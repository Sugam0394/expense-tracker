 import type { Request, Response } from "express";

export const getExpenses = (_req: Request, res: Response) => {
  res.json({
    message: "GET expenses controller is working",
  });
};