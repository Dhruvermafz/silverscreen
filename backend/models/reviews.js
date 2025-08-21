const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movie: { type: String, required: true }, // Store TMDb movie ID as string
    ratingCategory: {
      type: String,
      required: true,
      enum: [
        "GREAT",
        "MEH",
        "ITS A EXPERIENCE",
        "IGNORE",
        "FUN TO WATCH",
        "ONE TIME WATCH",
      ],
    },
    comment: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
