import { db }
from "./firebase-config.js";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  serverTimestamp,
  doc,
  setDoc
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

let roomId = "";
let username = "";

/* =========================
   JOIN ROOM
========================= */

window.joinRoom = async function () {

  roomId =
    document.getElementById("roomId").value.trim();

  username =
    document.getElementById("username").value.trim();

  if (!roomId || !username) {
    alert("Fill all fields");
    return;
  }

  document.getElementById(
    "currentRoom"
  ).innerHTML =
    `Joined Room: ${roomId}`;

  await setDoc(

    doc(
      db,
      "rooms",
      roomId,
      "members",
      username
    ),

    {
      name: username,
      online: true
    }

  );

  listenMembers();
  listenMessages();

};

/* =========================
   SEND MESSAGE
========================= */

window.sendMessage =
  async function () {

    const text =
      document.getElementById(
        "messageInput"
      ).value;

    if (!text) return;

    await addDoc(

      collection(
        db,
        "rooms",
        roomId,
        "messages"
      ),

      {
        user: username,
        message: text,
        createdAt:
          serverTimestamp()
      }

    );

    document.getElementById(
      "messageInput"
    ).value = "";

  };

/* =========================
   LISTEN MESSAGES
========================= */

function listenMessages() {

  const q = query(

    collection(
      db,
      "rooms",
      roomId,
      "messages"
    )

  );

  onSnapshot(q, (snapshot) => {

    const chatBox =
      document.getElementById(
        "chatBox"
      );

    chatBox.innerHTML = "";

   snapshot.forEach(doc => {

  const data = doc.data();

  const messageClass =
    data.user === username
      ? "sent"
      : "received";

  chatBox.innerHTML +=

    `
    <div class="message ${messageClass}">
      <b>${data.user}</b><br>
      ${data.message}
    </div>
    `;

});

  });

}

/* =========================
   LISTEN MEMBERS
========================= */

function listenMembers() {

  onSnapshot(

    collection(
      db,
      "rooms",
      roomId,
      "members"
    ),

    (snapshot) => {

      const box =
        document.getElementById(
          "membersBox"
        );

      if (!box) return;

      box.innerHTML = "";

      snapshot.forEach(doc => {

        const user =
          doc.data();

        box.innerHTML +=

          `
          <div class="member">
            🟢 ${user.name}
          </div>
          `;

      });

    }

  );

}