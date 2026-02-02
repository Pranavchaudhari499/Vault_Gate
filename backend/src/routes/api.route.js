const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const User = require("../models/User");

// Mock database for demonstrations
const requestLogs = [];
const blockStatus = {};
const RATE_LIMIT_THRESHOLD = 10; // requests per minute per user
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes

// Helper: Check if user is blocked
const isUserBlocked = (username) => {
    if (!blockStatus[username]) return false;
    const now = Date.now();
    if (now > blockStatus[username].unblockTime) {
        delete blockStatus[username];
        return false;
    }
    return true;
};

// Helper: Block user
const blockUser = (username) => {
    blockStatus[username] = {
        blockedTime: Date.now(),
        unblockTime: Date.now() + BLOCK_DURATION
    };
};

// Helper: Check rate limit
const checkRateLimit = (username) => {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    const recentRequests = requestLogs.filter(
        log => log.username === username && log.timestamp > oneMinuteAgo
    );

    return recentRequests.length >= RATE_LIMIT_THRESHOLD;
};

// Test endpoint
router.get("/test-endpoint", authMiddleware, (req, res) => {
    const username = req.user.username;

    // Check if user is blocked
    if (isUserBlocked(username)) {
        return res.status(403).json({
            message: "User temporarily blocked due to rate limiting",
            blockedUntil: blockStatus[username].unblockTime
        });
    }

    // Check rate limit
    if (checkRateLimit(username)) {
        blockUser(username);
        return res.status(429).json({
            message: "Rate limit exceeded. User blocked for 15 minutes.",
            retryAfter: 900
        });
    }

    // Log the request
    requestLogs.push({
        username,
        timestamp: Date.now(),
        endpoint: "/api/test-endpoint",
        method: "GET",
        status: 200
    });

    res.json({
        message: "Request allowed",
        timestamp: new Date().toISOString(),
        requestCount: requestLogs.filter(
            log => log.username === username && log.timestamp > Date.now() - 60000
        ).length
    });
});

// Make payment endpoint
router.post("/payment", authMiddleware, (req, res) => {
    const { recipient, amount } = req.body;
    const username = req.user.username;

    // Validation
    if (!recipient || !amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid payment details" });
    }

    // Check if user is blocked
    if (isUserBlocked(username)) {
        return res.status(403).json({
            message: "User temporarily blocked",
            blockedUntil: blockStatus[username].unblockTime
        });
    }

    // Check rate limit
    if (checkRateLimit(username)) {
        blockUser(username);
        return res.status(429).json({
            message: "Rate limit exceeded",
            retryAfter: 900
        });
    }

    // Log the request
    requestLogs.push({
        username,
        timestamp: Date.now(),
        endpoint: "/api/payment",
        method: "POST",
        status: 200,
        details: `Payment of $${amount} to ${recipient}`
    });

    // Mock payment success
    res.status(200).json({
        message: "Payment processed successfully",
        transactionId: `TXN-${Date.now()}`,
        recipient,
        amount,
        timestamp: new Date().toISOString()
    });
});

// Check balance endpoint
router.get("/balance", authMiddleware, (req, res) => {
    const username = req.user.username;

    // Check if user is blocked
    if (isUserBlocked(username)) {
        return res.status(403).json({
            message: "User temporarily blocked"
        });
    }

    // Check rate limit
    if (checkRateLimit(username)) {
        blockUser(username);
        return res.status(429).json({
            message: "Rate limit exceeded"
        });
    }

    // Log the request
    requestLogs.push({
        username,
        timestamp: Date.now(),
        endpoint: "/api/balance",
        method: "GET",
        status: 200
    });

    // Mock balance
    res.json({
        balance: 10000,
        currency: "USD",
        lastUpdated: new Date().toISOString()
    });
});

// User activity logs
router.get("/user/activity", authMiddleware, (req, res) => {
    const username = req.user.username;

    // Get user's recent activities from logs
    const userActivities = requestLogs
        .filter(log => log.username === username)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 20)
        .map(log => ({
            id: requestLogs.indexOf(log),
            type: log.endpoint.split("/")[2] || "api",
            action: log.endpoint.split("/").pop(),
            status: log.status === 200 ? "success" : "failed",
            details: log.details || `API call to ${log.endpoint}`,
            timestamp: new Date(log.timestamp).toISOString()
        }));

    res.json({
        username,
        activities: userActivities.length > 0 ? userActivities : [
            {
                id: 1,
                type: "login",
                action: "Login",
                status: "success",
                details: "User logged in",
                timestamp: new Date().toISOString()
            }
        ]
    });
});

module.exports = router;
