const express = require("express");
const cors = require("cors");
const { gatewayRateLimitMiddleware } = require("./middleware/gatewayRateLimit.middleware");

const app = express();

/* ======================================================
   🔥 CORS CONFIG — MUST BE FIRST
   ====================================================== */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://vault-gate-pi.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-api-key"
  ],
  credentials: true
}));

// 🔥 Handle browser preflight requests globally
app.options("*", (req, res) => {
  res.sendStatus(204);
});

/* ======================================================
   BODY PARSER & REQUEST TIMER
   ====================================================== */
app.use(express.json());

app.use((req, res, next) => {
  req._startTime = Date.now();
  next();
});

/* ======================================================
   API GATEWAY RATE LIMITER
   - Applied ONLY to /api routes
   - Auth & health are excluded
   ====================================================== */
app.use("/api", (req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
}, gatewayRateLimitMiddleware);

/* ======================================================
   ROUTES
   ====================================================== */
const healthRoute = require("./routes/health.route");
const authRoute = require("./routes/auth.route");
const protectedRoute = require("./routes/protected.route");
const apiRoute = require("./routes/api.route");
const adminRoute = require("./routes/admin.route");
const adminSimulationRoute = require("./routes/adminSimulation.routes");
const userRoute = require("./routes/user.route");
const chatRoute = require("./routes/chat.route");
const mlAnomalyRoute = require("./routes/mlAnomaly.route");

// Public routes
app.use("/health", healthRoute);
app.use("/auth", authRoute);

// Protected / API routes
app.use("/protected", protectedRoute);
app.use("/api", apiRoute);
app.use("/api/admin", adminRoute);
app.use("/api/admin", adminSimulationRoute);
app.use("/api/admin", mlAnomalyRoute);
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);

/* ======================================================
   404 HANDLER
   ====================================================== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/* ======================================================
   GLOBAL ERROR HANDLER
   ====================================================== */
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

module.exports = app;
