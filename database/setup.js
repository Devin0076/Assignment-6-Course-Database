// database/setup.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'university.db');
const db = new sqlite3.Database(dbPath);

const createSchemaSQL = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  credits INTEGER NOT NULL CHECK (credits > 0),
  description TEXT,
  semester TEXT NOT NULL
);
`;

db.serialize(() => {
  db.exec(createSchemaSQL, (err) => {
    if (err) {
      console.error('Error creating database schema:', err.message);
      return db.close(() => process.exit(1));
    }

    console.log('Database created or verified at:', dbPath);
    console.log('Table "courses" ensured with proper schema.');
    db.close((closeErr) => {
      if (closeErr) {
        console.error('Error closing database:', closeErr.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  });
});
