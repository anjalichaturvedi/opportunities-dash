// server.js
import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const dbPromise = open({
  filename: "./opportunities.db",
  driver: sqlite3.Database
});

// Now you can use: const db = await dbPromise; etc.

// Connect to SQLite
const db = new sqlite3.Database("./opportunities.db", (err) => {
  if (err) return console.error("DB Error:", err.message);
  console.log("✅ Connected to SQLite DB.");
});

// Create table if not exists
db.run(
  `CREATE TABLE IF NOT EXISTS opportunities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT,
    title TEXT,
    category TEXT,
    deadline TEXT
  )`,
  (err) => {
    if (err) console.error("❌ Table creation failed:", err.message);
  }
);


// GET all
app.get("/opportunities", (req, res) => {
  db.all("SELECT * FROM opportunities ORDER BY deadline ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST
app.post("/opportunities", (req, res) => {
  let { company, title, category, deadline } = req.body;

  // Convert "2025-04" → "Apr"
  const monthMap = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  try {
    const monthIndex = parseInt(deadline.split("-")[1], 10) - 1;
    deadline = monthMap[monthIndex] || deadline;
  } catch {
    console.warn("Invalid deadline format");
  }

  if (!company || !title || !category || !deadline) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const query = `INSERT INTO opportunities (company, title, category, deadline)
                 VALUES (?, ?, ?, ?)`;
  db.run(query, [company, title, category, deadline], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

// DELETE all
app.delete("/clear", (req, res) => {
  db.run("DELETE FROM opportunities", (err) => {
    if (err) return res.status(500).send("Failed to clear data");
    res.send("All opportunities deleted.");
  });
});

// delete by id
app.delete("/opportunities/:id", async (req, res) => {
  const db = await dbPromise;
  const id = req.params.id;

  const result = await db.run("DELETE FROM opportunities WHERE id = ?", id);

  if (result.changes > 0) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Opportunity not found" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static React build
app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});