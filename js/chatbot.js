document.addEventListener("DOMContentLoaded", () => {
  const chatbotTab = document.getElementById("chatbot-tab");

  chatbotTab.innerHTML = `
    <div id="chatbot">
      <div class="chat-header">Mindzy ChatBot</div>
      <div class="chat-messages" id="chat-messages"></div>
      <input type="text" id="chat-input" placeholder="Type your message..." />
    </div>
  `;

  const chatMessages = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");

  const responses = {
    hi: "Hey there! 😊 I’m here to help you with your study goals!",
    hello: "Hello! 👋 How are you feeling today?",
    "how are you": "I’m great! More importantly — how are *you* feeling today?",
    "how to use this app": "📘 You can plan your studies in 'Study Planner', explore resources in 'Resource Finder', track focus with 'Pomodoro Timer', and see your progress in 'Analytics Dashboard'.",
    "how to plan": "To plan your studies, go to the 📅 Study Planner tab. Add your subjects, chapters, and how much time you'll take per chapter.",
    plan: "Planning helps you manage your time better! Prioritize tough chapters first, and break big topics into small ones.",
    "i am very tensed": "😟 It’s okay to feel that way sometimes. Take a deep breath. You're doing your best, and I’m proud of you.",
    "i am stressed": "Don’t worry! You're not alone. You’ve got this 💪. How about a 25-minute focused study session?",
    "i am scared": "You’re stronger than you think 💡. Start with small goals and take it step by step. I’m right here!",
    exam: "Exams are just a way to check what you’ve learned. Focus on doing your best, not being perfect! 🎯",
    tired: "Rest is important too 💤. Take a short break, drink some water, and bounce back refreshed.",
    thank: "You're always welcome! 🌟 Let me know if you need help again.",
    bye: "Goodbye! 👋 Keep up the amazing work and come back soon!",
    default: "I'm here for you. You can ask how to plan, how to use the app, or just say how you feel 😊"
  };

  chatInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const userMsg = chatInput.value.trim();
      if (userMsg === "") return;

      appendMessage("You", userMsg);
      chatInput.value = "";

      const lower = userMsg.toLowerCase();
      const match = Object.keys(responses).find((key) => lower.includes(key));
      const reply = responses[match] || responses.default;

      setTimeout(() => appendMessage("Mindzy Bot", reply), 500);
    }
  });

  function appendMessage(sender, text) {
    const msg = document.createElement("div");
    msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Initial friendly greeting
  setTimeout(() => {
    appendMessage("Mindzy Bot", "👋 Hi there! I'm your study buddy. How may I help you today?");
  }, 600);
});
