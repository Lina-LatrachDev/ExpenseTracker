import React from "react";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import BalanceCard from './BalanceCard'
export const StatCards = ({ balance, income, expenses, transactions, currentAccount, incomeChange, expenseChange}) => {
  return (
    <>
    <div className="col-span-12 lg:col-span-8">
      <BalanceCard 
      transactions={transactions}
      balance={balance}   
      income={income}
      expenses={expenses}
      currentAccount={currentAccount}
      />
      </div>
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">    
      <Card
        title="Revenu Total"
        value={`${income.toLocaleString()} MAD`}
        valueChange={incomeChange}
        trend="up"
      />
      
      <Card
        title="Dépenses Totales"
        value={`${expenses.toLocaleString()} MAD`}
        valueChange={expenseChange}
        trend="down"
      />
      </div>
    
    </>
  );
};


const Card = ({ title, value, trend, valueChange }) => {
  return (
    <div className={`bg-white rounded-2xl p-4 border border-stone-200 ${
  trend === "up" ? "border-green-500" : "border-red-500"
} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>

      <div className="flex items-center justify-between mb-3">

        <div>
          <h3 className="text-stone-500 text-sm mb-1">
            {title}
          </h3>

          <p className="text-2xl font-bold">
            {value}
          </p>
        </div>

        <span
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
            trend === "up"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />}
          {Math.abs(valueChange || 0).toFixed(1)}%
        </span>

      </div>
    </div>
  );
};
