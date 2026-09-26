import type { NextFunction, Request, Response } from "express";
import type {
  AnalyticsFilters,
} from "../types/analytics.js";
import { getExpenseSummaryService, getCategorySummaryService } from "../services/expenseAnalyticsService.js";
import { AppError } from "../errors/AppError.js";

 export async function getExpenseSummaryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { category_id, min_amount, max_amount, search } = req.query;

    const filters: AnalyticsFilters = {};

    if (category_id !== undefined) {
      const categoryId = Number(category_id);

      if (!Number.isInteger(categoryId) || categoryId <= 0) {
        throw new AppError("Invalid category_id", 400);
      }

      filters.categoryId = categoryId;
    }

    if (min_amount !== undefined) {
      const minAmount = Number(min_amount);

      if (!Number.isFinite(minAmount) || minAmount < 0) {
        throw new AppError("Invalid min_amount", 400);
      }

      filters.minAmount = minAmount;
    }

    if (max_amount !== undefined) {
      const maxAmount = Number(max_amount);

      if (!Number.isFinite(maxAmount) || maxAmount < 0) {
        throw new AppError("Invalid max_amount", 400);
      }

      filters.maxAmount = maxAmount;
    }

    if (search !== undefined) {
  if (typeof search !== "string") {
    throw new AppError("Invalid search", 400);
  }

  filters.search = search;
}

    const summary = await getExpenseSummaryService(filters);

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
}

 export async function getCategorySummaryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      category_id,
      min_amount,
      max_amount,
      search,
    } = req.query;

    const filters: AnalyticsFilters = {};

    if (category_id !== undefined) {
      const categoryId = Number(category_id);

      if (!Number.isInteger(categoryId) || categoryId <= 0) {
        throw new AppError("Invalid category_id", 400);
      }

      filters.categoryId = categoryId;
    }

    if (min_amount !== undefined) {
      const minAmount = Number(min_amount);

      if (!Number.isFinite(minAmount) || minAmount < 0) {
        throw new AppError("Invalid min_amount", 400);
      }

      filters.minAmount = minAmount;
    }

    if (max_amount !== undefined) {
      const maxAmount = Number(max_amount);

      if (!Number.isFinite(maxAmount) || maxAmount < 0) {
        throw new AppError("Invalid max_amount", 400);
      }

      filters.maxAmount = maxAmount;
    }

    if (search !== undefined) {
      if (typeof search !== "string") {
        throw new AppError("Invalid search", 400);
      }

      filters.search = search;
    }

    const summary = await getCategorySummaryService(filters);

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
}
