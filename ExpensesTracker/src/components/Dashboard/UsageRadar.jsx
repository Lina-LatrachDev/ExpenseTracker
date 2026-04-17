import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function UsageRadar({ transactions, categories }) {

  // keep only expenses
  const expenseTx = transactions.filter(tx => tx.type === "expense");

  // unique category IDs
  const categoryIds = [...new Set(expenseTx.map(tx => tx.categorie))];

  // labels (names)
  const labels = categoryIds.map(id => {
    const cat = categories?.find(c => c.id === id);
    return cat?.name || "Unknown";
  });

  // amounts
  const amounts = categoryIds.map(id =>
    expenseTx
      .filter(tx => tx.categorie === id)
      .reduce((sum, tx) => sum + Number(tx.montant), 0)
  );

  // 🎨 COLORS FROM YOUR CATEGORIES
  const colors = categoryIds.map(id => {
    const cat = categories?.find(c => c.id === id);
    return cat?.color || "#a1a1aa"; // fallback gray
  });

  // fallback
  const finalLabels = labels.length ? labels : ["No Data"];
  const finalAmounts = amounts.length ? amounts : [0];
  const finalColors = colors.length ? colors : ["#a1a1aa"];

  const data = {
    labels: finalLabels,
    datasets: [
      {
        label: "Dépenses par Catégorie",
        data: finalAmounts,
        backgroundColor: finalColors.map(color => color + "40"), // soft fill
        borderColor: finalColors,
        borderWidth: 2,
        pointBackgroundColor: finalColors,
        pointBorderColor: "#fff",
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top"
      }
    },
    scales: {
      r: {
        grid: {
          color: "#e4e4e7"
        },
        angleLines: {
          color: "#e4e4e7"
        },
        pointLabels: {
          color: "#374151",
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <div className="col-span-4 p-4 rounded border border-stone-300">

      <h3 className="font-medium mb-4">
        Répartition des dépenses
      </h3>

      <div className="h-[300px]">
        <Radar data={data} options={options} />
      </div>

    </div>
  );
}