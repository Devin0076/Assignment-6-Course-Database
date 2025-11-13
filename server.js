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

// CRUD Endpoints for Courses

// GET all courses
app.get('/api/courses', (req, res) => {
  const sql = `SELECT * FROM courses ORDER BY id;`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error." });
    res.json(rows);
  });
});

// GET course by ID
app.get('/api/courses/:id', (req, res) => {
  const sql = `SELECT * FROM courses WHERE id = ?;`;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: "Database error." });
    if (!row) return res.status(404).json({ error: "Course not found." });
    res.json(row);
  });
});

// POST create a course
app.post('/api/courses', (req, res) => {
  const { course_code, title, credits, description, semester } = req.body;

  if (!course_code || !title || !credits || !semester) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const sql = `
    INSERT INTO courses (course_code, title, credits, description, semester)
    VALUES (?, ?, ?, ?, ?);
  `;
  const params = [course_code, title, credits, description || null, semester];

  db.run(sql, params, function (err) {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res.status(400).json({ error: "Course code already exists." });
      }
      return res.status(500).json({ error: "Database error." });
    }

    res.status(201).json({
      id: this.lastID,
      course_code,
      title,
      credits,
      description,
      semester
    });
  });
});

// PUT update a course
app.put('/api/courses/:id', (req, res) => {
  const { course_code, title, credits, description, semester } = req.body;

  if (!course_code || !title || !credits || !semester) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const sql = `
    UPDATE courses
    SET course_code = ?, title = ?, credits = ?, description = ?, semester = ?
    WHERE id = ?;
  `;
  const params = [course_code, title, credits, description || null, semester, req.params.id];

  db.run(sql, params, function (err) {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res.status(400).json({ error: "Course code already exists." });
      }
      return res.status(500).json({ error: "Database error." });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Course not found." });
    }

    res.json({
      id: req.params.id,
      course_code,
      title,
      credits,
      description,
      semester
    });
  });
});

// DELETE course
app.delete('/api/courses/:id', (req, res) => {
  const sql = `DELETE FROM courses WHERE id = ?;`;

  db.run(sql, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: "Database error." });

    if (this.changes === 0) {
      return res.status(404).json({ error: "Course not found." });
    }

    res.status(204).send();
  });
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
