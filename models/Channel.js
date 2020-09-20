const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
    name: String,
    members: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    messages: [{
        status: {
            type: String,
            enum: ["SENDING", "SENT", "RECIEVED"],
            default: "SENDING"
        },
        content: { type: Object, required: true },
        contentType: {
            type: String,
            enum: ["PAYMENT", "MESSAGE", "GIF"],
            required: true
        },
        author: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        }
    }]
},
    { timestamps: true }
);

module.exports = mongoose.model("channel", ChannelSchema);
