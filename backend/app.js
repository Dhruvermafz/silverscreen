const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const listRoutes = require("./routes/listRoutes");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const newsroomRoutes = require("./routes/newsroomRoutes");
const tagsRoutes = require("./routes/tagsRoutes");
const app = express();
app.use(cors());
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", userRoutes);
app.use("/api/movies", require("./routes/movieRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/lists", listRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/newsroom", newsroomRoutes);
app.use("/api/tags", tagsRoutes);
module.exports = app;
