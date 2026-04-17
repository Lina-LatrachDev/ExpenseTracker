import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";

import { TransactionProvider } from "./context/TransactionContext";
import { CategoryProvider } from "./context/CategoryContext";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";

import TransactionForm from "./components/Transactions/TransactionForm";
import TransactionPage from "./pages/TransactionPage";
import CategoriesPage from "./pages/CategoriesPage";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/SideBar/SideBar";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";
import UserActivityPage from "./pages/admin/UserActivityPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function LegacyUserActivityRedirect() {
  const { userId } = useParams();
  return <Navigate to={`/admin/users/${userId}/activity`} replace />;
}

function AppContent() {
  const { currentUser, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleEditTransaction = (tx) => {
    setEditingTransaction(tx);
    setShowModal(true);
  };

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-[220px_minmax(0,1fr)] gap-4 bg-zinc-50 p-4">
      <Sidebar
        currentAccount={currentUser}
        onLogout={logout}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="relative min-w-0">
        <Routes>
          <Route
            path="/"
            element={<Dashboard searchTerm={searchTerm} onEdit={handleEditTransaction} />}
          />
          <Route
            path="/transactions"
            element={<TransactionPage onEdit={handleEditTransaction} searchTerm={searchTerm} />}
          />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<Navigate to="/admin/users" replace />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/users/:userId/activity" element={<UserActivityPage />} />
          <Route path="/admin/users/:userId/transactions" element={<LegacyUserActivityRedirect />} />
          <Route path="/admin/users/:userId/categories" element={<LegacyUserActivityRedirect />} />
        </Routes>

        <button
          onClick={() => {
            setEditingTransaction(null);
            setShowModal(true);
          }}
          className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-2xl text-white shadow-lg transition hover:scale-105 hover:bg-violet-700"
        >
          +
        </button>

        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <TransactionForm
                editingTransaction={editingTransaction}
                onClose={() => setShowModal(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CategoryProvider>
          <TransactionProvider>
            <AppContent />
          </TransactionProvider>
        </CategoryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
