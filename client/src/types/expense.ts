export interface Expense {
  id: number;
  amount: string;
  description: string;
  date: string;
  category: string;
}

 export interface CreateExpenseInput {
  amount: number;
  description: string;
  date: string;
  categoryId: number;
}

export interface UpdateExpenseInput {
  amount: number;
  description: string;
  date: string;
  categoryId: number;
}

export interface ExpenseFilters {
  category_id?: number;
  min_amount?: number;
  max_amount?: number;
  search?: string;
}