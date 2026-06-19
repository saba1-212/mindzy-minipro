import { db }
from "./firebase-config.js";

import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  onSnapshot,
  updateDoc
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const startBtn = document.getElementById("startBtn");
const createCallBtn = document.getElementById("createCallBtn");
const joinCallBtn = document.getElementById("joinCallBtn");

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

let peerConnection;

const servers = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302"
      ]
    }
  ]
};

let localStream = null;
let remoteStream = null;

startBtn.onclick = async () => {

  try {

    localStream =
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

    remoteStream = new MediaStream();

    localVideo.srcObject = localStream;
    remoteVideo.srcObject = remoteStream;

    alert("Camera Started Successfully ✅");

  } catch (err) {

    console.error(err);

    alert("Camera permission denied");

  }

};

createCallBtn.onclick =
async () => {

  if (!localStream) {
    alert("Start Camera First");
    return;
  }

  peerConnection =
    new RTCPeerConnection(
      servers
    );

  localStream
    .getTracks()
    .forEach(track => {
      peerConnection.addTrack(
        track,
        localStream
      );
    });

  peerConnection.ontrack =
    event => {

      event.streams[0]
        .getTracks()
        .forEach(track => {

          remoteStream.addTrack(
            track
          );

        });

    };

  const callDoc =
    doc(
      collection(
        db,
        "calls"
      )
    );

  const offerCandidates =
    collection(
      callDoc,
      "offerCandidates"
    );

  const answerCandidates =
    collection(
      callDoc,
      "answerCandidates"
    );

  document.getElementById(
  "callIdDisplay"
).textContent =
  callDoc.id;

  peerConnection.onicecandidate =
    event => {

      if (event.candidate) {

        addDoc(
          offerCandidates,
          event.candidate.toJSON()
        );

      }

    };

  const offer =
    await peerConnection
      .createOffer();

  await peerConnection
    .setLocalDescription(
      offer
    );

  await setDoc(
    callDoc,
    {
      offer: {
        type: offer.type,
        sdp: offer.sdp
      }
    }
  );

  onSnapshot(
    callDoc,
    snapshot => {

      const data =
        snapshot.data();

      if (
        data?.answer &&
        !peerConnection.currentRemoteDescription
      ) {

        peerConnection
          .setRemoteDescription(
            new RTCSessionDescription(
              data.answer
            )
          );

      }

    }
  );

  onSnapshot(
    answerCandidates,
    snapshot => {

      snapshot.docChanges()
        .forEach(change => {

          if (
            change.type ===
            "added"
          ) {

            peerConnection
              .addIceCandidate(
                new RTCIceCandidate(
                  change.doc.data()
                )
              );

          }

        });

    }
  );

};

joinCallBtn.onclick =
async () => {

  if (!localStream) {
    alert("Start Camera First");
    return;
  }

const callId =
document.getElementById(
  "callInput"
)
.value
.replace("Call ID:", "")
.trim();

console.log("Joining Call:", callId);

  const callDoc =
    doc(
      db,
      "calls",
      callId
    );

  const answerCandidates =
    collection(
      callDoc,
      "answerCandidates"
    );

  const offerCandidates =
    collection(
      callDoc,
      "offerCandidates"
    );

  const callSnapshot =
  await getDoc(callDoc);

if (!callSnapshot.exists()) {

  alert("Call ID not found ❌");

  return;

}

const callData =
  callSnapshot.data();


console.log(
  "CALL DATA:",
  callData
);




  peerConnection =
    new RTCPeerConnection(
      servers
    );

  localStream
    .getTracks()
    .forEach(track => {

      peerConnection.addTrack(
        track,
        localStream
      );

    });

  peerConnection.ontrack =
    event => {

      event.streams[0]
        .getTracks()
        .forEach(track => {

          remoteStream.addTrack(
            track
          );

        });

    };

  peerConnection.onicecandidate =
    event => {

      if (event.candidate) {

        addDoc(
          answerCandidates,
          event.candidate.toJSON()
        );

      }

    };

  const offerDescription =
    callData.offer;

  await peerConnection
    .setRemoteDescription(
      new RTCSessionDescription(
        offerDescription
      )
    );

  const answer =
    await peerConnection
      .createAnswer();

  await peerConnection
    .setLocalDescription(
      answer
    );

  await updateDoc(
    callDoc,
    {
      answer: {
        type: answer.type,
        sdp: answer.sdp
      }
    }
  );

  onSnapshot(
    offerCandidates,
    snapshot => {

      snapshot.docChanges()
        .forEach(change => {

          if (
            change.type ===
            "added"
          ) {

            peerConnection
              .addIceCandidate(
                new RTCIceCandidate(
                  change.doc.data()
                )
              );

          }

        });

    }
  );

  alert(
    "Joined Call Successfully ✅"
  );

};

