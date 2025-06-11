const express = require("express");
const router = express.Router();
const Analyst = require("../models/analyst");
const { auth, restrictTo } = require("../middleware/auth");

// Register as analyst
router.post("/register", auth, async (req, res, next) => {
  try {
    const { name, email, qualifications, experience, preferredInterviewTime } =
      req.body;
    const analyst = new Analyst({
      userId: req.user.userId,
      name,
      email,
      qualifications,
      experience,
      preferredInterviewTime,
    });
    await analyst.save();
    res.status(201).json({ message: "Registration submitted", analyst });
  } catch (err) {
    next(err);
  }
});

// Get top analysts (Spotlight)
router.get("/spotlight", async (req, res, next) => {
  try {
    const analysts = await Analyst.find({ status: "approved" })
      .sort({ predictionAccuracy: -1 })
      .limit(5)
      .select("name bio predictionAccuracy");
    res.json(analysts);
  } catch (err) {
    next(err);
  }
});

// Approve/reject analyst (Admin only)
router.patch(
  "/:id/status",
  auth,
  restrictTo("Analyst"),
  async (req, res, next) => {
    try {
      const { status } = req.body;
      const analyst = await Analyst.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (!analyst) {
        return res.status(404).json({ error: "Analyst not found" });
      }
      res.json({ message: `Analyst ${status}`, analyst });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
