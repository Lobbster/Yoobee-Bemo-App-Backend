const Channel = require("../models/Channel.js");
const User = require("../models/User.js");
const { getConnections } = require("../utils/socketConnections.js");

/**
 * Emit a channel update to socket
 * Sends a channel id and a channel data object
 * 
 * @param { Object } socket - socket.io instance
 * @param { String } channel - channel id as string
 */

// TODO: EMIT TO ALL LIVE USERS IN THE CHANNEL
const updateChannel = (socket, channel) => {
  Channel.findOne(
    { _id: channel },
    { messages: { $slice: -1 }, members: 1 },
    (err, channelData) => {
      socket.emit("updateChannel", {
        id: channelData._id,
        data: {
          latestMsg: channelData.messages[0],
          members: channelData.members,
        },
      });
    }
  );
};

/**
 * Emmit a channel to an array of socket id's
 * 
 * @param { Object } io - socket.io instance
 * @param { Array } sockets - array of socket ids
 * @param { Object } channel - channel object to be emitted
 */

const updateCurrentUsers = (io, sockets, channel) => {
  sockets.forEach(socket => {
    io.to(socket.socketId).emit('updateChannel', {
      id: channel._id,
      data: {
        members: channel.members,
        messages: channel.messages.slice(-1)[0]
      }
    });
  });
}

const updateUsers = (users, channel) => {
  users.forEach(user => {
    User.findOne(user._id).then(user => {
      user.channels.push(channel)
      user.save()
    })
  })
}

const createChannel = (io, socket, request) => {
  const channelSockets = getConnections(request.users);
  const channel = new Channel({ members: request.users });

  channel
    .save()
    .then((result) => {

      // Update Users
      updateUsers(request.users, result._id)

      // Update Online Users
      updateCurrentUsers(io, channelSockets, result);
    })
    .catch((err) => {
      io.to(socket).emit('error', { error: err });
    });
};

module.exports = {
  updateChannel,
  createChannel
};
