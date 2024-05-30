import axios from 'axios';

const routes = {
  tasksPath: () => '/api/tasks',
};

// BEGIN
export default async function run() {
  const form = document.querySelector('form');
  const input = form.querySelector('input[name="name"]');
  const tasksList = document.getElementById('tasks');

  const createTaskElement = (task) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.textContent = task.name;
    return li;
  };

  const renderTasks = (tasks) => {
    tasksList.innerHTML = '';
    tasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      tasksList.appendChild(taskElement);
    });
  };

  const loadTasks = async () => {
    try {
      const response = await axios.get(routes.tasksPath());
      const tasks = response.data.items;
      renderTasks(tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const addTask = async (task) => {
    try {
      const response = await axios.post(routes.tasksPath(), task);
      if (response.status === 201) {
        const tasks = [task, ...response.data.items];
        renderTasks(tasks);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const taskName = input.value.trim();
    if (taskName) {
      const newTask = { name: taskName };
      await addTask(newTask);
      input.value = '';
      await loadTasks();
    }
  });

  await loadTasks();
}
// END