const Salary = require("../models/Salary");

// ADD NEW SALARY (creates history)
const addSalary = async (req, res) => {
  try {
    const { userId, salary, frequency, allowances, effectiveFrom } = req.body;

    // 1. Close current active salary (if any)
    await Salary.findOneAndUpdate(
      { userId, effectiveTo: null },
      { $set: { effectiveTo: new Date(effectiveFrom || Date.now()) } }
    );

    // 2. Create new salary record
    const newSalary = await Salary.create({
      userId,
      salary,
      frequency,
      allowances,
      effectiveFrom: effectiveFrom || new Date(),
      effectiveTo: null,
    });

    return res.status(201).json(newSalary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET CURRENT SALARY
const getCurrentSalary = async (req, res) => {
  try {
    const { userId } = req.params;

    const salary = await Salary.findOne({
      userId,
      effectiveTo: null,
    }).populate("userId", "name email role");

    if (!salary) {
      return res.status(404).json({ message: "No active salary found" });
    }

    return res.json(salary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET SALARY HISTORY
const getSalaryHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await Salary.find({ userId })
      .sort({ effectiveFrom: -1 })
      .populate("userId", "name email role");

    return res.json(history);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllCurrentSalaries = async (req, res) => {
  try {
    const Salary = require("../models/Salary");
    const User = require("../models/User");

    // Get all users
    const users = await User.find({}, "_id name");

    const result = await Promise.all(
      users.map(async (user) => {
        const salary = await Salary.findOne({ userId: user._id })
          .sort({ effectiveFrom: -1 });

        return {
          userId: user._id,
          name: user.name,
          salary: salary?.salary || 0,
          frequency: salary?.frequency || "monthly",
          allowances: salary?.allowances || 0,
        };
      })
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addSalary,
  getCurrentSalary,
  getSalaryHistory,
  getAllCurrentSalaries
};