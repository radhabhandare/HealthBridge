import React from "react";
import { motion } from "framer-motion";
import {
  FaHeartbeat,
  FaUserMd,
  FaBrain,
  FaNotesMedical,
  FaAmbulance,
  FaLaptopMedical,
} from "react-icons/fa";

const services = [
  {
    icon: <FaUserMd />,
    title: "Doctor Consultation",
    desc: "Online and in-person consultations with verified doctors.",
  },
  {
    icon: <FaHeartbeat />,
    title: "Health Monitoring",
    desc: "Track your vitals and health reports digitally.",
  },
  {
    icon: <FaBrain />,
    title: "Mental Health Care",
    desc: "Confidential mental health support from experts.",
  },
  {
    icon: <FaNotesMedical />,
    title: "Medical Records",
    desc: "Secure storage and access to your medical history.",
  },
  {
    icon: <FaLaptopMedical />,
    title: "AI Health Assistance",
    desc: "Smart AI-driven health recommendations.",
  },
  {
    icon: <FaAmbulance />,
    title: "Emergency Support",
    desc: "Quick access to emergency medical assistance.",
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-white pt-28 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <h1 className="text-4xl font-bold text-green-700">
          Our Healthcare Services
        </h1>
        <p className="text-gray-500 mt-2">
          Comprehensive healthcare solutions designed for you
        </p>

        {/* Services Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="p-8 bg-gray-50 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <div className="text-3xl text-green-600">
                {service.icon}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-800">
                {service.title}
              </h3>
              <p className="mt-2 text-gray-500 text-sm">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
