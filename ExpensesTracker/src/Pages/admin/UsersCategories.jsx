import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiEdit, FiSearch, FiChevronDown } from "react-icons/fi";
import Chip from "../../components/UI/Chip";
import {
  addCategory,
  getUserCategories,
  deleteCategory,
  updateCategory
} from "../../api/api";

const emptyForm = {
  name: "",
  type: "expense",
  color: "#60a5fa"
};

const formatTypeLabel = (type) =>
  type === "income" ? "Revenu" : type === "expense" ? "Depense" : type;

export default function UserCategoriesPage() {
  const { userId } = useParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [filters, setFilters] = useState({
    search: "",
    typeFilter: "all"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchCategories();
  }, [userId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.typeFilter]);

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getUserCategories(userId);
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setError("Failed to load this user's categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      setError("Failed to delete this category.");
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      type: category.type || "expense",
      color: category.color || "#60a5fa"
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingCategory(null);
    setFormData(emptyForm);
    setIsModalOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      typeFilter: "all"
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingCategory) {
        const res = await updateCategory(editingCategory._id, formData);
        const updatedCategory = res.data || {};

        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === editingCategory._id ? updatedCategory : cat
          )
        );
      } else {
        const res = await addCategory({
          ...formData,
          user: userId
        });
        const newCategory = res.data || {};
        setCategories((prev) => [...prev, newCategory]);
      }

      closeModal();
    } catch (err) {
      console.error("Failed to save category", err);
      setError(
        err.response?.data?.message ||
          (editingCategory
            ? "Failed to update this category."
            : "Failed to add this category.")
      );
    }
  };

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = (cat.name || "")
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchesType =
      filters.typeFilter === "all" || cat.type === filters.typeFilter;

    return matchesSearch && matchesType;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / itemsPerPage)
  );
  const currentCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p className="p-6">Loading categories...</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Categories</h1>
        <button
          onClick={openCreateModal}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white"
        >
          Add Category
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="max-w-5xl mx-auto bg-white p-5 rounded-2xl shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl w-full md:w-1/3 focus-within:ring-2 focus-within:ring-violet-500">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm rounded-xl border hover:bg-gray-100 transition"
          >
            Réinitialiser
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Type</label>
            <div className="relative">
              <select
                value={filters.typeFilter}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, typeFilter: e.target.value }))
                }
                className="w-full appearance-none px-3 py-2 rounded-xl bg-gray-100 focus:ring-2 focus:ring-violet-500 outline-none text-sm"
              >
                <option value="all">Tous</option>
                <option value="income">Revenu</option>
                <option value="expense">Dépense</option>
              </select>
              <FiChevronDown className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {filters.search ? (
            <Chip
              label={`Recherche: ${filters.search}`}
              onRemove={() =>
                setFilters((prev) => ({ ...prev, search: "" }))
              }
            />
          ) : null}

          {filters.typeFilter !== "all" ? (
            <Chip
              label={`Type: ${
                filters.typeFilter === "income" ? "Revenu" : "Dépense"
              }`}
              onRemove={() =>
                setFilters((prev) => ({ ...prev, typeFilter: "all" }))
              }
            />
          ) : null}
        </div>
      </div>

      {!error && filteredCategories.length === 0 ? <p>No categories found</p> : null}

      {!error && filteredCategories.length > 0 ? (
        <div className="bg-white rounded-xl shadow p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-zinc-500">
                <th className="py-2">Name</th>
                <th>Type</th>
                <th>Color</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentCategories.map((cat) => (
                <tr key={cat._id} className="border-b hover:bg-zinc-50">
                  <td className="py-2">{cat.name}</td>
                  <td>{formatTypeLabel(cat.type)}</td>
                  <td>
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="inline-flex items-center gap-2 text-violet-600 text-sm"
                      >
                        <FiEdit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="text-red-500 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {!error && filteredCategories.length > 0 ? (
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-xl bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Précédent
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
            const isActive = pageNum === currentPage;

            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`rounded-lg px-3 py-1.5 text-sm transition ${
                    isActive
                      ? "bg-violet-600 text-white"
                      : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            }

            if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
              return (
                <span key={`dots-${pageNum}`} className="px-2 py-1 text-gray-400">
                  ...
                </span>
              );
            }

            return null;
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-xl bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      ) : null}

      {isModalOpen ? (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Category name"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />

              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>

              <input
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, color: e.target.value }))
                }
                className="w-full h-10"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-violet-600 text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
