// Socket.io

const { init } = require("./init.js");
const { createChannel } = require("./channel.js");
const { newMessage } = require("./chat.js");

const {
  newConnection,
  destroyConnection,
} = require("../utils/socketConnections.js");

const socket = (io) => {
  io.on("connection", async (socket) => {
    newConnection(socket.id, socket.request.user._id);

    /**
     * Init to the new socket with the users application data
     */
    init(socket);

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

    socket.on("chatMessage", (request) => {
      newMessage(socket, request);
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
