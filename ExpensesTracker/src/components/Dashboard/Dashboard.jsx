import { Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

export default function Dashboard({ transactions }) {
  // Total calculations
  const totalExpenses = transactions
    .filter(tx => tx.type === "expense")
    .reduce((sum, tx) => sum + Number(tx.montant), 0);

  const totalIncome = transactions
    .filter(tx => tx.type === "income")
    .reduce((sum, tx) => sum + Number(tx.montant), 0);

  const balance = totalIncome - totalExpenses;

  // Pie chart: expenses by category
  const expenseTx = transactions.filter(tx => tx.type === "expense");
  const categories = [...new Set(expenseTx.map(tx => tx.categorie))];
  const amountsByCategory = categories.map(cat =>
    expenseTx.filter(tx => tx.categorie === cat).reduce((sum, tx) => sum + Number(tx.montant), 0)
  );

  const pieData = {
    labels: categories,
    datasets: [
      {
        label: "Expenses by Category",
        data: amountsByCategory,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  // Line chart: expenses over time
  const sortedExpenses = expenseTx.sort((a, b) => new Date(a.date) - new Date(b.date));
  const lineData = {
    labels: sortedExpenses.map(tx => tx.date.slice(0, 10)), // show YYYY-MM-DD
    datasets: [
      {
        label: "Expenses Over Time",
        data: sortedExpenses.map(tx => Number(tx.montant)),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Income: {totalIncome} MAD</p>
      <p>Total Expenses: {totalExpenses} MAD</p>
      <p>Balance: {balance} MAD</p>

      <h3>Expenses by Category</h3>
      <Pie data={pieData} />

      <h3>Expenses Over Time</h3>
      <Line data={lineData} />
    </div>
  );
}