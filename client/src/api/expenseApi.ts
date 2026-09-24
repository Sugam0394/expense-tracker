 import apiClient from "./apiClient";
import type { ApiResponse } from "../types/api";
import type { Expense, UpdateExpenseInput, CreateExpenseInput } from "../types/expense";
import type { ExpenseFilters } from "../types/expense";

export const getExpenses = async (
  filters: ExpenseFilters = {}
): Promise<ApiResponse<Expense[]>> => {
  const params = {
    category_id: filters.category_id,
    min_amount: filters.min_amount,
    max_amount: filters.max_amount,
    search: filters.search,
  };

  const response = await apiClient.get<ApiResponse<Expense[]>>("/api/expenses", {
    params,
  });

  return response.data;
};

export const getExpenseById = async (
  id: number
): Promise<ApiResponse<Expense>> => {
  const response = await apiClient.get<ApiResponse<Expense>>(
    `/api/expenses/${id}`
  );

  return response.data;
};

export const createExpense = async (
  input: CreateExpenseInput
): Promise<ApiResponse<Expense>> => {
  const response = await apiClient.post<ApiResponse<Expense>>(
    "/api/create",
    {
      amount: input.amount,
      description: input.description,
      date: input.date,
      category_id: input.categoryId,
    }
  );

  return response.data;
};

export const updateExpense = async (
  id: number,
  input: UpdateExpenseInput
): Promise<ApiResponse<Expense>> => {
  const response = await apiClient.put<ApiResponse<Expense>>(
    `/api/update/${id}`,
    {
      amount: input.amount,
      description: input.description,
      date: input.date,
      category_id: input.categoryId,
    }
  );

  return response.data;
};

export const deleteExpense = async (
  id: number
): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/api/delete/${id}`
  );

  return response.data;
};
 
