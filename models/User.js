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
  channels: [{ type: mongoose.Types.ObjectId, ref: 'Channel' }],
  locked: {
    type: Boolean,
    default: false
},
  payments: [mongoose.Types.ObjectId],
  email: { type: String, required: true },
  phone: { type: String, required: true },
},
{ timestamps: true });

module.exports = mongoose.model("user", UserSchema);
