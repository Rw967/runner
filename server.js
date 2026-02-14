const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } // Erlaubt Zugriff von überall
});

let players = {};
let highscores = []; // Format: {n: "Name", s: 100}

io.on('connection', (socket) => {
    console.log('Ein Spieler ist verbunden:', socket.id);

    // RAUM BEITRETEN
    socket.on('joinRoom', (data) => {
        socket.join(data.room);
        players[socket.id] = {
            id: socket.id,
            name: data.name,
            room: data.room,
            x: 100,
            y: 300
        };
        console.log(`${data.name} ist Raum ${data.room} beigetreten`);
        
        // Allen im Raum die neue Spielerliste schicken
        updatePlayersInRoom(data.room);
        // Bestenliste beim Login schicken
        socket.emit('updateRankings', highscores);
    });

    // BEWEGUNG (Nur an Leute im gleichen Raum senden)
    socket.on('playerMove', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].name = data.name;
            
            socket.to(data.room).emit('updatePlayers', players);
        }
    });

    // SPIELSTART DURCH HOST
    socket.on('startRoomGame', (data) => {
        io.to(data.room).emit('roomStarted', { mode: data.mode });
    });

    // HIGHSCORE EINREICHEN
    socket.on('submitScore', (data) => {
        // Prüfen ob Spieler schon existiert, sonst hinzufügen
        const existingIdx = highscores.findIndex(h => h.n === data.name);
        if (existingIdx !== -1) {
            if (data.score > highscores[existingIdx].s) {
                highscores[existingIdx].s = data.score;
            }
        } else {
            highscores.push({ n: data.name, s: data.score });
        }

        // Sortieren und auf Top 10 kürzen
        highscores.sort((a, b) => b.s - a.s);
        highscores = highscores.slice(0, 10);

        // Alle Spieler weltweit über neue Bestenliste informieren
        io.emit('updateRankings', highscores);
    });

    // TRENNUNG
    socket.on('disconnect', () => {
        if (players[socket.id]) {
            const room = players[socket.id].room;
            delete players[socket.id];
            updatePlayersInRoom(room);
        }
        console.log('Spieler hat verlassen:', socket.id);
    });

    function updatePlayersInRoom(room) {
        const roomPlayers = {};
        for (let id in players) {
            if (players[id].room === room) {
                roomPlayers[id] = players[id];
            }
        }
        io.to(room).emit('updatePlayers', roomPlayers);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
