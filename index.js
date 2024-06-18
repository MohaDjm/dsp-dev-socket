const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/channel/:channelName', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté')
    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté')
    });
    socket.on('SMessage', (msg) => {
        io.emit('CMessage', { msg, id: socket.id });
    });
    socket.on('STyping', () => {
        socket.broadcast.emit('CTyping', 'Quelqu\'un est en train d\'écrire...');
    });
    socket.on('SStopTyping', () => {
        socket.broadcast.emit('CStopTyping');
    });
    socket.on('joinChannel', (channel) => {
        socket.join(channel);
        console.log(`User joined channel: ${channel}`);
    });
});
server.listen(5000, () => {
    console.log('server running at http://localhost:5000')
});
