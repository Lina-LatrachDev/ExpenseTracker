import { useState } from 'react';

export default function TransactionForm({ expenseCategories, incomeCategories, addTransaction }) {

  const now = new Date().toISOString().slice(0, 16);

  const [transaction, setTransaction] = useState({
    id: "",
    nom: "",
    type: "expense",
    montant: "",
    categorie: "",
    date: now
  });

  // Categories dynamiques
    const categories = transaction.type === "income" ? incomeCategories : expenseCategories;

    const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" && { categorie: "" }) // reset
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    const newTransaction = {
      ...transaction,
      id: Date.now() // générer l'ID
    };

    addTransaction(newTransaction); 

    // Reset
    setTransaction({
      id: "",
      type: "expense",
      nom: "",
      montant: "",
      categorie: "",
      date: now
    });
  };
  
return (
  <div className="bg-white p-5 rounded-xl shadow-sm max-w-md">

    <h2 className="text-lg font-semibold mb-4">
      Ajouter Transaction
    </h2>

    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Type Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1 w-fit">

        <label className={`px-4 py-1 rounded-md cursor-pointer text-sm font-medium transition 
          ${transaction.type === "expense" ? "bg-red-500 text-white" : "text-gray-600"}
        `}>
          <input
            type="radio"
            name="type"
            value="expense"
            checked={transaction.type === "expense"}
            onChange={handleChange}
            className="hidden"
          />
          Dépense
        </label>

        <label className={`px-4 py-1 rounded-md cursor-pointer text-sm font-medium transition 
          ${transaction.type === "income" ? "bg-green-500 text-white" : "text-gray-600"}
        `}>
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


      <div className="grid grid-cols-2 gap-3">

        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={transaction.nom}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="number"
          name="montant"
          placeholder="Montant"
          value={transaction.montant}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

      </div>

      <div className="grid grid-cols-2 gap-3">

        <select
          name="categorie"
          value={transaction.categorie}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="datetime-local"
          name="date"
          value={transaction.date}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
      >
        Ajouter Transaction
      </button>

    </form>
  </div>
);
}
