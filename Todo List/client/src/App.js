import { Router } from "express";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Link, Navigate } from "react-router-dom";

const Home = () => (
  <div>
    <h1>To-Do List</h1>
    <Link to="/login">Login</Link>
    <Link to="/register">Register</Link>
  </div>
);

const TodoList = ({
  isLoggedIn,
  tasks,
  handleLogout,
  handleAddTask,
  handleEditTask,
  handleDeleteTask,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const task = e.target.task.value;
    handleAddTask(task);
  };

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h1>To-Do List</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}
            <button onClick={() => handleEditTask(task.id, task.title)}>
              Edit
            </button>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" id="task" placeholder="Enter task" />
        <button type="submit">Add Task</button>
      </form>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [tasks, setTasks] = useState([]);
  app.use(checkJWTToken);

  useEffect(() => {
    fetch("/api/users/me")
      .then((response) => {
        if (response.ok) {
          setIsLoggedIn(true);
          setUsername(response.headers.get("username"));
          return response.json();
        } else {
          setIsLoggedIn(false);
          return null;
        }
      })
      .then((data) => {
        if (data) {
          setTasks(data.tasks);
        }
      });
  }, []);

  const handleLogin = (username, password) => {
    const body = {
      username,
      password,
    };
    fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          setIsLoggedIn(true);
          setUsername(response.headers.get("username"));
          return response.json();
        } else {
          throw new Error("Invalid username or password");
        }
      })
      .then((data) => {
        setTasks(data.tasks);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleLogout = () => {
    fetch("/api/users/logout")
      .then((response) => {
        if (response.ok) {
          setIsLoggedIn(false);
          setUsername("");
          setTasks([]);
        }
      })
      .catch((error) => {
        alert("Error logging out");
      });
  };

  const handleAddTask = (task) => {
    if (task.length > 140) {
      alert("Task cannot exceed 140 characters");
      return;
    }
    const body = {
      title: task,
    };
    fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error adding task");
        }
      })
      .then((data) => {
        setTasks([...tasks, data]);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleEditTask = (taskId, task) => {
    if (task.length > 140) {
      alert("Task cannot exceed 140 characters");
      return;
    }
    const body = {
      title: task,
    };
    fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          setTasks(
            tasks.map((t) => (t.id === taskId ? { ...t, title: task } : t))
          );
        } else {
          throw new Error("Error editing task");
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleDeleteTask = (taskId) => {
    fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setTasks(tasks.filter((t) => t.id !== taskId));
        } else {
          throw new Error("Error deleting task");
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <BrowserRouter>
      <Router>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/login">
          <Login handleLogin={handleLogin} />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/todo">
          <TodoList
            isLoggedIn={isLoggedIn}
            tasks={tasks}
            handleLogout={handleLogout}
            handleAddTask={handleAddTask}
            handleEditTask={handleEditTask}
            handleDeleteTask={handleDeleteTask}
          />
        </Route>
      </Router>
    </BrowserRouter>
  );
};

export default App;
