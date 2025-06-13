const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Create new user
router.post("/", async (req, res) => {
  try {
    const { username, email, bio, profilePic } = req.body;
    const user = new User({ username, email, bio, profilePic });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// router.get("/", (req, res) => {
//   res.send("User routes working");
// });

// Get user by username

// Get user by ID
router.get("/id/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("followers").populate("following");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate("followers").populate("following");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all users (for search)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("username profilePic");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Follow a user
router.put("/:id/follow", async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);

    if (!userToFollow.followers.includes(req.body.userId)) {
      userToFollow.followers.push(req.body.userId);
      currentUser.following.push(req.params.id);
      await userToFollow.save();
      await currentUser.save();
      res.json({ message: "Followed successfully" });
    } else {
      res.status(400).json({ message: "Already following" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);

    if (userToUnfollow.followers.includes(req.body.userId)) {
      userToUnfollow.followers.pull(req.body.userId);
      currentUser.following.pull(req.params.id);
      await userToUnfollow.save();
      await currentUser.save();
      res.json({ message: "Unfollowed successfully" });
    } else {
      res.status(400).json({ message: "Not following" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
