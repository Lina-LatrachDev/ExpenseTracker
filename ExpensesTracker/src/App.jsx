import { useState, useEffect } from "react";
import TransactionForm from './components/Transactions/TransactionForm';
import TransactionList from './components/Transactions/TransactionList';
import Dashboard from './components/Dashboard/Dashboard';
import Categories from './components/Categories';
import Sidebar from "./components/Layout/SideBar";

function App() {

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions(prev => [...prev, transaction]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-8">

        {/* Page title + button */}
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Add Transaction
          </button>

        </div>

        {/* Dashboard */}
        <Dashboard transactions={transactions} />

        {/* Transaction list */}
        <div className="mt-8">
          <TransactionList
            transactions={transactions}
            deleteTransaction={deleteTransaction}
          />
        </div>

      </div>

      {/* MODAL */}
      {showModal && (

        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >

          <div
            className="bg-white rounded-xl shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-6 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <TransactionForm
              expenseCategories={expenseCategories}
              incomeCategories={incomeCategories}
              addTransaction={(tx) => {
                addTransaction(tx);
                setShowModal(false);
              }}
            />

          </div>

        </div>

      )}

    </div>
  );
}

export default App;






/*import { useState, useEffect } from "react"; 
import TransactionForm from './components/Transactions/TransactionForm';
import TransactionList from './components/Transactions/TransactionList';
import Dashboard from './components/Dashboard/Dashboard';
import Categories from './components/Categories';
import Sidebar from "./components/Layout/SideBar";

function App() {
  // Etat transaction
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  // Deux types de catégories (expense & income)
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

  const [categoryType, setCategoryType] = useState("expense");
  // 
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Ajouter une transaction
  const addTransaction = (transaction) => {
    setTransactions(prev => [...prev, transaction]);
  };

  // Supprimer une transaction
  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  return (

    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
     
      <Dashboard transactions={transactions} />

      <div className="grid lg:grid-cols-3 gap-8 mt-8">
      <TransactionForm
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        addTransaction={addTransaction}
      />

      <TransactionList
        transactions={transactions}
        deleteTransaction={deleteTransaction}
      />
    </div>
      <div className="mt-8">

  <div className="flex gap-3 mb-4">

    <button
      onClick={() => setCategoryType("expense")}
      className={`px-4 py-2 rounded-lg font-medium
        ${categoryType === "expense"
          ? "bg-red-500 text-white"
          : "bg-gray-200"}
      `}
    >
      Catégories dépense
    </button>

    <button
      onClick={() => setCategoryType("income")}
      className={`px-4 py-2 rounded-lg font-medium
        ${categoryType === "income"
          ? "bg-green-500 text-white"
          : "bg-gray-200"}
      `}
    >
      Catégories Revenu 
    </button>

  </div>

  {categoryType === "expense" ? (
    <Categories
      title="Expense Categories"
      categories={expenseCategories}
      setCategories={setExpenseCategories}
    />
  ) : (
    <Categories
      title="Income Categories"
      categories={incomeCategories}
      setCategories={setIncomeCategories}
    />
  )}

</div>
    </div>
    </div>
  );
}

export default App;*/