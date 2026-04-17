import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  FiChevronDown,
  FiEdit,
  FiSearch,
  FiTrash2
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import Chip from "../../components/UI/Chip";
import FiltersBar from "../../components/Transactions/FiltersBar";
import {
  addCategory,
  addTransaction,
  deleteCategory,
  deleteTransaction,
  getUserById,
  getUserCategories,
  getUserTransactions,
  updateCategory,
  updateTransaction
} from "../../api/api";

const emptyTransactionForm = () => ({
  nom: "",
  type: "expense",
  montant: "",
  categorie: "",
  date: new Date().toISOString().slice(0, 16)
});

const emptyCategoryForm = {
  name: "",
  type: "expense",
  color: "#60a5fa"
};

export default function UserActivityPage() {
  const { userId } = useParams();
  const { canManageUsers } = useAuth();

  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("transactions");

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionForm, setTransactionForm] = useState(emptyTransactionForm);
  const [transactionFilters, setTransactionFilters] = useState({
    search: "",
    selectedCategory: "all",
    typeFilter: "all",
    startDate: "",
    endDate: ""
  });
  const [transactionPage, setTransactionPage] = useState(1);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [categoryFilters, setCategoryFilters] = useState({
    search: "",
    typeFilter: "all"
  });
  const [categoryPage, setCategoryPage] = useState(1);

  const transactionItemsPerPage = 5;
  const categoryItemsPerPage = 6;

  useEffect(() => {
    fetchData();
  }, [userId]);

  useEffect(() => {
    setTransactionPage(1);
  }, [
    transactionFilters.search,
    transactionFilters.selectedCategory,
    transactionFilters.typeFilter,
    transactionFilters.startDate,
    transactionFilters.endDate
  ]);

  useEffect(() => {
    setCategoryPage(1);
  }, [categoryFilters.search, categoryFilters.typeFilter]);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [userRes, transactionsRes, categoriesRes] = await Promise.all([
        getUserById(userId),
        getUserTransactions(userId),
        getUserCategories(userId)
      ]);

      setUser(userRes.data.data || null);
      setTransactions(transactionsRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } catch (err) {
      console.error("Failed to load user activity:", err);
      setError("Failed to load this user's activity.");
    } finally {
      setLoading(false);
    }
  };

  if (!canManageUsers()) {
    return <Navigate to="/" replace />;
  }

  const normalizedCategories = categories.map((cat) => ({
    id: cat._id || cat.id,
    name: cat.name,
    color: cat.color,
    type: cat.type
  }));

  const filteredTransactionCategories = categories.filter(
    (cat) => cat.type === transactionForm.type
  );

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = (tx.nom || "")
      .toLowerCase()
      .includes(transactionFilters.search.toLowerCase());
    const categoryId = tx.categorie?._id || tx.categorie || "";
    const matchesCategory =
      transactionFilters.selectedCategory === "all" ||
      String(categoryId) === transactionFilters.selectedCategory;
    const matchesType =
      transactionFilters.typeFilter === "all" ||
      tx.type === transactionFilters.typeFilter;
    const txDate = tx.date ? new Date(tx.date) : null;
    const matchesStart = transactionFilters.startDate
      ? txDate >= new Date(transactionFilters.startDate)
      : true;
    const matchesEnd = transactionFilters.endDate
      ? txDate <= new Date(transactionFilters.endDate)
      : true;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesType &&
      matchesStart &&
      matchesEnd
    );
  });

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = (cat.name || "")
      .toLowerCase()
      .includes(categoryFilters.search.toLowerCase());
    const matchesType =
      categoryFilters.typeFilter === "all" ||
      cat.type === categoryFilters.typeFilter;

    return matchesSearch && matchesType;
  });

  const transactionTotalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / transactionItemsPerPage)
  );
  const currentTransactions = filteredTransactions.slice(
    (transactionPage - 1) * transactionItemsPerPage,
    transactionPage * transactionItemsPerPage
  );

  const categoryTotalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / categoryItemsPerPage)
  );
  const currentCategories = filteredCategories.slice(
    (categoryPage - 1) * categoryItemsPerPage,
    categoryPage * categoryItemsPerPage
  );

  const openCreateTransactionModal = () => {
    setEditingTransaction(null);
    setTransactionForm(emptyTransactionForm());
    setIsTransactionModalOpen(true);
  };

  const openEditTransactionModal = (tx) => {
    setEditingTransaction(tx);
    setTransactionForm({
      nom: tx.nom || "",
      type: tx.type || "expense",
      montant: tx.montant ?? "",
      categorie: tx.categorie?._id || tx.categorie || "",
      date: tx.date ? new Date(tx.date).toISOString().slice(0, 16) : ""
    });
    setIsTransactionModalOpen(true);
  };

  const closeTransactionModal = () => {
    setEditingTransaction(null);
    setTransactionForm(emptyTransactionForm());
    setIsTransactionModalOpen(false);
  };

  const openCreateCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm(emptyCategoryForm);
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name || "",
      type: category.type || "expense",
      color: category.color || "#60a5fa"
    });
    setIsCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm(emptyCategoryForm);
    setIsCategoryModalOpen(false);
  };

  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setTransactionForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" ? { categorie: "" } : {})
    }));
  };

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        nom: transactionForm.nom,
        type: transactionForm.type,
        montant: Number(transactionForm.montant),
        categorie: transactionForm.categorie,
        date: transactionForm.date
      };

      const selectedCategory =
        categories.find(
          (cat) => (cat._id || cat.id) === transactionForm.categorie
        ) || null;

      if (editingTransaction) {
        const res = await updateTransaction(editingTransaction._id, payload);
        const savedTransaction = res.data?.transaction || {};

        setTransactions((prev) =>
          prev.map((tx) =>
            tx._id === editingTransaction._id
              ? {
                  ...tx,
                  ...savedTransaction,
                  categorie:
                    selectedCategory || savedTransaction.categorie || tx.categorie
                }
              : tx
          )
        );
      } else {
        const res = await addTransaction({
          ...payload,
          user: userId
        });
        const newTransaction = res.data || {};

        setTransactions((prev) => [
          {
            ...newTransaction,
            categorie: selectedCategory || newTransaction.categorie
          },
          ...prev
        ]);
      }

      closeTransactionModal();
    } catch (err) {
      console.error("Failed to save transaction:", err);
      setError(
        err.response?.data?.message ||
          (editingTransaction
            ? "Failed to update this transaction."
            : "Failed to add this transaction.")
      );
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm("Delete this transaction?")) return;
    setError("");

    try {
      await deleteTransaction(transactionId);
      setTransactions((prev) => prev.filter((tx) => tx._id !== transactionId));
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      setError(
        err.response?.data?.message || "Failed to delete this transaction."
      );
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingCategory) {
        const res = await updateCategory(editingCategory._id, categoryForm);
        const updatedCategory = res.data || {};

        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === editingCategory._id ? updatedCategory : cat
          )
        );
      } else {
        const res = await addCategory({
          ...categoryForm,
          user: userId
        });
        const newCategory = res.data || {};
        setCategories((prev) => [...prev, newCategory]);
      }

      closeCategoryModal();
    } catch (err) {
      console.error("Failed to save category:", err);
      setError(
        err.response?.data?.message ||
          (editingCategory
            ? "Failed to update this category."
            : "Failed to add this category.")
      );
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Delete this category?")) return;
    setError("");

    try {
      await deleteCategory(categoryId);
      setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
    } catch (err) {
      console.error("Failed to delete category:", err);
      setError(
        err.response?.data?.message || "Failed to delete this category."
      );
    }
  };

  const resetCategoryFilters = () => {
    setCategoryFilters({
      search: "",
      typeFilter: "all"
    });
  };

  const renderPagination = (currentPage, totalPages, setPage) => (
    <div className="flex justify-center gap-2 mt-4 flex-wrap">
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        className="rounded-xl bg-sky-600 px-4 py-1 text-white transition hover:bg-sky-700"
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
              onClick={() => setPage(pageNum)}
              className={`px-3 py-1 rounded-lg transition ${
                isActive
                  ? "bg-sky-600 text-white"
                  : "bg-white border border-sky-100 text-gray-700 hover:bg-sky-50"
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
        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        className="rounded-xl bg-sky-600 px-4 py-1 text-white transition hover:bg-sky-700"
      >
        Suivant
      </button>
    </div>
  );

  if (loading) {
    return <p className="p-6">Loading user activity...</p>;
  }

  const userRoleClass =
    user?.role === "admin"
      ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
      : user?.role === "editor"
        ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
        : "bg-violet-100 text-violet-700 ring-1 ring-violet-200";

  return (
    <div className="min-h-screen space-y-6 rounded-[30px] bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 p-6">
      <div className="rounded-[28px] border border-sky-100 bg-white/80 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-700">User Activity</p>
            <h1 className="text-3xl font-bold text-zinc-900">
              {user ? `${user.firstName} ${user.lastName}` : "Unknown User"}
            </h1>
            <p className="mt-1 text-zinc-500">{user?.email || "No email available"}</p>
          </div>
          {user ? (
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${userRoleClass}`}>
              {user.role}
            </span>
          ) : null}
        </div>

        <div className="mt-6 inline-flex rounded-2xl bg-sky-100/80 p-1">
          <button
            onClick={() => setActiveTab("transactions")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === "transactions"
                ? "bg-white text-sky-700 shadow"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            View Transactions
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === "categories"
                ? "bg-white text-sky-700 shadow"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            View Categories
          </button>
        </div>
      </div>

      {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-500">{error}</p> : null}

      {activeTab === "transactions" ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-900">Transactions</h2>
            <button
              onClick={openCreateTransactionModal}
              className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700"
            >
              Add Transaction
            </button>
          </div>

          <FiltersBar
            filters={transactionFilters}
            setFilters={setTransactionFilters}
            categories={normalizedCategories}
          />

          {filteredTransactions.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-sky-200 bg-white/70 px-4 py-8 text-center text-zinc-500">No transactions found for this user.</p>
          ) : (
            <>
              <div className="overflow-hidden rounded-[28px] border border-sky-100 bg-white/85 p-4 shadow-sm backdrop-blur">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-sky-100 text-sm text-zinc-500">
                      <th className="py-3">Name</th>
                      <th className="py-3">Category</th>
                      <th className="py-3">Type</th>
                      <th className="py-3">Amount</th>
                      <th className="py-3">Date</th>
                      <th className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTransactions.map((tx) => (
                      <tr key={tx._id} className="border-b border-sky-50 hover:bg-sky-50/50">
                        <td className="py-2">{tx.nom}</td>
                        <td>{tx.categorie?.name || "Uncategorized"}</td>
                        <td className="capitalize">{tx.type}</td>
                        <td>{tx.montant}</td>
                        <td>{tx.date ? new Date(tx.date).toLocaleDateString() : "-"}</td>
                        <td>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openEditTransactionModal(tx)}
                              className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm text-sky-700 hover:bg-sky-50"
                            >
                              <FiEdit size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(tx._id)}
                              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-red-500 hover:bg-red-50"
                            >
                              <FiTrash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPagination(transactionPage, transactionTotalPages, setTransactionPage)}
            </>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-900">Categories</h2>
            <button
              onClick={openCreateCategoryModal}
              className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700"
            >
              Add Category
            </button>
          </div>

          <div className="max-w-5xl rounded-[28px] border border-sky-100 bg-white/85 p-5 shadow-sm backdrop-blur">
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              <div className="flex w-full items-center gap-2 rounded-2xl bg-sky-50 px-4 py-2 md:w-1/3 focus-within:ring-2 focus-within:ring-sky-400">
                <FiSearch className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={categoryFilters.search}
                  onChange={(e) =>
                    setCategoryFilters((prev) => ({
                      ...prev,
                      search: e.target.value
                    }))
                  }
                  className="bg-transparent outline-none w-full text-sm"
                />
              </div>

              <button
                onClick={resetCategoryFilters}
                className="rounded-2xl border border-sky-100 px-4 py-2 text-sm transition hover:bg-sky-50"
              >
                Réinitialiser
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Type</label>
                <div className="relative">
                  <select
                    value={categoryFilters.typeFilter}
                    onChange={(e) =>
                      setCategoryFilters((prev) => ({
                        ...prev,
                        typeFilter: e.target.value
                      }))
                    }
                    className="w-full appearance-none rounded-2xl bg-sky-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400"
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
              {categoryFilters.search ? (
                <Chip
                  label={`Recherche: ${categoryFilters.search}`}
                  onRemove={() =>
                    setCategoryFilters((prev) => ({ ...prev, search: "" }))
                  }
                />
              ) : null}
              {categoryFilters.typeFilter !== "all" ? (
                <Chip
                  label={`Type: ${
                    categoryFilters.typeFilter === "income" ? "Revenu" : "Dépense"
                  }`}
                  onRemove={() =>
                    setCategoryFilters((prev) => ({ ...prev, typeFilter: "all" }))
                  }
                />
              ) : null}
            </div>
          </div>

          {filteredCategories.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-sky-200 bg-white/70 px-4 py-8 text-center text-zinc-500">No categories found for this user.</p>
          ) : (
            <>
              <div className="overflow-hidden rounded-[28px] border border-sky-100 bg-white/85 p-4 shadow-sm backdrop-blur">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-sky-100 text-sm text-zinc-500">
                      <th className="py-3">Name</th>
                      <th className="py-3">Type</th>
                      <th className="py-3">Color</th>
                      <th className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCategories.map((cat) => (
                      <tr key={cat._id} className="border-b border-sky-50 hover:bg-sky-50/50">
                        <td className="py-2">{cat.name}</td>
                        <td>{cat.type}</td>
                        <td>
                          <span
                            className="inline-block w-4 h-4 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openEditCategoryModal(cat)}
                              className="inline-flex items-center gap-2 rounded-xl px-2 py-1 text-sm text-sky-700 hover:bg-sky-50"
                            >
                              <FiEdit size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat._id)}
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
              {renderPagination(categoryPage, categoryTotalPages, setCategoryPage)}
            </>
          )}
        </>
      )}

      {isTransactionModalOpen ? (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeTransactionModal}
        >
          <div
            className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingTransaction ? "Edit Transaction" : "Add Transaction"}
            </h2>
            <form onSubmit={handleSaveTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="nom"
                  value={transactionForm.nom}
                  onChange={handleTransactionChange}
                  placeholder="Name"
                  className="border rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  name="montant"
                  value={transactionForm.montant}
                  onChange={handleTransactionChange}
                  placeholder="Amount"
                  className="border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  name="type"
                  value={transactionForm.type}
                  onChange={handleTransactionChange}
                  className="border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <select
                  name="categorie"
                  value={transactionForm.categorie}
                  onChange={handleTransactionChange}
                  className="border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Category</option>
                  {filteredTransactionCategories.map((cat) => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="datetime-local"
                name="date"
                value={transactionForm.date}
                onChange={handleTransactionChange}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeTransactionModal}
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

      {isCategoryModalOpen ? (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeCategoryModal}
        >
          <div
            className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h2>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <input
                type="text"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Category name"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              <select
                value={categoryForm.type}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <input
                type="color"
                value={categoryForm.color}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, color: e.target.value }))
                }
                className="w-full h-10"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeCategoryModal}
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
