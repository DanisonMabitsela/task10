// app.js
const express = require("express");
const app = express();

// Add the middleware to parse JSON request bodies
app.use(express.json());

// Import the routes
const usersRouter = require("./routes/users");
const todosRouter = require("./routes/todos");

// Apply the checkJWTToken middleware to the specific routes that require authentication
app.use("/users", usersRouter);
app.use("/todos", todosRouter);

// Start the server
app.listen(3000, () => {
  console.log("App is listening on port 3001");
});
