import TopBar from "../components/Dashboard/TopBar";
import Grid from "../components/Dashboard/Grid";
import { useTransaction } from "../context/TransactionContext";
import { useCategory } from "../context/CategoryContext";
import { useAuth } from "../context/AuthContext";
import { useState } from 'react'

export default function Dashboard({ onEdit }) {
  const { currentUser } = useAuth();
  const { transactions } = useTransaction();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const filteredTransactions = transactions.filter(tx => {
    const d = new Date(tx.date);

    const matchesStart = startDate ? d >= new Date(startDate) : true;
    const matchesEnd = endDate ? d <= new Date(endDate) : true;

    return matchesStart && matchesEnd;
  });


  const { categories } = useCategory();
  

  const totalExpenses = filteredTransactions
    .filter(tx => tx.type === "expense")
    .reduce((sum, tx) => sum + Number(tx.montant), 0);

  const totalIncome = filteredTransactions
    .filter(tx => tx.type === "income")
    .reduce((sum, tx) => sum + Number(tx.montant), 0);

  const balance = totalIncome - totalExpenses;

  const now = new Date();

  const currentMonthTx = filteredTransactions.filter(tx => {
    const d = new Date(tx.date);
    return d.getMonth() === now.getMonth() &&
           d.getFullYear() === now.getFullYear();
  });

  const lastMonthTx = filteredTransactions.filter(tx => {
    const d = new Date(tx.date);
    return d.getMonth() === now.getMonth() - 1 &&
           d.getFullYear() === now.getFullYear();
  });

  const currentIncome = currentMonthTx
    .filter(tx => tx.type === "income")
    .reduce((sum, tx) => sum + Number(tx.montant), 0);

  const lastIncome = lastMonthTx
    .filter(tx => tx.type === "income")
    .reduce((sum, tx) => sum + Number(tx.montant), 0);

  const currentExpenses = currentMonthTx
    .filter(tx => tx.type === "expense")
    .reduce((sum, tx) => sum + Number(tx.montant), 0);

  const lastExpenses = lastMonthTx
    .filter(tx => tx.type === "expense")
    .reduce((sum, tx) => sum + Number(tx.montant), 0);

  const incomeChange = lastIncome
    ? ((currentIncome - lastIncome) / lastIncome) * 100
    : 0;

  const expenseChange = lastExpenses
    ? ((currentExpenses - lastExpenses) / lastExpenses) * 100
    : 0;

  return (
    <div className="min-w-0 flex-1 rounded-lg bg-white pb-4 shadow">

      <TopBar
        incomeChange={incomeChange}
        expenseChange={expenseChange}
        currentAccount={currentUser}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      <Grid
        transactions={filteredTransactions}
        categories={categories}
        balance={balance}
        income={totalIncome}
        expenses={totalExpenses}
        incomeChange={incomeChange}
        expenseChange={expenseChange}
        onEdit={onEdit}
      />

    </div>
  );
}
