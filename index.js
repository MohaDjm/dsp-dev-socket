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
    console.log('Un utilisateur s\'est connecté');
    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
    });
    socket.on('SMessage', (msg) => {
        const channel = socket.channel;
        if (channel) {
            io.to(channel).emit('CMessage', { msg, id: socket.id });
        }
    });
    socket.on('STyping', () => {
        const channel = socket.channel;
        if (channel) {
            socket.to(channel).emit('CTyping', 'Quelqu\'un est en train d\'écrire...');
        }
    });
    socket.on('SStopTyping', () => {
        const channel = socket.channel;
        if (channel) {
            socket.to(channel).emit('CStopTyping');
        }
    });
    socket.on('joinChannel', (channel) => {
        socket.join(channel);
        socket.channel = channel;
        console.log(`Un utilisateur a rejoint le channel: ${channel}`);
    });
});
server.listen(5000, () => {
    console.log('server running at http://localhost:5000');
});
