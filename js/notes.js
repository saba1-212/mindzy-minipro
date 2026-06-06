document.addEventListener("DOMContentLoaded", () => {
  const notesTab = document.getElementById("notes-tab");
  notesTab.innerHTML = `
    <h2>📝 Quick Notes</h2>
    <textarea id="noteInput" placeholder="Write your quick notes..." rows="10" style="width: 100%; margin-bottom: 10px;"></textarea>
    <br>
    <button onclick="saveNote()">💾 Save Note</button>
<button onclick="startVoiceNote()">🎤 Voice Note</button>
<button onclick="stopVoiceNote()">⏹ Stop</button>
<button onclick="downloadNote()">📥 Download Note</button>
    <hr>

    <h3>📎 Upload PDF or Text File</h3>
    <input type="file" id="noteFileInput" accept=".txt,.pdf" />
    <ul id="uploadedFiles"></ul>

    <hr>

    <h3>📚 Saved Notes</h3>
    <div id="notesContainer" style="margin-top: 10px;"></div>
  `;

  displayNotes();
  displayUploadedFiles();

  document.getElementById("noteFileInput").addEventListener("change", handleFileUpload);
});

// 💾 Save a note to localStorage
function saveNote() {
  const noteInput = document.getElementById("noteInput");
  const text = noteInput.value.trim();
  if (!text) return alert("✏️ Please write something first.");
  
  const notes = JSON.parse(localStorage.getItem("quickNotes")) || [];
  notes.push(text);
  localStorage.setItem("quickNotes", JSON.stringify(notes));
  noteInput.value = "";
  displayNotes();
}

// 📥 Download the current note as .txt
function downloadNote() {
  const text = document.getElementById("noteInput").value.trim();
  if (!text) return alert("Note is empty!");
  
  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "Mindzy_QuickNote.txt";
  a.click();
  URL.revokeObjectURL(a.href);
}

// 🧾 Show all saved notes
function displayNotes() {
  const container = document.getElementById("notesContainer");
  const notes = JSON.parse(localStorage.getItem("quickNotes")) || [];

  if (notes.length === 0) {
    container.innerHTML = "<p>No saved notes yet.</p>";
    return;
  }

  container.innerHTML = notes
    .map((note, index) => `<div class="note-box">🗒 ${note}</div>`)
    .join("");
}

// 📤 Handle file uploads (PDF or TXT)
let uploadedNotes = JSON.parse(localStorage.getItem("uploadedNotes")) || [];

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    uploadedNotes.push({
      name: file.name,
      type: file.type,
      data: e.target.result
    });
    localStorage.setItem("uploadedNotes", JSON.stringify(uploadedNotes));
    displayUploadedFiles();
  };

  if (file.type === "application/pdf" || file.type === "text/plain") {
    reader.readAsDataURL(file);
  } else {
    alert("❌ Only PDF or TXT files are supported.");
  }
}

// 📄 Show list of uploaded files with download buttons
function displayUploadedFiles() {
  const list = document.getElementById("uploadedFiles");
  list.innerHTML = "";

  if (uploadedNotes.length === 0) {
    list.innerHTML = "<li>No uploaded files yet.</li>";
    return;
  }

  uploadedNotes.forEach((file, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${file.name}
      <button onclick="downloadUploadedFile(${index})">📥 Download</button>
    `;
    list.appendChild(li);
  });
}

// 📥 Download uploaded file
function downloadUploadedFile(index) {
  const file = uploadedNotes[index];
  const a = document.createElement("a");
  a.href = file.data;
  a.download = file.name;
  a.click();
}
function switchTab(tabId) {
  const tabs = document.querySelectorAll(".tab-content");
  tabs.forEach(tab => tab.style.display = "none"); // hide all

  const activeTab = document.getElementById(`${tabId}-tab`);
  if (activeTab) activeTab.style.display = "block"; // show target
}


let recognition;
let isListening = false;

function startVoiceNote() {

  if (!('webkitSpeechRecognition' in window)) {

    alert(
      "Speech Recognition is not supported in this browser. Use Chrome."
    );

    return;
  }

  recognition =
    new webkitSpeechRecognition();

  recognition.continuous = true;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

  recognition.lang = "en-IN";

  recognition.onstart = () => {

    isListening = true;

    console.log("🎤 Listening...");
  };

  recognition.onresult = (event) => {

    let transcript = "";

    for (
      let i = event.resultIndex;
      i < event.results.length;
      i++
    ) {

      transcript +=
        event.results[i][0].transcript;
    }

    document.getElementById(
      "noteInput"
    ).value += " " + transcript;
  };

  recognition.onerror = (event) => {

    console.error(event.error);
  };

  recognition.start();
}

function stopVoiceNote() {

  if (
    recognition &&
    isListening
  ) {

    recognition.stop();

    isListening = false;

    console.log(
      "🎤 Voice recording stopped"
    );
  }
}
recognition.onend = () => {

  if (listening) {

    recognition.start();

  }

};