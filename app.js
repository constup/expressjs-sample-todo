const express = require("express");
const bodyParser = require("body-parser");
const serveStatic = require("serve-static");
const app = express();

app.use(bodyParser.json());
app.use(serveStatic("html"));
let todos = [];
let maxIndex = 0;

app.get("/todos/:id?", (request, response) => {
    const id = request.params.id;
    if (!id) {
        response.json(todos);
    } else {
        const todo = todos.find(todo => todo.id === parseInt(id));
        if (todo) {
            response.json(todo);
        } else {
            response.status(404).json({error: "Todo not found"});
        }
    }
});

app.post("/todos", (request, response) => {
    maxIndex += 1;
    const todo = {
        id: maxIndex,
        title: request.body.title,
        completed: request.body.completed || false
    }

    todos.push(todo);
    response.status(201).json(todo);
});

app.put("/todos/:id", (request, response) => {
    const id = parseInt(request.params.id);
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) {
        return response.status(404).json({ error: `Todo ${id} not found`});
    }

    todos[index] = {
        ...todos[index],
        title: request.body.title !== undefined ? request.body.title : todos[index].title,
        completed: request.body.completed !== undefined ? request.body.completed : todos[index].completed
    }

    response.json(todos[index]);
});

app.delete("/todos/:id", (request, response) => {
    const id = parseInt(request.params.id)
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) {
        response.status(404).json({error: "Todo not found"});
    }
    todos.splice(index, 1);
    response.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});