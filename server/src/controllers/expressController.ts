import type { Request, Response } from "express";
import type { ExpenseListResponse , ExpenseResponse, SingleExpenseResponse } from "../types/expense.js";
import {
  createExpenseService,
  getExpensesService,
  getExpenseByIdService,
  updateExpenseService,
  deleteExpenseService,
} from "../services/expense.service.js";



// Create expense
export const createExpenseController = async (
  req: Request,
  res: Response
) => {
  try {
    const expense = req.body;

    const expenseId = await createExpenseService(expense);

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: {
        id: expenseId,
      },
    });
  } catch (error) {
    console.error("Error creating expense:", error);


        if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }



    res.status(500).json({
      success: false,
      message: "Failed to create expense",
    });
  }
};
 
 // Get all expenses
export const getExpensesController = async (
  req: Request,
  res: Response
) => {
  try {
    const expenses = await getExpensesService();

    const responseData: ExpenseResponse[] = expenses.map((expense) => ({
      id: expense.id,
      amount: expense.amount,
      description: expense.description,
      date: expense.date,
      category: expense.category,
    }));

    const response: ExpenseListResponse = {
      success: true,
      data: responseData,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching expenses:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
    });
  }
};

// Get expense by ID
export const getExpenseByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const expense = await getExpenseByIdService(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    const responseData: ExpenseResponse = {
      id: expense.id,
      amount: expense.amount,
      description: expense.description,
      date: expense.date,
      category: expense.category,
    };


    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching expense:", error);


     if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }


    res.status(500).json({
      success: false,
      message: "Failed to fetch expense",
    });
  }
};

// Update expense
export const updateExpenseController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const expense = req.body;

    const updatedExpense = await updateExpenseService(id, expense);

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
    });
  } catch (error) {
    console.error("Error updating expense:", error);

    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update expense",
    });
  }
};

// Delete expense
export const deleteExpenseController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const deletedExpense = await deleteExpenseService(id);

    if (!deletedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting expense:", error);


       if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete expense",
    });
  }
};
