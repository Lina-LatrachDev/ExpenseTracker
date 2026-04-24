import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";
import FiltersBar from "../../components/Transactions/FiltersBar";
import {
  addTransaction,
  getUserTransactions,
  getUserCategories,
  updateTransaction,
  deleteTransaction
} from "../../api/api";

const emptyForm = () => ({
  nom: "",
  type: "expense",
  montant: "",
  categorie: "",
  date: new Date().toISOString().slice(0, 16)
});

const formatTypeLabel = (type) =>
  type === "income" ? "Revenu" : type === "expense" ? "Depense" : type;

export default function UserTransactionsPage() {
  const { userId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [filters, setFilters] = useState({
    search: "",
    selectedCategory: "all",
    typeFilter: "all",
    startDate: "",
    endDate: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, [userId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters.search,
    filters.selectedCategory,
    filters.typeFilter,
    filters.startDate,
    filters.endDate
  ]);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [transactionsRes, categoriesRes] = await Promise.all([
        getUserTransactions(userId),
        getUserCategories(userId)
      ]);

      setTransactions(transactionsRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } catch (err) {
      console.error("Failed to fetch user transactions:", err);
      setError("Failed to load this user's transactions.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingTransaction(null);
    setFormData(emptyForm());
    setIsModalOpen(true);
  };

  const openEditModal = (tx) => {
    setEditingTransaction(tx);
    setFormData({
      nom: tx.nom || "",
      type: tx.type || "expense",
      montant: tx.montant ?? "",
      categorie: tx.categorie?._id || tx.categorie || "",
      date: tx.date ? new Date(tx.date).toISOString().slice(0, 16) : ""
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
    setFormData(emptyForm());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" ? { categorie: "" } : {})
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        nom: formData.nom,
        type: formData.type,
        montant: Number(formData.montant),
        categorie: formData.categorie,
        date: formData.date
      };

      const selectedCategory =
        categories.find((cat) => (cat._id || cat.id) === formData.categorie) || null;

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

      closeModal();
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

  const handleDelete = async (transactionId) => {
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

  const filteredCategories = categories.filter((cat) => cat.type === formData.type);
  const normalizedCategories = categories.map((cat) => ({
    id: cat._id || cat.id,
    name: cat.name,
    color: cat.color,
    type: cat.type
  }));
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = (tx.nom || "")
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const categoryId = tx.categorie?._id || tx.categorie || "";
    const matchesCategory =
      filters.selectedCategory === "all" ||
      String(categoryId) === filters.selectedCategory;
    const matchesType =
      filters.typeFilter === "all" || tx.type === filters.typeFilter;

    const txDate = tx.date ? new Date(tx.date) : null;
    const matchesStart = filters.startDate
      ? txDate >= new Date(filters.startDate)
      : true;
    const matchesEnd = filters.endDate
      ? txDate <= new Date(filters.endDate)
      : true;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesType &&
      matchesStart &&
      matchesEnd
    );
  });
  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / itemsPerPage)
  );
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <p className="p-6">Loading transactions...</p>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Transactions</h1>
        <button
          onClick={openCreateModal}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white"
        >
          Add Transaction
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <FiltersBar
        filters={filters}
        setFilters={setFilters}
        categories={normalizedCategories}
      />

      {!error && filteredTransactions.length === 0 ? (
        <p>No transactions found for this user.</p>
      ) : null}

      {!error && filteredTransactions.length > 0 ? (
        <div className="bg-white rounded-xl shadow p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-zinc-500">
                <th className="py-2">Name</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((tx) => (
                <tr key={tx._id} className="border-b hover:bg-zinc-50">
                  <td className="py-2">{tx.nom}</td>
                  <td>{tx.categorie?.name || "Uncategorized"}</td>
                  <td>{formatTypeLabel(tx.type)}</td>
                  <td>{tx.montant}</td>
                  <td>{tx.date ? new Date(tx.date).toLocaleDateString() : "-"}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEditModal(tx)}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-violet-600 hover:bg-violet-50"
                      >
                        <FiEdit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tx._id)}
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
      ) : null}

      {!error && filteredTransactions.length > 0 ? (
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
            className="relative bg-white p-6 rounded-xl w-full max-w-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close transaction modal"
              className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
            >
              <FiX size={18} />
            </button>
            <h2 className="text-xl font-semibold mb-4 pr-10">
              {editingTransaction ? "Edit Transaction" : "Add Transaction"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Name"
                  className="border rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  name="montant"
                  value={formData.montant}
                  onChange={handleChange}
                  placeholder="Amount"
                  className="border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>

                <select
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Category</option>
                  {filteredCategories.map((cat) => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm"
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
