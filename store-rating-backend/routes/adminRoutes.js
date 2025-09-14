const express = require("express");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const User = require("../models/User");
const Store = require("../models/Store");
const Rating = require("../models/Rating");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🔹 Admin Dashboard (counts)
router.get("/dashboard", authMiddleware(["ADMIN"]), async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error("❌ Error in /admin/dashboard:", err);
    res.status(500).json({ message: "Server error fetching dashboard data" });
  }
});

// 🔹 Add User
router.post("/users", authMiddleware(["ADMIN"]), async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, address, role });

    res.json({ message: "✅ User added successfully", user });
  } catch (err) {
    console.error("❌ Error in /admin/users POST:", err);
    res.status(500).json({ message: "Server error adding user" });
  }
});

// 🔹 Add Store
router.post("/stores", authMiddleware(["ADMIN"]), async (req, res) => {
  try {
    const { name, address, ownerId } = req.body;

    const owner = await User.findByPk(ownerId);
    if (!owner || owner.role !== "OWNER") {
      return res.status(400).json({ message: "Invalid ownerId. Must be a valid OWNER." });
    }

    const store = await Store.create({ name, address, ownerId });
    res.json({ message: "Store created", store });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Get Users (filters + sorting + pagination + show ratings for owners)
router.get("/users", authMiddleware(["ADMIN"]), async (req, res) => {
  try {
    let {
      page = 1,
      limit = 5,
      name,
      email,
      address,
      role,
      sortField = "id",
      sortOrder = "ASC",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const { rows, count } = await User.findAndCountAll({
      where,
      order: [[sortField, sortOrder]],
      limit,
      offset,
      include: [{ model: Store, as: "Stores", include: [Rating] }],
      attributes: ["id", "name", "email", "address", "role"],
    });

    const data = rows.map((u) => {
      let avgRating = null;
      if (u.role === "OWNER" && u.Stores.length > 0) {
        const ratings = u.Stores.flatMap((store) => store.Ratings);
        if (ratings.length > 0) {
          avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        }
      }
      return { ...u.toJSON(), ownerAvgRating: avgRating };
    });

    res.json({
      users: data,
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("❌ Error in /admin/users GET:", err);
    res.status(500).json({ message: "Server error fetching users" });
  }
});

// 🔹 Get Stores (with owner + ratings + pagination)
router.get("/stores", authMiddleware(["ADMIN"]), async (req, res) => {
  try {
    let { page = 1, limit = 5 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const { rows, count } = await Store.findAndCountAll({
      include: [
        { model: User, as: "Owner", attributes: ["id", "name", "email"], required: false },
        { model: Rating, attributes: ["rating"] },
      ],
      limit,
      offset,
    });

    const data = rows.map((s) => {
      const ratings = s.Ratings || [];
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

      return {
        id: s.id,
        name: s.name,
        address: s.address,
        ownerName: s.Owner ? s.Owner.name : "No owner",
        ownerEmail: s.Owner ? s.Owner.email : "N/A",
        averageRating: avgRating.toFixed(2),
      };
    });

    res.json({
      stores: data,
      totalStores: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("❌ Error in /admin/stores:", err);
    res.status(500).json({ message: "Server error fetching stores" });
  }
});

// 🔹 Reset User Password (by Admin)
// 🔹 Reset User Password (by Admin)
router.put("/users/:id/reset-password", authMiddleware(["ADMIN"]), async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    // ✅ Add validation here
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be 8–16 characters long, include at least one uppercase letter and one special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = hashedPassword;
    await user.save();

    res.json({ message: `✅ Password reset for ${user.email}` });
  } catch (err) {
    console.error("❌ Error in reset-password:", err);
    res.status(500).json({ message: "Server error resetting password" });
  }
});


module.exports = router;
