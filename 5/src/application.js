import uniqueId from 'lodash/uniqueId.js';

// BEGIN
export default function app() {
    const listsContainer = document.querySelector('[data-container="lists"]');
    const tasksContainer = document.querySelector('[data-container="tasks"]');
    const newListForm = document.querySelector('[data-container="new-list-form"]');
    const newTaskForm = document.querySelector('[data-container="new-task-form"]');

    let lists = {
        general: { name: 'General', tasks: [] }
    };

    let currentList = lists.general;

    function renderLists() {
        const ul = document.createElement('ul');
        for (const key in lists) {
            const list = lists[key];
            const li = document.createElement('li');
            if (currentList.name === list.name) {
                li.innerHTML = `<b>${list.name}</b>`;
            } else {
                li.innerHTML = `<a href="#" data-list-id="${key}">${list.name}</a>`;
            }
            ul.appendChild(li);
        }
        listsContainer.innerHTML = '';
        listsContainer.appendChild(ul);
    }

    function renderTasks() {
        if (currentList.tasks.length === 0) {
            tasksContainer.innerHTML = '';
            return;
        }

        const ul = document.createElement('ul');
        currentList.tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task;
            ul.appendChild(li);
        });
        tasksContainer.innerHTML = '';
        tasksContainer.appendChild(ul);
    }

    function addList(name) {
        const key = name.toLowerCase();
        if (!lists[key]) {
            lists[key] = { name, tasks: [] };
            renderLists();
        }
    }

    function addTask(task) {
        currentList.tasks.push(task);
        renderTasks();
    }

    newListForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newListName = document.querySelector('#new-list-name').value.trim();
        if (newListName) {
            addList(newListName);
            document.querySelector('#new-list-name').value = '';
        }
    });

    newTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTaskName = document.querySelector('#new-task-name').value.trim();
        if (newTaskName) {
            addTask(newTaskName);
            document.querySelector('#new-task-name').value = '';
        }
    });

    listsContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const listId = e.target.dataset.listId;
            currentList = lists[listId];
            renderLists();
            renderTasks();
        }
    });

    renderLists();
    renderTasks();
}
// END