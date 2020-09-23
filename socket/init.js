/**
 * Send the current user thier channels, user info
 * and other application data
 *
 * @param { object } socket - socket.io instance
 */

const init = async (socket) => {
  const chatsPayload = {};

  if (socket.request.user.channels) {
    // populate the current user's channels and into thoes channels thier members
    await socket.request.user
      .populate({
        path: "channels",
        model: "Channel",
        select: {
          messages: { $slice: -1 },
          members: 1,
        },
        populate: {
          path: "members",
          model: "User",
          select: "username fullname picture",
        },
      })
      .execPopulate();

    // For each channel return a dictonary of channels
    for (id in socket.request.user.channels) {
      let channelMembers = socket.request.user.channels[id].members;
      chatsPayload[socket.request.user.channels[id]._id] = {
        // Get them channels latest message
        latestMsg: socket.request.user.channels[id].messages[0],
        // Reassign the channel members to objects for the frontend
        members: Object.assign(
          {},
          ...channelMembers.map((member) => ({
            [member._id]: {
              photo: member.photo,
              username: member.username,
              fullname: member.fullname,
            },
          }))
        ),
      };
    }
  }

  // Emmit the channels dictonary and user info to the current user
  socket.emit("initChannels", chatsPayload);
  socket.emit("initUser", socket.request.user);
};

module.exports = {
  init,
};
