const taskInput = document.querySelector("#taskInput");
const subjectInput = document.querySelector("#subjectInput");
const addTaskButton = document.querySelector("#addTaskButton");
const taskList = document.querySelector("#taskList");
const emptyMessage = document.querySelector("#emptyMessage");
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");
const filterButtons = document.querySelectorAll(".filter-button");

let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

function addTask() {
  const title = taskInput.value.trim();

  if (title === "") {
    taskInput.focus();
    return;
  }

  const newTask = {
    id: Date.now(),
    title,
    subject: subjectInput.value,
    done: false
  };

  tasks.push(newTask);
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

function toggleTask(taskId) {
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      return { ...task, done: !task.done };
    }

    return task;
  });

  saveTasks();
  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
}

function getFilteredTasks() {
  if (currentFilter === "open") {
    return tasks.filter((task) => !task.done);
  }

  if (currentFilter === "done") {
    return tasks.filter((task) => task.done);
  }

  return tasks;
}

function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.done).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressText.textContent = `${percentage}% concluido`;
  progressBar.style.width = `${percentage}%`;
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();

  taskList.innerHTML = "";
  emptyMessage.style.display = filteredTasks.length === 0 ? "block" : "none";

  filteredTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item ${task.done ? "done" : ""}`;

    item.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""} aria-label="Marcar tarefa">
      <div>
        <p class="task-title">${task.title}</p>
        <p class="task-subject">${task.subject}</p>
      </div>
      <button class="delete-button" type="button" aria-label="Excluir tarefa">Excluir</button>
    `;

    item.querySelector("input").addEventListener("change", () => toggleTask(task.id));
    item.querySelector("button").addEventListener("click", () => deleteTask(task.id));
    taskList.appendChild(item);
  });

  updateProgress();
}

addTaskButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

renderTasks();
