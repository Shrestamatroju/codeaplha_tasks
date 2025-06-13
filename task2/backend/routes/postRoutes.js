const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment"); // Add this at the top if not already

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user").lean();

   
    for (const post of posts) {
  const count = await Comment.countDocuments({ post: post._id });
  post.commentsCount = count;
}

    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts with comments count:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Create a new post
router.post("/", async (req, res) => {
  try {
    const { userId, image, caption } = req.body;
    const post = new Post({ user: userId, image, caption });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Like or Unlike a post
router.put("/like/:postId", async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// DELETE /api/posts/:id
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post not found" });

    await Post.findByIdAndDelete(req.params.id);
    // Optional: delete associated comments
    await Comment.deleteMany({ postId: req.params.id });

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

//this is coreect for comments to be visible in profile i am changin gthsi 
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("user", "username")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username profilePic"
        }
      })
      .lean();

    res.json(posts);
  } catch (err) {
    console.error("Error fetching user's posts:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


