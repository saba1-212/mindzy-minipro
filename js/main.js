function switchTab(id) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.getElementById(id + "-tab").classList.add("active");

  if (id === "analytics" && typeof updateAnalyticsCharts === "function") {
    updateAnalyticsCharts(window.currentTimetable || {});
  }
}

window.addEventListener('DOMContentLoaded', () => {
  if (typeof initPlanner === 'function') initPlanner();
  if (typeof initResources === 'function') initResources();
  if (typeof initTimer === 'function') initTimer();
  if (typeof initAnalytics === 'function') initAnalytics()
  if (typeof initAIEngine === "function") initAIEngine();
});

