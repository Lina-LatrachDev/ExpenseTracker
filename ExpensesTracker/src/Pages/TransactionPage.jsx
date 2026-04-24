import { useState, useEffect } from "react";

import { useTransaction } from "../context/TransactionContext";
import { useCategory } from "../context/CategoryContext";

import TransactionList from "../components/Transactions/TransactionList";
import FiltersBar from "../components/Transactions/FiltersBar";

export default function TransactionsPage({ onEdit }) {
  const { transactions, deleteTransaction } = useTransaction();
  const { categories } = useCategory();

  // ✅ ONE state only
  const [filters, setFilters] = useState({
    search: "",
    selectedCategory: "all",
    typeFilter: "all",
    startDate: "",
    endDate: ""
  });

  // ✅ destructure AFTER state
  const { search, selectedCategory, typeFilter, startDate, endDate } = filters;

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- Filtering ---
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch =
      (tx.nom || "").toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      tx.categorie?.toString() === selectedCategory;

    const matchesType =
      typeFilter === "all" || tx.type === typeFilter;

    const txDate = tx.date ? new Date(tx.date) : null;

    const matchesStart =
      startDate ? txDate >= new Date(startDate) : true;

    const matchesEnd =
      endDate ? txDate <= new Date(endDate) : true;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesType &&
      matchesStart &&
      matchesEnd
    );
  });

  // --- Pagination ---
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- Reset page on filter change ---
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, typeFilter, startDate, endDate]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">
        Transactions
      </h1>

      {/* ✅ ONLY this (no old filters anymore) */}
      <FiltersBar
        filters={filters}
        setFilters={setFilters}
        categories={categories}
      />

      {/* --- List --- */}
      <TransactionList
        transactions={currentTransactions}
        categories={categories}
        deleteTransaction={deleteTransaction}
        onEdit={onEdit}
      />

      {/* --- Pagination --- */}
      <div className="flex justify-center gap-2 mt-4 flex-wrap">

        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="rounded-xl bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Précédent
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .map(pageNum => {
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
                  className={`rounded-lg px-3 py-1.5 text-sm transition
                    ${isActive
                      ? "bg-violet-600 text-white"
                      : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                    }`}
                >
                  {pageNum}
                </button>
              );
            }

            if (
              pageNum === currentPage - 3 ||
              pageNum === currentPage + 3
            ) {
              return (
                <span key={`dots-${pageNum}`} className="px-2 py-1 text-gray-400">
                  ...
                </span>
              );
            }

            return null;
          })
        }

        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="rounded-xl bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Suivant
        </button>

      </div>
    </div>
  );
}
