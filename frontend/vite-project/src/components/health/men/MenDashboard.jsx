import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaHeart, FaBrain, FaDumbbell, FaAppleAlt, 
  FaMoon, FaChartLine, FaTint, FaFire,
  FaWeight, FaRunning, FaBolt, FaLeaf,
  FaArrowLeft, FaInfoCircle, FaBell, FaFileMedical,
  FaHeartbeat
} from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';
import Sidebar from '../../Sidebar';

export default function MenDashboard() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const features = [
    {
      icon: <FaHeartbeat className="text-2xl" />,
      title: 'Heart Health',
      description: 'Monitor blood pressure, cholesterol, and cardiovascular health',
      stats: 'BP: 120/80 • Cholesterol: 180',
      gradient: 'from-red-500 to-rose-500',
    },
    {
      icon: <FaBrain className="text-2xl" />,
      title: 'Stress & Mental Health',
      description: 'Track stress levels, anxiety, and mental wellbeing',
      stats: 'Stress: Moderate • Mood: Good',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: <FaTint className="text-2xl" />,
      title: 'Diabetes Risk',
      description: 'Monitor blood sugar, insulin sensitivity, and diabetes risk',
      stats: 'Blood Sugar: 95 mg/dL',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <FaDumbbell className="text-2xl" />,
      title: 'Fitness & Performance',
      description: 'Track workouts, strength, and athletic performance',
      stats: 'Workouts: 4 this week',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: <FaWeight className="text-2xl" />,
      title: 'Weight Management',
      description: 'Track weight, BMI, body fat, and metabolic health',
      stats: 'BMI: 23.5 • Target: 22',
      gradient: 'from-orange-500 to-amber-500',
    },
    {
      icon: <FaMoon className="text-2xl" />,
      title: 'Sleep & Recovery',
      description: 'Monitor sleep quality, duration, and recovery',
      stats: 'Sleep: 7.2h • Quality: Good',
      gradient: 'from-indigo-500 to-purple-500',
    }
  ];

  const upcomingReminders = [
    { id: 1, title: 'Blood Pressure Check', date: 'Tomorrow', icon: <FaHeart />, color: 'red' },
    { id: 2, title: 'Workout Session', date: 'Today 6 PM', icon: <FaDumbbell />, color: 'green' },
    { id: 3, title: 'Cholesterol Test', date: 'In 3 days', icon: <FaTint />, color: 'blue' },
    { id: 4, title: 'Protein Supplement', date: 'Daily', icon: <FaFire />, color: 'orange' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-white'
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
              Men's <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Health</span>
            </h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Optimize your physical and mental performance
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <QuickStat 
            icon={<FaHeart />}
            value="72"
            label="Heart Rate"
            change="Normal"
            color="red"
            darkMode={darkMode}
          />
          <QuickStat 
            icon={<FaBrain />}
            value="42"
            label="Stress Level"
            change="Moderate"
            color="purple"
            darkMode={darkMode}
          />
          <QuickStat 
            icon={<FaFire />}
            value="2,400"
            label="Calories"
            change="Daily target"
            color="orange"
            darkMode={darkMode}
          />
          <QuickStat 
            icon={<FaMoon />}
            value="7.2h"
            label="Sleep"
            change="Good"
            color="blue"
            darkMode={darkMode}
          />
        </div>

        {/* Features Grid */}
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Health Features
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

        {/* Upcoming Reminders */}
        <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white shadow-lg'}`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <FaBell className="text-blue-500" />
            Upcoming Reminders
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingReminders.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  darkMode ? `bg-${item.color}-600/20 text-${item.color}-400` : `bg-${item.color}-100 text-${item.color}-600`
                }`}>
                  {item.icon}
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ icon, value, label, change, color, darkMode }) {
  const colors = {
    red: darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-100 text-red-600',
    purple: darkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-600',
    orange: darkMode ? 'bg-orange-600/20 text-orange-400' : 'bg-orange-100 text-orange-600',
    blue: darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'
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