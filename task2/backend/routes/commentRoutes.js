const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Post = require("../models/Post");

// Create a comment

router.post("/", async (req, res) => {
  try {
    const { postId, userId, text, parentComment } = req.body;

    const comment = new Comment({
      post: postId,
      user: userId,
      text,
      parentComment: parentComment || null,
    });
    await comment.save();

    // Push comment into Post.comments only if it's top-level comment
    if (!parentComment) {
      await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });
    }

    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Get all comments for a post
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.delete("/:commentId", async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!deletedComment) return res.status(404).json({ error: "Comment not found" });

    // Optionally: Remove from Post.comments array if it’s a top-level comment
    if (!deletedComment.parentComment) {
      await Post.findByIdAndUpdate(deletedComment.post, { $pull: { comments: deletedComment._id } });
    }

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
