const express = require("express");
const router = express.Router();
const movieController = require("../controller/movieController");

router.get("/", movieController.getAllMovies);
router.post("/", movieController.addMovie);
router.put("/:id", movieController.updateMovie);
router.delete("/:id", movieController.deleteMovie);

router.post("/requests", movieController.addMovieRequest);
router.delete("/requests/:id", movieController.deleteMovieRequest);

module.exports = router;
