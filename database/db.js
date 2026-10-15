const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'second_brain.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Initialize Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS memories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    type TEXT NOT NULL, -- Note, Code, Idea, Task, Bookmark
    category TEXT,
    sub_category TEXT,
    tags TEXT,
    code_language TEXT DEFAULT 'javascript',
    task_status TEXT DEFAULT 'Todo', -- Todo, In Progress, Completed
    task_percentage INTEGER DEFAULT 0,
    url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Check if initial seed data is needed
const countStmt = db.prepare('SELECT COUNT(*) AS count FROM memories');
const { count } = countStmt.get();

if (count === 0) {
  const insertStmt = db.prepare(`
    INSERT INTO memories (title, content, type, category, sub_category, tags, code_language, task_status, task_percentage, url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialSeed = [
    [
      'Express Routing Cheat Sheet',
      `const express = require('express');\nconst router = express.Router();\n\n// Middleware specific to this router\nrouter.use((req, res, next) => {\n  console.log('Time: ', Date.now());\n  next();\n});\n\n// Define home page route\nrouter.get('/', (req, res) => {\n  res.render('index');\n});\n\nmodule.exports = router;`,
      'Code',
      'Development',
      'Backend',
      'express, nodejs, routing',
      'javascript',
      'Completed',
      100,
      ''
    ],
    [
      'Second Brain Core Philosophy',
      'Your mind is for having ideas, not holding them. When you dump your thoughts, snippet codes, and tasks into a single reliable Second Brain, your focus increases tenfold.',
      'Note',
      'Productivity',
      'Mindset',
      'philosophy, gtd, focus',
      '',
      'Completed',
      100,
      ''
    ],
    [
      'Build AI Snippet Categorizer',
      'Explore adding a local light classification script to auto-suggest tags and subcategories based on snippet text.',
      'Idea',
      'Development',
      'Features',
      'ai, ideas, backlog',
      '',
      'Todo',
      15,
      ''
    ],
    [
      'Refactor Database Controller Methods',
      'Task list for database optimization:\n1. Add parameterized search query\n2. Add category list cache query\n3. Optimize tag breakdown stats',
      'Task',
      'Development',
      'Refactoring',
      'task, sqlite, db',
      '',
      'In Progress',
      60,
      ''
    ],
    [
      'MDN Web Docs - Express Guide',
      'Comprehensive reference for building web applications with Node.js and Express framework.',
      'Bookmark',
      'Resources',
      'Documentation',
      'docs, mdn, express',
      '',
      'Completed',
      100,
      'https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs'
    ]
  ];

  const insertMany = db.transaction((memories) => {
    for (const mem of memories) insertStmt.run(...mem);
  });

  insertMany(initialSeed);
}

module.exports = db;
