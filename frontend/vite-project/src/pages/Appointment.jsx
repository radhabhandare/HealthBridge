import React from "react";
import { motion } from "framer-motion";

export default function Appointment() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-28 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* LEFT – INFO */}
        <div className="p-10 bg-gradient-to-br from-green-600 to-green-700 text-white flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold leading-tight">
            Book Your
            <span className="block text-green-200">Doctor Appointment</span>
          </h1>

          <p className="mt-6 text-green-100">
            Schedule appointments with verified doctors and get quality
            healthcare at your convenience.
          </p>

          <ul className="mt-8 space-y-3 text-green-100">
            <li>✔ Verified Doctors</li>
            <li>✔ Easy Scheduling</li>
            <li>✔ Secure Medical Records</li>
            <li>✔ 24/7 Support</li>
          </ul>
        </div>

        {/* RIGHT – FORM */}
        <div className="p-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Appointment Details
          </h2>
          <p className="text-gray-500 mt-1">
            Fill in the form to confirm your appointment
          </p>

          <form className="mt-8 grid grid-cols-1 gap-5">
            <input
              type="text"
              placeholder="Full Name"
              className="input-modern-light"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="input-modern-light"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              className="input-modern-light"
            />

            <select className="input-modern-light">
              <option>Select Doctor</option>
              <option>Dr. Rahul Sharma – Cardiologist</option>
              <option>Dr. Anjali Mehta – Dermatologist</option>
              <option>Dr. Amit Verma – Neurologist</option>
            </select>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="date" className="input-modern-light" />
              <input type="time" className="input-modern-light" />
            </div>

            <textarea
              rows="4"
              placeholder="Describe your health issue"
              className="input-modern-light resize-none"
            />

            <button
              type="submit"
              className="mt-4 w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 hover:scale-[1.02] transition"
            >
              Confirm Appointment
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
