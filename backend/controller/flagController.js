const Flag = require("../models/flags");
const User = require("../models/user");

exports.submitFlag = async (req, res) => {
  try {
    const { userId, type, reason, description, evidence } = req.body;
    const flag = new Flag({
      userId,
      type,
      reason,
      description,
      evidence,
    });
    await flag.save();
    res.status(201).json({ message: "Flag submitted successfully", flag });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit flag", error });
  }
};

exports.getUserFlags = async (req, res) => {
  try {
    const { userId } = req.params;
    const flags = await Flag.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(flags);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch flags", error });
  }
};

exports.reviewFlag = async (req, res) => {
  try {
    const { flagId } = req.params;
    const { status, adminResponse } = req.body;
    const flag = await Flag.findByIdAndUpdate(
      flagId,
      { status, adminResponse, updatedAt: Date.now() },
      { new: true }
    );
    if (status === "approved" && flag.type === "reviewer_role_appeal") {
      await User.findByIdAndUpdate(flag.userId, {
        role: "reviewer",
        "reviewerStatus.warnings": [],
      });
    }
    res.status(200).json({ message: "Flag reviewed successfully", flag });
  } catch (error) {
    res.status(500).json({ message: "Failed to review flag", error });
  }
};
