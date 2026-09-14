import pool from "../config/database.js";
import type { Expense , CreateExpenseInput , UpdateExpenseInput } from "../types/expense.js";

export async function getExpenses(): Promise<Expense[]> {
  const [rows] = await pool.execute(`
    SELECT
      expenses.id,
      expenses.amount,
      expenses.description,
      expenses.date,
      categories.name AS category
    FROM expenses
    JOIN categories
      ON expenses.category_id = categories.id
  `);

  return rows as Expense[];
}

export async function getExpenseById(
  expenseId: number
): Promise<Expense | null> {
  const [rows] = await pool.execute(
    `
    SELECT
      expenses.id,
      expenses.amount,
      expenses.description,
      expenses.date,
      categories.name AS category
    FROM expenses
    JOIN categories
      ON expenses.category_id = categories.id
    WHERE expenses.id = ?
    `,
    [expenseId]
  );

  const expenses = rows as Expense[];

  return expenses[0] ?? null;
}

export async function createExpense(
  expense: CreateExpenseInput
): Promise<number> {
  const [result] = await pool.execute(
    `
    INSERT INTO expenses
      (amount, description, date, category_id)
    VALUES
      (?, ?, ?, ?)
    `,
    [
      expense.amount,
      expense.description,
      expense.date,
      expense.category_id
    ]
  );

  const insertResult = result as { insertId: number };

  return insertResult.insertId;
}

export async function updateExpense(
  expenseId: number,
  expense: UpdateExpenseInput
): Promise<boolean> {
  const [result] = await pool.execute(
    `
    UPDATE expenses
    SET
      amount = ?,
      description = ?,
      date = ?,
      category_id = ?
    WHERE id = ?
    `,
    [
      expense.amount,
      expense.description,
      expense.date,
      expense.category_id,
      expenseId
    ]
  );

  const updateResult = result as { affectedRows: number };

  return updateResult.affectedRows > 0;
}

export async function deleteExpense(
  expenseId: number
): Promise<boolean> {
  const [result] = await pool.execute(
    `
    DELETE FROM expenses
    WHERE id = ?
    `,
    [expenseId]
  );

  const deleteResult = result as { affectedRows: number };

  return deleteResult.affectedRows > 0;
}