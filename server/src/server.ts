 import "dotenv/config";
import express from "express";
import cors from "cors";
import expressRoutes from "./routes/expenseRoutes.js";
import expenseAnalyticsRoutes from "./routes/expensesAnalyticsRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Root route
app.get("/", (_req, res) => {
  res.json({
    message: "Expense Tracker API is running",
  });
});

// Mount analytics before the general expense routes. The analytics router has
// a static `/summary` route, while the general router has `/expenses/:id`.
// If the general router is mounted first, `summary` is treated as an ID.
app.use("/api/expenses", expenseAnalyticsRoutes);
app.use("/api", expressRoutes);














app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
