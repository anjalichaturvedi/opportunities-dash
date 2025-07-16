// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

// ⛑ Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🌐 PostgreSQL connection
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || 5432,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// 🌟 Express setup
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ✅ Serve built frontend
app.use(express.static(path.join(__dirname, "dist")));

// ✅ API: Get all opportunities
app.get("/opportunities", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM opportunities ORDER BY deadline ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ API: Add opportunity
app.post("/opportunities", async (req, res) => {
  const { company, title, category, deadline } = req.body;
  if (!company || !title || !category || !deadline) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO opportunities (company, title, category, deadline) VALUES ($1, $2, $3, $4) RETURNING id",
      [company, title, category, deadline]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ API: Edit opportunity
app.put("/opportunities/:id", async (req, res) => {
  const id = req.params.id;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) return res.status(400).json({ error: "Nothing to update." });

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const sql = `UPDATE opportunities SET ${setClause} WHERE id = $${keys.length + 1}`;

  try {
    const result = await pool.query(sql, [...values, id]);
    if (result.rowCount > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Opportunity not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ API: Delete opportunity
app.delete("/opportunities/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query("DELETE FROM opportunities WHERE id = $1", [id]);
    if (result.rowCount > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Health check
app.get("/ping", (req, res) => {
  res.send("pong");
});

// 🎯 Catch-all for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
