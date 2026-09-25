import { getExpenseSummary, getCategorySummary } from "../repositories/expenseAnalytisRepository.js";
import type { CategorySummary, ExpenseSummary } from "../types/analytics.js";

 export async function getExpenseSummaryService(
  categoryId?: number
): Promise<ExpenseSummary> {
  return await getExpenseSummary(categoryId);
}

export async function getCategorySummaryService(): Promise<CategorySummary[]> {
  return await getCategorySummary();
}