import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { createUser, getUsers } from "../../api/api";
import UsersList from "../../components/Users/UsersList";
import { useAuth } from "../../context/AuthContext";

const emptyCreateForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "user"
};

export default function UsersPage() {
  const { canManageUsers, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [createError, setCreateError] = useState("");

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

  const openCreateModal = () => {
    setCreateError("");
    setCreateForm(emptyCreateForm);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateError("");
    setCreateForm(emptyCreateForm);
    setIsCreateModalOpen(false);
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateError("");
    setIsCreatingUser(true);

    try {
      await createUser(createForm);
      closeCreateModal();

      if (page !== 1) {
        setPage(1);
      } else {
        await fetchUsers();
      }
    } catch (err) {
      setCreateError(
        err.response?.data?.message || "Impossible de creer cet utilisateur."
      );
    } finally {
      setIsCreatingUser(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8 space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-zinc-900">
            Gestion des utilisateurs
          </h1>

          <p className="max-w-xl text-sm text-zinc-500">
            Recherchez, filtrez, creez et gerez les roles des utilisateurs.
          </p>
        </div>

        {isAdmin() ? (
          <button
            onClick={openCreateModal}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700"
          >
            Ajouter un utilisateur
          </button>
        ) : null}
      </div>

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
          <p className="text-sm text-zinc-500">Editeurs (page)</p>
          <p className="mt-2 text-3xl font-semibold">
            {users.filter((u) => u.role === "editor").length}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-wrap gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher..."
            className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500 md:max-w-sm"
          />

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">Tous les roles</option>
            <option value="admin">Administrateur</option>
            <option value="editor">Editeur</option>
            <option value="user">Utilisateur</option>
          </select>
        </div>

        <div className="text-sm text-zinc-500">
          Page <span className="font-medium">{page}</span> /{" "}
          <span className="font-medium">{totalPages}</span>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-zinc-500">Chargement...</div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {!loading && !error ? (
        <>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <UsersList users={users} onRoleUpdated={handleRoleUpdated} />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="rounded-xl bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Precedent
            </button>

            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === page;

                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= page - 2 && pageNum <= page + 2)
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

                if (pageNum === page - 3 || pageNum === page + 3) {
                  return (
                    <span key={`dots-${pageNum}`} className="px-2 py-1 text-gray-400">
                      ...
                    </span>
                  );
                }

                return null;
              })}
            </div>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="rounded-xl bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </>
      ) : null}

      {isCreateModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={closeCreateModal}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeCreateModal}
              aria-label="Close create user modal"
              className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
            >
              <FiX size={18} />
            </button>

            <h2 className="mb-2 pr-10 text-xl font-semibold text-zinc-900">
              Creer un utilisateur
            </h2>
            <p className="mb-5 text-sm text-zinc-500">
              Les administrateurs peuvent creer des comptes utilisateur ou editeur.
            </p>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {createError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {createError}
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="firstName"
                  value={createForm.firstName}
                  onChange={handleCreateChange}
                  placeholder="Prenom"
                  required
                  className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-violet-500"
                />
                <input
                  type="text"
                  name="lastName"
                  value={createForm.lastName}
                  onChange={handleCreateChange}
                  placeholder="Nom"
                  required
                  className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <input
                type="email"
                name="email"
                value={createForm.email}
                onChange={handleCreateChange}
                placeholder="Email"
                required
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-violet-500"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="password"
                  name="password"
                  value={createForm.password}
                  onChange={handleCreateChange}
                  placeholder="Mot de passe"
                  required
                  minLength={6}
                  className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-violet-500"
                />
                <select
                  name="role"
                  value={createForm.role}
                  onChange={handleCreateChange}
                  className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-violet-500"
                >
                  <option value="user">Utilisateur</option>
                  <option value="editor">Editeur</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="rounded-xl border border-zinc-200 px-4 py-2 text-sm transition hover:bg-zinc-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCreatingUser ? "Creation..." : "Creer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
