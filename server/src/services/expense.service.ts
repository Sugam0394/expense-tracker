 import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  categoryExists
} from "../repositories/expenseRepository.js";

import type {
  CreateExpenseInput,
  UpdateExpenseInput,
  Expense,
  ExpenseFilters
} from "../types/expense.js";

import { AppError } from "../errors/AppError.js";


// Create expense
 export const createExpenseService = async (
  expense: CreateExpenseInput
): Promise<number> => {
  // Business rule: amount must be greater than 0
  if (!Number.isFinite(expense.amount) || expense.amount <= 0) {
    throw new AppError("Expense amount must be greater than 0", 400);
  }

  // Business rule: description is required
  if (!expense.description?.trim()) {
    throw new AppError("Expense description is required", 400);
  }

  // Business rule: date is required
  if (!expense.date) {
    throw new AppError("Expense date is required", 400);
  }

  // Business rule: category ID is required
  if (!Number.isInteger(expense.category_id) || expense.category_id <= 0) {
    throw new AppError("Valid expense category is required", 400);
  }

  // Business rule: category must exist
  const exists = await categoryExists(expense.category_id);

  if (!exists) {
    throw new AppError("Category not found", 404);
  }

  return await createExpense(expense);
};

// Get all expenses
 export const getExpensesService = async (
  filters: ExpenseFilters = {}
): Promise<Expense[]> => {
  if (
    filters.category_id !== undefined &&
    (!Number.isInteger(filters.category_id) || filters.category_id <= 0)
  ) {
    throw new AppError("Invalid category ID", 400);
  }

  if (
    filters.min_amount !== undefined &&
    (!Number.isFinite(filters.min_amount) || filters.min_amount < 0)
  ) {
    throw new AppError("Invalid minimum amount", 400);
  }

  if (
    filters.max_amount !== undefined &&
    (!Number.isFinite(filters.max_amount) || filters.max_amount < 0)
  ) {
    throw new AppError("Invalid maximum amount", 400);
  }

  if (
    filters.min_amount !== undefined &&
    filters.max_amount !== undefined &&
    filters.min_amount > filters.max_amount
  ) {
    throw new AppError(
      "Minimum amount cannot be greater than maximum amount",
      400
    );
  }

  return await getExpenses(filters);
};

// Get expense by ID
export const getExpenseByIdService = async (id: number) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("Invalid expense ID", 400);
  }

  const expense = await getExpenseById(id);

  if (!expense) {
    throw new AppError("Expense not found", 404);
  }

  return expense;
};

// Update expense
 export const updateExpenseService = async (
  id: number,
  expense: UpdateExpenseInput
) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("Invalid expense ID", 400);
  }

  if (
    expense.amount !== undefined &&
    (!Number.isFinite(expense.amount) || expense.amount <= 0)
  ) {
    throw new AppError("Expense amount must be greater than 0", 400);
  }

  if (
    expense.description !== undefined &&
    !expense.description.trim()
  ) {
    throw new AppError("Expense description cannot be empty", 400);
  }

  if (expense.date !== undefined && !expense.date) {
    throw new AppError("Expense date cannot be empty", 400);
  }

  if (
    expense.category_id !== undefined &&
    (!Number.isInteger(expense.category_id) || expense.category_id <= 0)
  ) {
    throw new AppError("Valid expense category is required", 400);
  }

  if (expense.category_id !== undefined) {
  const exists = await categoryExists(expense.category_id);

  if (!exists) {
    throw new AppError("Category not found", 404);
  }
}

  const updatedExpense = await updateExpense(id, expense);

  if (!updatedExpense) {
    throw new AppError("Expense not found", 404);
  }

  return updatedExpense;
};

// Delete expense
export const deleteExpenseService = async (id: number) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("Invalid expense ID", 400);
  }

  const deleted = await deleteExpense(id);

  if (!deleted) {
    throw new AppError("Expense not found", 404);
  }

  return deleted;
};
