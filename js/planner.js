function initPlanner() {
  const plannerTab = document.getElementById("planner-tab");

  plannerTab.innerHTML = `
    <div class="planner-container">
      <h2>📅 Smart Study Planner</h2>

      <input type="number" id="totalDays" placeholder="Total Study Days">

      <input type="number" id="dailyHours" placeholder="Available Study Hours Per Day">

      <div id="subjectFields"></div>

      <button onclick="addSubjectField()">➕ Add Subject</button>
      <button onclick="generateSchedule()">🚀 Generate Smart Timetable</button>

      <div id="timetable"></div>

      <button onclick="downloadTimetable()">📥 Download Timetable</button>
    </div>
  `;
}

function addSubjectField() {
  const div = document.createElement("div");

  div.classList.add("subject-card");

  div.innerHTML = `
    <input placeholder="Subject Name">

    <input type="number" placeholder="Number of Chapters">

    <input type="number" placeholder="Time Per Chapter (minutes)">

    <select>
      <option value="1">Easy</option>
      <option value="2">Medium</option>
      <option value="3">Hard</option>
    </select>

    <select>
      <option value="1">Low Priority</option>
      <option value="2">Medium Priority</option>
      <option value="3">High Priority</option>
    </select>

    <label style="display:block; margin-top:8px;">
      <input type="checkbox">
      Weak Subject
    </label>

    <hr>
  `;

  document.getElementById("subjectFields").appendChild(div);
}

let currentTimetable = {};

function generateSchedule() {
  const totalDays = parseInt(document.getElementById("totalDays").value);
  const dailyHours = parseInt(document.getElementById("dailyHours").value);

  if (!totalDays || !dailyHours) {
    alert("Please fill all planner details.");
    return;
  }

  const maxDailyMinutes = dailyHours * 60;

  const chapters = [];

  document.querySelectorAll("#subjectFields .subject-card").forEach(card => {

    const inputs = card.querySelectorAll("input");
    const selects = card.querySelectorAll("select");

    const subject = inputs[0].value;
    const chapterCount = parseInt(inputs[1].value);
    const timePerChapter = parseInt(inputs[2].value);

    const difficulty = parseInt(selects[0].value);
    const priority = parseInt(selects[1].value);

    const weakSubject = inputs[3].checked;

    const weight =
      difficulty +
      priority +
      (weakSubject ? 2 : 0);

    for (let i = 1; i <= chapterCount; i++) {

      chapters.push({
        subject,
        chapter: `Chapter ${i}`,
        time: timePerChapter,
        weight,
        revision: false
      });

      // Add revision session for hard/weak subjects
      if (weight >= 6 && i % 2 === 0) {
        chapters.push({
          subject,
          chapter: `Revision ${i / 2}`,
          time: Math.floor(timePerChapter / 2),
          weight,
          revision: true
        });
      }
    }
  });

  // Sort by weight (highest priority first)
  chapters.sort((a, b) => b.weight - a.weight);

  currentTimetable = {};

  for (let d = 1; d <= totalDays; d++) {
    currentTimetable[`Day_${d}`] = {
      tasks: [],
      usedMinutes: 0
    };
  }

  // Smart Distribution
  chapters.forEach(task => {

    let assigned = false;

    for (let d = 1; d <= totalDays; d++) {

      const day = currentTimetable[`Day_${d}`];

      if (day.usedMinutes + task.time <= maxDailyMinutes) {

        day.tasks.push(task);

        day.usedMinutes += task.time;

        assigned = true;

        break;
      }
    }

    // If all days are full, place in least loaded day
    if (!assigned) {

      let leastLoadedDay = Object.keys(currentTimetable)[0];

      Object.keys(currentTimetable).forEach(dayKey => {
        if (
          currentTimetable[dayKey].usedMinutes <
          currentTimetable[leastLoadedDay].usedMinutes
        ) {
          leastLoadedDay = dayKey;
        }
      });

      currentTimetable[leastLoadedDay].tasks.push(task);

      currentTimetable[leastLoadedDay].usedMinutes += task.time;
    }
  });

  localStorage.setItem(
    "mindzyTimetable",
    JSON.stringify(currentTimetable)
  );

  renderTimetable();
  updateAnalyticsCharts(currentTimetable);
}


function renderTimetable() {

  const container = document.getElementById("timetable");

  container.innerHTML = "";

  Object.entries(currentTimetable).forEach(([day, data]) => {

    const ulId = `${day}_list`;

    const totalPomodoros = data.tasks.reduce((acc, task) => {
      return acc + Math.ceil(task.time / 25);
    }, 0);

    container.innerHTML += `
      <div class="day-card">

        <h3>📌 ${day.replace("_", " ")}</h3>

        <p><strong>Total Study Time:</strong> ${data.usedMinutes} mins</p>

        <p><strong>Pomodoro Sessions:</strong> ${totalPomodoros}</p>

        <ul id="${ulId}">
          ${data.tasks.map(task => `
            <li>
              <input type="checkbox"
                     onchange='updateProgress("${day}")'>

              ${task.revision ? "🔁" : "📖"}

              <strong>${task.subject}</strong>
              - ${task.chapter}
              (${task.time} mins)
            </li>
          `).join("")}
        </ul>

        <div class="progress-bar-container">
          <div id="${day}-bar"
               class="progress-bar-fill">
            0%
          </div>
        </div>

      </div>
    `;
  });
}

function updateProgress(day) {

  const boxes = document.querySelectorAll(
    `#${day}_list input[type='checkbox']`
  );

  const total = boxes.length;

  const done = [...boxes].filter(cb => cb.checked).length;

  const percent = Math.round((done / total) * 100);

  const bar = document.getElementById(`${day}-bar`);

  bar.style.width = percent + "%";

  bar.innerText = percent + "%";

  saveProgress();
}

function saveProgress() {
  localStorage.setItem(
    "plannerProgress",
    JSON.stringify(currentTimetable)
  );
}

function downloadTimetable() {

  if (Object.keys(currentTimetable).length === 0) {
    alert("Generate timetable first.");
    return;
  }

  const rows = [
    [
      "Day",
      "Subject",
      "Task",
      "Time",
      "Revision"
    ]
  ];

  Object.entries(currentTimetable).forEach(([day, data]) => {

    data.tasks.forEach(task => {

      rows.push([
        day.replace("_", " "),
        task.subject,
        task.chapter,
        task.time,
        task.revision ? "Yes" : "No"
      ]);
    });
  });

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Smart Timetable"
  );

  XLSX.writeFile(workbook, "Mindzy_Smart_Timetable.xlsx");
}

document.addEventListener("DOMContentLoaded", () => {
  initPlanner();
});