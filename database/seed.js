// database/seed.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'university.db');
const db = new sqlite3.Database(dbPath);

// Sample course data
const courses = [
  ["CS101", "Intro Programming", 3, "Learn Python basics", "Fall 2024"],
  ["BIO120", "General Biology", 3, "Introduction to biological principles", "Fall 2024"],
  ["MATH150", "Calculus I", 4, "Basic calculus", "Fall 2024"],
  ["ENG101", "Composition I", 3, "Academic writing and critical thinking", "Spring 2025"],
  ["ME210", "Thermodynamics", 3, "Principles of thermodynamics and heat transfer", "Spring 2025"],
  ["CS301", "Database Systems", 3, "Design and implementation of database systems", "Fall 2024"],
  ["PHYS201", "Physics II", 4, "Electricity, magnetism, and modern physics", "Spring 2025"],
  ["CS201", "Data Structures", 4, "Study of fundamental data structures and algorithms", "Spring 2025"]
];

// Parameterized INSERT
const insertSQL = `
  INSERT INTO courses (course_code, title, credits, description, semester)
  VALUES (?, ?, ?, ?, ?);
`;

db.serialize(() => {
  const stmt = db.prepare(insertSQL);

  courses.forEach((course) => {
    stmt.run(course, (err) => {
      if (err) {
        console.error("Error inserting course:", course[0], "-", err.message);
      }
    });
  });

  stmt.finalize((err) => {
    if (err) {
      console.error("Error finalizing statement:", err.message);
    } else {
      console.log("Course data inserted successfully.");
    }

    db.close((closeErr) => {
      if (closeErr) {
        console.error("Error closing database:", closeErr.message);
      } else {
        console.log("Database connection closed.");
      }
    });
  });
});
