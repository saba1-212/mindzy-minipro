/* =========================
   MINDZY FOCUS TIMER
========================= */

let interval;
let timeLeft = 0;
let isFocus = true;
let focusStreak = 0;



/* =========================
   INITIALIZE TIMER UI
========================= */

function initTimer() {

  const tab =
    document.getElementById("timer-tab");

  tab.innerHTML = `

    <div class="focus-container">

      <h1>🎯 Mindzy Focus Timer</h1>

      <p class="quote">
        Stay focused. Your future self will thank you.
      </p>

      <div class="timer-settings">

        <label>

          Focus Time (minutes)

          <input
            type="number"
            id="focusTime"
            value="25"
          />

        </label>

        <br>

        <label>

          Break Time (minutes)

          <input
            type="number"
            id="breakTime"
            value="5"
          />

        </label>

      </div>



      <div class="timer-circle">

        <h1 id="timerDisplay">
          00:00
        </h1>

      </div>



      <h3 id="modeDisplay">
        Mode: Focus
      </h3>



      <h3 id="streakDisplay">
        🔥 Focus Streak: 0
      </h3>



      <div class="timer-buttons">

        <button onclick="startTimer()">
          ▶️ Start Focus
        </button>

        <button onclick="pauseTimer()">
          ⏸️ Pause
        </button>

        <button onclick="resetTimer()">
          🔄 Reset
        </button>

      </div>

    </div>

  `;
}



/* =========================
   START TIMER
========================= */

function startTimer() {
  
localStorage.setItem(
  "mindzyFocusMode",
  "on"
);



  enterFullscreen();

  const display =
    document.getElementById("timerDisplay");

  const focusMinutes =
    parseInt(
      document.getElementById("focusTime").value
    );

  const breakMinutes =
    parseInt(
      document.getElementById("breakTime").value
    );



  if (!timeLeft) {

    timeLeft =
      (isFocus ? focusMinutes : breakMinutes) * 60;
  }



  clearInterval(interval);



  interval = setInterval(() => {

    const minutes =
      Math.floor(timeLeft / 60)
        .toString()
        .padStart(2, '0');

    const seconds =
      (timeLeft % 60)
        .toString()
        .padStart(2, '0');




display.innerText =
`${minutes}:${seconds}`;




    timeLeft--;



    /* =========================
       TIMER FINISHED
    ========================= */

    if (timeLeft < 0) {

      clearInterval(interval);



      if (isFocus) {

        focusStreak++;

        document.getElementById(
          "streakDisplay"
        ).innerText =
          `🔥 Focus Streak: ${focusStreak}`;



        alert(
          "🎉 Focus Session Completed!"
        );
      }



      isFocus = !isFocus;



      document.getElementById(
        "modeDisplay"
      ).innerText =
        "Mode: " +
        (isFocus ? "Focus" : "Break");



      timeLeft =
        ((isFocus ? focusMinutes : breakMinutes) * 60);



      startTimer();
    }

  }, 1000);
}



/* =========================
   PAUSE TIMER
========================= */

function pauseTimer() {
  localStorage.setItem( "mindzyFocusMode", "off" );

  clearInterval(interval);
}



/* =========================
   RESET TIMER
========================= */

function resetTimer() {

 
localStorage.setItem(
  "mindzyFocusMode",
  "off"
);



  clearInterval(interval);

  timeLeft = 0;

  isFocus = true;



  document.getElementById(
    "timerDisplay"
  ).innerText = "00:00";



  document.getElementById(
    "modeDisplay"
  ).innerText = "Mode: Focus";



  document.getElementById(
    "streakDisplay"
  ).innerText =
    "🔥 Focus Streak: 0";
}



/* =========================
   FULLSCREEN MODE
========================= */

function enterFullscreen() {

  const elem = document.documentElement;

  if (elem.requestFullscreen) {

    elem.requestFullscreen();
  }
}



/* =========================
   DISTRACTION DETECTION
========================= */

document.addEventListener(
  "visibilitychange",
  () => {

    const timerTab =
      document.getElementById("timer-tab");

    const isTimerActive =
      timerTab.classList.contains("active");

    if (
      document.hidden &&
      isTimerActive &&
      interval
    ) {

      alert(
        "⚠️ Stay Focused! Avoid distractions."
      );
    }

  }
);