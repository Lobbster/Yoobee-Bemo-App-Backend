const http = require("../../server.js");
const Room = require("../../models/Room.js");

// Check if room exists in database
const roomExists = (roomId) => {
  Room.exists({ _id: roomId }, function(err, result) {
    if (err) {
      return false;
    } else {
      return true;
    }
  });
}


module.exports = {
  roomExists
};
