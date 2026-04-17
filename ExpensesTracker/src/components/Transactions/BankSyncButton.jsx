import React, { useState } from "react";
import API from "../../api/api"; // ✅ use your axios instance

export default function BankSyncButton({ transactions, setTransactions }) {
  const [loading, setLoading] = useState(false);

  const syncBankTransactions = async () => {
    try {
      setLoading(true);

      // ✅ FIXED endpoint (no userId)
      const res = await API.get("/bank/fetch-external");

      const newTransactions = res.data.data;

      const filteredTransactions = newTransactions.filter(newTx =>
        !transactions.some(existingTx =>
          existingTx.nom === newTx.nom &&
          existingTx.montant === newTx.montant &&
          new Date(existingTx.date).toDateString() === new Date(newTx.date).toDateString()
        )
      );

      setTransactions(prev => [...filteredTransactions, ...prev]);

      alert(`${filteredTransactions.length} new transaction(s) synced!`);
    } catch (err) {
      console.error(err);
      alert("Error syncing bank transactions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={syncBankTransactions}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      {loading ? "Syncing..." : "Sync with Bank"}
    </button>
  );
}