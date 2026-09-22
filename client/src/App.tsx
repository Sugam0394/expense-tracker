 
  /* import { useEffect, useState } from "react";  




import { getExpenses } from "./api/expenseApi";
import type { Expense } from "./types/expense";
import "./App.css";

interface ExpenseFormData {
  amount: string;
  description: string;
  date: string;
  categoryId: string;
}

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: "",
    description: "",
    date: "",
    categoryId: "",
  });

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getExpenses();

        if (response.success && response.data) {
          setExpenses(response.data);
        } else {
          setError(response.message ?? "Failed to load expenses");
        }
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
        setError("Unable to connect to the server");
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, []);

  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  setFormError(null);

  const amount = Number(formData.amount);
  const categoryId = Number(formData.categoryId);

  if (!formData.amount) {
    setFormError("Amount is required");
    return;
  }

  if (amount <= 0 || Number.isNaN(amount)) {
    setFormError("Amount must be greater than 0");
    return;
  }

  if (!formData.description.trim()) {
    setFormError("Description is required");
    return;
  }

  if (!formData.date) {
    setFormError("Date is required");
    return;
  }

  if (!formData.categoryId) {
    setFormError("Category is required");
    return;
  }

  const expenseData = {
    amount,
    description: formData.description.trim(),
    date: formData.date,
    category_id: categoryId,
  };

  console.log("Prepared expense data:", expenseData);
};

  return (
    <div>
      <h1>Expense Tracker</h1>

      <form onSubmit={handleSubmit}>
        {formError && <p role="alert">{formError}</p>}

        <div>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            name="description"
            type="text"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            <option value="1">Food</option>
            <option value="2">Transport</option>
            <option value="3">Shopping</option>
            <option value="4">Bills</option>
            <option value="5">Entertainment</option>
            <option value="6">Other</option>
          </select>
        </div>

        <button type="submit">Add Expense</button>
      </form>

      {loading && <p>Loading expenses...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && expenses.length === 0 && (
        <p>No expenses found.</p>
      )}

      {expenses.map((expense) => (
        <div key={expense.id}>
          <p>Amount: {expense.amount}</p>
          <p>Description: {expense.description}</p>
          <p>Category: {expense.category}</p>
        </div>
      ))}
    </div>
  );
}

export default App;  */


 import { useEffect, useState, useCallback } from "react";
import { createExpense, getExpenses } from "./api/expenseApi";
import type { Expense } from "./types/expense";
import "./App.css";

interface ExpenseFormData {
  amount: string;
  description: string;
  date: string;
  categoryId: string;
}

interface FormErrors {
  amount?: string;
  description?: string;
  date?: string;
  categoryId?: string;
  general?: string;
}

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: "",
    description: "",
    date: "",
    categoryId: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Removed synchronous setState calls from the start of the function.
  // State is now only updated asynchronously after the fetch resolves.
  const loadExpenses = useCallback(async () => {
    try {
      const response = await getExpenses();

      if (response.success && response.data) {
        setExpenses(response.data);
        setError(null);
      } else {
        setError(response.message ?? "Failed to load expenses");
      }
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      setError("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear the specific field error as the user types/selects
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined,
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormErrors({});

    const newErrors: FormErrors = {};
    const amountNum = Number(formData.amount);
    const categoryIdNum = Number(formData.categoryId);

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (amountNum <= 0 || Number.isNaN(amountNum)) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
    const expenseData = {
  amount: amountNum,
  description: formData.description.trim(),
  date: formData.date,
  category_id: categoryIdNum,
};

      const response = await createExpense(expenseData);

      if (!response.success) {
        setFormErrors({
          general: response.message ?? "Failed to create expense",
        });
        return;
      }

      console.log("Expense created successfully:", response.data);

      // Reset form on success
      setFormData({
        amount: "",
        description: "",
        date: "",
        categoryId: "",
      });

      // Refresh the expense list to show the new item
      await loadExpenses();
    } catch (err) {
      console.error("Submission failed:", err);

      setFormErrors({
        general: "Unable to connect to the server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Expense Tracker</h1>

      <form onSubmit={handleSubmit}>
        {formErrors.general && <p role="alert" style={{ color: "red" }}>{formErrors.general}</p>}

        <div>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {formErrors.amount && <small style={{ color: "red", display: "block" }}>{formErrors.amount}</small>}
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            name="description"
            type="text"
            value={formData.description}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {formErrors.description && <small style={{ color: "red", display: "block" }}>{formErrors.description}</small>}
        </div>

        <div>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {formErrors.date && <small style={{ color: "red", display: "block" }}>{formErrors.date}</small>}
        </div>

        <div>
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="">Select category</option>
            <option value="1">Food</option>
            <option value="2">Transport</option>
            <option value="3">Shopping</option>
            <option value="4">Bills</option>
            <option value="5">Entertainment</option>
            <option value="6">Other</option>
          </select>
          {formErrors.categoryId && <small style={{ color: "red", display: "block" }}>{formErrors.categoryId}</small>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding Expense..." : "Add Expense"}
        </button>
      </form>

      {loading && <p>Loading expenses...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && expenses.length === 0 && (
        <p>No expenses found.</p>
      )}

      {expenses.map((expense) => (
        <div key={expense.id}>
          <p>Amount: {expense.amount}</p>
          <p>Description: {expense.description}</p>
          <p>Category: {expense.category}</p>
        </div>
      ))}
    </div>
  );
}

export default App;




