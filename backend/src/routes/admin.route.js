const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

// Mock data for admin metrics
const getMetrics = () => {
    return {
        totalRequests: Math.floor(Math.random() * 500) + 1000,
        allowedRequests: Math.floor(Math.random() * 400) + 800,
        blockedRequests: Math.floor(Math.random() * 150) + 50,
        rateLimitedRequests: Math.floor(Math.random() * 100) + 30,
        activeUsers: Math.floor(Math.random() * 50) + 30,
        suspiciousActivities: Math.floor(Math.random() * 30) + 5
    };
};

const getTrafficData = () => {
    return {
        stats: {
            requestsPerMinute: Math.floor(Math.random() * 200) + 50,
            avgResponseTime: Math.floor(Math.random() * 100) + 20,
            totalEndpoints: 12,
            peakLoad: Math.floor(Math.random() * 500) + 200
        },
        traffic: [
            {
                id: 1,
                endpoint: "/api/payment",
                method: "POST",
                requests: Math.floor(Math.random() * 300) + 100,
                avgTime: Math.floor(Math.random() * 50) + 30,
                status: "healthy",
                successRate: 98.7
            },
            {
                id: 2,
                endpoint: "/api/balance",
                method: "GET",
                requests: Math.floor(Math.random() * 600) + 300,
                avgTime: Math.floor(Math.random() * 40) + 20,
                status: "healthy",
                successRate: 99.8
            },
            {
                id: 3,
                endpoint: "/api/transfer",
                method: "POST",
                requests: Math.floor(Math.random() * 250) + 100,
                avgTime: Math.floor(Math.random() * 80) + 40,
                status: "warning",
                successRate: 94.2
            },
            {
                id: 4,
                endpoint: "/api/user/activity",
                method: "GET",
                requests: Math.floor(Math.random() * 350) + 200,
                avgTime: Math.floor(Math.random() * 50) + 20,
                status: "healthy",
                successRate: 99.5
            }
        ]
    };
};

const getSuspiciousActivities = () => {
    return {
        activities: [
            {
                id: 1,
                username: `user_${Math.random().toString(36).substr(2, 5)}`,
                action: "Multiple failed login attempts",
                type: "suspicious",
                severity: "high",
                timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
                details: `${Math.floor(Math.random() * 5) + 3} failed attempts in 2 minutes`,
                ip: `192.168.1.${Math.floor(Math.random() * 255)}`
            },
            {
                id: 2,
                username: `user_${Math.random().toString(36).substr(2, 5)}`,
                action: "Rate limit exceeded",
                type: "rate-limited",
                severity: "medium",
                timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
                details: `${Math.floor(Math.random() * 20) + 10} requests in ${Math.floor(Math.random() * 30) + 10} seconds`,
                ip: `192.168.1.${Math.floor(Math.random() * 255)}`
            },
            {
                id: 3,
                username: `user_${Math.random().toString(36).substr(2, 5)}`,
                action: "User temporarily blocked",
                type: "blocked",
                severity: "critical",
                timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
                details: "Exceeded rate limit threshold",
                ip: `192.168.1.${Math.floor(Math.random() * 255)}`
            },
            {
                id: 4,
                username: `user_${Math.random().toString(36).substr(2, 5)}`,
                action: "Suspicious payment pattern",
                type: "suspicious",
                severity: "high",
                timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
                details: "Multiple transfers to different accounts",
                ip: `192.168.1.${Math.floor(Math.random() * 255)}`
            }
        ]
    };
};

// Admin metrics endpoint
router.get("/metrics", authMiddleware, (req, res) => {
    // Check if user is admin
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }

    res.json(getMetrics());
});

// API traffic monitoring
router.get("/traffic", authMiddleware, (req, res) => {
    // Check if user is admin
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }

    res.json(getTrafficData());
});

// Suspicious activity logs
router.get("/suspicious-activity", authMiddleware, (req, res) => {
    // Check if user is admin
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }

    res.json(getSuspiciousActivities());
});

module.exports = router;
