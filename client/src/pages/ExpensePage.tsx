import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { createExpense, getExpenses } from "../api/expenseApi";

import ExpenseForm from "../components/ExpenseForm/ExpenseForm";
import ExpenseList from "../components/ExpenseList/ExpenseList";

import type { Expense } from "../types/expense";

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

const initialFormData: ExpenseFormData = {
  amount: "",
  description: "",
  date: "",
  categoryId: "",
};

function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [formData, setFormData] =
    useState<ExpenseFormData>(initialFormData);

  const [formErrors, setFormErrors] =
    useState<FormErrors>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState("");

  const loadExpenses = async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const response = await getExpenses();

      if (response.success) {
        setExpenses(response.data ?? []);
      }
    } catch (error) {
      console.error("Failed to load expenses:", error);

      setLoadError(
        "Failed to load expenses. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadExpenses();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormErrors((previous) => ({
      ...previous,
      [name]: undefined,
      general: undefined,
    }));
     setSuccessMessage("");
  };

   

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    const amount = Number(formData.amount);

    if (!formData.amount) {
      errors.amount = "Amount is required.";
    } else if (Number.isNaN(amount) || amount <= 0) {
      errors.amount = "Amount must be greater than 0.";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required.";
    }

    if (!formData.date) {
      errors.date = "Date is required.";
    }

    if (!formData.categoryId) {
      errors.categoryId = "Category is required.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const expenseData = {
        amount: formData.amount,
        description: formData.description.trim(),
        date: formData.date,
        categoryId: Number(formData.categoryId),
      };

      const response = await createExpense(expenseData);

      if (response.success) {
  setFormData(initialFormData);
  setFormErrors({});

  setSuccessMessage("Expense added successfully.");

  await loadExpenses();
} else {
        setFormErrors({
          general:
            response.message || "Failed to create expense.",
        });
      }
    } catch (error: unknown) {
  console.error("Failed to create expense:", error);

  const message =
    error instanceof Error ? error.message :
    "Something went wrong. Please try again.";

  setFormErrors({
    general: message,
  });
} finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <h1>Expense Tracker</h1>

       <ExpenseForm
  formData={formData}
  formErrors={formErrors}
  isSubmitting={isSubmitting}
  onChange={handleChange}
  onSubmit={handleSubmit}
/>

      {successMessage && <p>{successMessage}</p>}

      <hr />

      {isLoading && <p>Loading expenses...</p>}

      {loadError && <p>{loadError}</p>}

      {!isLoading && !loadError && (
        <ExpenseList expenses={expenses} />
      )}
    </main>
  );
}

export default ExpensePage;
