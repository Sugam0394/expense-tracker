 import { Router } from "express";
import { getExpenseById, getExpenses, createExpense, updateExpense, deleteExpense } from "../controllers/expressController.js";

const router = Router();


// routes for expenses

router.get("/expenses", getExpenses);
router.get("/expenses/:id", getExpenseById);
router.post("/expenses", createExpense)
router.put("/expenses/:id", updateExpense);
router.delete("/expenses/:id", deleteExpense);

export default router;  