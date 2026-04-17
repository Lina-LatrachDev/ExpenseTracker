import { useState } from "react";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { useCategory } from "../context/CategoryContext";

export default function CategoriesPage() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory
  } = useCategory();

  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [color, setColor] = useState("#60a5fa");
  const [type, setType] = useState("expense");
  const [editingId, setEditingId] = useState(null);

  // SAVE
  const handleSave = async () => {
    if (!newCategory.trim()) return;

    try {
      if (editingId) {
        await updateCategory(editingId, {
          name: newCategory,
          color,
          type
        });
      } else {
        await addCategory({
          name: newCategory,
          color,
          type
        });
      }

      resetModal();

    } catch (err) {
      console.error(err);
    }
  };

  // DELETE
  const handleDelete = async (cat) => {
    try {
      await deleteCategory(cat.id);
    } catch (err) {
      console.error(err);
    }
  };

  // EDIT
  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setNewCategory(cat.name);
    setColor(cat.color);
    setType(cat.type);
    setShowModal(true);
  };

  const resetModal = () => {
    setNewCategory("");
    setColor("#60a5fa");
    setType("expense");
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Catégories</h1>

      <button
        onClick={() => setShowModal(true)}
        className="mb-6 bg-violet-600 text-white px-4 py-2 rounded-lg shadow"
      >
        Ajouter une catégorie
      </button>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="p-4 rounded-xl shadow flex justify-between items-center"
            style={{ backgroundColor: cat.color + "20" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
              <div>
                <span className="font-medium">{cat.name}</span>
                <p className="text-xs text-gray-500">
                  {cat.type === "expense" ? "Dépense" : "Revenu"}
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <button onClick={() => handleEdit(cat)}>
                <FiEdit />
              </button>
              <button onClick={() => handleDelete(cat)}>
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      
      {showModal && (
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={resetModal}
      >
        <div 
          className="bg-white p-6 rounded-xl w-[350px]"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Modifier" : "Ajouter"} une catégorie
          </h2>

          <input
            type="text"
            placeholder="Nom"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />

          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full mb-3 h-10"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="expense">Dépense</option>
            <option value="income">Revenu</option>
          </select>

          <div className="flex justify-end gap-2">
            <button
              onClick={resetModal}
              className="px-3 py-1 border rounded"
            >
              Annuler
            </button>

            <button
              onClick={handleSave}
              className="px-3 py-1 bg-violet-600 text-white rounded"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}