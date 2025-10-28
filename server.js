// server.js (FINALMENTE CORREGIDO PARA SINCRONIZACIÓN Y ALTURA)
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

const players = {}; 

io.on("connection", (socket) => {
  console.log("Nuevo jugador conectado:", socket.id);

  // 1. GUARDAR posición y rotación inicial, incluyendo altura Y=1.0 (centro del cubo)
  // Nota: Esto debe coincidir con la Y del cubo en el suelo.
  const initialData = { x: 0, y: 1.0, z: 0, ry: 0 }; 
  players[socket.id] = initialData;

  // 2. Enviar a este jugador TODAS las posiciones existentes.
  socket.emit("existingPlayers", players);

  // 3. Avisar a todos los *demás* (broadcast) que hay un nuevo jugador.
  socket.broadcast.emit("updatePlayer", { id: socket.id, ...initialData });

  // Cuando el jugador se mueve
  socket.on("playerMove", (data) => { // data incluye x, y, z, ry, donde y es la altura del salto
    // [MODIFICACIÓN CLAVE] Guardamos data con la altura Y y rotación RY
    players[socket.id] = data; 
    socket.broadcast.emit("updatePlayer", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    console.log("Jugador desconectado:", socket.id);
    delete players[socket.id];
    socket.broadcast.emit("removePlayer", socket.id);
  });
});


httpServer.listen(3000, () => console.log("Servidor Socket.IO corriendo..."));