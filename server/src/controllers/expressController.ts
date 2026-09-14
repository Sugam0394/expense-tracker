 import type { Request, Response } from "express";
import {
  getExpenses as getExpensesFromRepository,
  getExpenseById as getExpenseByIdFromRepository,
  createExpense as createExpenseInRepository,
  updateExpense as updateExpenseFromRepository,
  deleteExpense as deleteExpenseFromRepository,
} from "../repositories/expenseRepository.js";

export const getExpenses = async (_req: Request, res: Response) => {
  const expenses = await getExpensesFromRepository();

  res.json(expenses);
};

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // Call the repository function instead of the controller itself
    const expense = await getExpenseByIdFromRepository(id);

    if (!expense) {
      res.status(404).json({
        message: "Expense not found",
      });
      return;
    }

    res.status(200).json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);

    res.status(500).json({
      message: "Failed to fetch expense",
    });
  }
};

export const createExpense = async (req: Request, res: Response) => {
  try {
    const { amount, description, date, category_id } = req.body;

    const expenseId = await createExpenseInRepository({
      amount,
      description,
      date,
      category_id,
    });

    res.status(201).json({
      message: "Expense created successfully",
      id: expenseId,
    });
  } catch (error) {
    console.error("Error creating expense:", error);

    res.status(500).json({
      message: "Failed to create expense",
    });
  }
};

 export const updateExpense = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { amount, description, date, category_id } = req.body;

    // Pass the fields as a single object to match the repository's UpdateExpenseInput type
    const success = await updateExpenseFromRepository(id, {
      amount,
      description,
      date,
      category_id,
    });

    // The repository returns a boolean (true if successful, false if not found)
    if (!success) {
      res.status(404).json({
        message: "Expense not found",
      });
      return;
    }

    res.status(200).json({
      message: "Expense updated successfully",
    });
  } catch (error) {
    console.error("Error updating expense:", error);

    res.status(500).json({
      message: "Failed to update expense",
    });
  }
};

 export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const result = await deleteExpenseFromRepository(id);

    if (!result) {
      res.status(404).json({
        message: "Expense not found",
      });
      return;
    }

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting expense:", error);

    res.status(500).json({
      message: "Failed to delete expense",
    });
  }
};