const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    salary: {
      type: Number,
      required: true,
    },

    frequency: {
      type: String,
      enum: ["hourly", "daily", "semi_monthly", "monthly"],
      required: true,
    },

    allowances: {
      type: Number,
      default: 0,
    },

    effectiveFrom: {
      type: Date,
      required: true,
    },

    effectiveTo: {
      type: Date,
      default: null, // null = current active salary
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Salary", salarySchema);