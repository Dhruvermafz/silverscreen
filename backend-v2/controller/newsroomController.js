// controllers/NewsroomController.js
const mongoose = require("mongoose");
const Newsroom = require("../models/newsroom"); // Adjust path to your Newsroom model
const NewsPost = require("../models/newsPost"); // Adjust path to your NewsPost model
const Comment = require("../models/comment"); // Adjust path to your Comment model
const User = require("../models/user"); // Adjust path to your User model

// Create a new newsroom
const createNewsroom = async (req, res) => {
  try {
    const { name, description, allowComments } = req.body;
    const creatorId = req.user.userId; // From auth middleware

    // Validate inputs
    if (!name) {
      return res.status(400).json({ message: "Newsroom name is required" });
    }

    // Check if newsroom name is unique
    const existingNewsroom = await Newsroom.findOne({ name });
    if (existingNewsroom) {
      return res.status(400).json({ message: "Newsroom name already exists" });
    }

    // Create newsroom
    const newsroom = new Newsroom({
      name,
      description,
      creator: creatorId,
      editors: [creatorId], // Creator is the initial editor
      allowComments: allowComments !== undefined ? allowComments : true,
    });

    await newsroom.save();

    res.status(201).json(newsroom);
  } catch (error) {
    console.error("Create newsroom error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update newsroom details
const updateNewsroom = async (req, res) => {
  try {
    const { newsroomId } = req.params;
    const { name, description, allowComments } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(newsroomId)) {
      return res.status(400).json({ message: "Invalid newsroom ID" });
    }

    // Find newsroom
    const newsroom = await Newsroom.findById(newsroomId);
    if (!newsroom) {
      return res.status(404).json({ message: "Newsroom not found" });
    }

    // Check if user is an editor
    if (!newsroom.editors.includes(userId)) {
      return res.status(403).json({
        message: "Unauthorized: Only editors can update newsroom details",
      });
    }

    // Check if new name is unique
    if (name && name !== newsroom.name) {
      const existingNewsroom = await Newsroom.findOne({ name });
      if (existingNewsroom) {
        return res
          .status(400)
          .json({ message: "Newsroom name already exists" });
      }
    }

    // Update newsroom
    newsroom.name = name || newsroom.name;
    newsroom.description =
      description !== undefined ? description : newsroom.description;
    newsroom.allowComments =
      allowComments !== undefined ? allowComments : newsroom.allowComments;
    newsroom.updatedAt = Date.now();

    await newsroom.save();

    res.json(newsroom);
  } catch (error) {
    console.error("Update newsroom error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get newsroom by ID
const getNewsroomById = async (req, res) => {
  try {
    const { newsroomId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(newsroomId)) {
      return res.status(400).json({ message: "Invalid newsroom ID" });
    }

    const newsroom = await Newsroom.findById(newsroomId)
      .populate("creator", "username avatar")
      .populate("editors", "username avatar")
      .populate("followers", "username avatar");

    if (!newsroom) {
      return res.status(404).json({ message: "Newsroom not found" });
    }

    res.json(newsroom);
  } catch (error) {
    console.error("Get newsroom by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a moderator (editor) to a newsroom
const addNewsroomModerator = async (req, res) => {
  try {
    const { newsroomId, userId } = req.params;
    const currentUserId = req.user.userId; // From auth middleware

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(newsroomId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid newsroom or user ID" });
    }

    // Find newsroom
    const newsroom = await Newsroom.findById(newsroomId);
    if (!newsroom) {
      return res.status(404).json({ message: "Newsroom not found" });
    }

    // Check if current user is the creator
    if (newsroom.creator.toString() !== currentUserId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only the creator can add editors" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already an editor
    if (newsroom.editors.includes(userId)) {
      return res.status(400).json({ message: "User is already an editor" });
    }

    // Add user to editors
    newsroom.editors.push(userId);
    await newsroom.save();

    res.json({ message: `User added as editor to ${newsroom.name}` });
  } catch (error) {
    console.error("Add newsroom moderator error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Post news to a newsroom
const postNewsToNewsroom = async (req, res) => {
  try {
    const { newsroomId } = req.params;
    const { title, body } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(newsroomId)) {
      return res.status(400).json({ message: "Invalid newsroom ID" });
    }
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    // Find newsroom
    const newsroom = await Newsroom.findById(newsroomId);
    if (!newsroom) {
      return res.status(404).json({ message: "Newsroom not found" });
    }

    // Check if user is an editor
    if (!newsroom.editors.includes(userId)) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only editors can post news" });
    }

    // Create news post
    const newsPost = new NewsPost({
      title,
      body,
      author: userId,
      newsroom: newsroomId,
    });

    await newsPost.save();

    // Add post to newsroom
    newsroom.posts.push(newsPost._id);
    await newsroom.save();

    const populatedPost = await NewsPost.findById(newsPost._id)
      .populate("author", "username avatar")
      .populate("newsroom", "name");

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Post news to newsroom error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit a news post
const editNewsPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, body } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // Find post
    const post = await NewsPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find newsroom
    const newsroom = await Newsroom.findById(post.newsroom);
    if (!newsroom) {
      return res.status(404).json({ message: "Newsroom not found" });
    }

    // Check if user is an editor
    if (!newsroom.editors.includes(userId)) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only editors can edit posts" });
    }

    // Update post
    post.title = title || post.title;
    post.body = body || post.body;
    post.updatedAt = Date.now();

    await post.save();

    const populatedPost = await NewsPost.findById(postId)
      .populate("author", "username avatar")
      .populate("newsroom", "name");

    res.json(populatedPost);
  } catch (error) {
    console.error("Edit news post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a news post
const deleteNewsPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId; // From auth middleware

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // Find post
    const post = await NewsPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find newsroom
    const newsroom = await Newsroom.findById(post.newsroom);
    if (!newsroom) {
      return res.status(404).json({ message: "Newsroom not found" });
    }

    // Check if user is an editor
    if (!newsroom.editors.includes(userId)) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only editors can delete posts" });
    }

    // Delete post and associated comments
    await NewsPost.deleteOne({ _id: postId });
    await Comment.deleteMany({ newsPost: postId });

    // Remove post from newsroom
    newsroom.posts = newsroom.posts.filter((id) => id.toString() !== postId);
    await newsroom.save();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete news post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Comment on a news post
const commentOnNewsPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    // Find post
    const post = await NewsPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find newsroom
    const newsroom = await Newsroom.findById(post.newsroom);
    if (!newsroom) {
      return res.status(404).json({ message: "Newsroom not found" });
    }

    // Check if comments are allowed
    if (!newsroom.allowComments) {
      return res
        .status(403)
        .json({ message: "Comments are disabled for this newsroom" });
    }

    // Create comment
    const comment = new Comment({
      content,
      user: userId,
      newsPost: postId,
    });

    await comment.save();

    // Add comment to post
    post.comments.push(comment._id);
    await post.save();

    const populatedComment = await Comment.findById(comment._id).populate(
      "user",
      "username avatar"
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Comment on news post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all newsrooms
const getAllNewsrooms = async (req, res) => {
  try {
    const newsrooms = await Newsroom.find()
      .populate("creator", "username avatar")
      .populate("editors", "username avatar")
      .populate("followers", "username avatar")
      .sort({ createdAt: -1 }); // Newest first

    res.json(newsrooms);
  } catch (error) {
    console.error("Get all newsrooms error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all news posts for a newsroom
const getAllNewsPosts = async (req, res) => {
  try {
    const { newsroomId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(newsroomId)) {
      return res.status(400).json({ message: "Invalid newsroom ID" });
    }

    // Check if newsroom exists
    const newsroom = await Newsroom.findById(newsroomId);
    if (!newsroom) {
      return res.status(404).json({ message: "Newsroom not found" });
    }

    const posts = await NewsPost.find({ newsroom: newsroomId })
      .populate("author", "username avatar")
      .populate("newsroom", "name")
      .populate("comments")
      .sort({ createdAt: -1 }); // Newest first

    res.json(posts);
  } catch (error) {
    console.error("Get all news posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createNewsroom,
  updateNewsroom,
  getNewsroomById,
  addNewsroomModerator,
  postNewsToNewsroom,
  editNewsPost,
  deleteNewsPost,
  commentOnNewsPost,
  getAllNewsrooms,
  getAllNewsPosts,
};
