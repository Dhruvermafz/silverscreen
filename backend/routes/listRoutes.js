const express = require("express");
const router = express.Router();
const listController = require("../controller/listController");

router.get("/", listController.getLists);
router.post("/", listController.createList);
router.delete("/:id", listController.deleteList);

module.exports = router;
