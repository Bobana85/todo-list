const form = document.getElementById('task-form');

const taskList = document.getElementById('task-list');

const taskTitle = document.getElementById('task-title');
const taskDesc = document.getElementById('task-desc');

let editingTask = null;

form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (!taskTitle.value.trim() || !taskDesc.value.trim()) {
    showNotification('Both fields are required!', 'error');
    return; 
  }

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  if (taskTitle.value.length && taskDesc.value.length) {
    if (editingTask) {
      const taskTextDiv = editingTask.querySelector('.task-text');
      taskTextDiv.querySelector('h3').textContent = taskTitle.value;
      taskTextDiv.querySelector('p').textContent = taskDesc.value;
      taskTextDiv.querySelector('small').innerHTML = `Time: <em>${formattedTime}</em>`;

      showNotification('Task edited successfully!', 'success');

      editingTask = null;
      unlockList();
    } else {
      taskList.appendChild(createTaskElement(taskTitle.value, taskDesc.value, formattedTime));
      saveTasksToLocalStorage();
      showNotification('Task added successfully', 'success');

      const lista = document.getElementById('lista');
      lista.classList.remove('display-none');
    }

    taskTitle.value = '';
    taskDesc.value = '';
  }
});

form.addEventListener('reset', function (e) {
  resetForm();
});

function resetForm() {
  taskTitle.value = '';
  taskDesc.value = '';
  unlockList();
}

taskList.addEventListener('click', function (e) {
  if (e.target && e.target.classList.contains('delete')) {
    const listItem = e.target.parentElement;
    listItem.parentElement.remove();

    showNotification('Task deleted successfully!', 'success');

    saveTasksToLocalStorage();
    if (taskList.children.length === 0) {
      const lista = document.getElementById('lista');
      lista.classList.add('display-none');
    }
  }
});

taskList.addEventListener('click', function (e) {
  if (e.target && e.target.classList.contains('edit')) {
    const listItem = e.target.closest('.task'); 
    const editTitle = listItem.querySelector('h3').textContent;
    const editDesc = listItem.querySelector('p').textContent;

    taskTitle.value = editTitle;
    taskDesc.value = editDesc;

    lockList();
    editingTask = listItem; 
  }
});

function lockList() {
  taskList.classList.add('locked');
}

function unlockList() {
  taskList.classList.remove('locked');
}

function saveTasksToLocalStorage() {
  const tasks = [];
  document.querySelectorAll('#task-list .task').forEach((task) => {
    const title = task.querySelector('h3').textContent;
    const description = task.querySelector('p').textContent;
    const time = task.querySelector('small em').textContent;
    tasks.push({ title, description, time });
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach((task) => {
    taskList.appendChild(createTaskElement(task.title, task.description, task.time));
  });

  if (savedTasks.length > 0) {
    const lista = document.getElementById('lista');
    lista.classList.remove('display-none');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  loadTasksFromLocalStorage();
});

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function createTaskElement(title, description, time) {
  const li = document.createElement('li');
  li.className = 'task';

  const taskTextDiv = document.createElement('div');
  taskTextDiv.className = 'task-text';

  const h3 = document.createElement('h3');
  h3.textContent = title;
  taskTextDiv.appendChild(h3);

  const p = document.createElement('p');
  p.textContent = description;
  taskTextDiv.appendChild(p);

  const small = document.createElement('small');
  small.innerHTML = `Time: <em>${time}</em>`;
  taskTextDiv.appendChild(small);

  li.appendChild(taskTextDiv);

  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'buttons';

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.className = 'edit';
  editButton.textContent = 'Edit';
  buttonsDiv.appendChild(editButton);

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete';
  deleteButton.textContent = 'Delete';
  buttonsDiv.appendChild(deleteButton);

  li.appendChild(buttonsDiv);

  return li;
}