import { useState } from 'react';
import TransactionForm from './components/Transactions/TransactionForm';
import TransactionList from './components/Transactions/TransactionList';
import Categories from './components/Categories';

function App() {

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

  // ✅ Declare transactions state first
  const [transactions, setTransactions] = useState([]);

  // Now you can safely use it
  const addTransaction = (transaction) => {
    setTransactions(prev => [...prev, transaction]);
  };

  return (
    <>
      <TransactionForm
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        addTransaction={addTransaction} 
      />

      <TransactionList transactions={transactions} />

      <Categories
        categories={expenseCategories}
        setCategories={setExpenseCategories}
      />
    </>
  );
}

export default App;