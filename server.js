// server.js (Modificado)
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

  // 1. GUARDAR posición y rotación inicial
  const initialData = { x: 0, y: 1, z: 0, ry: 0 }; // <--- Añadimos ry
  players[socket.id] = initialData;

  // 2. Enviar a este jugador TODAS las posiciones existentes.
  socket.emit("existingPlayers", players);

  // 3. Avisar a todos los *demás* (broadcast) que hay un nuevo jugador.
  socket.broadcast.emit("updatePlayer", { id: socket.id, ...initialData });

  // Cuando el jugador se mueve
  socket.on("playerMove", (data) => { // data incluye x, y, z, ry
    players[socket.id] = data;
    socket.broadcast.emit("updatePlayer", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    console.log("Jugador desconectado:", socket.id);
    delete players[socket.id];
    socket.broadcast.emit("removePlayer", socket.id);
  });
});


httpServer.listen(3000, () => console.log("Servidor Socket.IO corriendo en puerto 3000"));