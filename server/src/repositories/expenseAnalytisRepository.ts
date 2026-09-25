 import pool from "../config/database.js";
import type { ExpenseSummary, CategorySummary } from "../types/analytics.js";

 export async function getExpenseSummary(
  categoryId?: number
): Promise<ExpenseSummary> {
  const [rows] = await pool.execute(
    `
      SELECT
        SUM(amount) AS totalAmount,
        COUNT(*) AS expenseCount
      FROM expenses
      WHERE (? IS NULL OR category_id = ?)
    `,
    [categoryId ?? null, categoryId ?? null]
  );

  const summary = rows as ExpenseSummary[];

  return summary[0] ?? {
    totalAmount: "0.00",
    expenseCount: 0,
  };
}

export async function getCategorySummary(categoryId?: number): Promise<CategorySummary[]> {
  const [rows] = await pool.execute(`
    SELECT
      categories.name AS category,
      SUM(expenses.amount) AS totalAmount
    FROM expenses
    JOIN categories
      ON expenses.category_id = categories.id
    GROUP BY categories.name
  `);

  return rows as CategorySummary[];
}