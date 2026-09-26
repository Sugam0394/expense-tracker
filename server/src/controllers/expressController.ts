import type { NextFunction, Request, Response } from "express";
import type { ExpenseListResponse , ExpenseResponse, SingleExpenseResponse, ExpenseFilters } from "../types/expense.js";
import {
  createExpenseService,
  getExpensesService,
  getExpenseByIdService,
  updateExpenseService,
  deleteExpenseService,
} from "../services/expense.service.js";
import { AppError } from "../errors/AppError.js";

const parseExpenseId = (req: Request): number => {
  const rawId = req.params.id;
  const id = Number(rawId);

  if (!rawId || !Number.isInteger(id) || id <= 0) {
    throw new AppError(`Invalid expense ID: ${rawId ?? "missing"}`, 400);
  }

  return id;
};


// Create expense
export const createExpenseController = async (
  req: Request,
  res: Response,
  next: NextFunction
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
    next(error);
  }
};
 
 // Get all expenses
 export const getExpensesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      category_id,
      min_amount,
      max_amount
    } = req.query;

    const filters: ExpenseFilters = {};

    if (category_id !== undefined) {
      filters.category_id = Number(category_id);
    }

    if (min_amount !== undefined) {
      filters.min_amount = Number(min_amount);
    }

    if (max_amount !== undefined) {
      filters.max_amount = Number(max_amount);
    }

    const expenses = await getExpensesService(filters);

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
    next(error);
  }
};
// Get expense by ID
export const getExpenseByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseExpenseId(req);

    const expense = await getExpenseByIdService(id);

    const responseData: ExpenseResponse = {
      id: expense.id,
      amount: expense.amount,
      description: expense.description,
      date: expense.date,
      category: expense.category,
    };


  const response: SingleExpenseResponse = {
  success: true,
  data: responseData,
};

res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

 // Update expense
export const updateExpenseController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseExpenseId(req);
    const expense = req.body;

    const updatedExpense = await updateExpenseService(id, expense);

    res.status(200).json({
      success: true,
      data: {
        id: updatedExpense.id,
        amount: updatedExpense.amount,
        description: updatedExpense.description,
        date: updatedExpense.date,
        category: updatedExpense.category,
      },
    });
  } catch (error) {
    next(error);
  }
};
// Delete expense
export const deleteExpenseController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseExpenseId(req);

    await deleteExpenseService(id);

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
