import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signup(form);

    if (res.success) {
      navigate("/");
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative px-4">

      {/* Purple glow */}
      <div className="absolute w-[500px] h-[500px] bg-violet-600 opacity-30 blur-3xl rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative z-10">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2 text-zinc-800">
          Créer un compte
        </h2>
        <p className="text-center text-sm text-zinc-500 mb-6">
          Commencez à gérer vos finances aujourd'hui
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-500 bg-red-50 border border-red-200 p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* First + Last name row */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
              className="w-full p-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
              className="w-full p-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 text-white p-3 rounded-xl font-semibold 
              hover:bg-violet-700 active:scale-[0.98] transition-all duration-200 shadow-md"
          >
            {loading ? "Création du compte..." : "S'inscrir'"}
          </button>

        </form>

        {/* Footer */}
        <p className="text-sm mt-6 text-center text-zinc-500">
          Vous avez déjà un compte?{" "}
          <Link to="/login" className="text-violet-600 font-medium hover:underline">
            Se connecter
          </Link>
        </p>

      </div>
    </div>
  );
}