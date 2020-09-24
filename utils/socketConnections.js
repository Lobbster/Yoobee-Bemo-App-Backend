let socketConnections = [];

const newConnection = (socket, user) => {
    socketConnections[user] = {
        socketId: socket
    }
}

const destroyConnection = (socket) => {
    delete socketConnections[socket];
}

const getConnections = (ids) => {
    let connections = [];

    ids.forEach(user => {
        if(socketConnections[user]){
            connections.push(socketConnections[user]);
        }
    });

    return connections;
}

module.exports = {
    newConnection,
    destroyConnection,
    getConnections
}