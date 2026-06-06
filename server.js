const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { YoutubeTranscript } =
require("youtube-transcript");


const path = require('path');
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve all static files from the public folder
app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});
app.use(express.json());
app.use(cors());

io.on('connection', socket => {
  socket.on('join-room', ({ user, room }) => {
    socket.join(room);
    socket.to(room).emit('receive-message', { user: "System", message: `${user} joined the room.` });
  });

  socket.on('send-message', ({ user, room, message }) => {
    io.to(room).emit('receive-message', { user, message });
  });

  socket.on('status-update', ({ user, room, status }) => {
    io.to(room).emit('status-update', { user, status });
  });
});

/* ==========================
   YOUTUBE TRANSCRIPT ROUTE
========================== */

app.post(
  "/youtube-transcript",
  async (req, res) => {

    try {

      const { videoId } =
        req.body;

      const transcript =
        await YoutubeTranscript
          .fetchTranscript(
            videoId
          );

      const fullText =
        transcript
          .map(
            item => item.text
          )
          .join(" ");

      res.json({
        success: true,
        transcript: fullText
      });

    }

    catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Transcript not available"
      });

    }

  }
);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

