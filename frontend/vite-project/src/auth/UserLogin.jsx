import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState("user");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(formData.email, formData.password, role);
    
    if (result.success) {
      // Redirect based on role
      if (role === "user") {
        navigate("/user/dashboard");
      } else if (role === "doctor") {
        navigate("/doctor/dashboard");
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-black">
      {/* LEFT – BRAND / INFO */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex flex-col justify-center px-16 bg-gradient-to-br from-purple-800 to-black text-white"
      >
        <h1 className="text-5xl font-extrabold leading-tight">
          Smart Healthcare
          <span className="block text-purple-300">Platform</span>
        </h1>

        <p className="mt-6 text-gray-300 text-lg">
          {role === "user"
            ? "Connect with verified doctors and manage your health digitally."
            : "Access your doctor dashboard and manage patient consultations."}
        </p>

        <ul className="mt-8 space-y-3 text-gray-300">
          <li>✔ Secure Access</li>
          <li>✔ Verified Accounts</li>
          <li>✔ AI-powered System</li>
        </ul>
      </motion.div>

      {/* RIGHT – LOGIN CARD */}
      <div className="flex items-center justify-center px-6">
        <motion.div
          key={role}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-black/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
        >
          {/* ROLE SWITCH */}
          <div className="flex bg-black/40 rounded-xl p-1 mb-6">
            {["user", "doctor"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
                  ${
                    role === r
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
              >
                {r === "user" ? "User Login" : "Doctor Login"}
              </button>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-white">
            {role === "user" ? "User Login" : "Doctor Login"}
          </h2>

          <p className="text-gray-400 mt-1">
            {role === "user"
              ? "Login to continue your healthcare journey"
              : "Only admin-approved doctors can login"}
          </p>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:ring-2 focus:ring-purple-600 outline-none text-white"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:ring-2 focus:ring-purple-600 outline-none text-white"
            />

            {/* FORGOT */}
            <div className="text-right">
              <span
                onClick={() =>
                  navigate(
                    role === "user"
                      ? "/forgot-password/user"
                      : "/forgot-password/doctor"
                  )
                }
                className="text-sm text-purple-400 cursor-pointer hover:underline"
              >
                Forgot password?
              </span>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* REGISTER BUTTON */}
          <button
            onClick={() =>
              navigate(role === "user" ? "/register/user" : "/register/doctor")
            }
            className="w-full py-3 rounded-xl border border-purple-500 text-purple-400 font-semibold hover:bg-purple-500/10 transition"
          >
            Create New {role === "user" ? "User" : "Doctor"} Account
          </button>
        </motion.div>
      </div>
    </div>
  );
}