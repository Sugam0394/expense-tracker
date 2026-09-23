import type { Expense } from "../../types/expense";

interface ExpenseListProps {
  expenses: Expense[];
}

function ExpenseList({ expenses }: ExpenseListProps) {
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
        </article>
      ))}
    </section>
  );
}

export default ExpenseList;