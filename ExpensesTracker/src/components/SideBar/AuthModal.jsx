import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext"; 

function AuthModal({ isOpen, onClose, onAuth }) {
  const { login, signup } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (form.password.length < 4) {
    return setError("Mot de passe trop court");
  }

  if (isSignup && form.password !== form.confirmPassword) {
    return setError("Les mots de passe ne correspondent pas");
  }

  try {
    let res;

    if (isSignup) {
      res = await signup(form);
    } else {
      res = await login({
        email: form.email,
        password: form.password
      });
    }

    if (!res.success) {
      return setError(res.message);
    }

    onClose();

  } catch (err) {
    console.error(err);
    setError("Erreur d'authentification");
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <div className="relative bg-white rounded-xl p-6 w-[350px] shadow-xl">

        <h2 className="text-lg font-semibold mb-4">
          {isSignup ? "Créer un compte" : "Connexion"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          {isSignup && (
            <>
              <input
                type="text"
                placeholder="Prénom"
                required
                value={form.firstName}
                className="p-2 border rounded"
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />

              <input
                type="text"
                placeholder="Nom"
                required
                value={form.lastName}
                className="p-2 border rounded"
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            className="p-2 border rounded"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Mot de passe"
            required
            value={form.password}
            className="p-2 border rounded"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {isSignup && (
            <input
              type="password"
              placeholder="Confirmer"
              required
              value={form.confirmPassword}
              className="p-2 border rounded"
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button className="bg-violet-500 text-white p-2 rounded">
            {isSignup ? "Créer" : "Se connecter"}
          </button>
        </form>

        <p className="text-xs mt-4 text-center">
          {isSignup ? "Déjà un compte ?" : "Pas encore de compte ?"}
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
            className="ml-1 text-violet-600"
          >
            {isSignup ? "Connexion" : "Créer un compte"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;