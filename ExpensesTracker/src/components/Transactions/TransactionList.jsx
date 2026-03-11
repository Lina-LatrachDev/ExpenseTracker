export default function TransactionList({ transactions, deleteTransaction }) {

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

        {transactions.map(tr => (

          <li
            key={tr.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
          >

            {/* Coté gauche */}
            <div className="flex items-center gap-3">

              {/* Indicateur */}
              <div
                className={`w-3 h-3 rounded-full
                ${tr.type === "income"
                  ? "bg-green-500"
                  : "bg-red-500"
                }`}
              ></div>

              {/* Info */}
              <div>

                <p className="font-medium text-gray-800">
                  {tr.nom}
                </p>

                <div className="flex gap-2 text-sm text-gray-500">

                  <span>
                    {new Date(tr.date).toLocaleDateString()}
                  </span>

                  <span className="bg-gray-200 px-2 py-0.5 rounded text-xs">
                    {tr.categorie}
                  </span>

                </div>

              </div>

            </div>

            
            <div className="flex items-center gap-4">

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

              <button
                onClick={() => deleteTransaction(tr.id)}
                className="text-red-500 text-sm hover:text-red-700"
              >
                Supprimer
              </button>

            </div>

          </li>

        ))}

      </ul>

    </div>
  );
}