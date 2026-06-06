const socket = io();
let room = "";
let name = "";

function createRoom() {
  room = document.getElementById("roomId").value.trim();
  name = document.getElementById("username").value.trim();

  if (!room || !name) return alert("Enter Room ID and Name");

  socket.emit("createRoom", { room, name });
  showChatUI("created");
}

function joinRoom() {
  room = document.getElementById("roomId").value.trim();
  name = document.getElementById("username").value.trim();

  if (!room || !name) return alert("Enter Room ID and Name");

  socket.emit("joinRoom", { room, name });
  showChatUI("joined");
}

function showChatUI(status) {
  document.getElementById("roomInfo").style.display = "block";
  document.getElementById("roomStatus").innerText = `You have ${status} room "${room}"`;
}

function sendMessage() {
  const msg = document.getElementById("chatInput").value;
  if (msg.trim() !== "") {
    socket.emit("message", { room, name, text: msg });
    document.getElementById("chatInput").value = "";
  }
}

socket.on("message", (data) => {
  const messagesDiv = document.getElementById("messages");
  const msgDiv = document.createElement("div");
  msgDiv.innerText = `${data.name}: ${data.text}`;
  messagesDiv.appendChild(msgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
