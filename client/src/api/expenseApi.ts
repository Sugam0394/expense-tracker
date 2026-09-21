import apiClient from "./apiClient";
import type { ApiResponse } from "../types/api";
import type { Expense } from "../types/expense";

export const getExpenses = async (): Promise<ApiResponse<Expense[]>> => {
  const response = await apiClient.get<ApiResponse<Expense[]>>("/api/expenses");

  return response.data;
};