import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.agree) {
      setError("Please accept terms & privacy policy");
      return;
    }

    setLoading(true);

    // Prepare data for API
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      mobile: formData.mobile,
      gender: formData.gender,
    };

    const result = await register(userData, "user");
    
    if (result.success) {
      navigate("/user/dashboard");
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#6b21a8,_#000)] flex items-center justify-center px-4">
      <div className="bg-black/50 backdrop-blur-2xl p-8 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl text-white">

        {/* Header */}
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Create Account
        </h2>

        <p className="text-center text-gray-400 mt-2 text-sm">
          Join to consult verified doctors
        </p>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <Input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
          />

          <Select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Select>

          <Input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* Consent */}
          <div className="flex items-start gap-3 text-sm text-gray-300">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="mt-1"
              required
            />
            <p>
              I agree to the Terms of Service & Privacy Policy
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-xs text-gray-500">
            Your data is secure and private
          </p>
          
          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login/user")}
              className="text-purple-400 hover:underline"
            >
              Login here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

/* ===== Reusable UI ===== */

const Input = ({ ...props }) => (
  <input
    {...props}
    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:ring-2 focus:ring-purple-600 outline-none text-white"
  />
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:ring-2 focus:ring-purple-600 outline-none text-white"
  >
    {children}
  </select>
);