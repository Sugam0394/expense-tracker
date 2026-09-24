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

// Create expense
 export const createExpenseService = async (
  expense: CreateExpenseInput
): Promise<number> => {
  // Business rule: amount must be greater than 0
  if (expense.amount <= 0) {
    throw new Error("Expense amount must be greater than 0");
  }

  // Business rule: description is required
  if (!expense.description?.trim()) {
    throw new Error("Expense description is required");
  }

  // Business rule: date is required
  if (!expense.date) {
    throw new Error("Expense date is required");
  }

  // Business rule: category ID is required
  if (!Number.isInteger(expense.category_id) || expense.category_id <= 0) {
    throw new Error("Valid expense category is required");
  }

  // Business rule: category must exist
  const exists = await categoryExists(expense.category_id);

  if (!exists) {
    throw new Error("Category not found");
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
    throw new Error("Invalid category ID");
  }

  if (
    filters.min_amount !== undefined &&
    filters.min_amount < 0
  ) {
    throw new Error("Minimum amount cannot be negative");
  }

  if (
    filters.max_amount !== undefined &&
    filters.max_amount < 0
  ) {
    throw new Error("Maximum amount cannot be negative");
  }

  if (
    filters.min_amount !== undefined &&
    filters.max_amount !== undefined &&
    filters.min_amount > filters.max_amount
  ) {
    throw new Error(
      "Minimum amount cannot be greater than maximum amount"
    );
  }

  return await getExpenses(filters);
};

// Get expense by ID
export const getExpenseByIdService = async (id: number) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid expense ID");
  }

  return await getExpenseById(id);
};

// Update expense
 export const updateExpenseService = async (
  id: number,
  expense: UpdateExpenseInput
) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid expense ID");
  }

  if (expense.amount !== undefined && expense.amount <= 0) {
    throw new Error("Expense amount must be greater than 0");
  }

  if (
    expense.description !== undefined &&
    !expense.description.trim()
  ) {
    throw new Error("Expense description cannot be empty");
  }

  if (expense.date !== undefined && !expense.date) {
    throw new Error("Expense date cannot be empty");
  }

  if (
    expense.category_id !== undefined &&
    (!Number.isInteger(expense.category_id) || expense.category_id <= 0)
  ) {
    throw new Error("Valid expense category is required");
  }

  if (expense.category_id !== undefined) {
  const exists = await categoryExists(expense.category_id);

  if (!exists) {
    throw new Error("Category not found");
  }
}

  return await updateExpense(id, expense);
};

// Delete expense
export const deleteExpenseService = async (id: number) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid expense ID");
  }

  return await deleteExpense(id);
};