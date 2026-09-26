import { getExpenseSummary, getCategorySummary,  } from "../repositories/expenseAnalytisRepository.js";
import type { CategorySummary, ExpenseSummary, AnalyticsFilters } from "../types/analytics.js";

 export async function getExpenseSummaryService(
  filters: AnalyticsFilters = {}
): Promise<ExpenseSummary> {
  return await getExpenseSummary(filters);
}

 export async function getCategorySummaryService(
  filters: AnalyticsFilters = {}
): Promise<CategorySummary[]> {
  return await getCategorySummary(filters);
}