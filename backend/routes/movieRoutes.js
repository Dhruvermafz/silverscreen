const router = require("express").Router();
const { searchMovies, saveMovie } = require("../controllers/movieController");
const auth = require("../middlewares/authMiddleware");

router.get("/search", searchMovies);
router.post("/save", auth, saveMovie);

module.exports = router;
