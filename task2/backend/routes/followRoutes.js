const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Follow a user
router.put("/follow/:id", async (req, res) => {
  try {
    const currentUserId = req.body.currentUserId;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!currentUser.following.includes(targetUserId)) {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      await currentUser.save();
      await targetUser.save();
      res.json({ message: "User followed" });
    } else {
      res.status(400).json({ error: "Already following this user" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unfollow a user
router.put("/unfollow/:id", async (req, res) => {
  try {
     ;
  
    const currentUserId = req.body.currentUserId;
    const targetUserId = req.params.id;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    currentUser.following.pull(targetUserId);
    targetUser.followers.pull(currentUserId);

    await currentUser.save();
    await targetUser.save();
    res.json({ message: "User unfollowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get followers of a user
router.get("/followers/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("followers", "username profilePic");
    res.json(user.followers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get following list of a user
router.get("/following/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("following", "username profilePic");
    res.json(user.following);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// router.get("/", (req, res) => {
//   res.send("follow routes working");
// });

module.exports = router;
