import React from "react";
import {
  FiHome,
  FiRepeat,
  FiTag,
  FiBarChart2,
  FiSettings,
  FiTarget,
  FiUsers,
  FiShield
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const RouteSelect = () => {
  const location = useLocation();
  const { isAdmin, isEditor, canManageUsers } = useAuth();

  return (
    <div className="space-y-1">
      <Route Icon={FiHome} title="Dashboard" path="/" location={location} />
      <Route Icon={FiRepeat} title="Transactions" path="/transactions" location={location} />
      <Route Icon={FiTag} title="Categories" path="/categories" location={location} />
      {isAdmin() && (
        <Route Icon={FiShield} title="Admin" path="/admin/dashboard" location={location} accent />
      )}
      {canManageUsers() && (
        <Route
          Icon={FiUsers}
          title={isEditor() ? "Editor Pages" : "Users"}
          path="/admin/users"
          location={location}
          accent
        />
      )}
    </div>
  );
};

const Route = ({ Icon, title, path, location, accent = false }) => {
  const navigate = useNavigate();
  const selected = location.pathname === path;

  return (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center gap-2 w-full rounded px-2 py-1.5 text-sm transition ${
        selected
          ? "bg-white text-stone-950 shadow"
          : accent
            ? "bg-violet-50/70 text-violet-700 hover:bg-violet-100"
            : "hover:bg-stone-200 text-stone-500"
      }`}
    >
      <Icon className={selected ? "text-violet-500" : accent ? "text-violet-500" : ""} />
      <span>{title}</span>
    </button>
  );
};
{/*<Route Icon={FiTarget} title="Budgets" path="/budgets" location={location} disabled />
      <Route Icon={FiBarChart2} title="Analytiques" path="/analytics" location={location} disabled />
      <Route Icon={FiSettings} title="Parametres" path="/settings" location={location} />*/}