const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema(
  {
    name: String,
    members: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        status: {
          type: String,
          enum: ["SENDING", "SENT", "RECIEVED"],
          default: "SENDING",
        },
        content: { type: Object, required: true },
        contentType: {
          type: String,
          enum: ["PAYMENT", "TEXT/PLAIN", "GIF"],
        },
        author: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Channel", ChannelSchema);
