
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// Fetch tasks from the server
function fetchTasks() {
  fetch('/tasks')
    .then((response) => response.json())
    .then((tasks) => {
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.toggle('completed', task.isCompleted);
        li.innerHTML = `
          <span>${task.task}</span>
          <button onclick="deleteTask('${task._id}')">Delete</button>
          <button onclick="toggleComplete('${task._id}', ${task.isCompleted})">${task.isCompleted ? 'Undo' : 'Complete'}</button>
        `;
        taskList.appendChild(li);
      });
    })
    .catch((err) => console.log('Error fetching tasks:', err));
}

// Add a new task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const task = taskInput.value.trim();

  if (task) {
    fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task }),
    })
      .then((response) => response.json())
      .then(() => {
        taskInput.value = '';
        fetchTasks(); // Refresh task list
      })
      .catch((err) => console.log('Error adding task:', err));
  }
});

// Delete a task
function deleteTask(taskId) {
  fetch(`/tasks/${taskId}`, {
    method: 'DELETE',
  })
    .then(() => fetchTasks()) // Refresh task list
    .catch((err) => console.log('Error deleting task:', err));
}

// Toggle task completion
function toggleComplete(taskId, isCompleted) {
  fetch(`/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isCompleted: !isCompleted }),
  })
    .then(() => fetchTasks()) // Refresh task list
    .catch((err) => console.log('Error updating task:', err));
}

// Initial fetch of tasks
fetchTasks();
