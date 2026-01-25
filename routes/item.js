//[SECTION] Dependencies and Modules
const express = require("express");
const router = express.Router(); // ✅ This line defines `router`

const itemController = require("../controllers/item");
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

// Create Item (admin only)
router.post("/", verify, verifyAdmin, itemController.createItem);

// Get All Items (admin only)
router.get("/all", verify, itemController.getAllItems);

// Update Item Status (admin only)
router.put("/:itemId", verify, verifyAdmin, itemController.updateItemStatus);

//[SECTION] Export the router so it can be used in app.js
module.exports = router;
