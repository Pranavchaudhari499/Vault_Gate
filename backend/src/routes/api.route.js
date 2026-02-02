const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const ApiLog = require("../models/ApiLog");
const Balance = require("../models/Balance");

const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes

const rateLimitConfig = {
    "/api/balance": { limit: 10, windowMs: 60 * 1000 },
    "/api/transfer": { limit: 3, windowMs: 60 * 1000 }
};

const requestBuckets = new Map();
const blockStatus = new Map();

const getClientIp = (req) => {
    const forwarded = req.headers["x-forwarded-for"];
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    return req.ip || req.connection?.remoteAddress || "unknown";
};

const getKey = (userId, endpoint) => `${userId}:${endpoint}`;

const logRequest = async ({ req, endpoint, statusCode, isBlocked = false, reason }) => {
    try {
        await ApiLog.create({
            userId: req.user?._id,
            endpoint,
            method: req.method,
            statusCode,
            ipAddress: getClientIp(req),
            isBlocked,
            reason
        });
    } catch (error) {
        console.error("ApiLog error:", error.message);
    }
};

const isBlocked = (userId, endpoint) => {
    const key = getKey(userId, endpoint);
    const blockInfo = blockStatus.get(key);

    if (!blockInfo) return false;
    if (Date.now() > blockInfo.unblockTime) {
        blockStatus.delete(key);
        return false;
    }
    return true;
};

const blockUser = (userId, endpoint) => {
    const key = getKey(userId, endpoint);
    blockStatus.set(key, {
        blockedTime: Date.now(),
        unblockTime: Date.now() + BLOCK_DURATION
    });
};

const checkRateLimit = (userId, endpoint) => {
    const config = rateLimitConfig[endpoint];
    if (!config) return { limited: false };

    const now = Date.now();
    const windowStart = now - config.windowMs;
    const key = getKey(userId, endpoint);
    const timestamps = requestBuckets.get(key) || [];
    const recent = timestamps.filter((ts) => ts > windowStart);

    if (recent.length >= config.limit) {
        requestBuckets.set(key, recent);
        return { limited: true };
    }

    recent.push(now);
    requestBuckets.set(key, recent);
    return { limited: false };
};

const handleTransfer = async (req, res, endpoint) => {
    const { recipient, amount } = req.body;

    if (!recipient || !amount || Number(amount) <= 0) {
        await logRequest({ req, endpoint, statusCode: 400, reason: "invalid_payload" });
        return res.status(400).json({ message: "Invalid transfer details" });
    }

    const userId = req.user._id;

    if (isBlocked(userId, endpoint)) {
        await logRequest({
            req,
            endpoint,
            statusCode: 429,
            isBlocked: true,
            reason: "blocked"
        });
        return res.status(429).json({ message: "Rate limit exceeded" });
    }

    const rateCheck = checkRateLimit(userId, endpoint);
    if (rateCheck.limited) {
        blockUser(userId, endpoint);
        await logRequest({
            req,
            endpoint,
            statusCode: 429,
            isBlocked: true,
            reason: "rate_limit"
        });
        return res.status(429).json({ message: "Rate limit exceeded" });
    }

    // Check balance and deduct amount
    let userBalance = await Balance.findOne({ userId });
    if (!userBalance) {
        userBalance = await Balance.create({ userId, balance: 10000 });
    }

    if (userBalance.balance < Number(amount)) {
        await logRequest({ req, endpoint, statusCode: 400, reason: "insufficient_funds" });
        return res.status(400).json({
            message: "Insufficient balance",
            currentBalance: userBalance.balance,
            requiredAmount: Number(amount)
        });
    }

    // Deduct amount from balance
    const transactionId = `TXN-${Date.now()}`;
    userBalance.balance -= Number(amount);
    userBalance.transactions.push({
        type: "debit",
        amount: Number(amount),
        description: `Transfer to ${recipient}`,
        recipient,
        transactionId,
        timestamp: new Date()
    });
    await userBalance.save();

    await logRequest({ req, endpoint, statusCode: 200 });
    return res.status(200).json({
        message: "Transfer completed successfully",
        transactionId,
        recipient,
        amount: Number(amount),
        newBalance: userBalance.balance,
        timestamp: new Date().toISOString()
    });
};

// Get account balance
router.get("/balance", authMiddleware, async (req, res) => {
    const endpoint = "/api/balance";
    const userId = req.user._id;

    if (isBlocked(userId, endpoint)) {
        await logRequest({ req, endpoint, statusCode: 429, isBlocked: true, reason: "blocked" });
        return res.status(429).json({ message: "Rate limit exceeded" });
    }

    const rateCheck = checkRateLimit(userId, endpoint);
    if (rateCheck.limited) {
        blockUser(userId, endpoint);
        await logRequest({ req, endpoint, statusCode: 429, isBlocked: true, reason: "rate_limit" });
        return res.status(429).json({ message: "Rate limit exceeded" });
    }

    // Get real balance from database
    let userBalance = await Balance.findOne({ userId });
    if (!userBalance) {
        userBalance = await Balance.create({ userId, balance: 10000 });
    }

    await logRequest({ req, endpoint, statusCode: 200 });
    return res.json({
        balance: userBalance.balance,
        currency: "USD",
        lastUpdated: new Date().toISOString(),
        transactions: userBalance.transactions.slice(-5) // Return last 5 transactions
    });
});

// Transfer money (highly protected)
router.post("/transfer", authMiddleware, async (req, res) => {
    return handleTransfer(req, res, "/api/transfer");
});

// Backwards compatibility: /payment -> /transfer
router.post("/payment", authMiddleware, async (req, res) => {
    return handleTransfer(req, res, "/api/transfer");
});

// User activity logs from MongoDB
router.get("/user/activity", authMiddleware, async (req, res) => {
    const logs = await ApiLog.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

    const activities = logs.map((log) => ({
        id: log._id,
        type: log.endpoint.split("/")[2] || "api",
        action: log.endpoint.split("/").pop(),
        status: log.statusCode === 200 ? "success" : "failed",
        details: log.reason || `API call to ${log.endpoint}`,
        timestamp: log.createdAt
    }));

    res.json({
        username: req.user.username,
        activities
    });
});

// Get user notifications
router.get("/notifications", authMiddleware, async (req, res) => {
    const Notification = require("../models/Notification");

    const notifications = await Notification.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

    res.json({ notifications });
});

// Mark notification as read
router.patch("/notifications/:notificationId/read", authMiddleware, async (req, res) => {
    const Notification = require("../models/Notification");

    const notification = await Notification.findByIdAndUpdate(
        req.params.notificationId,
        { read: true },
        { new: true }
    );

    if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ notification });
});

module.exports = router;
