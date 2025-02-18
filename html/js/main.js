const todoForm = document.getElementById('todo-form')
const todoInput = document.getElementById("todo-input")
const todoList = document.getElementById("todo-table-body")

const BACKEND_URL = "http://localhost:3000/todos"

// CRUD
async function createTodo(todo) {
    await fetch(BACKEND_URL, {
        method: "POST",
        body: JSON.stringify(todo),
        headers: { "Content-Type": "application/json" },
    });
}

async function getTodo(id) {
    const response = await fetch(`${BACKEND_URL}/${id}`);
    return await response.json();
}

async function updateTodo(todo) {
    await fetch(`${BACKEND_URL}/${todo.id}`, {
        method: "PUT",
        body: JSON.stringify(todo),
        headers: { "Content-Type": "application/json" },
    });
}

async function deleteTodo(id) {
    await fetch(`${BACKEND_URL}/${id}`, { method: "DELETE" });
    await loadTodos();
}
// CRUD

todoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = todoInput.value.trim();
    if (title) {
        const todo = { title };
        await createTodo(todo);
        todoInput.value = "";
        await loadTodos();
    }
});

async function loadTodos() {
    const todos = await fetchTodos();
    renderTodos(todos);
}

async function fetchTodos() {
    const response = await fetch(BACKEND_URL);
    return response.json();
}

function renderTodos(todos) {
    todoList.innerHTML = "";
    todos.forEach((todo) => {
        const todoElement = createTodoElement(todo);
        todoList.appendChild(todoElement);
    });
}

function createTodoElement(todo) {
    const row = document.createElement("tr");
    row.classList.add("todo");
    if (todo.completed) {
        row.classList.add("table-success");
    }
    row.innerHTML = `
        <td><span>${todo.id}</span></td>
        <td><span>${todo.title}</span></td>
        <td><button class="btn ${todo.completed ? 'btn-primary' : 'btn-success'} btn-sm" onclick="toggleCompleted(${todo.id})">${todo.completed ? "Reopen" : "Complete"}</button></td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteTodo(${todo.id})">Delete</button></td>
    `;
    return row;
}

async function toggleCompleted(id) {
    const todo = await getTodo(id);
    const updatedTodo = { ...todo, completed: !todo.completed };
    await updateTodo(updatedTodo);
    await loadTodos();
}
