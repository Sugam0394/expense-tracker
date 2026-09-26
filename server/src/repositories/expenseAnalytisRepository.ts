 import pool from "../config/database.js";
import type { ExpenseSummary, CategorySummary, AnalyticsFilters } from "../types/analytics.js";

 export async function getExpenseSummary(
  filters: AnalyticsFilters = {}
): Promise<ExpenseSummary> {
  const conditions: string[] = [];
  const values: (number | string)[] = [];

  if (filters.categoryId !== undefined) {
    conditions.push("category_id = ?");
    values.push(filters.categoryId);
  }

  if (filters.minAmount !== undefined) {
    conditions.push("amount >= ?");
    values.push(filters.minAmount);
  }

  if (filters.maxAmount !== undefined) {
    conditions.push("amount <= ?");
    values.push(filters.maxAmount);
  }

  if (filters.search !== undefined && filters.search.trim() !== "") {
  conditions.push("description LIKE ?");
  values.push(`%${filters.search.trim()}%`);
}

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  const [rows] = await pool.execute(
  `
    SELECT
      COALESCE(SUM(amount), 0.00) AS totalAmount,
      COUNT(*) AS expenseCount
    FROM expenses
    ${whereClause}
  `,
  values
);

  const summary = rows as ExpenseSummary[];

  return summary[0] ?? {
    totalAmount: "0.00",
    expenseCount: 0,
  };
}

 export async function getCategorySummary(
  filters: AnalyticsFilters = {}
): Promise<CategorySummary[]> {
  const conditions: string[] = [];
  const values: (number | string)[] = [];

  if (filters.categoryId !== undefined) {
    conditions.push("expenses.category_id = ?");
    values.push(filters.categoryId);
  }

  if (filters.minAmount !== undefined) {
    conditions.push("expenses.amount >= ?");
    values.push(filters.minAmount);
  }

  if (filters.maxAmount !== undefined) {
    conditions.push("expenses.amount <= ?");
    values.push(filters.maxAmount);
  }

  if (filters.search !== undefined && filters.search.trim() !== "") {
    conditions.push("expenses.description LIKE ?");
    values.push(`%${filters.search.trim()}%`);
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  const [rows] = await pool.execute(
    `
      SELECT
        categories.name AS category,
        COALESCE(SUM(expenses.amount), 0.00) AS totalAmount
      FROM expenses
      JOIN categories
        ON expenses.category_id = categories.id
      ${whereClause}
      GROUP BY categories.name
    `,
    values
  );

  return rows as CategorySummary[];
}