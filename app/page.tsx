"use client";
import { useState, useEffect } from "react";
import { Container, Typography, List, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import SearchForm from "./components/SearchForm";
import SearchItem from "./components/SearchItem";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [taskToUndo, setTaskToUndo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    filterTasks(searchTerm);
  }, [searchTerm, tasks]);

  const addTask = (taskText) => {
    const newTask = { id: Date.now(), text: taskText, completed: false, completedAt: null };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const toggleComplete = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : null }
          : task
      )
    );
  };

  const editTask = (taskId) => {
    const newText = prompt("Edit task");
    if (newText) {
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, text: newText } : task
        )
      );
    }
  };

  const handleUndo = (taskId) => {
    setTaskToUndo(taskId);
    setOpenModal(true);
  };

  const confirmUndo = () => {
    setTasks(tasks.map(task =>
      task.id === taskToUndo
        ? { ...task, completed: false, completedAt: null }
        : task
    ));
    setOpenModal(false);
  };

  const cancelUndo = () => {
    setOpenModal(false);
  };

  const filterTasks = (term) => {
    if (!term) {
      setFilteredTasks(tasks); // Show all tasks when no search term
    } else {
      setFilteredTasks(
        tasks.filter(task =>
          task.text.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "80vh",
        paddingTop: "50px",
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Pending Tasks
        </Typography>
        <Box
          sx={{
            minHeight: "80vh",
            padding: "20px",
          }}
        >
          <TaskForm onAdd={addTask} />
          <List>
            {pendingTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={deleteTask}
                onComplete={toggleComplete}
                onEdit={editTask}
              />
            ))}
          </List>
        </Box>
      </Container>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Completed
        </Typography>
        <Box
          sx={{
            backgroundColor: "#FFE9E4",
            minHeight: "80vh",
            padding: "20px",
          }}
        >
          <SearchForm onSearch={handleSearch} />
          <List>
            {completedTasks.map((task) => (
              <SearchItem
                key={task.id}
                task={task}
                onEdit={editTask}
                onUndo={handleUndo}
              />
            ))}
          </List>
        </Box>
      </Container>

      {/* Undo Confirmation Dialog */}
      <Dialog open={openModal} onClose={cancelUndo}>
        <DialogTitle>Confirm Undo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to undo this task? This will move it back to the pending list.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelUndo} color="primary">Cancel</Button>
          <Button onClick={confirmUndo} color="secondary">Undo</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
