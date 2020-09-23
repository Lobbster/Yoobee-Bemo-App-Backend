const Channel = require("../models/Channel.js");
const channel = require("./channel.js");
const Channel = require("../models/Channel.js");

const emmitMessage = (message, channel) => {

};

const newMessage = async (socket, request) => {
    const channel = await Channel.findOne(request.channel._id)

    let message = request.message
    message.author = socket.request.user._id
    channel.messages.push(message)
    await channel.save()

    let formattedMessage = request.message
    formattedMessage.author = socket.request.user

    /** 
     * 
     * NOTE:
     * Return an dict of authors with name and profile
     * 
     * Return an arry of msg's, only return msg where the author is still in the channel
     * 
     * authors dict key is the authors object id
     * 
     */

    io.to(request.channel_id).emit("message", message);
};

module.exports = {
  newMessage,
};
