import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaHeartbeat, FaPills, FaSyringe, FaAppleAlt, 
  FaMoon, FaChartLine, FaTint, FaWheelchair,
  FaWeight, FaClock, FaBell, FaExclamationTriangle,
  FaArrowLeft, FaInfoCircle, FaFileMedical, FaLungs,
  FaBrain, FaEye, FaEarListen, FaBone
} from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';
import Sidebar from '../../Sidebar';

export default function ElderlyDashboard() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const features = [
    {
      icon: <FaHeartbeat className="text-2xl" />,
      title: 'Blood Pressure',
      description: 'Track BP, get alerts, and maintain healthy levels',
      stats: '125/82 • Normal',
      gradient: 'from-red-500 to-rose-500',
    },
    {
      icon: <FaTint className="text-2xl" />,
      title: 'Blood Sugar',
      description: 'Monitor glucose levels and diabetes management',
      stats: '115 mg/dL • Normal',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <FaPills className="text-2xl" />,
      title: 'Medication Reminders',
      description: 'Never miss a dose with smart reminders',
      stats: '5 medications',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: <FaExclamationTriangle className="text-2xl" />,
      title: 'Fall Detection',
      description: 'Automatic fall detection and emergency alerts',
      stats: '0 falls this month',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: <FaBrain className="text-2xl" />,
      title: 'Cognitive Health',
      description: 'Brain exercises and memory tracking',
      stats: 'Score: 85%',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: <FaBone className="text-2xl" />,
      title: 'Bone Health',
      description: 'Track bone density and prevent osteoporosis',
      stats: 'T-score: -1.2',
      gradient: 'from-yellow-500 to-amber-500',
    }
  ];

  const medications = [
    { id: 1, name: 'Lisinopril', dosage: '10mg', time: '8:00 AM', taken: true },
    { id: 2, name: 'Metformin', dosage: '500mg', time: '8:00 AM', taken: true },
    { id: 3, name: 'Aspirin', dosage: '81mg', time: '8:00 AM', taken: false },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-purple-50 to-white'
    }`}>
      <Sidebar />
      
      <div className="p-8 lg:p-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/user/dashboard')}
            className={`p-2 rounded-lg ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            } transition`}
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Elderly <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Care</span>
            </h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive senior health monitoring
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <QuickStat 
            icon={<FaHeartbeat />}
            value="125/82"
            label="Blood Pressure"
            change="Normal"
            color="red"
            darkMode={darkMode}
          />
          <QuickStat 
            icon={<FaTint />}
            value="115"
            label="Blood Sugar"
            change="Normal"
            color="blue"
            darkMode={darkMode}
          />
          <QuickStat 
            icon={<FaPills />}
            value="5"
            label="Medications"
            change="2 due today"
            color="purple"
            darkMode={darkMode}
          />
          <QuickStat 
            icon={<FaMoon />}
            value="7.2h"
            label="Sleep"
            change="Good"
            color="green"
            darkMode={darkMode}
          />
        </div>

        {/* Today's Medications */}
        <div className={`p-6 rounded-2xl mb-8 ${darkMode ? 'bg-white/5' : 'bg-white shadow-lg'}`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <FaPills className="text-purple-500" />
            Today's Medications
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {medications.map((med) => (
              <div key={med.id} className={`p-4 rounded-xl flex items-center justify-between ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div>
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{med.name}</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{med.dosage} • {med.time}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  med.taken 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {med.taken ? 'Taken' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Care Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-2xl cursor-pointer ${
                darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white shadow-lg hover:shadow-xl'
              } transition-all`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white text-xl mb-4`}>
                {feature.icon}
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{feature.title}</h3>
              <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{feature.description}</p>
              
              <div className="mb-3">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  darkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {feature.stats}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickStat({ icon, value, label, change, color, darkMode }) {
  const colors = {
    red: darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-100 text-red-600',
    blue: darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600',
    purple: darkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-600',
    green: darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-600'
  };

  return (
    <div className={`p-4 rounded-xl ${colors[color]}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="text-xl">{icon}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
      <p className="text-sm font-medium mb-1">{label}</p>
      <p className="text-xs opacity-80">{change}</p>
    </div>
  );
}