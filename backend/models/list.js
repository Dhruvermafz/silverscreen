const mongoose = require("mongoose");

const listSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    movies: [
      {
        type: String, // You can replace String with a proper Movie model reference if you want later
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("List", listSchema);
