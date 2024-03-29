// Socket.io
const Channel = require("../models/Channel.js");
const { init } = require("./init.js");
const { createChannel } = require("./channel.js");
const { newMessage, getMsgs } = require("./chat.js");

const {
  newConnection,
  destroyConnection,
  getUsers,
} = require("../utils/socketConnections.js");

const socket = (io) => {
  io.on("connection", async (socket) => {
    newConnection(socket.id, socket.request.user);

    io.emit("activeUsers", getUsers());

    /**
     * Init to the new socket with the users application data
     */

    init(socket);

    socket.on("init", () => {
      init(socket);
    });

    /**
     * Listster for a socket creatChannel event
     *
     * @param  {object} request - new channel object
     * @typedef {{ name: string, users: array}}
     */

    socket.on("createChannel", (request) => {
      createChannel(io, socket, request);
    });

    /**
     * Listen for a socket chatMessage event
     *
     * @param {object} request - chat message object
     * @typedef {{ channel: objectId, content: string, contentType: string}}
     */

    socket.on("sendMsg", (request) => {
      newMessage(io, socket, request);
    });

    /**
     * Listen for a socket joinChanel event
     *
     * @param { String } channel - The channel id
     */

    socket.on("joinChannel", async (channelId) => {
      socket.join(channelId);

      const channel = await Channel.findById(channelId);

      io.emit("updateChannel", {
        _id: channel._id,
        length: channel.messages.length
      });
    });

    socket.on("getMsgs", (options) => {
      getMsgs(io, options);
    })

    /**
     * Listen for a socket leaveChannel event
     *
     * @param { String } channel - The channel id
     */

    socket.on("leaveChannel", (channel) => {
      // console.log("User Left " + channel);
      socket.leave(channel);
    });

    /**
     * When a user disconnects from socket
     */

    socket.on("disconnect", () => {
      destroyConnection(socket._id, socket.request.user._id);
    });
  });
};

module.exports = socket;
