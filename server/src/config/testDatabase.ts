 /* import pool from "./database.js";

export async function testDatabaseConnection() {
  try {
    const expenseId = 2;

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

    console.log("✅ Expense fetched successfully:");
    console.log(rows);
  } catch (error) {
    console.error("❌ Database query failed:", error);
  }
} */ 

/* import {
  deleteExpense,
  getExpenseById
} from "../repositories/expenseRepository.js";

export async function testDatabaseConnection() {
  try {
    const deleted = await deleteExpense(3);

    console.log("✅ Expense delete result:", deleted);

    const expense = await getExpenseById(3);

    console.log("✅ Expense after delete:");
    console.log(expense);
  } catch (error) {
    console.error("❌ Repository test failed:", error);
  }
} */