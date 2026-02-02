const ApiLog = require("../models/ApiLog");

const loggerMiddleware = async (req, res, next) => {
  res.on("finish", async () => {
    await ApiLog.create({
      userId: req.user ? req.user._id : null,
      endpoint: req.baseUrl + req.path,
      method: req.method,
      statusCode: res.statusCode,
      ipAddress: req.ip,
      isBlocked: res.statusCode >= 400,
    });
  });

  next();
};

module.exports = loggerMiddleware;
