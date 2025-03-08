async function fetchTasks() {
    try {
        const response = await fetch('https://taskmanagerapi-ni9m.onrender.com/api/tasks');
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        document.getElementById('status').textContent = `Error: ${error.message}`;
    }
}

function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <div>
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Due: ${new Date(task.dueDate).toLocaleDateString()}</p>
                <p>Status: ${task.status}</p>
            </div>
            <div>
                <button class="edit" onclick="editTask(${task.id})">Edit</button>
                <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}

async function addTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const status = document.getElementById('taskStatus').value;

    if (!title || !dueDate) {
        document.getElementById('status').textContent = 'Title and Due Date are required.';
        return;
    }

    const task = { title, description, dueDate, status };

    try {
        await fetch('https://taskmanagerapi-ni9m.onrender.com/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        fetchTasks();
        clearForm();
    } catch (error) {
        document.getElementById('status').textContent = `Error: ${error.message}`;
    }
}

async function editTask(id) {
    const title = prompt('Enter new title:');
    const description = prompt('Enter new description:');
    const dueDate = prompt('Enter new due date (YYYY-MM-DD):');
    const status = prompt('Enter new status (To Do, In Progress, Done):');

    if (!title || !dueDate) return;

    const task = { id, title, description, dueDate, status };

    try {
        await fetch(`https://taskmanagerapi-ni9m.onrender.com/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        fetchTasks();
    } catch (error) {
        document.getElementById('status').textContent = `Error: ${error.message}`;
    }
}

async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        await fetch(`https://taskmanagerapi-ni9m.onrender.com/api/tasks/${id}`, {
            method: 'DELETE'
        });
        fetchTasks();
    } catch (error) {
        document.getElementById('status').textContent = `Error: ${error.message}`;
    }
}

function clearForm() {
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskDueDate').value = '';
    document.getElementById('taskStatus').value = 'To Do';
    document.getElementById('status').textContent = '';
}

// Load tasks on page load
fetchTasks();