// Socket.io

const { init } = require("./init.js");
const { createChannel } = require("./channel.js");

const {
  newConnection,
  destroyConnection,
} = require("../utils/socketConnections.js");

const socket = (io) => {
  io.on("connection", async (socket) => {
    newConnection(socket.id, socket.request.user._id);

    init(socket);

    /**
     * Listster for a socket creatChannel event
     * 
     * @param  {object} request - new channel object
     * @typedef {{ name: string, users: array}}
     */

    socket.on("createChannel", (request) => {
      createChannel(io, socket, request)
    });

    /**
     * Listen for a socket chatMessage event
     * 
     * @param {object} request - chat message object
     * @typedef {{ channel: objectId, body: string, type: string}}
     */

    socket.on("chatMessage", (request) => {
      io.to(request.channel).emit("message", request.body);
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
