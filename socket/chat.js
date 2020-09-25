const Channel = require("../models/Channel.js");

/**
 * Create and save a new message
 * Then emmit that message to that channel
 * 
 * @param { Object } socket - socket.io instance
 * @param { Object } request - request body object
 * @typedef {{ channel: objectId, content: string, contentType: string }}
 */

const sendMessage = async (socket, request) => {
    const channel = await Channel.findOne(request.channel._id)

    // Add current user to message object
    let message = request.message
    message.author = socket.request.user._id

    // Save to database for current channel
    channel.messages.push(message)
    await channel.save()

    io.to(request.channel_id).emit("newMessage", { channel: request.channel_id, message: message });
};

const initChat = async (io, channelId) => {
  const channel = await Channel.findOne(channelId)
  io.to(channelId).emit('initChat', { channel: channelId, messages: channel.messages })
}

module.exports = {
  sendMessage,
  initChat
};
