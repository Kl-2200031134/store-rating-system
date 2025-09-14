const express = require("express");
const { Op } = require("sequelize");
const Store = require("../models/Store");
const Rating = require("../models/Rating");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🔹 View all stores (with search)
router.get("/stores", authMiddleware(["USER"]), async (req, res) => {
  try {
    const { name, address } = req.query;
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({ where, include: [Rating] });

    const data = await Promise.all(
      stores.map(async (s) => {
        const avgRating =
          s.Ratings.reduce((sum, r) => sum + r.rating, 0) / (s.Ratings.length || 1);

        const userRating = await Rating.findOne({
          where: { storeId: s.id, userId: req.user.id }
        });

        return {
          id: s.id,
          name: s.name,
          address: s.address,
          averageRating: avgRating.toFixed(2),
          userRating: userRating ? userRating.rating : null
        };
      })
    );

    res.json({ stores: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Submit or update rating
router.post("/stores/:id/rating", authMiddleware(["USER"]), async (req, res) => {
  try {
    const { rating } = req.body;
    const storeId = req.params.id;

    let rate = await Rating.findOne({
      where: { storeId, userId: req.user.id }
    });

    if (rate) {
      rate.rating = rating;
      await rate.save();
    } else {
      rate = await Rating.create({ storeId, userId: req.user.id, rating });
    }

    res.json({ message: "Rating submitted", rating: rate.rating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
