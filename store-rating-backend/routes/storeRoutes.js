const express = require("express");
const { Op } = require("sequelize");
const Store = require("../models/Store");
const Rating = require("../models/Rating");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🔹 Get all stores (with search + ratings + user’s own rating)
router.get("/", authMiddleware(["USER", "ADMIN"]), async (req, res) => {
  try {
    const { name, address } = req.query;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      include: [
        { model: Rating, include: [{ model: User, attributes: ["id", "name", "email"] }] },
        { model: User, as: "Owner", attributes: ["id", "name", "email"] }
      ]
    });

    const data = stores.map((store) => {
      const ratings = store.Ratings || [];
      const avgRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      // Find logged-in user's rating
      const userRating = ratings.find((r) => r.userId === req.user.id)?.rating;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating: avgRating.toFixed(2),
        userRating: userRating || null,
        ownerName: store.Owner ? store.Owner.name : null,
        ownerEmail: store.Owner ? store.Owner.email : null
      };
    });

    res.json({ stores: data });
  } catch (err) {
    console.error("❌ Error fetching stores:", err);
    res.status(500).json({ message: "Server error fetching stores" });
  }
});

// 🔹 Rate a store
router.post("/:storeId/rate", authMiddleware(["USER"]), async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // If user already rated, update it
    const [userRating, created] = await Rating.findOrCreate({
      where: { storeId, userId: req.user.id },
      defaults: { rating }
    });

    if (!created) {
      userRating.rating = rating;
      await userRating.save();
    }

    res.json({ message: "✅ Rating submitted successfully" });
  } catch (err) {
    console.error("❌ Error rating store:", err);
    res.status(500).json({ message: "Server error submitting rating" });
  }
});

module.exports = router;
