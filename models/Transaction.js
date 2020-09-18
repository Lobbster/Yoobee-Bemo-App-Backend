const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    source: { type: Object, required: true },
    destination: { type: Object, required: true },
    status: {
      type: String,
      enum: ["RESOLVED", "FAILED", "ISF"],
      required: true
    },
    amount: { 
      type: Number, 
      min: [50, 'MIN PAYMENT AMOUNT OF 0.50'],
      max: [50000, 'MAX PAYMENT AMOUNT OF 500'],
      required: true 
    },
    payment: {
      type: Object,
      required: true
    },
    resolvedTime: Date,
    sourceIp: String,
    destinationIp: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("transaction", TransactionSchema);
