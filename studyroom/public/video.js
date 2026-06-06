const socket = io();
let localStream;
let remoteStream;
let peerConnection;
const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

function joinVideoRoom() {
  const roomId = document.getElementById("roomId").value.trim();
  if (!roomId) return alert("Enter a room ID");

  socket.emit("join-video-room", roomId);
}

socket.on("video-joined", async (roomId) => {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;

  peerConnection = new RTCPeerConnection(config);
  peerConnection.onicecandidate = e => {
    if (e.candidate) {
      socket.emit("ice-candidate", e.candidate);
    }
  };
  peerConnection.ontrack = e => {
    remoteVideo.srcObject = e.streams[0];
  };
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  if (roomId === "initiator") {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer", offer);
  }
});

socket.on("offer", async offer => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  socket.emit("answer", answer);
});

socket.on("answer", async answer => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on("ice-candidate", async candidate => {
  try {
    await peerConnection.addIceCandidate(candidate);
  } catch (err) {
    console.error("Error adding received ice candidate", err);
  }
});
