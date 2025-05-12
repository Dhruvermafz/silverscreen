const express = require("express");
const router = express.Router();
const listController = require("./controllers/ListController");
const authMiddleware = require("./middleware/auth");

router.post("/", authMiddleware, listController.createList);
router.put("/:listId", authMiddleware, listController.editList);
router.delete("/:listId", authMiddleware, listController.deleteList);
router.get("/:listId", listController.getListById);
router.post(
  "/:listId/films/:filmId",
  authMiddleware,
  listController.addFilmToList
);
router.delete(
  "/:listId/films/:filmId",
  authMiddleware,
  listController.removeFilmFromList
);
router.get("/user/:userId", listController.getListsByUser);
router.get("/featured", listController.getFeaturedLists);

module.exports = router;
