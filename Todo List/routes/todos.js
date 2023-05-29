// routes/todos.js
const express = require("express");
const jsonwebtoken = require("jsonwebtoken");

const router = express.Router();

// Apply the checkJWTToken middleware to the specific routes that require authentication
router.post("/", checkJWTToken, (req, res) => {
  const { username } = req.headers;

  // Check if the todo is too long.
  const { title } = req.body;

  if (title.length > 140) {
    res.status(400).send("Todo is too long");
    return;
  }

  // Add the todo to the database.
  addTodo(username, title);

  // Send a success message to the user.
  res.status(201).send("Todo added successfully");
});

router.put("/:id", checkJWTToken, (req, res) => {
  const { username } = req.headers;

  // Check if the todo exists.
  const todo = findTodoById(req.params.id);

  if (!todo) {
    res.status(404).send("Todo not found");
    return;
  }

  // Check if the user is trying to edit someone else's todo.
  if (todo.username !== username) {
    res.status(403).send("Unauthorized");
    return;
  }

  // Update the todo in the database.
  updateTodo(req.params.id, req.body);

  // Send a success message to the user.
  res.status(200).send("Todo updated successfully");
});

router.delete("/:id", checkJWTToken, (req, res) => {
  const { username } = req.headers;

  // Check if the todo exists.
  const todo = findTodoById(req.params.id);

  if (!todo) {
    res.status(404).send("Todo not found");
    return;
  }

  // Check if the user is trying to delete someone else's todo.
  if (todo.username !== username) {
    res.status(403).send("Unauthorized");
    return;
  }

  // Delete the todo from the database.
  deleteTodo(req.params.id);

  // Send a success message to the user.
  res.status(200).send("Todo deleted successfully");
});

module.exports = router;
