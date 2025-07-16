// server.js
import express from "express";
import cors from "cors";
import sqlite3Pkg from "sqlite3";
const sqlite3 = sqlite3Pkg.verbose();
import path from "path";
import { fileURLToPath } from "url";

// ⛑ Fix __dirname in ESM mode
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📦 Setup Express
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 🗄️ Load SQLite DB
const dbPath = path.join(__dirname, "opportunities.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Failed to connect to SQLite:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to SQLite DB");
});

// 🧱 Create table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS opportunities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT,
    title TEXT,
    category TEXT,
    deadline TEXT
  )
`);

// 📥 API: Get all opportunities
app.get("/opportunities", (req, res) => {
  db.all("SELECT * FROM opportunities ORDER BY deadline ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ➕ API: Add a new opportunity
app.post("/opportunities", (req, res) => {
  const { company, title, category, deadline } = req.body;
  if (!company || !title || !category || !deadline) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const query = `INSERT INTO opportunities (company, title, category, deadline) VALUES (?, ?, ?, ?)`;
  db.run(query, [company, title, category, deadline], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

// ✏️ API: Edit opportunity
app.put("/opportunities/:id", (req, res) => {
  const id = req.params.id;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) return res.status(400).json({ error: "Nothing to update." });

  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const sql = `UPDATE opportunities SET ${setClause} WHERE id = ?`;

  db.run(sql, [...values, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Opportunity not found" });
    }
  });
});

// ❌ API: Delete opportunity
app.delete("/opportunities/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM opportunities WHERE id = ?", id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
});

// ✅ Health check route (for debugging)
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Serve frontend build
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});


// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
