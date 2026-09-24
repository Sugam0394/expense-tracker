 
import { useEffect, useState } from "react";
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

/*
  Backend returns category name:

  "Food"
  "Transport"
  "Shopping"
  etc.

  But the form select works with category IDs:

  "1"
  "2"
  "3"
  etc.

  This map converts the backend category name
  into the value expected by the form.
*/
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

  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  /*
    null  → create mode

    Expense → edit mode
  */
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

  /* =====================================================
     LOAD ALL EXPENSES
     ===================================================== */

  const loadExpenses = async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const response = await getExpenses();

      if (response.success) {
        const loadedExpenses =
          response.data ?? [];

        setExpenses(loadedExpenses);

        /*
          STALE EDIT PROTECTION

          If we are currently editing an expense,
          check whether that expense still exists
          after refreshing the list.

          Example:

          selectedExpense.id = 55

          Refresh happens

          Backend no longer returns id 55

          Therefore:
          → exit edit mode
          → reset form
        */
        if (selectedExpense) {
          const stillExists =
            loadedExpenses.some(
              (expense) =>
                expense.id === selectedExpense.id
            );

          if (!stillExists) {
            setSelectedExpense(null);
            setFormData(initialFormData);
            setFormErrors({});
          }
        }
      }
    } catch (error) {
      console.error(
        "Failed to load expenses:",
        error
      );

      setLoadError(
        "Failed to load expenses. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* =====================================================
     INITIAL LOAD
     ===================================================== */

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadExpenses();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  /* =====================================================
     PREFILL FORM WHEN EDITING
     ===================================================== */

  useEffect(() => {
    if (!selectedExpense) {
      return;
    }

    /*
      Convert backend response into
      the shape required by ExpenseForm.
    */

    setFormData({
      amount: selectedExpense.amount,

      description:
        selectedExpense.description,

      date:
        selectedExpense.date.slice(0, 10),

      categoryId:
        categoryMap[
          selectedExpense.category
        ] ?? "",
    });

    setFormErrors({});
    setSuccessMessage("");
  }, [selectedExpense]);

  /* =====================================================
     FORM CHANGE
     ===================================================== */

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } =
      event.target;

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

    const amount = Number(
      formData.amount
    );

    if (!formData.amount) {
      errors.amount =
        "Amount is required.";
    } else if (
      Number.isNaN(amount) ||
      amount <= 0
    ) {
      errors.amount =
        "Amount must be greater than 0.";
    }

    if (!formData.description.trim()) {
      errors.description =
        "Description is required.";
    }

    if (!formData.date) {
      errors.date =
        "Date is required.";
    }

    if (!formData.categoryId) {
      errors.categoryId =
        "Category is required.";
    }

    setFormErrors(errors);

    return (
      Object.keys(errors).length === 0
    );
  };

  /* =====================================================
     CREATE / UPDATE
     ===================================================== */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    /*
      Stop here if validation fails.
    */
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      /*
        Convert form data into API data.
      */

      const expenseData = {
        amount: formData.amount,

        description:
          formData.description.trim(),

        date: formData.date,

        categoryId:
          Number(formData.categoryId),
      };

      /*
        CREATE vs UPDATE

        selectedExpense === null
              ↓
            CREATE

        selectedExpense !== null
              ↓
             UPDATE
      */

      let response;

      if (selectedExpense) {
        response = await updateExpense(
          selectedExpense.id,
          expenseData
        );
      } else {
        response =
          await createExpense(
            expenseData
          );
      }

      /* =================================================
         SUCCESS
         ================================================= */

      if (response.success) {
        /*
          Reset form.
        */
        setFormData(
          initialFormData
        );

        setFormErrors({});

        /*
          Leave edit mode.

          This is important because
          after updating we don't want
          the form to continue thinking
          it is editing the old expense.
        */
        setSelectedExpense(null);

        /*
          Different message depending
          on the operation.
        */
        setSuccessMessage(
          selectedExpense
            ? "Expense updated successfully."
            : "Expense added successfully."
        );

        /*
          Refresh the list from backend.
        */
        await loadExpenses();
      } else {
        setFormErrors({
          general:
            response.message ||
            "Failed to save expense.",
        });
      }
    } catch (error: unknown) {
      console.error(
        "Failed to save expense:",
        error
      );

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
     EDIT EXPENSE
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
      await loadExpenses();
    }
  } catch (error) {
    console.error("Failed to delete expense:", error);
  }
};
  const handleEdit = async (
    id: number
  ) => {
    try {
      setFormErrors({});
      setSuccessMessage("");

      const response =
        await getExpenseById(id);

      if (
        response.success &&
        response.data
      ) {
        setSelectedExpense(
          response.data
        );
      } else {
        setFormErrors({
          general:
            response.message ||
            "Failed to load expense.",
        });
      }
    } catch (error) {
      console.error(
        "Failed to load expense:",
        error
      );

      setFormErrors({
        general:
          "Failed to load expense. Please try again.",
      });
    }
  };

  /* =====================================================
     CANCEL EDIT
     ===================================================== */

  const handleCancelEdit = () => {
    /*
      Remove selected expense.
      This automatically changes:

      edit → create
    */
    setSelectedExpense(null);

    /*
      Reset form.
    */
    setFormData(initialFormData);

    /*
      Clear validation errors.
    */
    setFormErrors({});

    /*
      Clear success message.
    */
    setSuccessMessage("");
  };

  /* =====================================================
     FORM MODE
     ===================================================== */

  const formMode: "create" | "edit" =
    selectedExpense
      ? "edit"
      : "create";

  /* =====================================================
     UI
     ===================================================== */

  return (
    <main>
      <h1>Expense Tracker</h1>

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
          Editing:{" "}
          {selectedExpense.description}
        </p>
      )}

      {successMessage && (
        <p>{successMessage}</p>
      )}

      <hr />

      {isLoading && (
        <p>
          Loading expenses...
        </p>
      )}

      {loadError && (
        <p>{loadError}</p>
      )}

      {!isLoading &&
        !loadError && (
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
 



