const Channel = require("../../models/Channel.js")
const User = require("../../models/User.js")
const {
    userJoin,
    userLeave,
    getRoomUsers
  } = require('./users.js');
  

const testUser = {"locked":false,"payments":[],"_id":"5f6155eea6c8fe5f4cc04ace","phone":"0220392200","email":"michael@gmail.com","fullname":"Micael","username":"NICKWPI","userToken":291886062,"createdAt":"2020-09-16T00:01:50.041Z","updatedAt":"2020-09-16T00:01:50.041Z","__v":0}



const socket = (io) => {
    io.on("connection", async (socket) => {
        console.log("Connect to socket made");

        let currentUser = await User.findOne({ _id: "5f6155eea6c8fe5f4cc04ace" });

        // When someone joins the room
        socket.on('join', ({ channel }) => {

            userJoin(currentUser, channel);
            socket.join(channel);

            Channel.findOne({ _id: channel }, (err, dbChannel) => {
                if(!err) {
                    io.to(channel).emit('messageHistory', dbChannel.messages);
                } else {
                    io.to(channel).emit('error', "Error loading message history. Please retry.");
                } 
            });

            console.log(`someone join ${room}`);
        });

        // Listen for chatMessage
        socket.on('chatMessage', msg => {
            // const user = getCurrentUser(socket.id);
            io.to("room1").emit('message', `${msg}`);
        });



        socket.on('disconnect', () => {
            console.log("A user has disconnected");
        });



    })
};

module.exports = socket;