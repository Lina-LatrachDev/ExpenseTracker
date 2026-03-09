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

  // Dynamic categories based on type
    const categories = transaction.type === "income" ? incomeCategories : expenseCategories;

    const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" && { categorie: "" }) // reset category if type changes
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new transaction object with automatic ID
    const newTransaction = {
      ...transaction,
      id: Date.now() // generate unique ID here
    };

    addTransaction(newTransaction); // send it to App

    // Reset form
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
    <form onSubmit={handleSubmit}>

      <label>
        <input
          type="radio"
          name="type"
          value="expense"
          checked={transaction.type === "expense"}
          onChange={handleChange}
        />
        Dépense
      </label>

      <label>
        <input
          type="radio"
          name="type"
          value="income"
          checked={transaction.type === "income"}
          onChange={handleChange}
        />
        Revenu
      </label>

      <label>Nom :</label>
      <input
        type="text"
        name="nom"
        value={transaction.nom}
        onChange={handleChange}
      />

      <label>Montant :</label>
      <input
        type="number"
        name="montant"
        value={transaction.montant}
        onChange={handleChange}
      />

      <label>Catégorie :</label>
      <select
        name="categorie"
        value={transaction.categorie}
        onChange={handleChange}
      >
        <option value="">Choisir une catégorie</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <label>Date :</label>
      <input
        type="datetime-local"
        name="date"
        value={transaction.date}
        onChange={handleChange}
      />

      <button type="submit">Ajouter</button>

    </form>
  );
}
