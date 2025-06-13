// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Assuming you have this model

// Signup (mock logic)
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Simple check for existing user
    let existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already exists" });

    // Create new user (no real password encryption if you want dummy login)
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Signup error", error: err.message });
  }
});

// Login (mock logic)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid login" });
    }

    res.status(200).json(user); // You can remove password from response if needed
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

module.exports = router;
