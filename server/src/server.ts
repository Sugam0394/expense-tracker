 import "dotenv/config";
import express from "express";
import expressRoutes from "./routes/expenseRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Root route
app.get("/", (_req, res) => {
  res.json({
    message: "Expense Tracker API is running",
  });
});

// Mount the expense routes
app.use("/api", expressRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});