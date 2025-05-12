const mongoose = require("mongoose");
const Group = require("../models/group"); // Adjust path to your Group model
const GroupPost = require("../models/groupPost"); // Adjust path to your GroupPost model
const User = require("../models/user"); // Adjust path to your User model

// Create a new group
const createGroup = async (req, res) => {
  try {
    const { name, description, rules, isPrivate } = req.body;
    const creatorId = req.user.userId; // From auth middleware

    // Validate inputs
    if (!name) {
      return res.status(400).json({ message: "Group name is required" });
    }

    // Check if group name is unique
    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ message: "Group name already exists" });
    }

    // Create group
    const group = new Group({
      name,
      description,
      creator: creatorId,
      members: [{ user: creatorId, role: "Admin" }],
      rules: rules || [],
      isPrivate: isPrivate || false,
    });

    await group.save();

    res.status(201).json(group);
  } catch (error) {
    console.error("Create group error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update group details
const updateGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description, rules, isPrivate } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    // Find group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is admin
    const member = group.members.find(
      (m) => m.user.toString() === userId && m.role === "Admin"
    );
    if (!member) {
      return res.status(403).json({
        message: "Unauthorized: Only admins can update group details",
      });
    }

    // Check if new name is unique
    if (name && name !== group.name) {
      const existingGroup = await Group.findOne({ name });
      if (existingGroup) {
        return res.status(400).json({ message: "Group name already exists" });
      }
    }

    // Update group
    group.name = name || group.name;
    group.description =
      description !== undefined ? description : group.description;
    group.rules = rules || group.rules;
    group.isPrivate = isPrivate !== undefined ? isPrivate : group.isPrivate;
    group.updatedAt = Date.now();

    await group.save();

    res.json(group);
  } catch (error) {
    console.error("Update group details error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a group
const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId; // From auth middleware

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    // Find group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is creator
    if (group.creator.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized: Only the creator can delete the group",
      });
    }

    // Delete group and associated posts
    await Group.deleteOne({ _id: groupId });
    await GroupPost.deleteMany({ group: groupId });

    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("Delete group error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Join a group
const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId; // From auth middleware

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    // Find group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is already a member
    if (group.members.some((m) => m.user.toString() === userId)) {
      return res
        .status(400)
        .json({ message: "You are already a member of this group" });
    }

    // For private groups, you might want to implement a request/approval system
    if (group.isPrivate) {
      return res.status(403).json({
        message: "This is a private group. Request access from an admin.",
      });
    }

    // Add user to members
    group.members.push({ user: userId, role: "Member" });
    await group.save();

    res.json({ message: `Joined ${group.name} successfully` });
  } catch (error) {
    console.error("Join group error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Leave a group
const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId; // From auth middleware

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    // Find group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is a member
    const memberIndex = group.members.findIndex(
      (m) => m.user.toString() === userId
    );
    if (memberIndex === -1) {
      return res
        .status(400)
        .json({ message: "You are not a member of this group" });
    }

    // Prevent creator from leaving
    if (group.creator.toString() === userId) {
      return res.status(400).json({
        message: "Creator cannot leave the group. Delete the group instead.",
      });
    }

    // Remove user from members
    group.members.splice(memberIndex, 1);
    await group.save();

    res.json({ message: `Left ${group.name} successfully` });
  } catch (error) {
    console.error("Leave group error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get group by ID
const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    const group = await Group.findById(groupId)
      .populate("creator", "username avatar")
      .populate("members.user", "username avatar");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json(group);
  } catch (error) {
    console.error("Get group by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get posts for a group
const getGroupPosts = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    // Check if group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const posts = await GroupPost.find({ group: groupId })
      .populate("user", "username avatar")
      .populate("comments.user", "username avatar")
      .sort({ createdAt: -1 }); // Newest first

    res.json(posts);
  } catch (error) {
    console.error("Get group posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Post to a group
const postToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }
    if (!content) {
      return res.status(400).json({ message: "Post content is required" });
    }

    // Find group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is a member
    if (!group.members.some((m) => m.user.toString() === userId)) {
      return res
        .status(403)
        .json({ message: "You must be a member to post in this group" });
    }

    // Create post
    const post = new GroupPost({
      group: groupId,
      user: userId,
      content,
    });

    await post.save();

    // Add post to group
    group.posts.push(post._id);
    await group.save();

    const populatedPost = await GroupPost.findById(post._id)
      .populate("user", "username avatar")
      .populate("comments.user", "username avatar");

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Post to group error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Comment on a group post
const commentOnGroupPost = async (req, res) => {
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
    const post = await GroupPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find group
    const group = await Group.findById(post.group);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is a member
    if (!group.members.some((m) => m.user.toString() === userId)) {
      return res
        .status(403)
        .json({ message: "You must be a member to comment in this group" });
    }

    // Add comment
    post.comments.push({
      user: userId,
      content,
    });

    await post.save();

    const updatedPost = await GroupPost.findById(postId)
      .populate("user", "username avatar")
      .populate("comments.user", "username avatar");

    res.json(updatedPost);
  } catch (error) {
    console.error("Comment on group post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Promote a user to moderator
const promoteToModerator = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const currentUserId = req.user.userId; // From auth middleware

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(groupId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid group or user ID" });
    }

    // Find group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if current user is admin
    const currentMember = group.members.find(
      (m) => m.user.toString() === currentUserId && m.role === "Admin"
    );
    if (!currentMember) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only admins can promote moderators" });
    }

    // Check if target user is a member
    const targetMember = group.members.find(
      (m) => m.user.toString() === userId
    );
    if (!targetMember) {
      return res
        .status(400)
        .json({ message: "User is not a member of this group" });
    }

    // Prevent promoting admins
    if (targetMember.role === "Admin") {
      return res.status(400).json({ message: "User is already an admin" });
    }

    // Promote to moderator
    targetMember.role = "Moderator";
    await group.save();

    res.json({ message: `User promoted to moderator in ${group.name}` });
  } catch (error) {
    console.error("Promote to moderator error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Ban a user from a group
const banUserFromGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const currentUserId = req.user.userId; // From auth middleware

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(groupId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid group or user ID" });
    }

    // Find group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if current user is admin or moderator
    const currentMember = group.members.find(
      (m) =>
        m.user.toString() === currentUserId &&
        (m.role === "Admin" || m.role === "Moderator")
    );
    if (!currentMember) {
      return res.status(403).json({
        message: "Unauthorized: Only admins or moderators can ban users",
      });
    }

    // Prevent banning admins
    const targetMember = group.members.find(
      (m) => m.user.toString() === userId
    );
    if (targetMember && targetMember.role === "Admin") {
      return res.status(400).json({ message: "Cannot ban an admin" });
    }

    // Remove user from members
    group.members = group.members.filter((m) => m.user.toString() !== userId);
    await group.save();

    // Optionally, delete user's posts
    await GroupPost.deleteMany({ group: groupId, user: userId });

    res.json({ message: `User banned from ${group.name}` });
  } catch (error) {
    console.error("Ban user from group error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all groups
const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("creator", "username avatar")
      .populate("members.user", "username avatar")
      .sort({ createdAt: -1 }); // Newest first

    res.json(groups);
  } catch (error) {
    console.error("Get all groups error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Search groups by query
const searchGroups = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Search by name or description (case-insensitive)
    const groups = await Group.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    })
      .populate("creator", "username avatar")
      .populate("members.user", "username avatar")
      .limit(20); // Limit for performance

    res.json(groups);
  } catch (error) {
    console.error("Search groups error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createGroup,
  updateGroupDetails,
  deleteGroup,
  joinGroup,
  leaveGroup,
  getGroupById,
  getGroupPosts,
  postToGroup,
  commentOnGroupPost,
  promoteToModerator,
  banUserFromGroup,
  getAllGroups,
  searchGroups,
};
