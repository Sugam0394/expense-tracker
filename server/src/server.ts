 import "dotenv/config";
import express from "express";
import testDatabaseConnection from "./config/testDatabase.js"


const app = express();


const PORT = process.env.PORT || 5000;

testDatabaseConnection();

app.get("/", (_req, res) => {
  res.json({
    message: "Expense Tracker API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});