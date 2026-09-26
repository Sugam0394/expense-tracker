 import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";

import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
} from "../api/expenseApi";

import ExpenseForm from "../components/ExpenseForm/ExpenseForm";
import ExpenseList from "../components/ExpenseList/ExpenseList";
import ExpenseAnalytics from "../components/ExpenseAnalytics/ExpenseAnalytics";

import type { Expense } from "../types/expense";
import type { ExpenseFilters } from "../types/expense";

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

const categoryMap: Record<string, string> = {
  Food: "1",
  Transport: "2",
  Shopping: "3",
  Bills: "4",
  Entertainment: "5",
  Other: "6",
};

function ExpensePage() {
  /* =====================================================
     STATE
     ===================================================== */

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>({});

  const [selectedExpense, setSelectedExpense] =
    useState<Expense | null>(null);

  const [formData, setFormData] =
    useState<ExpenseFormData>(initialFormData);

  const [formErrors, setFormErrors] =
    useState<FormErrors>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState("");

  const [filterForm, setFilterForm] = useState({
    categoryId: "",
    minAmount: "",
    maxAmount: "",
  });

  /* =====================================================
     LOAD EXPENSES (WITH CURRENT FILTERS)
     ===================================================== */

  const loadExpenses = async (currentFilters: ExpenseFilters = filters) => {
    try {
      setIsLoading(true);
      setLoadError("");

      const response = await getExpenses(currentFilters);

      if (response.success) {
        const loadedExpenses = response.data ?? [];
        setExpenses(loadedExpenses);

        if (selectedExpense) {
          const stillExists = loadedExpenses.some(
            (expense) => expense.id === selectedExpense.id
          );

          if (!stillExists) {
            setSelectedExpense(null);
            setFormData(initialFormData);
            setFormErrors({});
          }
        }
      }
    } catch (error) {
      console.error("Failed to load expenses:", error);
      setLoadError("Failed to load expenses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* =====================================================
     INITIAL LOAD
     ===================================================== */

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadExpenses({});
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  /* =====================================================
     APPLY & CLEAR FILTER HANDLERS
     ===================================================== */

  const handleApplyFilters = async () => {
    const newFilters: ExpenseFilters = {};

    if (filterForm.categoryId !== "") {
      newFilters.category_id = Number(filterForm.categoryId);
    }

    if (filterForm.minAmount !== "") {
      newFilters.min_amount = Number(filterForm.minAmount);
    }

    if (filterForm.maxAmount !== "") {
      newFilters.max_amount = Number(filterForm.maxAmount);
    }

    setFilters(newFilters);
    await loadExpenses(newFilters);
  };

  const handleClearFilters = async () => {
    setFilterForm({
      categoryId: "",
      minAmount: "",
      maxAmount: "",
    });

    setFilters({});
    await loadExpenses({});
  };

  /* =====================================================
     PREFILL FORM WHEN EDITING
     ===================================================== */

  useEffect(() => {
    if (!selectedExpense) {
      return;
    }

    setFormData({
      amount: selectedExpense.amount,
      description: selectedExpense.description,
      date: selectedExpense.date.slice(0, 10),
      categoryId: categoryMap[selectedExpense.category] ?? "",
    });

    setFormErrors({});
    setSuccessMessage("");
  }, [selectedExpense]);

  /* =====================================================
     FORM CHANGE
     ===================================================== */

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  /* =====================================================
     FORM VALIDATION
     ===================================================== */

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

  /* =====================================================
     CREATE / UPDATE
     ===================================================== */

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
  amount: Number(formData.amount),
  description: formData.description.trim(),
  date: formData.date,
  categoryId: Number(formData.categoryId),
};

      let response;

      if (selectedExpense) {
        response = await updateExpense(
          selectedExpense.id,
          expenseData
        );
      } else {
        response = await createExpense(expenseData);
      }

      if (response.success) {
        setFormData(initialFormData);
        setFormErrors({});
        setSelectedExpense(null);
        setSuccessMessage(
          selectedExpense
            ? "Expense updated successfully."
            : "Expense added successfully."
        );
        // Refresh preserving the current active filters
        await loadExpenses(filters);
      } else {
        setFormErrors({
          general: response.message || "Failed to save expense.",
        });
      }
    } catch (error: unknown) {
      console.error("Failed to save expense:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setFormErrors({
        general: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =====================================================
     DELETE / EDIT / CANCEL
     ===================================================== */

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await deleteExpense(id);

      if (response.success) {
        setSuccessMessage("Expense deleted successfully.");
        await loadExpenses(filters);
      }
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      setFormErrors({});
      setSuccessMessage("");

      const response = await getExpenseById(id);

      if (response.success && response.data) {
        setSelectedExpense(response.data);
      } else {
        setFormErrors({
          general: response.message || "Failed to load expense.",
        });
      }
    } catch (error) {
      console.error("Failed to load expense:", error);
      setFormErrors({
        general: "Failed to load expense. Please try again.",
      });
    }
  };

  const handleCancelEdit = () => {
    setSelectedExpense(null);
    setFormData(initialFormData);
    setFormErrors({});
    setSuccessMessage("");
  };

  const formMode: "create" | "edit" = selectedExpense
    ? "edit"
    : "create";

  /* =====================================================
     UI
     ===================================================== */

  return (
    <main>
      <h1>Expense Tracker</h1>
    

      <ExpenseAnalytics />

      
      <ExpenseForm
        formData={formData}
        formErrors={formErrors}
        isSubmitting={isSubmitting}
        mode={formMode}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancelEdit={handleCancelEdit}
      />

      {selectedExpense && (
        <p>
          Editing: {selectedExpense.description}
        </p>
      )}

      {successMessage && <p>{successMessage}</p>}

      <hr />

      {/* =====================================================
    FILTER SECTION
    ===================================================== */}
<section className="expense-filters">
  <h3>Filter Expenses</h3>

  <div
    style={{
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      marginBottom: "10px",
    }}
  >
          <div>
            <label style={{ display: "block", fontSize: "12px" }}>Category</label>
            <select
              value={filterForm.categoryId}
              onChange={(e) =>
                setFilterForm({
                  ...filterForm,
                  categoryId: e.target.value,
                })
              }
            >
              <option value="">All Categories</option>
              <option value="1">Food</option>
              <option value="2">Transport</option>
              <option value="3">Shopping</option>
              <option value="4">Bills</option>
              <option value="5">Entertainment</option>
              <option value="6">Other</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px" }}>Minimum Amount</label>
            <input
              type="number"
              placeholder="Min amount"
              value={filterForm.minAmount}
              onChange={(e) =>
                setFilterForm({
                  ...filterForm,
                  minAmount: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px" }}>Maximum Amount</label>
            <input
              type="number"
              placeholder="Max amount"
              value={filterForm.maxAmount}
              onChange={(e) =>
                setFilterForm({
                  ...filterForm,
                  maxAmount: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handleApplyFilters}>Apply Filters</button>
          <button onClick={handleClearFilters}>Clear Filters</button>
        </div>
      </section>

      <hr />

      {isLoading && <p>Loading expenses...</p>}

      {loadError && <p>{loadError}</p>}

      {!isLoading && !loadError && (
        <ExpenseList
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}

export default ExpensePage;
 



