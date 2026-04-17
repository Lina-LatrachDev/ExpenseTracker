import React from "react";

export default function BudgetPage({ budgets, transactions }) {

  const getSpentByCategory = (category) => {
    const now = new Date();

    return transactions
      .filter(tx => {
        const txDate = new Date(tx.date);

        return (
          tx.type === "expense" &&
          tx.categorie === category &&
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, tx) => sum + Number(tx.montant), 0);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Budgets</h1>

      <div className="space-y-4">
        {budgets.length === 0 && (
          <p className="text-stone-500">No budgets yet.</p>
        )}

        {budgets.map((budget) => {
          const spent = getSpentByCategory(budget.category);
          const percentage = (spent / budget.limit) * 100;

          const color =
            percentage > 100
              ? "bg-red-500"
              : percentage > 80
              ? "bg-yellow-500"
              : "bg-violet-500";

          return (
            <div
              key={budget.id}
              className="bg-white p-4 rounded shadow"
            >
              <div className="flex justify-between mb-2">
                <h2 className="font-semibold">{budget.category}</h2>
                <span className="text-sm text-stone-500">
                  {spent} / {budget.limit} MAD
                </span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded mb-2">
                <div
                  className={`${color} h-2 rounded`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>

              <p className="text-sm text-stone-500">
                Remaining: {budget.limit - spent} MAD
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}