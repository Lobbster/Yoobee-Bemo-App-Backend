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
  message.createdAt = Date.now();

  // Save to database for current channel
  channel.messages.push(message);
  await channel.save()

  io.to(request.channel).emit("receiveMsg", {
    msg: message,
    length: channel.messages.length
  });
  updateChannel(io, socket, request.channel);
};

const getMsgs = async (io, options) => {
  const channel = await Channel.findById(options.channelId);
  const msgSum = await channel.messages.length
  const messages = channel.messages.splice(- options.num -20 , 20).reverse();
  io.to(options.channelId).emit("reciveMsgs", {
    msgs: messages, 
    length: msgSum
})};

module.exports = {
  newMessage,
  getMsgs
};
