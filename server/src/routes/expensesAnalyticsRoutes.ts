import { Router } from "express";

import {
  getExpenseSummaryController,
  getCategorySummaryController
} from "../controllers/expenseAnalyticsController.js";

const router = Router();

router.get("/summary", getExpenseSummaryController);
router.get("/categories", getCategorySummaryController);

export default router;
