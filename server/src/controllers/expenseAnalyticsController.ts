import type { Request, Response } from "express";
import type {
  AnalyticsFilters,
} from "../types/analytics.js";
import { getExpenseSummaryService, getCategorySummaryService } from "../services/expenseAnalyticsService.js";

 export async function getExpenseSummaryController(
  req: Request,
  res: Response
) {
  try {
    const { category_id, min_amount, max_amount, search } = req.query;

    const filters: AnalyticsFilters = {};

    if (category_id !== undefined) {
      const categoryId = Number(category_id);

      if (!Number.isInteger(categoryId) || categoryId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid category_id",
        });
      }

      filters.categoryId = categoryId;
    }

    if (min_amount !== undefined) {
      const minAmount = Number(min_amount);

      if (!Number.isFinite(minAmount) || minAmount < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid min_amount",
        });
      }

      filters.minAmount = minAmount;
    }

    if (max_amount !== undefined) {
      const maxAmount = Number(max_amount);

      if (!Number.isFinite(maxAmount) || maxAmount < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid max_amount",
        });
      }

      filters.maxAmount = maxAmount;
    }

    if (search !== undefined) {
  if (typeof search !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid search",
    });
  }

  filters.search = search;
}

    const summary = await getExpenseSummaryService(filters);

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to get expense summary",
    });
  }
}

 export async function getCategorySummaryController(
  req: Request,
  res: Response
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
        return res.status(400).json({
          success: false,
          message: "Invalid category_id",
        });
      }

      filters.categoryId = categoryId;
    }

    if (min_amount !== undefined) {
      const minAmount = Number(min_amount);

      if (!Number.isFinite(minAmount) || minAmount < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid min_amount",
        });
      }

      filters.minAmount = minAmount;
    }

    if (max_amount !== undefined) {
      const maxAmount = Number(max_amount);

      if (!Number.isFinite(maxAmount) || maxAmount < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid max_amount",
        });
      }

      filters.maxAmount = maxAmount;
    }

    if (search !== undefined) {
      if (typeof search !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid search",
        });
      }

      filters.search = search;
    }

    const summary = await getCategorySummaryService(filters);

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to get category summary",
    });
  }
}