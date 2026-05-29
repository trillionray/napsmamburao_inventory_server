const express = require("express");
const router = express.Router();

const salaryController = require("../controllers/salary");
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

// Add new salary (admin only)
router.post("/", verify, verifyAdmin, salaryController.addSalary);

// Get current salary of a user (admin only)
router.get("/current/:userId", verify, verifyAdmin, salaryController.getCurrentSalary);

// Get salary history of a user (admin only)
router.get("/history/:userId", verify, verifyAdmin, salaryController.getSalaryHistory);


router.get("/all-current", verify, verifyAdmin, salaryController.getAllCurrentSalaries);
//[SECTION] Export router
module.exports = router;