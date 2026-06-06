document.addEventListener('DOMContentLoaded', () => {
  const todoTab = document.getElementById("todo-tab");

  todoTab.innerHTML = `
    <h2>📝 To-Do List</h2>
    <input type="text" id="taskInput" placeholder="Enter your task" />
    <button onclick="addTask()">Add Task</button>
    <ul id="taskList"></ul>
  `;

  loadTasks();
});

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const task = { text: taskText, completed: false };
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
  taskInput.value = "";
  renderTasks();
}

function toggleTask(index) {
  const tasks = getTasks();
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  renderTasks();
}

function deleteTask(index) {
  const tasks = getTasks();
  tasks.splice(index, 1);
  saveTasks(tasks);
  renderTasks();
}

function getTasks() {
  return JSON.parse(localStorage.getItem("todoTasks") || "[]");
}

function saveTasks(tasks) {
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  const tasks = getTasks();

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} onclick="toggleTask(${index})" />
      <span style="text-decoration:${task.completed ? 'line-through' : 'none'}">${task.text}</span>
      <button onclick="deleteTask(${index})">❌</button>
    `;
    taskList.appendChild(li);
  });
}

function loadTasks() {
  renderTasks();
}
