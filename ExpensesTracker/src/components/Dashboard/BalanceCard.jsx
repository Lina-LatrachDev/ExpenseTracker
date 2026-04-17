import React from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

export default function BalanceCard({ balance, income, expenses }) {
  const isPositive = balance >= 0;

  return (
    <div className="col-span-12 lg:col-span-6">
      <div className="bg-white p-6 rounded-2xl shadow-md border border-stone-200 hover:shadow-xl transition-all duration-300">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-stone-500 text-sm">Solde total</p>

          <span
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
              isPositive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
            {isPositive ? "Positif" : "Négatif"}
          </span>
        </div>

        {/* Balance */}
        <h2 className="text-4xl font-bold mb-6 tracking-tight">
          {balance.toLocaleString()} MAD
        </h2>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-4">

          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm text-stone-500">Revenus</p>
            <p className="text-lg font-semibold text-green-600">
              +{income.toLocaleString()} MAD
            </p>
          </div>

          <div className="bg-red-50 rounded-xl p-4">
            <p className="text-sm text-stone-500">Dépenses</p>
            <p className="text-lg font-semibold text-red-500">
              -{expenses.toLocaleString()} MAD
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}