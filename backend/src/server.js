const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");

const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// Connect Redis for rate limiting
connectRedis();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
