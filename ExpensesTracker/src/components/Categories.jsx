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
    <div>

      <h2>Categories</h2>

      <ul>
        {categories.map((cat) => (
          <li key={cat}>
            {cat}

            <button onClick={() => deleteCategory(cat)}>
              Delete
            </button>

          </li>
        ))}
      </ul>

      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="New category"
      />

      <button onClick={addCategory}>
        Add
      </button>

    </div>
  );
}