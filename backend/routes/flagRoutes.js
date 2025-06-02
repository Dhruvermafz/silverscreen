const express = require("express");
const router = express.Router();
const flagController = require("../controller/flagController");

router.post("/flags", flagController.submitFlag);
router.get("/flags/:userId", flagController.getUserFlags);
router.put("/flags/:flagId/review", flagController.reviewFlag);

module.exports = router;
