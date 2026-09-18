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
  category_id: number;
  category?: string;
}

export interface UpdateExpenseInput {
  amount: number;
  description: string;
  date: string;
  category_id: number;
  category?: string;
}

export interface ExpenseResponse {
  id: number;
  amount: string;
  description: string;
  date: string;
  category: string;
}

export interface SingleExpenseResponse {
  success: true;
  data: ExpenseResponse;
}

export interface ExpenseListResponse {
  success: true;
  data: ExpenseResponse[];
}


