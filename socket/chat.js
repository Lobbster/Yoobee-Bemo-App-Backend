const Channel = require("../models/Channel.js");
const { updateChannel } = require("./channel.js");

/**
 * Create and save a new message
 * Then emmit that message to that channel
 *
 * @param { Object } socket - socket.io instance
 * @param { Object } request - request body object
 * @typedef {{ channel: objectId, content: string, contentType: string }}
 */

const newMessage = async (io, socket, request) => {
  const channel = await Channel.findById(request.channel);

  // Add current user to message object
  let message = request.message;
  message.author = socket.request.user._id;

  // Save to database for current channel
  channel.messages.push(message);
  await channel.save();

  io.to(request.channel).emit("receiveMsg", message);
  updateChannel(io, socket, request.channel);
};

const initChat = async (io, channelId) => {
  const channel = await Channel.findById(channelId);
  io.to(channelId).emit("initChat", channel.messages);
};

module.exports = {
  newMessage,
  initChat
};