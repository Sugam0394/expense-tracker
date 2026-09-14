 import { Router } from "express";
import { getExpenses } from "../controllers/expressController.js";

const router = Router();

router.get("/expenses", getExpenses);

export default router;