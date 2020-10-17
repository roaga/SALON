const { Socket } = require('dgram');
const { read } = require('fs');

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3001

app.get('/', (req, res) => {
    res.send("Hello");
});

server.listen(port, () => {
    console.log('listening on *:3001');
});

let interval;

var userMap = []
var clients = []
var liveLog = []

io.on("connection", (socket) => {
    if (interval) {
        clearInterval(interval);
    }

    clients.push(socket);

    interval = setInterval(() => getApiAndEmit(socket), 1000); // every second, it returns the socket data

    socket.on("passUsername", function (data) {
        var isValidUser = true;
        var tempDict = { 'user': data, 'transcript': "", 'audio': 0 };
        for (var i = 0; i < userMap.length; i++) {
            if (userMap[i].user === data) {
                isValidUser = false;
            }
        }
        if (isValidUser) {
            console.log("User " + data + " has joined");
            userMap.push(tempDict);
            clients.push({ 'socket': socket, 'user': data });
        }
    });

    socket.on('comment', function (data) {
        liveLog.push(data);
    });

    socket.on('disconnect', () => {
        console.log("Client disconnected");
        clearInterval(interval);

        for (var i = 0; i < clients.length; i++) {
            if (clients[i].socket === socket) {
                var user = clients[i].user;
                clients.splice(i, 1);
                break;
            }
        }

        for (var i = 0; i < userMap.length; i++) {
            if (userMap[i].user === user) {
                userMap.splice(i, 1);
                break;
            }
        }

        console.log(userMap);
        console.log(liveLog);
    });
});

const getApiAndEmit = (socket) => {
    socket.on('transcript data', function (data) {

        for (var i = 0; i < userMap.length; i++) {
            if ((userMap[i].user === data.user)) {
                if (!(userMap[i].transcript === data.transcript)) {
                    liveLog.push(data.transcript);
                    userMap[i].transcript = data.transcript;
                }
                userMap[i].audio = data.audioBLOB;
                break;
            }
        }

        return liveLog;
    });
};