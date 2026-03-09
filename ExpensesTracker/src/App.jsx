import { useState } from 'react';
import TransactionForm from './components/Transactions/TransactionForm';
import TransactionList from './components/Transactions/TransactionList';
import Dashboard from './components/Dashboard/Dashboard';
import Categories from './components/Categories';

function App() {
  // Categories
  const [expenseCategories, setExpenseCategories] = useState([
    "Transportation",
    "Alimentation",
    "Factures",
    "Loisirs"
  ]);

  const [incomeCategories, setIncomeCategories] = useState([
    "Salaire",
    "Freelance",
    "Cadeau"
  ]);

  // Transactions state
  const [transactions, setTransactions] = useState([]);

  // Add a transaction
  const addTransaction = (transaction) => {
    setTransactions(prev => [...prev, transaction]);
  };

  // Delete a transaction
  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  return (
    <div className="app-container">
      <h1>Expense Tracker</h1>

      {/* Form to add transactions */}
      <TransactionForm
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        addTransaction={addTransaction}
      />

      {/* Dashboard */}
      <Dashboard transactions={transactions} />

      {/* Transaction list with delete */}
      <TransactionList
        transactions={transactions}
        deleteTransaction={deleteTransaction}
      />

      {/* Manage expense categories */}
      <Categories
        categories={expenseCategories}
        setCategories={setExpenseCategories}
      />

      {/* Manage income categories (optional) */}
      <Categories
        categories={incomeCategories}
        setCategories={setIncomeCategories}
      />
    </div>
  );
}

export default App;