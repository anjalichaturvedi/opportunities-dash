const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQLite DB setup
const db = new sqlite3.Database("./opportunities.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS opportunities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      deadline TEXT,
      category TEXT
    )
  `);
});

// Routes
app.get("/opportunities", (req, res) => {
  db.all("SELECT * FROM opportunities", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/opportunities", (req, res) => {
  const { title, deadline, category } = req.body;
  db.run(
    "INSERT INTO opportunities (title, deadline, category) VALUES (?, ?, ?)",
    [title, deadline, category],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
