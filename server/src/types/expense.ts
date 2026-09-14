

export interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
  category: string;
}

export interface CreateExpenseInput {
  amount: number;
  description: string;
  date: string;
  category_id: number;
}

export interface UpdateExpenseInput {
  amount: number;
  description: string;
  date: string;
  category_id: number;
}