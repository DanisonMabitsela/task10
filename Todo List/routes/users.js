// routes/users.js
const express = require("express");
const jsonwebtoken = require("jsonwebtoken");

const router = express.Router();

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if the username is already taken.
  if (usernameExists(username)) {
    res.status(400).send("Username is already taken");
    return;
  }

  // Create a new user.
  const user = {
    username,
    password,
  };

  // Save the user to the database.
  saveUser(user);

  // Generate a JWT token for the user.
  const token = jsonwebtoken.sign({ username }, "secret");

  // Send the token to the user.
  res.status(201).send({ token });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password are correct.
  const user = findUserByUsernameAndPassword(username, password);

  if (!user) {
    res.status(401).send("Invalid username or password");
    return;
  }

  // Generate a JWT token for the user.
  const token = jsonwebtoken.sign({ username }, "secret");

  // Send the token to the user.
  res.status(200).send({ token });
});

module.exports = router;
