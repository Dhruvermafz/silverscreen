const express = require("express");
const router = express.Router();
const listController = require("../controller/listController");

router.get("/lists", listController.getLists);
router.post("/lists", listController.createList);
router.delete("/lists/:id", listController.deleteList);

module.exports = router;
