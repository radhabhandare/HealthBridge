import React from "react";
import { useNavigate } from "react-router-dom";
import heroBg from "../../assets/hero-bg.jpg";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      className="min-h-screen bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="w-full min-h-screen bg-black/60 flex items-center">
        <div className="max-w-6xl mx-auto px-6">
          <div className="backdrop-blur-md bg-white/10 p-10 rounded-2xl shadow-2xl max-w-3xl">
            
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              AI-Driven Healthcare <br />
              <span className="text-purple-400">For Every Generation</span>
            </h1>

            <p className="mt-6 text-gray-200 text-lg">
              Smart AI health insights personalized for every age group.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              {/* ✅ USER → USER LOGIN */}
              <button
                onClick={() => navigate("/login/user")}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg"
              >
                Get Started as User
              </button>

              {/* ✅ DOCTOR → DOCTOR LOGIN */}
              <button
                onClick={() => navigate("/login/doctor")}
                className="px-6 py-3 border border-purple-400 text-purple-400 rounded-xl hover:bg-purple-400 hover:text-black transition"
              >
                Register as Doctor
              </button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
