const Channel = require("../models/Channel.js");
const { getConnections } = require("../utils/socketConnections.js");

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

const createChannel = (io, socket, users) => {
    console.log(users)
  const channelSockets = getConnections(users);
  console.log(channelSockets);

  const channel = new Channel({ users: channelUsers });
  
  channel
    .save()
    .then((result) => {
        channelSockets.forEach(socket => {
            console.log(socket)
            io.to(socket).emit('updateChannel', {
                id: result._id,
                data: {
                    members: result.members,
                    messages: result.messages.slice(-1)[0]
                }
            });
        });
    })
    .catch((err) => {
        io.to(socket).emit('error', { error: err });
    });
};

module.exports = {
  updateChannel,
  createChannel
};
