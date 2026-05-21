import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  const [incomeForm, setIncomeForm] = useState({
    title: "",
    amount: "",
    source: "",
    date: "",
  });

  const fetchBudgetSummary = () => {
    fetch(`${API_URL}/budget/summary`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Budget summary request failed");
        }

        return response.json();
      })
      .then((data) => {
        setSummary(data);
      })
      .catch((error) => {
        console.error("Budget summary could not be fetched:", error);
        setError("Budget summary could not be loaded.");
      });
  };

  useEffect(() => {
    fetchBudgetSummary();
  }, []);

  const handleExpenseChange = (event) => {
    const { name, value } = event.target;

    setExpenseForm({
      ...expenseForm,
      [name]: value,
    });
  };

  const handleIncomeChange = (event) => {
    const { name, value } = event.target;

    setIncomeForm({
      ...incomeForm,
      [name]: value,
    });
  };

  const handleExpenseSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: expenseForm.title,
          amount: Number(expenseForm.amount),
          category: expenseForm.category,
          date: expenseForm.date,
        }),
      });

      if (!response.ok) {
        throw new Error("Expense could not be created");
      }

      setExpenseForm({
        title: "",
        amount: "",
        category: "",
        date: "",
      });

      fetchBudgetSummary();
    } catch (error) {
      console.error("Expense could not be created:", error);
      setError("Expense could not be created.");
    }
  };

  const handleIncomeSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/incomes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: incomeForm.title,
          amount: Number(incomeForm.amount),
          source: incomeForm.source,
          date: incomeForm.date,
        }),
      });

      if (!response.ok) {
        throw new Error("Income could not be created");
      }

      setIncomeForm({
        title: "",
        amount: "",
        source: "",
        date: "",
      });

      fetchBudgetSummary();
    } catch (error) {
      console.error("Income could not be created:", error);
      setError("Income could not be created.");
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>BudgetFlow</h1>
          <p>Personal budget tracking dashboard</p>
        </div>
      </header>

      {error && <p className="error-message">{error}</p>}

      {!summary && !error ? (
        <p>Loading budget summary...</p>
      ) : (
        summary && (
          <section className="summary-grid">
            <div className="summary-card">
              <span>Total Income</span>
              <strong>{summary.total_income} ₺</strong>
            </div>

            <div className="summary-card">
              <span>Total Expense</span>
              <strong>{summary.total_expense} ₺</strong>
            </div>

            <div className="summary-card">
              <span>Balance</span>
              <strong>{summary.balance} ₺</strong>
            </div>
          </section>
        )
      )}

      <section className="form-section">
        <h2>Add Expense</h2>

        <form className="form-card" onSubmit={handleExpenseSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={expenseForm.title}
              onChange={handleExpenseChange}
              placeholder="Exp: Coffee"
              required
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={expenseForm.amount}
              onChange={handleExpenseChange}
              placeholder="Exp: 120"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={expenseForm.category}
              onChange={handleExpenseChange}
              placeholder="Exp: Food"
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={expenseForm.date}
              onChange={handleExpenseChange}
              required
            />
          </div>

          <button type="submit">Add Expense</button>
        </form>
      </section>

      <section className="form-section">
        <h2>Add Income</h2>

        <form className="form-card" onSubmit={handleIncomeSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={incomeForm.title}
              onChange={handleIncomeChange}
              placeholder="Exp: Salary"
              required
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={incomeForm.amount}
              onChange={handleIncomeChange}
              placeholder="Exp: 45000"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Source</label>
            <input
              type="text"
              name="source"
              value={incomeForm.source}
              onChange={handleIncomeChange}
              placeholder="Exp: Work"
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={incomeForm.date}
              onChange={handleIncomeChange}
              required
            />
          </div>

          <button type="submit">Add Income</button>
        </form>
      </section>
    </div>
  );
}

export default App;
