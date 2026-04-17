import { deleteUser, updateUserRole } from "../../api/api";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UsersList({ users, onRoleUpdated }) {
  const navigate = useNavigate();
  const { isAdmin, isEditor } = useAuth();
  const canDeleteUsers = isAdmin();

  const roleLabels = {
    admin: "Administrateur",
    editor: "Editeur",
    user: "Utilisateur",
  };

  const roleBadgeClass = (role) =>
    role === "admin"
      ? "bg-amber-100 text-amber-700"
      : role === "editor"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-violet-100 text-violet-700";

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
        <p className="text-lg font-medium">Aucun utilisateur</p>
        <p className="text-sm">Essayez de modifier les filtres</p>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;

    try {
      await deleteUser(id);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePromote = async (user) => {
    try {
      const res = await updateUserRole(user._id || user.id, "editor");
      onRoleUpdated?.(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <th className="px-6 py-4 text-left">Utilisateur</th>
            <th className="px-6 py-4 text-left">Email</th>
            <th className="px-6 py-4 text-left">Role</th>
            <th className="px-6 py-4 text-left">Activite</th>
            {isAdmin() && <th className="px-6 py-4">Role</th>}
            {canDeleteUsers && <th className="px-6 py-4 text-right">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user._id || user.id}
              className="border-b last:border-none hover:bg-zinc-50 transition"
            >
              <td className="px-6 py-4 font-medium text-zinc-800">
                {user.firstName} {user.lastName}
              </td>

              <td className="px-6 py-4 text-zinc-500">{user.email}</td>

              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${roleBadgeClass(
                    user.role
                  )}`}
                >
                  {roleLabels[user.role] || user.role}
                </span>
              </td>

              <td className="px-6 py-4">
                {isEditor() && user.role !== "user" ? (
                  <span className="text-zinc-400 text-xs">Restreint</span>
                ) : (
                  <button
                    onClick={() =>
                      navigate(`/admin/users/${user._id || user.id}/activity`)
                    }
                    className="text-sky-600 hover:text-sky-800 font-medium text-sm"
                  >
                    Voir
                  </button>
                )}
              </td>

              {isAdmin() && (
                <td className="px-6 py-4">
                  {user.role === "user" ? (
                    <button
                      onClick={() => handlePromote(user)}
                      className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600 transition"
                    >
                      Promouvoir
                    </button>
                  ) : (
                    <span className="text-xs text-zinc-400">
                      {user.role === "editor"
                        ? "Déjà éditeur"
                        : "Admin"}
                    </span>
                  )}
                </td>
              )}

              {canDeleteUsers && (
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(user._id || user.id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

{/*import { deleteUser, updateUserRole } from "../../api/api";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UsersList({ users, onRoleUpdated }) {
  const navigate = useNavigate();
  const { isAdmin, isEditor } = useAuth();
  const canDeleteUsers = isAdmin();
  const roleLabels = {
    admin: "Administrateur",
    editor: "Editeur",
    user: "Utilisateur",
  };
  const roleBadgeClass = (role) =>
    role === "admin"
      ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
      : role === "editor"
        ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
        : "bg-violet-100 text-violet-700 ring-1 ring-violet-200";

  if (users.length === 0) {
    return <p>Aucun utilisateur trouve</p>;
  }

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;

    try {
      await deleteUser(id);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePromote = async (user) => {
    try {
      const res = await updateUserRole(user._id || user.id, "editor");
      onRoleUpdated?.(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-sky-100 bg-white/90 shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-sky-100 bg-sky-50/80 text-sm text-zinc-600">
            <th className="px-4 py-3">Nom</th>
            <th className="px-4 py-3">E-mail</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Activite</th>
            {isAdmin() ? <th className="px-4 py-3">Actions sur le role</th> : null}
            {canDeleteUsers ? <th className="px-4 py-3">Suppression</th> : null}
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id || user.id} className="border-b border-sky-50 transition hover:bg-sky-50/50">
              <td className="px-4 py-4">
                {user.firstName} {user.lastName}
              </td>
              <td className="px-4 py-4 text-zinc-600">{user.email}</td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${roleBadgeClass(user.role)}`}
                >
                  {roleLabels[user.role] || user.role}
                </span>
              </td>
              <td className="px-4 py-4">
                {isEditor() && user.role !== "user" ? (
                  <span className="text-sm text-zinc-400">Restreint</span>
                ) : (
                  <button
                    onClick={() => navigate(`/admin/users/${user._id || user.id}/activity`)}
                    className="rounded-xl bg-sky-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-sky-700"
                  >
                    Voir l'activite
                  </button>
                )}
              </td>
              {isAdmin() ? (
                <td className="px-4 py-4">
                  {user.role === "user" ? (
                    <button
                      onClick={() => handlePromote(user)}
                      className="rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-700"
                    >
                      Promouvoir en editeur
                    </button>
                  ) : (
                    <span className="text-sm text-zinc-400">
                      {user.role === "editor" ? "Deja editeur" : "Administrateur"}
                    </span>
                  )}
                </td>
              ) : null}
              {canDeleteUsers ? (
                <td className="px-4 py-4">
                  <button
                    onClick={() => handleDelete(user._id || user.id)}
                    className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 hover:scale-110 transition"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}*/}