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

io.on("connection", (socket) => {
  if (interval) {
    clearInterval(interval);
  }

  clients.push(socket);

  interval = setInterval(() => getApiAndEmit(socket), 1000); // every second, it returns the socket data

  socket.on("passUsername", function(data) {
        var isValidUser = true;
        var tempDict = {'user': data, 'transcript': "", 'audio': 0};
        for(var i = 0; i < userMap.length; i++) {
            if(userMap[i].user === data) {
                isValidUser = false;
            }
        }
        if(isValidUser) {
            console.log("User " + data + " has joined");
            userMap.push(tempDict);
        }
  });

  socket.on('disconnect', function(data) {
    console.log("Client disconnected");
    console.log(data);

    clearInterval(interval);
    console.log(userMap);
  });
});

const getApiAndEmit = (socket) => {
    socket.on('transcript data', function(data) {
        for(var i = 0; i < userMap.length; i++) {
            if((userMap[i].user === data.user)) {
                userMap[i].transcript = data.transcript;
                userMap[i].audio = data.audioBLOB;
            }
        }

        return userMap;
    });
};

/*
const serverPort = 3001;
const [transcript, setTranscript] = useState("Transcript goes here");
    const [audioBLOB, setAudioBLOB] = useState(2)

    const socket = socketIOClient('http://localhost:' + serverPort);

    socket.on("FromAPI", data => {
        console.log(data);
    });

    var user = firebase.auth().currentUser
    if(user != null) {
        socket.emit('passUsername', user.email);
    }

    if(user != null) {
        var fulldata = {'user': user.email, 'transcript': transcript, 'audioBLOB': audioBLOB};
        setInterval(() => {
            socket.emit('transcript data', fulldata);
        }, 1000);
    }

    socket.emit('disconnect', "email");
*/