function initResources() {

  const tab = document.getElementById("resources-tab");

  tab.innerHTML = `

    <h2>🔍 Resource Finder</h2>

    <input type="text"
           id="resourceQuery"
           placeholder="Enter Topic">

    <button onclick="searchResources()">
      Search
    </button>

    <table id="resourceTable"
           border="1"
           style="margin-top:10px; width:100%">

      <thead>
        <tr>
          <th>Title</th>
          <th>Channel</th>
          <th>Views</th>
        </tr>
      </thead>

      <tbody></tbody>

    </table>

    <button onclick="downloadCSV()">
      Download CSV
    </button>

    <hr style="margin:30px 0;">

    <h2>📘 University Notes Finder</h2>

    <select id="universitySelect">

      <option value="OU">OU</option>

      <option value="JNTU">JNTU</option>

    </select>

    <input type="text"
           id="subjectSearch"
           placeholder="Enter Subject">

    <button onclick="findNotes()">
      Find Notes
    </button>

    <div id="notesResults"
         style="margin-top:20px;">
    </div>

  `;
}

/* =========================
   YOUTUBE RESOURCE FINDER
========================= */

async function searchResources() {

  const query =
    document.getElementById("resourceQuery").value;

  const apiKey =
    "AIzaSyCrCpctMSNw0gVpV443wYUR5P7RR-wSQkA";

  const url =
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&q=${encodeURIComponent(query)}&key=${apiKey}`;

  const res = await fetch(url);

  const data = await res.json();

  const videoData = [];

  const videoIds =
    data.items.map(item => item.id.videoId).join(',');

  const statsUrl =
    `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${apiKey}`;

  const statsRes = await fetch(statsUrl);

  const statsData = await statsRes.json();

  const tbody =
    document.querySelector("#resourceTable tbody");

  tbody.innerHTML = "";

  statsData.items.forEach(item => {

    const title = item.snippet.title;

    const channel = item.snippet.channelTitle;

    const views = item.statistics.viewCount;

    const url =
      `https://www.youtube.com/watch?v=${item.id}`;

    videoData.push([
      title,
      channel,
      views,
      url
    ]);

    const row = `
      <tr>

        <td>
          <a href="${url}"
             target="_blank">

             ${title}

          </a>
        </td>

        <td>${channel}</td>

        <td>${views}</td>

      </tr>
    `;

    tbody.innerHTML += row;
  });

  window._lastCSVData = videoData;
}

function downloadCSV() {

  const rows = window._lastCSVData || [];

  if (!rows.length)
    return alert("Search first!");

  let csvContent =
    "Title,Channel,Views,URL\n" +

    rows.map(r =>
      r.map(field => `"${field}"`).join(',')
    ).join('\n');

  const blob = new Blob(
    [csvContent],
    { type: "text/csv" }
  );

  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);

  a.download = "youtube_resources.csv";

  a.click();
}

/* =========================
   UNIVERSITY NOTES DATABASE
========================= */

const notesDB = {

  dbms: {

    OU: [
      {
        title: "DBMS Unit 1 Notes",
        link: "notes/ou/dbms_unit1.pdf"
      },

      {
        title: "DBMS Important Questions",
        link: "notes/ou/dbms_questions.pdf"
      }
    ],

    JNTU: [
      {
        title: "DBMS JNTU Notes",
        link: "notes/jntu/dbms_notes.pdf"
      }
    ]
  },

  os: {

    OU: [
      {
        title: "Operating System Notes",
        link: "notes/ou/os_notes.pdf"
      }
    ],

    JNTU: [
      {
        title: "OS Important Questions",
        link: "notes/jntu/os_questions.pdf"
      }
    ]
  },

  java: {

    OU: [
      {
        title: "Java Programming Notes",
        link: "notes/ou/java_notes.pdf"
      }
    ],

    JNTU: [
      {
        title: "Java Complete Notes",
        link: "notes/jntu/java_notes.pdf"
      }
    ]
  }

};



/* =========================
   FIND NOTES FUNCTION
========================= */

function findNotes() {

  const university =
    document.getElementById("universitySelect").value;

  const subject =
    document.getElementById("subjectSearch")
      .value
      .toLowerCase()
      .trim();

  const resultsDiv =
    document.getElementById("notesResults");

  resultsDiv.innerHTML = "";



  /* =========================
     SMART SUBJECT MATCHING
  ========================= */

  const matchedSubject =
    Object.keys(notesDB).find(key =>

      key.includes(subject)

    );



  /* =========================
     IF NOTES FOUND
  ========================= */

  if (
    matchedSubject &&
    notesDB[matchedSubject][university]
  ) {

    notesDB[matchedSubject][university]
      .forEach(note => {

        resultsDiv.innerHTML += `

          <div class="note-box">

            <h3>${note.title}</h3>

            <a href="${note.link}"
               target="_blank"
               class="open-btn">

               📄 Open Notes

            </a>

          </div>

        `;
      });

  }



  /* =========================
     IF NOTES NOT FOUND
  ========================= */

  else {

    resultsDiv.innerHTML = `

      <div class="note-box">

        <h3>
          ❌ No notes found
        </h3>

        <p>
          Try another subject name
        </p>

      </div>

    `;
  }
}



/* =========================
   PAGE LOAD
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "University Notes Finder Ready ✅"
    );

  }
);