const taskInput = document.querySelector("#new-task");
const addButton = document.querySelector("#add-task-btn");
const taskListContainer = document.querySelector("#task-list");
const filterButtons = document.querySelectorAll(".filter-btn");
const editModal = document.querySelector(".modalEdit");
const editConfirmModal = document.getElementById("editConfirm");
const editCancelModal = document.getElementById("editCancel");
const editInput = document.getElementById("editInput");
const filterBtns = document.querySelectorAll(".filter-btn");
let taskElement;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();
let taskID;

addButton.addEventListener("click", () => {
  if (/\s+/gim.test(taskInput.value) || taskInput.value === "") {
    alert("Please enter a valid task");
  } else {
    tasks.push({
      id: Date.now(),
      task: taskInput.value,
      completed: false,
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskInput.value = "";
    renderTasks();
  }
});

function renderTasks() {
  taskListContainer.innerHTML = "";
  tasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");
    taskItem.id = task.id;
    taskItem.innerHTML = `
    <span class="task-text ${task.completed ? "completed" : ""}">${
      task.task
    }</span>
    <div class="task-buttons">
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
    </div>
    `;
    taskListContainer.appendChild(taskItem);
  });

  const tasktext = document.querySelectorAll(".task-text");
  if (tasktext) {
    tasktext.forEach((txt) => {
      txt.addEventListener("click", (e) => {
        taskID = e.currentTarget.parentElement.id;
        const newTask = tasks.find((task) => task.id == taskID);
        newTask.completed = !newTask.completed;
        tasks = [newTask, ...tasks.filter((task) => task.id != taskID)];
        localStorage.setItem("tasks", JSON.stringify(tasks));
        utils()
        renderTasks();
      });
    });
  }

  const editBtn = document.querySelectorAll(".edit-btn");
  const deleteBtn = document.querySelectorAll(".delete-btn");
  editBtn.forEach((btn) => {
    btn.addEventListener("click", editTask);
  });

  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", deleteTask);
  });
}

editCancelModal.addEventListener("click", () => {
  editModal.classList.remove("editActive");
  document.removeEventListener("click", checkModalToClose);
  editInput.value = "";
});

editConfirmModal.addEventListener("click", () => {
  if (editInput.value.trim() === "") {
    alert("Please enter a valid task");
  } else {
    const newTask = tasks.find((task) => task.id == taskID);
    newTask.task = editInput.value;
    tasks = [newTask, ...tasks.filter((task) => task.id != taskID)];
    localStorage.setItem("tasks", JSON.stringify(tasks));
    editModal.classList.remove("editActive");
    document.removeEventListener("click", checkModalToClose);
    renderTasks();
    editInput.value = "";
  }
});
function editTask(e) {
  e.stopPropagation();
  tasks = JSON.parse(localStorage.getItem("tasks"))
  taskID = e.currentTarget.parentElement.parentElement.id;
  if (!tasks.filter((task) => task.id == taskID)[0].completed) {
    editModal.classList.toggle("editActive");
    document.addEventListener("click", checkModalToClose);
    editInput.value =
      e.currentTarget.parentElement.parentElement.querySelector(
        ".task-text"
      ).innerText;
  }
}

function deleteTask(e) {
  e.stopPropagation();
  taskID = e.currentTarget.parentElement.parentElement.id;
  tasks = JSON.parse(localStorage.getItem("tasks"))
  tasks = tasks.filter((task) => task.id != taskID);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  utils()
  renderTasks();
}

const utils = () => {
  document.querySelector(".filters").querySelector(".active").classList.remove("active")
  document.querySelector("[data-filter=all]").classList.add("active")
}

function checkModalToClose(e) {
  if (
    !e.target.classList.contains("modalEdit") &&
    e.target.closest(".modalEdit") === null
  ) {
    editModal.classList.remove("editActive");
    document.removeEventListener("click", checkModalToClose);
  }
}

filterBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    filterBtns.forEach((btn) => {
      if (btn.classList.contains("active")) {
        btn.classList.remove("active");
      }
    });
    e.currentTarget.classList.add("active");
    filterTasks(e.currentTarget.dataset.filter);
  });
});

const filterTasks = (toFilter) => {
  const newTasks = JSON.parse(localStorage.getItem("tasks"));
  if (toFilter == "all") {
    tasks = newTasks;
    renderTasks();
  } else if (toFilter == "completed") {
    tasks = newTasks.filter((task) => !!task.completed);
    renderTasks();
  } else if (toFilter == "active") {
    tasks = newTasks.filter((task) => {
      if (task.completed) return false;
      return true;
    });
    renderTasks();
  }
};
