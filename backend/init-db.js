import sqlite3 from "sqlite3";
import { open } from "sqlite";

const seed = async () => {
  const db = await open({
    filename: "./data.db",
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS opportunities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      company TEXT,
      category TEXT,
      deadline TEXT
    );
  `);

  await db.run("DELETE FROM opportunities");

  const data = [
    { title: "Goldman Sachs India Hackathon 2025", company: "Goldman Sachs", category: "Hackathon", deadline: "2025-04-01" },
    { title: "GeoAI Hackathon 2025", company: "IISc Bangalore", category: "Hackathon", deadline: "2025-04-10" },
    { title: "Deloitte Spark Hackathon 2025", company: "Deloitte", category: "Hackathon", deadline: "2025-02-28" },
    { title: "Google Girl Hackathon 2025", company: "Google", category: "Hackathon", deadline: "2025-02-15" },
    { title: "HSBC Technology India Hackathon 2025", company: "HSBC", category: "Hackathon", deadline: "2025-03-01" },
    { title: "Morgan Stanley India Code to Give Hackathon 2025", company: "Morgan Stanley", category: "Hackathon", deadline: "2025-03-15" },
    { title: "Adobe Women-in-Tech Internship 2025", company: "Adobe", category: "Women-only", deadline: "2025-08-01" }
  ];

  for (const item of data) {
    await db.run("INSERT INTO opportunities (title, company, category, deadline) VALUES (?, ?, ?, ?)", [
      item.title, item.company, item.category, item.deadline
    ]);
  }

  console.log("Database initialized with seed data");
};

seed();