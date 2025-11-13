// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json());

// Database connection
const dbPath = path.join(__dirname, 'database', 'university.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Placeholder route structure
app.get('/', (req, res) => {
  res.send({ message: 'Course API is running' });
});

// Courses router placeholder
// CRUD endpoints will be added in the next commit
app.use('/api/courses', (req, res, next) => {
  // This will be replaced with real logic
  next();
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
