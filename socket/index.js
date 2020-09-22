// Socket.io

const { init } = require("./init.js");
const { createChannel } = require("./channel.js");

const {
  newConnection,
  destroyConnection,
//   getConnections,
} = require("../utils/socketConnections.js");

const socket = (io) => {
  io.on("connection", async (socket) => {
    newConnection(socket.id, socket.request.user._id);

    // Inti Bemo
    init(socket);

    createChannel(io, socket.request, [socket.request.user._id])

    // On disconnect destroy the connection
    socket.on("disconnect", () => {
      destroyConnection(socket._id, socket.request.user._id);
    });
  });
};

module.exports = socket;
