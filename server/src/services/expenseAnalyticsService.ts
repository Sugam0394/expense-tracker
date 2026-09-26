import { getExpenseSummary, getCategorySummary,  } from "../repositories/expenseAnalytisRepository.js";
import type { CategorySummary, ExpenseSummary, AnalyticsFilters } from "../types/analytics.js";
import { AppError } from "../errors/AppError.js";

function validateAnalyticsFilters(filters: AnalyticsFilters): void {
  if (
    filters.categoryId !== undefined &&
    (!Number.isInteger(filters.categoryId) || filters.categoryId <= 0)
  ) {
    throw new AppError("Invalid category_id", 400);
  }

  if (
    filters.minAmount !== undefined &&
    (!Number.isFinite(filters.minAmount) || filters.minAmount < 0)
  ) {
    throw new AppError("Invalid min_amount", 400);
  }

  if (
    filters.maxAmount !== undefined &&
    (!Number.isFinite(filters.maxAmount) || filters.maxAmount < 0)
  ) {
    throw new AppError("Invalid max_amount", 400);
  }

  if (
    filters.minAmount !== undefined &&
    filters.maxAmount !== undefined &&
    filters.minAmount > filters.maxAmount
  ) {
    throw new AppError(
      "Minimum amount cannot be greater than maximum amount",
      400
    );
  }
}

 export async function getExpenseSummaryService(
  filters: AnalyticsFilters = {}
): Promise<ExpenseSummary> {
  validateAnalyticsFilters(filters);
  return await getExpenseSummary(filters);
}

 export async function getCategorySummaryService(
  filters: AnalyticsFilters = {}
): Promise<CategorySummary[]> {
  validateAnalyticsFilters(filters);
  return await getCategorySummary(filters);
}
