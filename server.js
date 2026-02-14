const io = require("socket.io")(process.env.PORT || 3000, {
  cors: { origin: "*" }
});

let onlinePlayers = {};
let highscores = []; // Hier werden die echten Highscores gespeichert

io.on("connection", (socket) => {
  console.log("Spieler verbunden: " + socket.id);

  // 1. Highscores beim Verbinden senden
  socket.emit('updateLeaderboard', highscores);

  socket.on("playerMove", (data) => {
    onlinePlayers[socket.id] = data;
    // Sende Positionen an alle (für die Geister-Spieler im Hintergrund)
    socket.broadcast.emit("updatePlayers", onlinePlayers);
  });

  // 2. Highscore-Logik: Wenn ein Spiel endet
  socket.on("newHighscore", (data) => {
    highscores.push({ n: data.name, s: data.score });
    // Sortieren: Höchste zuerst
    highscores.sort((a, b) => b.s - a.s);
    // Nur Top 10 behalten
    highscores = highscores.slice(0, 10);
    // An alle senden
    io.emit('updateLeaderboard', highscores);
  });

  // 3. Lobby-Logik (Räume)
  socket.on("joinLobby", (code) => {
    socket.join(code);
    console.log(`Spieler ${socket.id} ist Raum ${code} beigetreten`);
  });

  socket.on("disconnect", () => {
    delete onlinePlayers[socket.id];
    io.emit("updatePlayers", onlinePlayers);
  });
});
