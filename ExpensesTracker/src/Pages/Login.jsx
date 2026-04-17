import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await login(form);

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
      <div className="w-full max-w-md backdrop-blur-lg bg-white/80 border border-white/40 rounded-3xl shadow-xl p-8">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2 text-zinc-800">
          Connectez-vous
        </h2>
        <p className="text-center text-sm text-zinc-500 mb-6">
          Connectez-vous pour continuer à gérer vos finances.
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-500 bg-red-50 border border-red-200 p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder=" "
              value={form.email}
              onChange={handleChange}
              required
              className="peer w-full p-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            />
            <label className="absolute left-3 top-3 text-zinc-400 text-sm transition-all 
              peer-placeholder-shown:top-3 
              peer-placeholder-shown:text-base 
              peer-placeholder-shown:text-zinc-400
              peer-focus:top-[-8px] 
              peer-focus:text-sm 
              peer-focus:text-violet-600
              bg-white px-1">
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder=" "
              value={form.password}
              onChange={handleChange}
              required
              className="peer w-full p-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            />
            <label className="absolute left-3 top-3 text-zinc-400 text-sm transition-all 
              peer-placeholder-shown:top-3 
              peer-placeholder-shown:text-base 
              peer-placeholder-shown:text-zinc-400
              peer-focus:top-[-8px] 
              peer-focus:text-sm 
              peer-focus:text-violet-600
              bg-white px-1">
              Password
            </label>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 text-white p-3 rounded-xl font-semibold 
              hover:bg-violet-700 active:scale-[0.98] transition-all duration-200 shadow-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-500 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-violet-600 font-medium hover:underline">
            S'inscrire
          </Link>
        </p>

      </div>
    </div>
  );
}