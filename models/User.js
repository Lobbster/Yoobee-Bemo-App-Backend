const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    fullName: { type: String, required: true },
    verified:  Boolean,
    picture: String,
    balance: Number,
    auth: String,
    accoutes: Object,
    locked: Boolean,
    payments: Array,
    email: { type: String, required: true },
  }
);

module.exports = mongoose.model("user", UserSchema);