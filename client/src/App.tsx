 
import { useEffect, useState } from "react";
import { getExpenses } from "./api/expenseApi";
import type { Expense } from "./types/expense";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div>
      <h1>Expense Tracker</h1>

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




