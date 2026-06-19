function initAnalytics() {

  const container =
    document.getElementById("analytics-tab");

  container.innerHTML = `

    <h2>📊 Analytics Dashboard</h2>

    <div class="analytics-cards">

      <div class="analytics-box">
        <h3 id="totalTasks">0</h3>
        <p>Total Tasks</p>
      </div>

      <div class="analytics-box">
        <h3 id="completedTasks">0</h3>
        <p>Completed Tasks</p>
      </div>

      <div class="analytics-box">
        <h3 id="studyHours">0 hrs</h3>
        <p>Total Study Time</p>
      </div>

      <div class="analytics-box">
        <h3 id="productivityScore">0%</h3>
        <p>Productivity</p>
      </div>

    </div>
<div class="chart-container">
    <canvas id="pieChart"></canvas>
</div>

<div class="chart-container">
    <canvas id="barChart"></canvas>
</div>

  `;
}

function updateAnalyticsCharts(timetable) {

  let completed = 0;

  let total = 0;

  let totalMinutes = 0;

  let subjectStats = {};

  Object.values(timetable).forEach(day => {

    day.tasks.forEach(task => {

      total++;

      totalMinutes += task.time;

      // Random simulation for completion
      // (until real completion tracking added)

      if (Math.random() > 0.5) {
        completed++;
      }

      if (!subjectStats[task.subject]) {
        subjectStats[task.subject] = 0;
      }

      subjectStats[task.subject] += task.time;
    });
  });

  const pending = total - completed;

  const studyHours =
    (totalMinutes / 60).toFixed(1);

  const productivity =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  // Update cards

  document.getElementById("totalTasks")
    .innerText = total;

  document.getElementById("completedTasks")
    .innerText = completed;

  document.getElementById("studyHours")
    .innerText = `${studyHours} hrs`;

  document.getElementById("productivityScore")
    .innerText = `${productivity}%`;

  const pieCtx =
    document.getElementById("pieChart")
      .getContext("2d");

  const barCtx =
    document.getElementById("barChart")
      .getContext("2d");

  // Destroy old charts

  if (window.pieChartInstance)
    window.pieChartInstance.destroy();

  if (window.barChartInstance)
    window.barChartInstance.destroy();

  // PIE CHART

 window.pieChartInstance = new Chart(pieCtx, {

    type: "pie",

    data: {

        labels: [
            "Completed",
            "Pending"
        ],

        datasets: [{

            data: [
                completed,
                pending
            ],

            backgroundColor: [
                "#4CAF50",
                "#F44336"
            ]

        }]
    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                position: "bottom"

            }

        }

    }

});

  // BAR CHART

  window.barChartInstance = new Chart(
    barCtx,
    {
      type: "bar",

      data: {

        labels:
          Object.keys(subjectStats),

        datasets: [{

          label: "Study Time (mins)",

          data:
            Object.values(subjectStats),

          backgroundColor: "#3e7aa8"
        }]
      },

      options: {

        responsive: true,

        scales: {

          y: {
            beginAtZero: true
          }
        }
      }
    }
  );
}

/* =========================
   LOAD ANALYTICS
========================= */

document.addEventListener(
  "DOMContentLoaded",
  initAnalytics
);