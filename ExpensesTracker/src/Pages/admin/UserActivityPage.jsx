import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  FiChevronDown,
  FiEdit,
  FiSearch,
  FiTrash2,
  FiX
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

const formatTypeLabel = (type) =>
  type === "income" ? "Revenu" : type === "expense" ? "Depense" : type;

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
      setError("Impossible de charger l'activite de cet utilisateur.");
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
      console.error("Impossible de sauvegarder la transaction:", err);
      setError(
        err.response?.data?.message ||
          (editingTransaction
            ? "Impossible de mettre a jour cette transaction."
            : "Impossible d'ajouter cette transaction.")
      );
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm("Supprimer cette transaction ?")) return;
    setError("");

    try {
      await deleteTransaction(transactionId);
      setTransactions((prev) => prev.filter((tx) => tx._id !== transactionId));
    } catch (err) {
      console.error("Impossible de supprimer la transaction:", err);
      setError(
        err.response?.data?.message || "Impossible de supprimer cette transaction."
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
            ? "Impossible de mettre a jour cette categorie."
            : "Impossible d'ajouter cette categorie.")
      );
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Supprimer cette categorie ?")) return;
    setError("");

    try {
      await deleteCategory(categoryId);
      setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
    } catch (err) {
      console.error("Impossible de supprimer la categorie:", err);
      setError(
        err.response?.data?.message || "Impossible de supprimer cette categorie."
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
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="rounded-xl bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Precedent
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
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                isActive
                  ? "bg-violet-600 text-white"
                  : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
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
        disabled={currentPage === totalPages}
        className="rounded-xl bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Suivant
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 p-8">
        <div className="flex items-center justify-center rounded-2xl bg-white px-6 py-16 text-zinc-500 shadow-sm">
          Chargement de l'activite de l'utilisateur...
        </div>
      </div>
    );
  }

  const userRoleClass =
    user?.role === "admin"
      ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
      : user?.role === "editor"
        ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
        : "bg-violet-100 text-violet-700 ring-1 ring-violet-200";

  return (
    <div className="min-h-screen space-y-8 bg-zinc-50 p-8">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-600">
              Gestion de l'activite
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-900">
              {user ? `${user.firstName} ${user.lastName}` : "Unknown User"}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {user?.email || "No email available"}
            </p>
          </div>
          {user ? (
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${userRoleClass}`}
            >
              {user.role}
            </span>
          ) : null}
        </div>

        <div className="mt-6 inline-flex rounded-2xl bg-zinc-100 p-1">
          <button
            onClick={() => setActiveTab("transactions")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === "transactions"
                ? "bg-white text-violet-700 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Voir les Transactions
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === "categories"
                ? "bg-white text-violet-700 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Voir les Categories
          </button>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {activeTab === "transactions" ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-zinc-900">
              Transactions
            </h2>
            <button
              onClick={openCreateTransactionModal}
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700"
            >
              Ajouter une Transaction
            </button>
          </div>

          <FiltersBar
            filters={transactionFilters}
            setFilters={setTransactionFilters}
            categories={normalizedCategories}
          />

          {filteredTransactions.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-zinc-200 bg-white px-4 py-8 text-center text-zinc-500 shadow-sm">
              Aucune transaction trouvee pour cet utilisateur.
            </p>
          ) : (
            <>
              <div className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-200 text-sm text-zinc-500">
                      <th className="py-3">Nom</th>
                      <th className="py-3">Categorie</th>
                      <th className="py-3">Type</th>
                      <th className="py-3">Montant</th>
                      <th className="py-3">Date</th>
                      <th className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTransactions.map((tx) => (
                      <tr
                        key={tx._id}
                        className="border-b border-zinc-100 hover:bg-zinc-50"
                      >
                        <td className="py-2">{tx.nom}</td>
                        <td>{tx.categorie?.name || "Uncategorized"}</td>
                        <td>{formatTypeLabel(tx.type)}</td>
                        <td>{tx.montant}</td>
                        <td>
                          {tx.date
                            ? new Date(tx.date).toLocaleDateString()
                            : "-"}
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openEditTransactionModal(tx)}
                              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-violet-600 hover:bg-violet-50"
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
              {renderPagination(
                transactionPage,
                transactionTotalPages,
                setTransactionPage
              )}
            </>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-zinc-900">
              Categories
            </h2>
            <button
              onClick={openCreateCategoryModal}
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700"
            >
              Ajouter une Categorie
            </button>
          </div>

          <div className="max-w-5xl rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between">
              <div className="flex w-full items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 md:w-1/3 focus-within:ring-2 focus-within:ring-violet-500">
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
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>

              <button
                onClick={resetCategoryFilters}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm transition hover:bg-zinc-100"
              >
                Réinitialiser
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="flex flex-col">
                <label className="mb-1 text-xs text-gray-500">Type</label>
                <div className="relative">
                  <select
                    value={categoryFilters.typeFilter}
                    onChange={(e) =>
                      setCategoryFilters((prev) => ({
                        ...prev,
                        typeFilter: e.target.value
                      }))
                    }
                    className="w-full appearance-none rounded-xl bg-gray-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="all">Tous</option>
                    <option value="income">Revenu</option>
                    <option value="expense">Depense</option>
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-3 top-2.5 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
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
                    categoryFilters.typeFilter === "income"
                      ? "Revenu"
                      : "Depense"
                  }`}
                  onRemove={() =>
                    setCategoryFilters((prev) => ({
                      ...prev,
                      typeFilter: "all"
                    }))
                  }
                />
              ) : null}
            </div>
          </div>

          {filteredCategories.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-zinc-200 bg-white px-4 py-8 text-center text-zinc-500 shadow-sm">
              Aucune categorie trouvee pour cet utilisateur.
            </p>
          ) : (
            <>
              <div className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-200 text-sm text-zinc-500">
                      <th className="py-3">Nom</th>
                      <th className="py-3">Type</th>
                      <th className="py-3">Couleur</th>
                      <th className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCategories.map((cat) => (
                      <tr
                        key={cat._id}
                        className="border-b border-zinc-100 hover:bg-zinc-50"
                      >
                        <td className="py-2">{cat.name}</td>
                        <td>{formatTypeLabel(cat.type)}</td>
                        <td>
                          <span
                            className="inline-block h-4 w-4 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openEditCategoryModal(cat)}
                              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-violet-600 hover:bg-violet-50"
                            >
                              <FiEdit size={16} />
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat._id)}
                              className="text-sm text-red-500"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPagination(
                categoryPage,
                categoryTotalPages,
                setCategoryPage
              )}
            </>
          )}
        </>
      )}

      {isTransactionModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={closeTransactionModal}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeTransactionModal}
              aria-label="Close transaction modal"
              className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
            >
              <FiX size={18} />
            </button>
            <h2 className="mb-4 pr-10 text-xl font-semibold text-zinc-900">
              {editingTransaction ? "Modifier Transaction" : "Ajouter Transaction"}
            </h2>
            <form onSubmit={handleSaveTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="nom"
                  value={transactionForm.nom}
                  onChange={handleTransactionChange}
                  placeholder="Nom"
                  className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-violet-500"
                />
                <input
                  type="number"
                  name="montant"
                  value={transactionForm.montant}
                  onChange={handleTransactionChange}
                  placeholder="Montant"
                  className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  name="type"
                  value={transactionForm.type}
                  onChange={handleTransactionChange}
                  className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-violet-500"
                >
                  <option value="expense">Depense</option>
                  <option value="income">Revenu</option>
                </select>
                <select
                  name="categorie"
                  value={transactionForm.categorie}
                  onChange={handleTransactionChange}
                  className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-violet-500"
                >
                  <option value="">Categorie</option>
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
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-violet-500"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeTransactionModal}
                  className="rounded-xl border border-zinc-200 px-4 py-2 text-sm transition hover:bg-zinc-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isCategoryModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={closeCategoryModal}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeCategoryModal}
              aria-label="Close category modal"
              className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
            >
              <FiX size={18} />
            </button>
            <h2 className="mb-4 pr-10 text-xl font-semibold text-zinc-900">
              {editingCategory ? "Modifier la Categorie" : "Ajouter une Categorie"}
            </h2>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <input
                type="text"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Nom de la categorie"
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-violet-500"
              />
              <select
                value={categoryForm.type}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-violet-500"
              >
                <option value="expense">Depense</option>
                <option value="income">Revenu</option>
              </select>
              <input
                type="color"
                value={categoryForm.color}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, color: e.target.value }))
                }
                className="h-10 w-full"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeCategoryModal}
                  className="rounded-xl border border-zinc-200 px-4 py-2 text-sm transition hover:bg-zinc-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
