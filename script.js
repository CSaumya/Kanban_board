document.addEventListener("DOMContentLoaded", function () {

    const todo = document.getElementById('todo');
    const progress = document.getElementById('progress');
    const done = document.getElementById('done');
    const columns = [todo, progress, done];

    const modal = document.querySelector('.modal');
    const toggleModal = document.getElementById('task-btn');
    const modalBg = document.querySelector('.modal .bg');
    const newTaskBtn = document.getElementById('add-new-task');

    let dragElement = null;

    function saveToLocalStorage() {
        const tasksData = {};

        columns.forEach(col => {
            const tasks = col.querySelectorAll('.task');

            tasksData[col.id] = Array.from(tasks).map(task => ({
                title: task.querySelector('h4').innerText,
                desc: task.querySelector('p').innerText
            }));

            col.querySelector('.task-right').innerText = tasks.length;
        });

        localStorage.setItem('tasks', JSON.stringify(tasksData));
    }

    function createTask(title, desc) {

        const div = document.createElement('div');
        div.classList.add('task');
        div.setAttribute('draggable', 'true');

        div.innerHTML = `
            <h4>${title}</h4>
            <p>${desc}</p>
            <button>Remove</button>
        `;

        div.addEventListener('dragstart', () => {
            dragElement = div;
        });

        div.querySelector('button').addEventListener('click', () => {
            div.remove();
            saveToLocalStorage();
        });

        return div;
    }

    const stored = localStorage.getItem('tasks');

    if (stored) {
        try {
            const savedData = JSON.parse(stored);

            Object.keys(savedData).forEach(col => {
                if (!Array.isArray(savedData[col])) return;

                const column = document.getElementById(col);
                if (!column) return;

                savedData[col].forEach(task => {
                    const taskEl = createTask(task.title, task.desc);
                    column.appendChild(taskEl);
                });
            });

            saveToLocalStorage();
        } catch {
            localStorage.removeItem('tasks');
        }
    }

    function launchConfetti() {
    confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#6c63ff', '#00f5ff', '#ffffff']
    });
}
    columns.forEach(column => {

        column.addEventListener('dragover', e => e.preventDefault());

        column.addEventListener('dragenter', () => {
            column.classList.add('hover-over');
        });

        column.addEventListener('dragleave', () => {
            column.classList.remove('hover-over');
        });

       column.addEventListener('drop', e => {
    e.preventDefault();
    column.classList.remove('hover-over');

    if (dragElement) {
        column.appendChild(dragElement);

        if (column.id === "done") {
            launchConfetti();
        }

        saveToLocalStorage();
    }
});
    });

    toggleModal.addEventListener('click', () => {
        modal.classList.toggle('active');
    });

    modalBg.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    newTaskBtn.addEventListener('click', () => {

        const title = document.getElementById('modal-input').value.trim();
        const desc = document.getElementById('modal-txtArea').value.trim();

        if (!title || !desc) {
            alert("Please fill all fields");
            return;
        }

        const taskEl = createTask(title, desc);
        todo.appendChild(taskEl);

        saveToLocalStorage();

        document.getElementById('modal-input').value = "";
        document.getElementById('modal-txtArea').value = "";
        modal.classList.remove('active');
    });

});