import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUsers } from "../../api/api";
import UsersList from "../../components/Users/UsersList";
import { useAuth } from "../../context/AuthContext";

export default function UsersPage() {
  const { canManageUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  if (!canManageUsers()) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchUsers();
  }, [search, role, page]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getUsers({ search, role, page, limit: 10 });
      setUsers(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalUsers(res.data.total || 0);
    } catch (err) {
      setError("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdated = (updatedUser) => {
    setUsers((prev) =>
      prev.map((user) =>
        (user._id || user.id) === (updatedUser.id || updatedUser._id)
          ? { ...user, ...updatedUser, _id: updatedUser.id || updatedUser._id }
          : user
      )
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8 space-y-8">

      {/* HEADER */}
      <div className="space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-sky-600">
          
        </span>

        <h1 className="text-3xl font-semibold text-zinc-900">
          Gestion des utilisateurs
        </h1>

        <p className="text-sm text-zinc-500 max-w-xl">
          Recherchez, filtrez et gérez les rôles des utilisateurs.
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Total utilisateurs</p>
          <p className="mt-2 text-3xl font-semibold">{totalUsers}</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Admins (page)</p>
          <p className="mt-2 text-3xl font-semibold">
            {users.filter((u) => u.role === "admin").length}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Éditeurs (page)</p>
          <p className="mt-2 text-3xl font-semibold">
            {users.filter((u) => u.role === "editor").length}
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm">
        
        <div className="flex flex-wrap gap-3 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher..."
            className="w-full md:max-w-sm px-4 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:ring-2 focus:ring-sky-500"
          />

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">Tous les rôles</option>
            <option value="admin">Administrateur</option>
            <option value="editor">Éditeur</option>
            <option value="user">Utilisateur</option>
          </select>
        </div>

        <div className="text-sm text-zinc-500">
          Page <span className="font-medium">{page}</span> /{" "}
          <span className="font-medium">{totalPages}</span>
        </div>
      </div>

      {/* STATES */}
      {loading && (
        <div className="text-center py-16 text-zinc-500">
          Chargement...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <UsersList users={users} onRoleUpdated={handleRoleUpdated} />
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border text-sm bg-white hover:bg-zinc-100 disabled:opacity-50"
            >
              Précédent
            </button>

            <span className="text-sm text-zinc-500">
              Page {page} sur {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl bg-sky-600 text-white text-sm hover:bg-sky-700 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
}

{/*import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUsers } from "../../api/api";
import UsersList from "../../components/Users/UsersList";
import { useAuth } from "../../context/AuthContext";

export default function UsersPage() {
  const { canManageUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  if (!canManageUsers()) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchUsers();
  }, [search, role, page]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getUsers({ search, role, page, limit: 10 });
      setUsers(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalUsers(res.data.total || 0);
    } catch (err) {
      setError("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdated = (updatedUser) => {
    setUsers((prev) =>
      prev.map((user) =>
        (user._id || user.id) === (updatedUser.id || updatedUser._id)
          ? { ...user, ...updatedUser, _id: updatedUser.id || updatedUser._id }
          : user
      )
    );
  };

  return (
    <div className="min-h-screen space-y-8 rounded-[30px] bg-gradient-to-br from-sky-50 via-cyan-50 to-emerald-50 p-8">
      <div className="rounded-[28px] border border-sky-100 bg-white/80 p-6 shadow-sm backdrop-blur">
        <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
          Gestion des utilisateurs
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
          Administration des utilisateurs
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600">
          Recherchez, filtrez et gerez les roles des utilisateurs sur votre plateforme.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-sky-100 bg-white/85 p-5 shadow-sm backdrop-blur">
          <p className="text-sm font-medium text-sky-700">Utilisateurs au total</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {totalUsers}
          </p>
        </div>

        <div className="rounded-3xl border border-amber-100 bg-white/85 p-5 shadow-sm backdrop-blur">
          <p className="text-sm font-medium text-amber-700">Admins (page actuelle)</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {users.filter((u) => u.role === "admin").length}
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white/85 p-5 shadow-sm backdrop-blur">
          <p className="text-sm font-medium text-emerald-700">Editeurs (page actuelle)</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {users.filter((u) => u.role === "editor").length}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher des utilisateurs..."
            className="w-full rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-sky-400 md:max-w-sm"
          />

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-sky-400"
          >
            <option value="">Tous les roles</option>
            <option value="admin">Administrateur</option>
            <option value="editor">Editeur</option>
            <option value="user">Utilisateur</option>
          </select>
        </div>

        <div className="text-sm text-zinc-500">
          Page <span className="font-medium">{page}</span> sur{" "}
          <span className="font-medium">{totalPages}</span>
        </div>
      </div>

      {/* STATES 
      {loading && (
        <div className="flex justify-center py-16 text-zinc-500">
          Chargement des utilisateurs...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
            <UsersList users={users} onRoleUpdated={handleRoleUpdated} />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="rounded-2xl border border-sky-100 bg-white/80 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-sky-50 disabled:opacity-50"
            >
              Precedent
            </button>

            <span className="text-sm text-zinc-500">
              Affichage de la page {page} sur {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
}*/}