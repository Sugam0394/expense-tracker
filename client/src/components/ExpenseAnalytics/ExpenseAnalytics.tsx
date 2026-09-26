 import { useEffect, useState } from "react";

import {
  getExpenseSummary,
  getCategorySummary,
} from "../../api/analyticsApi";

import type {
  ExpenseSummary,
  CategorySummary,
} from "../../types/analytics";

function ExpenseAnalytics() {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);

  const [categorySummary, setCategorySummary] = useState<
    CategorySummary[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [summaryData, categoryData] = await Promise.all([
          getExpenseSummary(),
          getCategorySummary(),
        ]);

        setSummary(summaryData);
        setCategorySummary(categoryData);
      } catch (error) {
        console.error("Failed to load analytics:", error);
        setError("Failed to load analytics.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadAnalytics();
  }, []);

  if (isLoading) {
    return <p>Loading analytics...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h2>Expense Analytics</h2>

      <div>
        <h3>Total Spending</h3>
        <p>₹{summary?.totalAmount ?? "0.00"}</p>
      </div>

      <div>
        <h3>Expense Count</h3>
        <p>{summary?.expenseCount ?? 0}</p>
      </div>

      <div>
        <h3>Category-wise Spending</h3>

        {categorySummary.length === 0 ? (
          <p>No category spending found.</p>
        ) : (
          <ul>
            {categorySummary.map((item) => (
              <li key={item.category}>
                {item.category}: ₹{item.totalAmount}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default ExpenseAnalytics;