const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

const userIds = new Set();

// io.on("connection", (socket) => {
//   console.log(userIds.size);
//   console.log("a user connected: " + socket.id);
//   if (!userIds.has(socket.id)) {
//     userIds.add(socket.id);
//     socket.emit("chat message", socket.id + " connected");
//   }
//   socket.on("chat message", (msg) => {
//     socket.broadcast.emit("chat message", msg);
//   });
// });

io.on("connection", (socket) => {
  socket.on("join", ({ username }) => {
    socket.username = username;

    io.emit("user-joined", `${username} joined the chat`);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      io.emit("user-left", `${socket.username} left the chat`);
    }
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
