 import type { Expense } from "../../types/expense";

 interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <section>
        <h2>Expenses</h2>
        <p>No expenses found.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Expenses</h2>

      {expenses.map((expense) => (
        <article key={expense.id}>
          <p>
            <strong>Amount:</strong> {expense.amount}
          </p>

          <p>
            <strong>Description:</strong> {expense.description}
          </p>

          <p>
            <strong>Category:</strong> {expense.category}
          </p>

          <p>
            <strong>Date:</strong> {expense.date}
          </p>

          <button onClick={() => onEdit(expense.id)}>
            Edit
          </button>
          <button onClick={() => onDelete(expense.id)}>
  Delete
</button>
        </article>
      ))}
    </section>
  );
}

export default ExpenseList;