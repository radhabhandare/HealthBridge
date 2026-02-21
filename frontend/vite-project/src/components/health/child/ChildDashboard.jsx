import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaChild, FaSyringe, FaAppleAlt, FaMoon, 
  FaChartLine, FaTint, FaWeight, FaRuler,
  FaClock, FaBell, FaHeartbeat, FaLungs,
  FaBrain, FaTeeth, FaEye, FaRunning,
  FaArrowLeft, FaInfoCircle, FaFileMedical, FaCalendarCheck
} from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';
import Sidebar from '../../Sidebar';

export default function ChildDashboard() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const features = [
    {
      icon: <FaRuler className="text-2xl" />,
      title: 'Growth Tracking',
      description: 'Monitor height, weight, and growth percentiles',
      stats: '50th percentile',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: <FaSyringe className="text-2xl" />,
      title: 'Vaccination Schedule',
      description: 'Track vaccinations and get reminders',
      stats: '4 completed • 2 pending',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <FaAppleAlt className="text-2xl" />,
      title: 'Nutrition Guide',
      description: 'Age-appropriate nutrition and meal plans',
      stats: 'Iron-rich foods',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <FaBrain className="text-2xl" />,
      title: 'Development Milestones',
      description: 'Track cognitive and motor skill development',
      stats: 'On track',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: <FaMoon className="text-2xl" />,
      title: 'Sleep Tracking',
      description: 'Monitor sleep patterns and establish routines',
      stats: '12-14 hrs daily',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: <FaTeeth className="text-2xl" />,
      title: 'Dental Health',
      description: 'Track teething, brushing, and dental visits',
      stats: '8 teeth emerged',
      gradient: 'from-pink-500 to-rose-500',
    }
  ];

  const upcomingVaccinations = [
    { id: 1, name: 'MMR', dueDate: '12 months', status: 'upcoming' },
    { id: 2, name: 'Varicella', dueDate: '15 months', status: 'upcoming' },
    { id: 3, name: 'Hepatitis A', dueDate: '18 months', status: 'upcoming' },
  ];

  const milestones = [
    { age: '3 months', skills: ['Lifts head', 'Follows objects', 'Smiles'] },
    { age: '6 months', skills: ['Sits with support', 'Rolls over', 'Babbles'] },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-yellow-50 to-white'
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
              Child <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">Care</span>
            </h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Track growth, development, and health
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <QuickStat 
            icon={<FaRuler />}
            value="88 cm"
            label="Height"
            change="50th percentile"
            color="green"
            darkMode={darkMode}
          />
          <QuickStat 
            icon={<FaWeight />}
            value="12.8 kg"
            label="Weight"
            change="50th percentile"
            color="blue"
            darkMode={darkMode}
          />
          <QuickStat 
            icon={<FaSyringe />}
            value="6"
            label="Vaccinations"
            change="2 pending"
            color="yellow"
            darkMode={darkMode}
          />
          <QuickStat 
            icon={<FaMoon />}
            value="13h"
            label="Daily Sleep"
            change="Good"
            color="purple"
            darkMode={darkMode}
          />
        </div>

        {/* Upcoming Vaccinations */}
        <div className={`p-6 rounded-2xl mb-8 ${darkMode ? 'bg-white/5' : 'bg-white shadow-lg'}`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <FaSyringe className="text-yellow-500" />
            Upcoming Vaccinations
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {upcomingVaccinations.map((vac) => (
              <div key={vac.id} className="p-4 rounded-lg bg-yellow-500/10">
                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{vac.name}</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Due at {vac.dueDate}</p>
                <span className="mt-2 inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                  Upcoming
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Child Development
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

        {/* Development Milestones */}
        <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white shadow-lg'}`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <FaBrain className="text-purple-500" />
            Development Milestones
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {milestones.map((stage, index) => (
              <div key={index} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stage.age}</h4>
                <ul className="space-y-1">
                  {stage.skills.map((skill, i) => (
                    <li key={i} className={`text-xs flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                      {skill}
                    </li>
                  ))}
                </ul>
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
    green: darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-600',
    blue: darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600',
    yellow: darkMode ? 'bg-yellow-600/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600',
    purple: darkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-600'
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