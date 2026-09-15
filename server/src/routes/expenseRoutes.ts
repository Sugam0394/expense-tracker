 import { Router } from "express";
 import {
  createExpenseController as createExpense,
  getExpensesController as getExpenses,
  getExpenseByIdController as getExpenseById,
  updateExpenseController as updateExpense,
  deleteExpenseController as deleteExpense,
} from "../controllers/expressController.js";

const router = Router();


// routes for expenses

router.get("/expenses", getExpenses);
router.get("/expenses/:id", getExpenseById);
router.post("/expenses", createExpense)
router.put("/expenses/:id", updateExpense);
router.delete("/expenses/:id", deleteExpense);

export default router;  
