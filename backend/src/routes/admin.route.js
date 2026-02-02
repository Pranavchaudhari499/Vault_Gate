const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const ApiLog = require("../models/ApiLog");
const Notification = require("../models/Notification");
const User = require("../models/User");

const ensureAdmin = (req, res) => {
    if (req.user.role !== "admin") {
        res.status(403).json({ message: "Admin access required" });
        return false;
    }
    return true;
};

const getStatusFromSuccessRate = (rate) => {
    if (rate >= 98) return "healthy";
    if (rate >= 95) return "warning";
    return "critical";
};

// Admin metrics endpoint
router.get("/metrics", authMiddleware, async (req, res) => {
    if (!ensureAdmin(req, res)) return;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const [
        totalRequests,
        allowedRequests,
        blockedRequests,
        rateLimitedRequests,
        suspiciousActivities,
        activeUserIds
    ] = await Promise.all([
        ApiLog.countDocuments(),
        ApiLog.countDocuments({ statusCode: 200 }),
        ApiLog.countDocuments({ isBlocked: true }),
        ApiLog.countDocuments({ statusCode: 429 }),
        ApiLog.countDocuments({
            $or: [{ isBlocked: true }, { statusCode: { $gte: 400 } }]
        }),
        ApiLog.distinct("userId", { createdAt: { $gte: oneHourAgo } })
    ]);

    res.json({
        totalRequests,
        allowedRequests,
        blockedRequests,
        rateLimitedRequests,
        activeUsers: activeUserIds.length,
        suspiciousActivities
    });
});

// API traffic monitoring
router.get("/traffic", authMiddleware, async (req, res) => {
    if (!ensureAdmin(req, res)) return;

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const requestsPerMinute = await ApiLog.countDocuments({ createdAt: { $gte: oneMinuteAgo } });
    const totalEndpoints = await ApiLog.distinct("endpoint");

    const peakLoadAgg = await ApiLog.aggregate([
        { $match: { createdAt: { $gte: oneHourAgo } } },
        {
            $group: {
                _id: {
                    minute: {
                        $dateToString: { format: "%Y-%m-%dT%H:%M", date: "$createdAt" }
                    }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    const peakLoad = peakLoadAgg.length ? peakLoadAgg[0].count : requestsPerMinute;

    const trafficAgg = await ApiLog.aggregate([
        {
            $group: {
                _id: { endpoint: "$endpoint", method: "$method" },
                requests: { $sum: 1 },
                successCount: {
                    $sum: {
                        $cond: [{ $eq: ["$statusCode", 200] }, 1, 0]
                    }
                }
            }
        },
        { $sort: { requests: -1 } },
        { $limit: 12 }
    ]);

    const traffic = trafficAgg.map((item, index) => {
        const successRate = item.requests
            ? Number(((item.successCount / item.requests) * 100).toFixed(1))
            : 0;
        return {
            id: index + 1,
            endpoint: item._id.endpoint,
            method: item._id.method,
            requests: item.requests,
            avgTime: 0,
            status: getStatusFromSuccessRate(successRate),
            successRate
        };
    });

    res.json({
        stats: {
            requestsPerMinute,
            avgResponseTime: 0,
            totalEndpoints: totalEndpoints.length,
            peakLoad
        },
        traffic
    });
});

// Suspicious activity logs
router.get("/suspicious-activity", authMiddleware, async (req, res) => {
    if (!ensureAdmin(req, res)) return;

    const logs = await ApiLog.find({
        $or: [{ isBlocked: true }, { statusCode: { $gte: 400 } }]
    })
        .sort({ createdAt: -1 })
        .limit(25)
        .populate("userId", "username")
        .lean();

    const activities = logs.map((log, index) => {
        const isRateLimited = log.statusCode === 429;
        const isBlocked = Boolean(log.isBlocked);
        const statusCode = log.statusCode || 0;

        let type = "suspicious";
        let action = "Suspicious request";
        let severity = "low";

        if (isBlocked) {
            type = "blocked";
            action = "User temporarily blocked";
            severity = "critical";
        } else if (isRateLimited) {
            type = "rate-limited";
            action = "Rate limit exceeded";
            severity = "medium";
        } else if (statusCode >= 500) {
            severity = "high";
            action = "Server error";
        } else if (statusCode >= 401) {
            severity = "high";
            action = "Unauthorized request";
        }

        return {
            id: log._id || index + 1,
            username: log.userId?.username || "unknown",
            userId: log.userId,
            action,
            type,
            severity,
            timestamp: log.createdAt,
            details: log.reason || `${log.method} ${log.endpoint} -> ${statusCode}`,
            ip: log.ipAddress || "unknown"
        };
    });

    res.json({ activities });
});

// Get user details for investigation
router.get("/user/:userId", authMiddleware, async (req, res) => {
    if (!ensureAdmin(req, res)) return;

    const user = await User.findById(req.params.userId).select(
        "username apiKey role createdAt"
    );

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const recentLogs = await ApiLog.find({ userId: req.params.userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

    res.json({
        user,
        recentLogs
    });
});

// Send notification to user (admin only)
router.post("/notify", authMiddleware, async (req, res) => {
    if (!ensureAdmin(req, res)) return;

    const { userId, title, message, type = "alert", severity = "medium", actionRequired = false, details } = req.body;

    if (!userId || !title || !message) {
        return res.status(400).json({ message: "userId, title, and message required" });
    }

    try {
        const notification = await Notification.create({
            userId,
            title,
            message,
            type,
            severity,
            actionRequired,
            details
        });

        res.status(201).json({
            message: "Notification sent",
            notification
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
