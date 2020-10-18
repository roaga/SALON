const {Socket} = require('dgram');
const {read} = require('fs');

const express = require('express');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 2050

server.listen(port, () => {
    console.log('listening on port 2050');
});

let interval;
let intervalA;

var userMap = []
var clients = []
var liveLog = []
var liveAudioLog = []

io.sockets.setMaxListeners(1);

io.on('connection', (socket) => {
    io.set('transports', ['websocket']);

    interval = setInterval(() => {
        socket.emit('newcomment', liveLog);
    }, 1000);
    intervalA = setInterval(() => {
        socket.emit('audiodata', liveAudioLog);
    }, 250);
    

    socket.on("passUsername", function (data) {
        var tempDict = { 'user': data, 'transcript': []};
        console.log("User " + data + " has joined");
        userMap.push(tempDict);
        clients.push({'socket': socket, 'user': data});
    });

    socket.on('comment', function (data) {
        var flag = true;
        for(var i = 0; i < liveLog.length; i++) {
            if(liveLog[i].topic === data.topic) {
                liveLog[i].content.push(data.content);
                flag = false;
            }
        }
        if(flag) {
            liveLog.push({'content': [data.content], 'topic': data.topic});
        }
    });

    socket.on('editcomment', function (data) {
        for(var i = 0; i < liveLog.length; i++) {
            if(liveLog[i].topic === data.topic) {
                liveLog[i].content[data.index] = data.content;
            }
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

    socket.on('relayaudio', function(data) {
        liveAudioLog.push({'user': data.user, 'binData': data.binData});
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
            clearInterval(intervalA);
            liveLog = [];
            liveAudioLog = [];
            console.log("Intervals killed. This server is kinda dead.")
        }

        if(user !== undefined) {
            console.log(user + " disconnected");
            console.log(liveLog);
            console.log(liveAudioLog);
        }

        for (var a = 0; a < userMap.length; a++) {
            if (userMap[a].user === user) {
                userMap.splice(i, 1);
                break;
            }
        }
    });
});

app.use(express.static('build'));