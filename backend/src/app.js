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
const apiRoute = require("./routes/api.route");
const adminRoute = require("./routes/admin.route");
const userRoute = require("./routes/user.route");


app.use("/health", healthRoute);
app.use("/auth", authRoute);
app.use("/protected", protectedRoute);
app.use("/api", apiRoute);
app.use("/api/admin", adminRoute);
app.use("/api/user", userRoute);

module.exports = app;

