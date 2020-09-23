const currentChats = [];

// Join user to chat
function userJoin(user, channel) {
    // TODO: VALIDATE USER
    const chatUser = { user, channel };

    currentChats.push(chatUser);

    return chatUser;
}

// User leaves chat
function userLeave(id) {
    const index = currentChats.findIndex(user => user.id === id);

    if (index !== -1) {
        return currentChats.splice(index, 1)[0];
    }
}

// Get room users
function getRoomUsers(room) {
    return currentChats.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    userLeave,
    getRoomUsers
};