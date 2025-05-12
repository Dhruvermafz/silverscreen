const express = require("express");
const router = express.Router();
const filmController = require("./controllers/FilmController");

router.get("/:filmId", filmController.getFilmById);
router.get("/search", filmController.searchFilms);
router.get("/trending", filmController.getTrendingFilms);
router.get("/:filmId/box-office", filmController.getBoxOfficeData);
router.get("/:filmId/streaming", filmController.getStreamingAvailability);
router.get("/:filmId/cast-crew", filmController.getCastAndCrew);

module.exports = router;
