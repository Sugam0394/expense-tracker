import api from "./apiClient"

import type {
  ExpenseSummary,
  CategorySummary,
} from "../types/analytics";
 

export async function getExpenseSummary(): Promise<ExpenseSummary> {
  const response = await api.get("/api/expenses/summary");

  return response.data.data;
}

export async function getCategorySummary(): Promise<CategorySummary[]> {
  const response = await api.get("/api/expenses/categories");

  return response.data.data;
}