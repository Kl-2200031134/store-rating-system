const express = require("express");
const bcrypt = require("bcrypt");
const Store = require("../models/Store");
const Rating = require("../models/Rating");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🟢 Owner Dashboard
router.get("/dashboard", authMiddleware(["OWNER"]), async (req, res) => {
  try {
    const store = await Store.findOne({ where: { ownerId: req.user.id } });
    if (!store) return res.status(404).json({ message: "Store not found" });

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, attributes: ["name", "email"] }]
    });

    const avgRating =
      ratings.reduce((sum, r) => sum + r.rating, 0) / (ratings.length || 1);

    res.json({
      store: store.name,
      averageRating: avgRating,
      ratings
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🟢 Change Password (Owner only)
router.put("/change-password", authMiddleware(["OWNER"]), async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both old and new passwords are required" });
    }

    const owner = await User.findByPk(req.user.id);
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    const isMatch = await bcrypt.compare(oldPassword, owner.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    owner.password = hashed;
    await owner.save();

    res.json({ message: "✅ Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
