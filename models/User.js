const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  fullname: { type: String, required: true },
  userToken: Number,
  pinCode: String,
  verified: Boolean,
  picture: String,
  balance: Number,
  auth: String,
  accounts: Object,
  locked: (Boolean = false),
  payments: [{ type: objectId }],
  email: { type: String, required: true },
});

module.exports = mongoose.model("user", UserSchema);
