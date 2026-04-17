import { FiTrash2, FiEdit2 } from "react-icons/fi";

export default function TransactionList({ 
  transactions, 
  deleteTransaction, 
  categories, 
  onEdit 
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">

      <h2 className="text-xl font-semibold mb-4">
        Activité Récente
      </h2>

      <ul className="space-y-4">

        {transactions.length === 0 && (
          <p className="text-gray-400 text-sm">
            Aucune transaction pour l'instant
          </p>
        )}

        {transactions.map((tr) => {
          const category = categories.find(
            c => String(c.id) === String(tr.categorie)
          );

          return (
            <li
              key={tr.id || tr._id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
            >

              {/* LEFT SIDE */}
              <div className="flex items-center gap-3">

                {/* Indicator */}
                <div
                  className={`w-3 h-3 rounded-full
                  ${tr.type === "income"
                    ? "bg-green-500"
                    : "bg-red-500"
                  }`}
                />

                {/* Info */}
                <div>
                  <p className="font-medium text-gray-800">
                    {tr.nom}
                  </p>

                  <div className="flex gap-2 text-sm text-gray-500">

                    <span>
                      {/*{new Date(tr.date).toLocaleDateString()}*/}
                      {tr.date
                      ? new Date(tr.date).toLocaleDateString()
                      : "No date"}
                    </span>

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
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex items-center gap-4">

                {/* Amount */}
                <span
                  className={`font-semibold text-lg
                  ${tr.type === "income"
                    ? "text-green-600"
                    : "text-red-500"
                  }`}
                >
                  {tr.type === "income" ? "+" : "-"}
                  {tr.montant} MAD
                </span>

                {/* Edit */}
                <button
                  onClick={() => onEdit(tr)}
                  className="p-2 rounded-lg text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition"
                >
                  <FiEdit2 size={18} />
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteTransaction(tr.id)}
                  className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 hover:scale-110 transition"
                >
                  <FiTrash2 size={18} />
                </button>

              </div>

            </li>
          );
        })}

      </ul>

    </div>
  );
}