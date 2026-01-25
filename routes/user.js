//[SECTION] Dependencies and Modules
const express = require("express");
const router = express.Router(); // ✅ This line defines `router`

const userController = require("../controllers/user");
const auth = require("../auth");
const { verify, verifyAdmin, } = auth;

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/details", verify, userController.getUserDetails);
router.get("/", verify, userController.getAllUsers);

//[SECTION] Export the router so it can be used in app.js
module.exports = router;
