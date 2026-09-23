import type { ChangeEvent, FormEvent } from "react";

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

interface ExpenseFormProps {
  formData: ExpenseFormData;
  formErrors: FormErrors;
  isSubmitting: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function ExpenseForm({
  formData,
  formErrors,
  isSubmitting,
  onChange,
  onSubmit,
}: ExpenseFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="amount">Amount</label>

        <input
          id="amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={onChange}
          placeholder="Enter amount"
          disabled={isSubmitting}
        />

        {formErrors.amount && (
          <p>{formErrors.amount}</p>
        )}
      </div>

      <div>
        <label htmlFor="description">Description</label>

        <input
          id="description"
          name="description"
          type="text"
          value={formData.description}
          onChange={onChange}
          placeholder="Enter description"
          disabled={isSubmitting}
        />

        {formErrors.description && (
          <p>{formErrors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="date">Date</label>

        <input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={onChange}
          disabled={isSubmitting}
        />

        {formErrors.date && (
          <p>{formErrors.date}</p>
        )}
      </div>

      <div>
        <label htmlFor="categoryId">Category</label>

        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={onChange}
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

        {formErrors.categoryId && (
          <p>{formErrors.categoryId}</p>
        )}
      </div>

      {formErrors.general && (
        <p>{formErrors.general}</p>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
}

export default ExpenseForm;