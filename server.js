// server.js
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" } // permitir todas las conexiones
});

const players = {}; // id -> posición

io.on("connection", (socket) => {
  console.log("Nuevo jugador conectado:", socket.id);

  // 1. GUARDAR la posición inicial del nuevo jugador antes de cualquier emisión.
  const initialPosition = { x: 0, y: 1, z: 0 }; 
  players[socket.id] = initialPosition;

  // 2. Enviar a este jugador TODAS las posiciones existentes.
  socket.emit("existingPlayers", players);

  // 3. Avisar a todos los *demás* (broadcast) que hay un nuevo jugador.
  socket.broadcast.emit("updatePlayer", { id: socket.id, position: initialPosition });

  // Cuando el jugador se mueve
  socket.on("playerMove", (pos) => {
    players[socket.id] = pos;
    socket.broadcast.emit("updatePlayer", { id: socket.id, position: pos });
  });

  socket.on("disconnect", () => {
    console.log("Jugador desconectado:", socket.id);
    delete players[socket.id];
    socket.broadcast.emit("removePlayer", socket.id);
  });
});


httpServer.listen(3000, () => console.log("Servidor Socket.IO corriendo en puerto 3000"));