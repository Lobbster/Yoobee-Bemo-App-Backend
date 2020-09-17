const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    source: { type: Object, required: true },
    destination: { type: Object, required: true },
    status: {
      type: String,
      enum: ["pending", "resolved", "failed", "frozen"],
      default: "pending"
    },
    amount: { 
      type: Number, 
      min: [50, 'Sorry, payments must be at least $0.50'],
      max: [50000, 'Sorry, the max allowed transaction at this time is $500'],
      required: true 
    },
    resolvedTime: Date,
    sourceIp: String,
    destinationIp: String,
    flag: {
      type: String,
      enum: ["fraud", "validate", "error"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("transaction", TransactionSchema);
