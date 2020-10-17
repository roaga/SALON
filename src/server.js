const { Socket } = require('dgram');
const { read } = require('fs');

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3010

app.get('/', (req, res) => {
    res.send("Hello");
});

server.listen(port, () => {
    console.log('listening on port 3010');
});

let interval;

var userMap = []
var clients = []
var liveLog = []
var liveAudioLog = []

io.on("connection", (socket) => {
    setInterval(() => {
        socket.broadcast.emit('newcomment', liveLog);
    }, 1500);

    socket.on("passUsername", function (data) {
        var isValidUser = true;
        var tempDict = { 'user': data, 'transcript': []};
        for (var i = 0; i < userMap.length; i++) {
            if (userMap[i].user === data) {
                isValidUser = false;
            }
        }
        if (isValidUser) {
            console.log("User " + data + " has joined");
            userMap.push(tempDict);
            clients.push({'socket': socket, 'user': data });
        }
    });

    socket.on('comment', function (data) {
        var flag = true;
        for(var i = 0; i < liveLog.length; i++) {
            if(liveLog[i].user === data.user && liveLog[i].content === data.content) {
                flag = false;
            }
        }
        if(flag) {
            liveLog.push({'user': data.user, 'content': data.content});
        } 
    });

    socket.on('transcript data', function (data) {
        for (var i = 0; i < userMap.length; i++) {
            if ((userMap[i].user === data.user)) {
                if (data.transcript !== "") {
                    liveLog.push({user: data.user, content: data.transcript});
                    userMap[i].transcript.push(data.transcript);
                }
                break;
            }
        }
    });

    socket.on('get audio', function(data) {
        liveAudioLog.push({user: data.user, audioData: data.audioData})
    });

    socket.on('disconnect', () => {
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].socket === socket) {
                var user = clients[i].user;
                clients.splice(i, 1);
                console.log(clients.length);
                break;
            }
        }

        if(clients.length === 0) {
            clearInterval();
        }

        if(user !== undefined) {
            console.log(user + " disconnected");
            console.log(liveLog);
        }

        for (var a = 0; a < userMap.length; a++) {
            if (userMap[a].user === user) {
                userMap.splice(i, 1);
                break;
            }
        }
    });
});