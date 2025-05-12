const express = require("express");
const router = express.Router();
const tagController = require("../controller/tagsController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/:filmId", authMiddleware, tagController.addTagToFilm);
router.get("/:filmId", tagController.getTagsByFilm);
router.get("/", tagController.getAllTags);
router.get("/films/:tagName", tagController.getTaggedFilms);
router.get("/popular", tagController.getPopularTags);

module.exports = router;
