const init = async (socket) => {
    const chatsPayload = {};

    if (socket.request.user.channels) {
        await socket.request.user.populate("channels", { messages: { $slice: -1 }, members: 1 }).execPopulate()

        for (id in socket.request.user.channels) {
            chatsPayload[socket.request.user.channels[id]._id] = {
                latestMsg: socket.request.user.channels[id].messages[0],
                members: socket.request.user.channels[id].members
            }
        }
    }

    socket.emit("initChannels", chatsPayload);
    socket.emit("initUser", socket.request.user);
};

module.exports = {
    init,
};
