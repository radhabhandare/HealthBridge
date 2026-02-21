import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCalendar, FaHeart, FaChild, FaTint, FaBrain, 
  FaChartLine, FaAppleAlt, FaMoon, FaTemperatureHigh,
  FaWeight, FaClock, FaExclamationTriangle, FaCheckCircle,
  FaArrowLeft, FaInfoCircle, FaBell, FaFileMedical
} from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';
import Sidebar from '../../Sidebar';

export default function WomenDashboard() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const features = [
    {
      icon: <FaCalendar className="text-2xl" />,
      title: 'Menstrual Cycle',
      description: 'Track your cycle, predict periods, and monitor symptoms',
      stats: '28 days avg • Next in 5 days',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: <FaHeart className="text-2xl" />,
      title: 'PCOS/PCOD Management',
      description: 'Monitor symptoms, track insulin resistance, and manage hormones',
      stats: 'Low risk • 3 symptoms tracked',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: <FaChild className="text-2xl" />,
      title: 'Pregnancy Care',
      description: 'Track pregnancy stages, fetal development, and prenatal health',
      stats: 'Week 24 • Trimester 2',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <FaTint className="text-2xl" />,
      title: 'Breast Health',
      description: 'Self-exam reminders, breast health tracking, and risk assessment',
      stats: 'Check in 5 days',
      gradient: 'from-teal-500 to-emerald-500',
    },
    {
      icon: <FaBrain className="text-2xl" />,
      title: 'Mental Wellness',
      description: 'Track mood, stress, anxiety, and emotional wellbeing',
      stats: 'Mood: Good • Stress: Moderate',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: <FaAppleAlt className="text-2xl" />,
      title: 'Nutrition & Fitness',
      description: 'Personalized diet plans, workout routines, and supplement tracking',
      stats: 'Iron rich • Calcium rich',
      gradient: 'from-green-500 to-lime-500',
    }
  ];

  const upcomingReminders = [
    { id: 1, title: 'Period Due', date: 'In 3 days', icon: <FaCalendar />, color: 'pink' },
    { id: 2, title: 'Fertility Window', date: 'Starts in 5 days', icon: <FaHeart />, color: 'purple' },
    { id: 3, title: 'Breast Self-Exam', date: 'Tomorrow', icon: <FaTint />, color: 'blue' },
    { id: 4, title: 'Iron Supplement', date: 'Daily', icon: <FaClock />, color: 'green' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-pink-50 to-white'
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
              Women's <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Health</span>
            </h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Complete wellness tracking and insights
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <QuickStat 
            icon={<FaCalendar />}
            value="28"
            label="Avg. Cycle"
            change="Regular"
            color="pink"
            darkMode={darkMode}
          />
          <QuickStat 
            icon={<FaHeart />}
            value="Low"
            label="PCOS Risk"
            change="12% below avg"
            color="purple"
            darkMode={darkMode}
          />
          <QuickStat 
            icon={<FaMoon />}
            value="7.5h"
            label="Avg Sleep"
            change="Good"
            color="blue"
            darkMode={darkMode}
          />
          <QuickStat 
            icon={<FaTemperatureHigh />}
            value="36.6°C"
            label="Avg Temp"
            change="Normal"
            color="green"
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
            <FaBell className="text-pink-500" />
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
    pink: darkMode ? 'bg-pink-600/20 text-pink-400' : 'bg-pink-100 text-pink-600',
    purple: darkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-600',
    blue: darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600',
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