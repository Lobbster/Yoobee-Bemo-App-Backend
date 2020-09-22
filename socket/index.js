
// Socket.io 

const { init } = require("./init.js");

const socket = (io) => {
    io.on("connection", async (socket) => {
        // Log a user connection
        console.log("Connect to socket made");

        // Inti Bemo
        init(socket);
        
    });
};

module.exports = socket;
