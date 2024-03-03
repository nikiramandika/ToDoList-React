import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Footer from "./Components/Footer";

function App() {
  const [taskInput, setTaskInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [isEditTask, setIsEditTask] = useState(false);
  const [todos, setTodos] = useState(
    JSON.parse(localStorage.getItem("todo-list")) || []
  );
  const [activeFilter, setActiveFilter] = useState("all");
  const [showSettings, setShowSettings] = useState(todos.map(() => false));
  const settingsRefs = useRef(todos.map(() => React.createRef()));

  useEffect(() => {
    localStorage.setItem("todo-list", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    settingsRefs.current.forEach((ref, index) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowSettings((prevSettings) =>
          prevSettings.map((setting, idx) => (idx === index ? false : setting))
        );
      }
    });
  };

  const showTodo = (filter) => {
    return todos.filter((todo) => filter === "all" || filter === todo.status);
  };

  const updateStatus = (taskId) => {
    setTodos(
      todos.map((todo, id) => {
        if (id === taskId) {
          return {
            ...todo,
            status: todo.status === "completed" ? "pending" : "completed",
          };
        }
        return todo;
      })
    );
  };

  const editTask = (taskId, textName) => {
    setEditId(taskId);
    setIsEditTask(true);
    setTaskInput(textName);
  };

  const deleteTask = (deleteId) => {
    setTodos(todos.filter((todo, id) => id !== deleteId));
    setShowSettings((prevSettings) =>
      prevSettings.filter((setting, idx) => idx !== deleteId)
    );
  };

  const clearAllTasks = () => {
    console.log("Clear All button clicked");
    setTodos([]);
    setShowSettings([]);
    localStorage.setItem("todo-list", "[]");
  };

  const handleTaskInputChange = (e) => {
    setTaskInput(e.target.value);
  };

  const handleTaskInputKeyPress = (e) => {
    if (e.key === "Enter" && taskInput.trim() !== "") {
      if (!isEditTask) {
        setTodos([...todos, { name: taskInput, status: "pending" }]);
        setShowSettings([...showSettings, false]);
      } else {
        setTodos(
          todos.map((todo, id) => {
            if (id === editId) {
              return { ...todo, name: taskInput };
            }
            return todo;
          })
        );
        setIsEditTask(false);
        setEditId(null);
      }
      setTaskInput("");
    }
  };

  const toggleSettings = (index) => {
    setShowSettings((prevSettings) =>
      prevSettings.map((setting, idx) => (idx === index ? !setting : setting))
    );
  };

  return (
    <>
      <body>
        <div className="wrapper">
          <h1>To-Do List</h1>
          <div className="task-input">
            <div className="input-icon">
              <input
                type="text"
                placeholder="Add a new task"
                value={taskInput}
                onChange={handleTaskInputChange}
                onKeyPress={handleTaskInputKeyPress}
              />
              <FontAwesomeIcon icon={faBars} />
            </div>
          </div>

          <div className="controls">
            <div className="filters">
              <span
                className={activeFilter === "all" ? "active" : ""}
                onClick={() => setActiveFilter("all")}
              >
                All
              </span>
              <span
                className={activeFilter === "pending" ? "active" : ""}
                onClick={() => setActiveFilter("pending")}
              >
                Pending
              </span>
              <span
                className={activeFilter === "completed" ? "active" : ""}
                onClick={() => setActiveFilter("completed")}
              >
                Completed
              </span>
            </div>
            <button className="clear-btn" onClick={() => clearAllTasks()}>
              Clear All
            </button>
          </div>
          <ul className="task-box">
            {showTodo(activeFilter).map((todo, id) => (
              <li className="task" key={id}>
                <label htmlFor={id}>
                  <input
                    type="checkbox"
                    id={id}
                    checked={todo.status === "completed"}
                    onChange={() => updateStatus(id)}
                  />
                  <p className={todo.status === "completed" ? "checked" : ""}>
                    {todo.name}
                  </p>
                </label>
                <div className="settings" ref={settingsRefs.current[id]}>
                  <i
                    onClick={() => toggleSettings(id)}
                    className="uil uil-ellipsis-h"
                  ></i>
                  <ul className={`task-menu ${showSettings[id] ? "show" : ""}`}>
                    <li onClick={() => editTask(id, todo.name)}>
                      <i className="uil uil-pen"></i>Edit
                    </li>
                    <li onClick={() => deleteTask(id)}>
                      <i className="uil uil-trash"></i>Delete
                    </li>
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Footer />
      </body>
    </>
  );
}

export default App;
