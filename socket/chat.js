const Channel = require("../models/Channel.js");

/**
 * Create and save a new message
 * Then emmit that message to that channel
 * 
 * @param { Object } socket - socket.io instance
 * @param { Object } request - request body object
 * @typedef {{ channel: objectId, content: string, contentType: string }}
 */

const newMessage = async (socket, request) => {
    const channel = await Channel.findOne(request.channel._id)

    // Add current user to message object
    let message = request.message
    message.author = socket.request.user._id

    // Save to database for current channel
    channel.messages.push(message)
    await channel.save()

    io.to(request.channel_id).emit("message", message);
};

module.exports = {
  newMessage,
};
