// === STEP 1: BACKEND SERVER ===
// File: server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);



const PORT = process.env.PORT || 3000;

let videoRooms = {}; // To track video initiators

// Serve static files from 'public' directory
app.use(express.static('public'));


// Single unified connection handler
io.on('connection', (socket) => {
  console.log('🔌 A user connected:', socket.id);

  // Chat: Join room
  socket.on('join-room', (roomId, username) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', username);
    console.log(`${username} joined room ${roomId}`);
  });

  // Chat: Send message
  socket.on('chat-message', (roomId, msg) => {
    socket.to(roomId).emit('chat-message', msg);
  });

  // Chat: Status update
  socket.on('status-update', (roomId, status) => {
    socket.to(roomId).emit('status-update', status);
  });

  // Video: Join video room
  socket.on("join-video-room", (roomId) => {
    const isInitiator = !videoRooms[roomId];
    socket.join(roomId);
    videoRooms[roomId] = true;
    socket.emit("video-joined", isInitiator ? "initiator" : "participant");
  });

  // Video: WebRTC signaling
  socket.on("offer", (offer) => {
    socket.broadcast.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    socket.broadcast.emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate) => {
    socket.broadcast.emit("ice-candidate", candidate);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('❌ A user disconnected:', socket.id);
  });
});



// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
