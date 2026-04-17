import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FiFolder, FiRepeat, FiUsers } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { getAdminDashboard } from "../../api/api";

const emptyDashboard = {
  totals: {
    users: 0,
    transactions: 0,
    categories: 0
  },
  recentUsers: [],
  recentTransactions: []
};

export default function AdminDashboard() {
  const { currentUser, isAdmin } = useAuth();
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getAdminDashboard();
      setDashboard(res.data.data || emptyDashboard);
    } catch (err) {
      console.error("Failed to load admin dashboard:", err);
      setError("Failed to load admin dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  const statCards = [
    {
      title: "Total Utilisateurs",
      value: dashboard.totals.users,
      icon: FiUsers,
      accent: "bg-sky-100 text-sky-600"
    },
    {
      title: "Total Transactions",
      value: dashboard.totals.transactions,
      icon: FiRepeat,
      accent: "bg-emerald-100 text-emerald-600"
    },
    {
      title: "Total Categories",
      value: dashboard.totals.categories,
      icon: FiFolder,
      accent: "bg-violet-100 text-violet-600"
    }
  ];

  return (
    <div className="p-8 space-y-8 bg-zinc-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Admin : {currentUser?.firstName}
          </p>
        </div>

        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-violet-700 active:scale-[0.98] transition"
        >
          Gérer les utilisateurs
        </Link>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          Loading dashboard...
        </div>
      ) : (
        <>
          {/* STATS */}
          <div className="grid gap-6 md:grid-cols-3">
            {statCards.map(({ title, value, icon: Icon, accent }) => (
              <div
                key={title}
                className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500">{title}</p>
                    <p className="mt-2 text-3xl font-semibold text-zinc-900">
                      {value}
                    </p>
                  </div>

                  <div
                    className={`rounded-xl p-3 ${accent} group-hover:scale-105 transition`}
                  >
                    <Icon size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CONTENT */}
          <div className="grid gap-6 xl:grid-cols-2">
            {/* USERS */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900">
                  Utilisateurs Récents
                </h2>
                <span className="text-xs text-zinc-400">
                  {dashboard.recentUsers.length} users
                </span>
              </div>

              <div className="space-y-3">
                {dashboard.recentUsers.length === 0 ? (
                  <p className="text-sm text-zinc-500">Aucun utilisateur à ce moment.</p>
                ) : (
                  dashboard.recentUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between rounded-xl border border-zinc-100 px-4 py-3 hover:bg-zinc-50 transition"
                    >
                      <div>
                        <p className="font-medium text-zinc-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-zinc-500">{user.email}</p>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium capitalize text-zinc-600">
                          {user.role}
                        </span>
                        <p className="mt-1 text-xs text-zinc-400">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* TRANSACTIONS */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900">
                  Transactions Récentes
                </h2>
                <span className="text-xs text-zinc-400">
                  {dashboard.recentTransactions.length} transactions
                </span>
              </div>

              <div className="space-y-3">
                {dashboard.recentTransactions.length === 0 ? (
                  <p className="text-sm text-zinc-500">
                    Aucune transaction pour le moment.
                  </p>
                ) : (
                  dashboard.recentTransactions.map((tx) => (
                    <div
                      key={tx._id}
                      className="flex items-center justify-between rounded-xl border border-zinc-100 px-4 py-3 hover:bg-zinc-50 transition"
                    >
                      <div>
                        <p className="font-medium text-zinc-900">{tx.nom}</p>
                        <p className="text-sm text-zinc-500">
                          {(tx.user?.firstName || "Unknown")}{" "}
                          {(tx.user?.lastName || "")}
                          {" · "}
                          {tx.categorie?.name || "Uncategorized"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            tx.type === "income"
                              ? "text-emerald-600"
                              : "text-red-500"
                          }`}
                        >
                          {tx.type === "income" ? "+" : "-"}
                          {tx.montant}
                        </p>

                        <p className="mt-1 text-xs text-zinc-400">
                          {tx.createdAt
                            ? new Date(tx.createdAt).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}