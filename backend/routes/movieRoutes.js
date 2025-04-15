const router = require("express").Router();
const { searchMovies, saveMovie } = require("../controller/movieController");
const protect = require("../middleware/authMiddleware");

router.get("/search", searchMovies);
router.post("/save", protect, saveMovie);

module.exports = router;
