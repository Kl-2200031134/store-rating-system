const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const { User, Store, Rating } = require("./models"); // ✅ import models via index.js

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Sync DB
sequelize.sync({ alter: true })
  .then(() => console.log("✅ Database Synced"))
  .catch((err) => console.log("❌ Error: " + err));

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/stores", require("./routes/storeRoutes"));
app.use("/owner", require("./routes/ownerRoutes"));

app.get("/", (req, res) => res.send("🚀 Store Rating Backend is running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
