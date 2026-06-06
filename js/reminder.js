let reminderEnabled = false;
let reminderIntervals = [];

function toggleReminders(isOn) {
  reminderEnabled = isOn;

  // Clear existing reminders
  reminderIntervals.forEach(clearInterval);
  reminderIntervals = [];

  if (reminderEnabled) {
    // TEST MODE: Short intervals for testing
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    reminderIntervals.push(setInterval(() => {
      sendReminder("💧 Test Hydration", "Testing: Time to drink water!");
    }, 5000)); // every 5s

    reminderIntervals.push(setInterval(() => {
      sendReminder("🧘 Test Stretch", "Testing: Take a stretch break!");
    }, 10000)); // every 10s

    reminderIntervals.push(setInterval(() => {
      sendReminder("📚 Test Planner", "Testing: Have you updated your planner?");
    }, 15000)); // every 15s
  }
}

function sendReminder(title, message) {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: message,
      icon: "logo.png" // optional icon
    });
  }
}

// Optional: Call this once page loads to request permission
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}
