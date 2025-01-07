const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize express app
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Serve static files like CSS, JS, images, etc.
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb://localhost/todolist', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Hello, MongoDB connected!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Task Schema for MongoDB
const taskSchema = new mongoose.Schema({
  task: String,
  isCompleted: { type: Boolean, default: false },
});

const Task = mongoose.model('Task', taskSchema);

// Routes

// Serve index.html on root request
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fetch all tasks
app.get('/tasks', (req, res) => {
  Task.find()
    .then((tasks) => res.json(tasks))
    .catch((err) => res.status(500).json({ message: 'Error fetching tasks' }));
});

// Add a new task
app.post('/tasks', (req, res) => {
  const newTask = new Task({
    task: req.body.task,
  });

  newTask.save()
    .then((task) => res.json(task))
    .catch((err) => res.status(500).json({ message: 'Error adding task' }));
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  Task.findByIdAndDelete(req.params.id)
    .then(() => res.json({ message: 'Task deleted' }))
    .catch((err) => res.status(500).json({ message: 'Error deleting task' }));
});

// Mark task as completed
app.put('/tasks/:id', (req, res) => {
  Task.findByIdAndUpdate(req.params.id, { isCompleted: req.body.isCompleted }, { new: true })
    .then((task) => res.json(task))
    .catch((err) => res.status(500).json({ message: 'Error updating task' }));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
