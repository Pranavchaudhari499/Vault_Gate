const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const healthRoute = require("./routes/health.route");
const authRoute = require("./routes/auth.route");
const protectedRoute = require("./routes/protected.route");


app.use("/health", healthRoute);
app.use("/auth", authRoute);
app.use("/protected", protectedRoute);

module.exports = app;

