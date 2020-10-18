const { Socket } = require('dgram');
const { read } = require('fs');

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 2050

server.listen(port, () => {
    console.log('listening on port 2050');
});

let interval;

var userMap = []
var clients = []
var liveLog = []
var liveAudioLog = []

io.sockets.setMaxListeners(1);

io.on('connection', (socket) => {
    interval = setInterval(() => {
        socket.emit('newcomment', liveLog);
    }, 1000);

    socket.on("passUsername", function (data) {
        var tempDict = { 'user': data, 'transcript': []};
        console.log("User " + data + " has joined");
        userMap.push(tempDict);
        clients.push({'socket': socket, 'user': data});
    });

    socket.on('comment', function (data) {
        liveLog.push({'user': data.user, 'content': data.content});
    });

    socket.on('editcomment', function (data) {
        liveLog[data.index].content = data.content;
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
            clearInterval(interval);
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