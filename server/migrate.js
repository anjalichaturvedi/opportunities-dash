// migrate.js

import sqlite3 from "sqlite3";
import pkg from "pg";
import "dotenv/config";

const { Pool } = pkg;

// Setup PostgreSQL connection
const pgPool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || 5432,
  ssl: false,
});

// Setup SQLite connection
const sqliteDB = new sqlite3.Database("./opportunities.db", sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error("❌ Failed to connect to SQLite:", err.message);
    process.exit(1);
  }
});

await pgPool.query(`
  CREATE TABLE IF NOT EXISTS opportunities (
    id SERIAL PRIMARY KEY,
    company TEXT,
    title TEXT,
    category TEXT,
    deadline TEXT
  );
`);
    console.log("✅ PostgreSQL table ensured");
// Main migration function
const migrate = async () => {
  try {
    const rows = await new Promise((resolve, reject) => {
      sqliteDB.all("SELECT * FROM opportunities", [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    for (const row of rows) {
      const { company, title, category, deadline } = row;
      await pgPool.query(
        `INSERT INTO opportunities (company, title, category, deadline) VALUES ($1, $2, $3, $4)`,
        [company, title, category, deadline]
      );
    }

    console.log(`✅ Migrated ${rows.length} rows to PostgreSQL`);
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  } finally {
    sqliteDB.close();
    pgPool.end();
  }
};

migrate();
