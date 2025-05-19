const Contact = require("../models/contact");

// Create a new contact
exports.createContact = async (req, res) => {
  try {
    const { firstname, email, subject, message } = req.body;

    // Validate input
    if (!firstname || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contact = new Contact({
      firstname,
      email,
      subject,
      message,
    });

    await contact.save();
    res
      .status(201)
      .json({ message: "Contact message created successfully", contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all contacts
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get contact by ID
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update contact by ID
exports.updateContact = async (req, res) => {
  try {
    const { firstname, email, subject, message } = req.body;

    // Validate input
    if (!firstname || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { firstname, email, subject, message, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact updated successfully", contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Search contacts by email
exports.searchContactByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email query parameter is required" });
    }

    const contacts = await Contact.find({
      email: { $regex: email, $options: "i" },
    });
    if (contacts.length === 0) {
      return res
        .status(404)
        .json({ message: "No contacts found with this email" });
    }

    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete contact by ID
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
