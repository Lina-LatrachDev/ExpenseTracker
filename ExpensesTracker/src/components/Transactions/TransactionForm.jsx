import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useTransaction } from "../../context/TransactionContext";
import { useCategory } from "../../context/CategoryContext";

export default function TransactionForm({
  //categories,
  //addTransaction,
  editingTransaction,
  onClose
}) {
  
  const now = new Date().toISOString().slice(0, 16);

  const [transaction, setTransaction] = useState({
    id: "",
    nom: "",
    type: "expense",
    montant: "",
    categorie: "",
    date: now,
    taxType: "TTC",
    tvaRate: 0.2,
  });

  const { categories } = useCategory();
  
  const { addTransaction, updateTransaction } = useTransaction();
  
  // ✅ TVA CALC STATE
  const [calc, setCalc] = useState({
    HT: null,
    TVA: null,
    TTC: null,
  });

  // ✅ Prefill when editing
  useEffect(() => {
    if (editingTransaction) {
      setTransaction({
        ...editingTransaction,
        montant: editingTransaction.montant,
        categorie: editingTransaction.categorie,
        date: editingTransaction.date.slice(0, 16),
        taxType: editingTransaction.taxType || "TTC",
        tvaRate: editingTransaction.tvaRate || 0.2,
      });
    }
  }, [editingTransaction]);

  // ✅ LIVE TVA CALCULATION
  useEffect(() => {
    const montant = Number(transaction.montant);
    const rate = Number(transaction.tvaRate);

    if (!montant) {
      setCalc({ HT: null, TVA: null, TTC: null });
      return;
    }

    let HT, TTC, TVA;

    if (transaction.taxType === "TTC") {
      TTC = montant;
      HT = TTC / (1 + rate);
    } else {
      HT = montant;
      TTC = HT * (1 + rate);
    }

    TVA = TTC - HT;

    setCalc({ HT, TVA, TTC });
  }, [transaction.montant, transaction.taxType, transaction.tvaRate]);

  const filteredCategories = categories.filter(
    (cat) => cat.type === transaction.type
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTransaction((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" && { categorie: "" }),
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!transaction.nom || !transaction.montant || !transaction.categorie) {
    return;
  }

  const payload = {
    nom: transaction.nom,
    type: transaction.type,
    montant: Number(transaction.montant),
    categorie: transaction.categorie,
    date: transaction.date,
  };

  try {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, payload);
    } else {
      await addTransaction(payload);
    }

    // reset
    setTransaction({
      id: "",
      nom: "",
      type: "expense",
      montant: "",
      categorie: "",
      date: now,
      taxType: "TTC",
      tvaRate: 0.2,
    });

    setCalc({ HT: null, TVA: null, TTC: null });
    onClose?.();

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="relative w-[420px] bg-white p-6 rounded-2xl shadow-xl">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close transaction modal"
        className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
      >
        <FiX size={18} />
      </button>

      <h2 className="text-xl font-semibold mb-5 pr-10">
        {editingTransaction ? "Modifier Transaction" : "Nouvelle Transaction"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* TYPE */}
        <div className="flex bg-zinc-100 rounded-lg p-1 w-fit">
          <label className={`px-4 py-1 rounded-md cursor-pointer text-sm font-medium transition
          ${transaction.type === "expense" ? "bg-red-500 text-white" : "text-zinc-600"}`}>
            <input
              type="radio"
              name="type"
              value="expense"
              checked={transaction.type === "expense"}
              onChange={handleChange}
              className="hidden"
            />
            Dépenses
          </label>

          <label className={`px-4 py-1 rounded-md cursor-pointer text-sm font-medium transition
          ${transaction.type === "income" ? "bg-green-500 text-white" : "text-zinc-600"}`}>
            <input
              type="radio"
              name="type"
              value="income"
              checked={transaction.type === "income"}
              onChange={handleChange}
              className="hidden"
            />
            Revenu
          </label>
        </div>

        {/* NAME + AMOUNT */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={transaction.nom}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <input
            type="number"
            name="montant"
            placeholder="Montant"
            value={transaction.montant}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* TAX OPTIONS */}
        <div className="grid grid-cols-2 gap-3">
          <select
            name="taxType"
            value={transaction.taxType}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="TTC">TTC</option>
            <option value="HT">HT</option>
          </select>

          <select
            name="tvaRate"
            value={transaction.tvaRate}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value={0.2}>TVA 20%</option>
            <option value={0.14}>TVA 14%</option>
            <option value={0.1}>TVA 10%</option>
          </select>
        </div>

        {/* ✅ TVA RESULT DISPLAY */}
        <div className="bg-stone-50 p-3 rounded-lg text-sm space-y-1">
          <p className="text-xs text-gray-400">Calcul automatique TVA</p>
          <p>HT: {calc.HT ? calc.HT.toFixed(2) : "-"}</p>
          <p>TVA: {calc.TVA ? calc.TVA.toFixed(2) : "-"}</p>
          <p className="font-semibold">
            TTC: {calc.TTC ? calc.TTC.toFixed(2) : "-"}
          </p>
        </div>

        {/* CATEGORY + DATE */}
        <div className="grid grid-cols-2 gap-3">
          <select
            name="categorie"
            value={transaction.categorie}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Categorie</option>

            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            name="date"
            value={transaction.date}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-violet-600 text-white py-2 rounded-lg"
        >
          {editingTransaction ? "Modifier" : "Ajouter Transaction"}
        </button>

      </form>
    </div>
  );
}
