import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function DoctorLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
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

    const result = await login(formData.email, formData.password, "doctor");
    
    if (result.success) {
      navigate("/doctor/dashboard");
    } else {
      setError(result.error || "Login failed");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-black">
      {/* LEFT – INFO / BRAND */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex flex-col justify-center px-16 bg-gradient-to-br from-purple-800 to-black text-white"
      >
        <h1 className="text-5xl font-extrabold leading-tight">
          Doctor
          <span className="block text-purple-300">Dashboard Access</span>
        </h1>

        <p className="mt-6 text-gray-300 text-lg">
          Secure access for verified doctors to manage patients, appointments,
          and consultations efficiently.
        </p>

        <ul className="mt-8 space-y-3 text-gray-300">
          <li>✔ Admin Verified Accounts</li>
          <li>✔ Secure Patient Data</li>
          <li>✔ Smart Appointment System</li>
        </ul>
      </motion.div>

      {/* RIGHT – LOGIN CARD */}
      <div className="flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-black/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-white">
            Doctor Login
          </h2>

          <p className="text-gray-400 mt-1">
            Only admin-approved doctors can access this portal
          </p>

          {/* Error Message */}
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
              placeholder="Doctor Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:ring-2 focus:ring-purple-600 outline-none text-white"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:ring-2 focus:ring-purple-600 outline-none text-white"
              required
            />

            {/* FORGOT PASSWORD */}
            <div className="text-right">
              <span
                onClick={() => navigate("/forgot-password/doctor")}
                className="text-sm text-purple-400 cursor-pointer hover:underline"
              >
                Forgot password?
              </span>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:scale-[1.02] transition disabled:opacity-50"
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

          {/* REGISTER */}
          <button
            onClick={() => navigate("/register/doctor")}
            className="w-full py-3 rounded-xl border border-purple-500 text-purple-400 font-semibold hover:bg-purple-500/10 transition"
          >
            Request Doctor Registration
          </button>

          {/* FOOTER NOTE */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Access will be granted after admin verification
          </p>
        </motion.div>
      </div>
    </div>
  );
}