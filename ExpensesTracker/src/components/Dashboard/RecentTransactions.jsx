import React from "react";
import { FiDollarSign, FiMoreHorizontal, FiEdit2, FiTrash2 } from "react-icons/fi";

export const RecentTransactions = ({ transactions, categories, onEdit, onDelete }) => {

  // sort newest first
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <div className="col-span-12 p-4 rounded border border-stone-300">

      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-medium">
          <FiDollarSign /> Transactions Récentes
        </h3>

        <span className="text-sm text-stone-500">
          Dernière Activité
        </span>
      </div>

      <table className="w-full table-auto">

        <TableHead />

        <tbody>
          {recent.map((tx, index) => (
            <TableRow
              key={tx.id}
              tx={tx}
              name={tx.nom}
              categoryId={tx.categorie}
              categories={categories}
              date={tx.date}
              amount={tx.montant}
              type={tx.type}
              order={index}
              onEdit={onEdit}        
              onDelete={onDelete} 
            />
          ))}
        </tbody>

      </table>

    </div>
  );
};


const TableHead = () => {
  return (
    <thead>
      <tr className="text-sm font-normal text-stone-500">
        <th className="text-start p-1.5">Nom</th>
        <th className="text-start p-1.5">Categorie</th>
        <th className="text-start p-1.5">Date</th>
        <th className="text-start p-1.5">Montant</th>
        <th className="w-8"></th>
      </tr>
    </thead>
  );
};


const TableRow = ({ tx, name, categoryId, categories, date, amount, type, order, onEdit, onDelete }) => {

  const formattedDate = date ? new Date(date).toLocaleDateString() : "No date";

  // ✅ Find category from ID
  const category = categories?.find(
    c => String(c.id) === String(categoryId)
  );

  return (
    <tr className={order % 2 ? "bg-stone-100 text-sm" : "text-sm"}>

      <td className="p-1.5 font-medium">
        {name}
      </td>

      {/* ✅ CATEGORY WITH COLOR */}
      <td className="p-1.5">
        <div className="flex items-center gap-2">

          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: category?.color }}
          />

          <span
            className="px-2 py-0.5 rounded text-xs font-medium"
            style={{
              backgroundColor: category?.color + "20",
              color: category?.color
            }}
          >
            {category?.name || "Unknown"}
          </span>

        </div>
      </td>

      <td className="p-1.5">
        {formattedDate}
      </td>

      <td
        className={`p-1.5 font-medium ${
          type === "income"
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {type === "income" ? "+" : "-"}
        {amount} MAD
      </td>

      <td className="w-16">
  <div className="flex items-center gap-2 justify-center">

    <FiEdit2
      onClick={() => onEdit(tx)}
      className="text-gray-400 hover:text-blue-500 cursor-pointer text-sm"
    />

    <FiTrash2
      onClick={() => onDelete(tx.id)}
      className="text-gray-400 hover:text-red-500 cursor-pointer text-sm"
    />

  </div>
</td>

    </tr>
  );
};