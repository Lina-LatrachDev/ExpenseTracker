import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

export default function Dashboard({ transactions }) {

  const totalExpenses = transactions
    .filter(tx => tx.type === "expense")
    .reduce((sum, tx) => sum + Number(tx.montant), 0);

  const totalIncome = transactions
    .filter(tx => tx.type === "income")
    .reduce((sum, tx) => sum + Number(tx.montant), 0);

  const balance = totalIncome - totalExpenses;

  const expenseTx = transactions.filter(tx => tx.type === "expense");

  const categories = [...new Set(expenseTx.map(tx => tx.categorie))];

  const amountsByCategory = categories.map(cat =>
    expenseTx
      .filter(tx => tx.categorie === cat)
      .reduce((sum, tx) => sum + Number(tx.montant), 0)
  );

  const pieData = {
    labels: categories,
    datasets: [
      {
        label: "Expenses",
        data: amountsByCategory,
        backgroundColor: [
          "#ef4444",
          "#f97316",
          "#eab308",
          "#22c55e",
          "#3b82f6",
          "#8b5cf6"
        ]
      }
    ]
  };

  return (
    <div className="p-6 space-y-8">

      {/* BALANCE CARD */}
      <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white p-8 rounded-2xl shadow-lg overflow-hidden max-w-xl">

        <div className="w-10 h-7 bg-yellow-300 rounded-md mb-6"></div>

        <p className="text-sm opacity-80">Solde Disponible</p>

        <h2 className="text-4xl font-bold tracking-wide mt-1">
          {balance} MAD
        </h2>

        <p className="mt-6 text-lg tracking-widest opacity-90">
          •••• •••• •••• 4582
        </p>

        <div className="flex justify-between items-center mt-6 text-sm opacity-90">

          <div>
            <p className="text-xs">Titulaire de la carte</p>
            <p className="font-medium">Mon Compte</p>
          </div>

          <div>
            <p className="text-xs">Expire Fin</p>
            <p>12/29</p>
          </div>

        </div>

        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/20 rounded-full"></div>

      </div>


      {/* Depense / Revenu */}
      <div className="grid md:grid-cols-2 gap-6 max-w-xl">

        <div className="bg-green-50 p-5 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Total Revenu</h3>
          <p className="text-2xl font-bold text-green-600">
            {totalIncome} MAD
          </p>
        </div>

        <div className="bg-red-50 p-5 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Total Dépenses</h3>
          <p className="text-2xl font-bold text-red-600">
            {totalExpenses} MAD
          </p>
        </div>

      </div>


      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-4">
            Dépenses par Catégorie
          </h3>
          <Pie data={pieData} />
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-4">
            Dépenses au cours du temps.
          </h3>

          <Line
            data={{
              labels: expenseTx.map(tx => tx.date.slice(0, 10)),
              datasets: [
                {
                  label: "Expenses",
                  data: expenseTx.map(tx => Number(tx.montant)),
                  borderColor: "#3b82f6",
                  tension: 0.3
                }
              ]
            }}
          />

        </div>

      </div>

    </div>
  );
}