const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  users: [mongoose.Types.ObjectId]
},
{ timestamps: true });

module.exports = mongoose.model("room", RoomSchema);
