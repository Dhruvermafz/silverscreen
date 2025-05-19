const express = require("express");
const router = express.Router();
const contactController = require("../controller/contactController");

router.post("/", contactController.createContact); // Create contact
router.get("/", contactController.getAllContacts); // Get all contacts
router.get("/:id", contactController.getContactById); // Get contact by ID
router.put("/:id", contactController.updateContact); // Update contact by ID
router.get("/search", contactController.searchContactByEmail); // Search contacts by email
router.delete("/:id", contactController.deleteContact); // Delete contact by ID

module.exports = router;
