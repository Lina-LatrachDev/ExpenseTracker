import { useState } from "react";

export default function Categories({ categories, setCategories }) {

  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (!newCategory) return;

    setCategories([...categories, newCategory]);
    setNewCategory("");
  };

  const deleteCategory = (cat) => {
    setCategories(categories.filter(c => c !== cat));
  };

  return (
  <div className="bg-white p-6 rounded-xl shadow-md">

    <h2 className="text-xl font-semibold mb-4">
      Categories
    </h2>

    <div className="flex gap-2 mb-4">

      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="Nouvelle Catégorie"
        className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <button
        onClick={addCategory}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Ajouter
      </button>

    </div>

    <ul className="grid grid-cols-2 gap-3">

      {categories.map((cat) => (
        <li
          key={cat}
          className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-lg"
        >

          <span className="font-medium">{cat}</span>

          <button
            onClick={() => deleteCategory(cat)}
            className="text-red-500 text-sm hover:text-red-700"
          >
            Supprimer
          </button>

        </li>
      ))}

    </ul>

  </div>
);
}