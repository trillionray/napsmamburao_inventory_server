const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["in", "out", "returned"],
      required: true
    },
    notes: {
      type: String,
      default: ""
    },
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    when: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
