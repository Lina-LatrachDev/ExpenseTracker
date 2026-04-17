import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  getTransactions,
  addTransaction as apiAddTransaction,
  deleteTransaction as apiDeleteTransaction,
  updateTransaction as apiUpdateTransaction
} from "../api/api";

const TransactionContext = createContext();

const normalizeTx = (tx) => ({
  id: tx._id || tx.id,
  nom: tx.nom || "",
  montant: tx.montant || 0,
  type: tx.type || "expense",
  categorie: tx.categorie?._id || tx.categorie || "",
  date: tx.date || new Date().toISOString()
});

export function TransactionProvider({ children }) {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!currentUser) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getTransactions();
      let raw = res.data;

      if (raw.transactions?.docs) raw = raw.transactions.docs;
      else if (raw.transactions) raw = raw.transactions;
      else if (raw.data) raw = raw.data;

      const txs = Array.isArray(raw) ? raw.map(normalizeTx) : [];
      setTransactions(txs);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentUser]);

  const addTransaction = async (tx) => {
    const res = await apiAddTransaction(tx);
    const newTx = normalizeTx(res.data);
    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  };

  const deleteTransaction = async (id) => {
    await apiDeleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTransaction = async (id, updatedData) => {
    const res = await apiUpdateTransaction(id, updatedData);
    const updatedTx = normalizeTx(res.data.transaction || res.data);
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? updatedTx : t))
    );
    return updatedTx;
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        fetchTransactions,
        addTransaction,
        deleteTransaction,
        updateTransaction
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransaction = () => useContext(TransactionContext);

{/*import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext"; // <-- add this
import {
  getTransactions,
  addTransaction as apiAddTransaction,
  deleteTransaction as apiDeleteTransaction,
  updateTransaction as apiUpdateTransaction
} from "../api/api";

const TransactionContext = createContext();

const normalizeTx = (tx) => ({
  id: tx._id || tx.id,
  nom: tx.nom || "",
  montant: tx.montant || 0,
  type: tx.type || "expense",
  categorie: tx.categorie?._id || tx.categorie || "",
  date: tx.date || new Date().toISOString()
});

export function TransactionProvider({ children }) {
  const { currentUser } = useAuth(); // <-- watch current user
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!currentUser) return setTransactions([]);
    setLoading(true);
    try {
      const res = await getTransactions();
      let raw = res.data;
      if (raw.transactions?.docs) raw = raw.transactions.docs;
      else if (raw.transactions) raw = raw.transactions;
      else if (raw.data) raw = raw.data;

      const txs = Array.isArray(raw) ? raw.map(normalizeTx) : [];
      setTransactions(txs);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset/fetch transactions whenever user changes
  useEffect(() => {
    fetchTransactions();
  }, [currentUser]);

  const addTransaction = async (tx) => {
    const res = await apiAddTransaction(tx);
    const newTx = normalizeTx(res.data);
    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  };

  const deleteTransaction = async (id) => {
    await apiDeleteTransaction(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = async (id, updatedData) => {
    const res = await apiUpdateTransaction(id, updatedData);
    const updatedTx = normalizeTx(res.data.transaction || res.data);
    setTransactions(prev => prev.map(t => (t.id === id ? updatedTx : t)));
    return updatedTx;
  };
  

  return (
    <TransactionContext.Provider value={{
      transactions,
      loading,
      fetchTransactions,
      addTransaction,
      deleteTransaction,
      updateTransaction
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransaction = () => useContext(TransactionContext);*/}