// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

// ✅ Create MySQL pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
  port: process.env.MYSQL_PORT || 3306,
  ssl: {
    rejectUnauthorized: false // ✅ Required for Zeabur's remote DB
  }
});

// ✅ Get all opportunities
app.get("/opportunities", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM opportunities ORDER BY deadline ASC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching opportunities:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add new opportunity
app.post("/opportunities", async (req, res) => {
  const { company, title, category, deadline } = req.body;
  if (!company || !title || !category || !deadline) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO opportunities (company, title, category, deadline) VALUES (?, ?, ?, ?)`,
      [company, title, category, deadline]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Health check
app.get("/ping", (req, res) => res.send("pong"));

// ✅ Serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
