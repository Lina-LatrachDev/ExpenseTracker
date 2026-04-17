import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

function AccountToggle({ onAddAccountClick }) {
  const { currentUser, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b mb-4 mt-2 pb-4 border-stone-300 relative">

      {/* CURRENT USER */}
      <button
        onClick={() => setOpen(!open)}
        className="
          group flex p-2 rounded-lg gap-2 w-full items-center
          transition-all duration-200 ease-out
          border border-transparent
          hover:border-violet-500/60
          hover:shadow-[0_0_0_1px_rgba(139,92,246,0.25),0_6px_18px_rgba(139,92,246,0.18)]
        "
      >
        {/* Avatar */}
        <img
          src={`https://api.dicebear.com/9.x/notionists/svg?seed=${currentUser?.email || "guest"}`}
          alt="avatar"
          className="size-8 rounded shrink-0 bg-violet-500 shadow transition-transform duration-200 group-hover:scale-105"
        />

        {/* User Info */}
        <div className="text-start">
          <span className="text-sm font-medium text-stone-800 block group-hover:text-violet-600 transition-colors">
            {currentUser
              ? `${currentUser.firstName} ${currentUser.lastName}`
              : "InvitÃ©"}
          </span>
          <span className="text-xs text-stone-500 block group-hover:text-violet-500 transition-colors">
            {currentUser?.email || "Non connectÃ©"}
          </span>
        </div>

        {/* Arrow */}
        <FiChevronDown
          className={`ml-auto text-xs text-stone-500 transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="
            absolute mt-2 w-full
            bg-white
            shadow-lg
            rounded-lg
            p-2
            z-50
            border border-stone-200
          "
        >
          {/* Login / Signup */}
          {!currentUser && (
            <button
              onClick={() => {
                setOpen(false);
                onAddAccountClick();
              }}
              className="w-full text-left p-2 rounded text-sm text-stone-600 hover:bg-stone-100 transition"
            >
              Se connecter
            </button>
          )}

          {/* Divider */}
          <div className="h-px bg-stone-200 my-2" />

          {/* Logout */}
          {currentUser && (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full text-left p-2 rounded text-sm text-stone-500 hover:bg-stone-100 transition"
            >
              Se déconnecter
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AccountToggle;
