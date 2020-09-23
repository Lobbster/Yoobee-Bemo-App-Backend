const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    source: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    status: {
      type: String,
      enum: ["PENDING", "RESOLVED", "FAILED", "FROZEN"],
      default: "PENDING"
    },
    transaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction"},
    amount: { 
      type: Number, 
      min: [50, 'Sorry, payments must be at least $0.50'],
      max: [50000, 'Sorry, the max allowed payment at this time is $500'],
      required: true 
    },
    paymentType: { type: String, enum: ["BEMO", "INCOMING", "OUTGOING"], required: true}
  },
  { timestamps: true }
);

module.exports = mongoose.model("payment", PaymentSchema);
