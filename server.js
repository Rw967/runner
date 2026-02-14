const io = require('socket.io')(process.env.PORT || 3000, {
    cors: { origin: "*" } // Erlaubt Verbindungen von überall
});

let players = {};

console.log("Server läuft...");

io.on('connection', (socket) => {
    console.log("Ein Spieler ist beigetreten: " + socket.id);

    // Neuen Spieler registrieren
    players[socket.id] = { x: 480, y: 280, skin: '🟦' };

    // Alle Spieler über den neuen Spieler informieren
    io.emit('updatePlayers', players);

    // Wenn sich ein Spieler bewegt
    socket.on('playerMove', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].skin = data.skin;
            // Position an alle anderen senden
            socket.broadcast.emit('updatePlayers', players);
        }
    });

    // Wenn ein Spieler das Spiel verlässt
    socket.on('disconnect', () => {
        console.log("Spieler weg: " + socket.id);
        delete players[socket.id];
        io.emit('updatePlayers', players);
    });
});
