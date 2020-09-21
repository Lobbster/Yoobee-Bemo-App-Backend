const Channel = require("../../models/Channel.js");
const User = require("../../models/User.js");
// const { userJoin, userLeave, getRoomUsers } = require("./users.js");

// let sessionStore = [];

const updateChannel = (socket, channel) => {
  Channel.findOne(
    { _id: channel },
    { messages: { $slice: -1 }, members: 1 },
    (err, channelData) => {
      socket.emit("updateChannel", {
        id: channelData._id,
        data:{
        latestMsg: channelData.messages[0],
        members: channelData.members,
      }});
    }
  );
};

const socket = (io) => {
  io.on("connection", async (socket) => {
    console.log("Connect to socket made");

    updateChannel(socket, "5f67d592fe74ed0c235ab8cf");

    // When someone joins the room
    socket.on("join", (channel) => {
      socket.join(channel);

      //   Store the current logged in passport user
      let currentUser = socket.request.user;
      // console.log(socket.request.user);

      Channel.findOne({ _id: channel }, (err, dbChannel) => {
        if (!err) {
          if (dbChannel) {
            if (dbChannel.members.includes(currentUser._id)) {
              console.log(dbChannel);
              let msgHistory = dbChannel.messages || [];
              io.to(channel).emit("channel", {
                id: channel,
                msgHistory: msgHistory,
              });
            } else {
              io.to(channel).emit(
                "error",
                "You don't have permission to view that chat"
              );
            }
          } else {
            io.to(channel).emit("error", "Couldn't find chat in our system");
          }
        } else {
          io.to(channel).emit("error", "Error loading chat. Please retry.");
        }
      });

      console.log(`someone join ${channel}`);
    });

    // Listen for chatMessage
    socket.on("chatMessage", (msg) => {
      // const user = getCurrentUser(socket.id);
      io.to(msg.channel).emit("message", msg.body);
    });

    socket.on("disconnect", () => {
      console.log("A user has disconnected");
    });

    // const session = socket.request.session;
    // session.socketId = socket.id;
    // session.save();
  });
};

module.exports = socket;
