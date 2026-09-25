import type { Request, Response } from "express";

import { getExpenseSummaryService, getCategorySummaryService } from "../services/expenseAnalyticsService.js";

 export async function getExpenseSummaryController(
  req: Request,
  res: Response
) {
  try {
    const { category_id } = req.query;

    const categoryId = category_id
      ? Number(category_id)
      : undefined;

    const summary = await getExpenseSummaryService(categoryId);

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
    const summary = await getCategorySummaryService();

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