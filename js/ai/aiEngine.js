function initAIEngine() {

  const tab =
    document.getElementById("ai-tab");

  tab.innerHTML = `

    <div class="ai-container">

      <h1>🧠 Mindzy AI Study Engine</h1>

      <p class="ai-subtitle">
        Upload notes, PDFs, or study material.
      </p>

      <div class="upload-section">

        <input
          type="file"
          id="studyFile"
          accept=".txt,.pdf,.doc,.docx"
        />

        <button onclick="analyzeFile()">
          Analyze Content
        </button>

      </div>

      <hr>

<h3>🎥 Learn From YouTube</h3>

<input
  type="text"
  id="youtubeUrl"
  placeholder="Paste YouTube URL here"
/>

<button onclick="analyzeYouTube()">
  Analyze YouTube Video
</button>


      <textarea
  id="extractedText"
></textarea>

      <div class="ai-tools">

        <button onclick="generateSummary()">
          📄 Summary
        </button>

        <button onclick="generateQuiz()">
          ❓ Quiz
        </button>

        <button onclick="generateFlashcards()">
          🧠 Flashcards
        </button>

        <button onclick="generateFlowchart()">
          🔀 Flowchart
        </button>

      </div>

      <div id="aiOutput"></div>

    </div>

  `;
}

document.addEventListener(
  "DOMContentLoaded",
  initAIEngine
);