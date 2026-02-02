const ApiLog = require("../models/ApiLog");

const rateLimitStore = {}; // in-memory (fast for hackathon)

const RATE_LIMITS = {
  "/api/balance": 10,   // 10 requests per minute
  "/api/transfer": 3,  // 3 requests per minute
};

const WINDOW_TIME = 60 * 1000; // 1 minute

const rateLimitMiddleware = async (req, res, next) => {
  const userId = req.user._id.toString();
  const endpoint = req.baseUrl + req.path;
  const currentTime = Date.now();

  if (!rateLimitStore[userId]) {
    rateLimitStore[userId] = {};
  }

  if (!rateLimitStore[userId][endpoint]) {
    rateLimitStore[userId][endpoint] = [];
  }

  // remove old requests
  rateLimitStore[userId][endpoint] = rateLimitStore[userId][endpoint].filter(
    (time) => currentTime - time < WINDOW_TIME
  );

  const limit = RATE_LIMITS[endpoint] || 5;

  if (rateLimitStore[userId][endpoint].length >= limit) {
    // log blocked request
    await ApiLog.create({
      userId,
      endpoint,
      method: req.method,
      statusCode: 429,
      ipAddress: req.ip,
      isBlocked: true,
      reason: "Rate limit exceeded",
    });

    return res.status(429).json({
      message: "Rate limit exceeded. Please try again later.",
    });
  }

  // allow request
  rateLimitStore[userId][endpoint].push(currentTime);

  next();
};

module.exports = rateLimitMiddleware;
