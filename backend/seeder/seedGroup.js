const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Group = require("../models/group"); // Adjust path to your Group model
require("dotenv").config();

// MongoDB connection URI
const MONGODB_URI = process.env.MONGO_URI;
// Provided user IDs (for validation)
const validUserIds = [
  "67ff26fba293ab7281627948",
  "67ff28f0a293ab728162794c",
  "67ff2a3ca293ab7281627950",
  "680df604700980538bb42962",
  "680e021c700980538bb42964",
  "68131e1207af9fb1b048a138",
  "68139da5031afd84f79deb6f",
  "68139dd9031afd84f79deb73",
  "6813a1b5031afd84f79deb86",
  "6813a75d031afd84f79deba5",
];

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Function to validate and seed groups
const seedGroups = async () => {
  try {
    // Clear existing groups (optional, comment out to preserve existing data)
    await Group.deleteMany({});
    console.log("Cleared existing groups");

    // Read groups from JSON file
    const groupsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "groups.json"), "utf-8")
    );

    // Validate user IDs in groups
    for (const group of groupsData) {
      if (!validUserIds.includes(group.creator)) {
        throw new Error(
          `Invalid creator ID: ${group.creator} in group ${group.name}`
        );
      }
      for (const member of group.members) {
        if (!validUserIds.includes(member.user)) {
          throw new Error(
            `Invalid member user ID: ${member.user} in group ${group.name}`
          );
        }
      }
    }

    // Map groups to schema format
    const groups = groupsData.map((group) => ({
      ...group,
      creator: new mongoose.Types.ObjectId(group.creator), // Use 'new' for ObjectId
      members: group.members.map((member) => ({
        user: new mongoose.Types.ObjectId(member.user), // Use 'new' for ObjectId
        role: member.role,
      })),
      posts: [], // Empty posts array
    }));

    // Insert groups
    await Group.insertMany(groups);
    console.log("Successfully seeded groups");

    // Verify inserted groups
    const insertedGroups = await Group.find();
    console.log("Inserted groups:", insertedGroups);
  } catch (error) {
    console.error("Error seeding groups:", error);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
};

// Run the seeder
seedGroups();
