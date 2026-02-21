import React from "react";
import {
  FaUserMd,
  FaHeartbeat,
  FaBrain,
  FaStethoscope,
  FaLaptopMedical,
  FaAmbulance,
  FaLock,
  FaBell,
  FaFileMedicalAlt,
} from "react-icons/fa";

import featuresBg from "../../assets/features-bg.jpg";

export default function Features() {
  const features = [
    {
      icon: <FaHeartbeat size={36} className="text-red-400" />,
      title: "AI Health Analysis",
      desc: "AI-driven predictions using health data, habits, and medical patterns.",
    },
    {
      icon: <FaUserMd size={36} className="text-blue-400" />,
      title: "Verified Doctors",
      desc: "Only admin-approved certified doctors can provide consultations.",
    },
    {
      icon: <FaBrain size={36} className="text-purple-400" />,
      title: "Mental Health AI",
      desc: "Mood, stress, anxiety & burnout analysis for all age groups.",
    },
    {
      icon: <FaStethoscope size={36} className="text-green-400" />,
      title: "Free First Consultation",
      desc: "First consultation is completely free for every user.",
    },
    {
      icon: <FaAmbulance size={36} className="text-yellow-400" />,
      title: "Emergency Assistance",
      desc: "Instant access to nearby verified doctors and clinics.",
    },
    {
      icon: <FaLaptopMedical size={36} className="text-pink-400" />,
      title: "24/7 Telemedicine",
      desc: "Consult doctors anytime through secure video & chat support.",
    },
    {
      icon: <FaLock size={36} className="text-gray-300" />,
      title: "Secure Medical Records",
      desc: "End-to-end encrypted medical records with privacy control.",
    },
    {
      icon: <FaFileMedicalAlt size={36} className="text-cyan-400" />,
      title: "AI Health Reports",
      desc: "Personalized health reports with trends, risks, and recommendations.",
    },
    {
      icon: <FaBell size={36} className="text-orange-400" />,
      title: "Smart Reminders & Alerts",
      desc: "Medicine reminders, health check alerts, and follow-up notifications.",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 bg-cover bg-center"
      style={{ backgroundImage: `url(${featuresBg})` }}
    >
      <div className="bg-black/75 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-white">
            Platform <span className="text-purple-400">Features</span>
          </h2>

          <p className="text-center text-gray-300 max-w-3xl mx-auto mt-6">
            A complete AI-powered healthcare ecosystem designed for every generation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
            {features.map((item, i) => (
              <div
                key={i}
                className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-xl
                           hover:scale-105 transition duration-300"
              >
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>

                <h3 className="text-xl font-semibold text-purple-300 text-center">
                  {item.title}
                </h3>

                <p className="text-gray-200 text-center mt-3 text-sm leading-relaxed">
                  {item.desc}
                  <br />
                  <span className="text-gray-400 text-xs">
                    Designed to support smarter, faster, and safer healthcare decisions.
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
