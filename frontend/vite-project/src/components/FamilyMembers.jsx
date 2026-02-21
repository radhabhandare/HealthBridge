import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUserPlus, FaEdit, FaTrash, FaHeart, 
  FaVenusMars, FaMars, FaChild, FaUserFriends,
  FaArrowLeft, FaBell, FaCalendar, FaTint
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import Sidebar from './Sidebar';

export default function FamilyMembers() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [familyMembers, setFamilyMembers] = useState([]);

  // Mock data for demo
  const mockMembers = [
    { id: 1, name: 'John Doe', relationship: 'Self', age: 35, category: 'men', bloodGroup: 'O+' },
    { id: 2, name: 'Jane Doe', relationship: 'Spouse', age: 32, category: 'women', bloodGroup: 'A+' },
    { id: 3, name: 'Baby Doe', relationship: 'Child', age: 5, category: 'child', bloodGroup: 'B+' },
  ];

  const categoryIcons = {
    men: <FaMars className="text-blue-500" />,
    women: <FaVenusMars className="text-pink-500" />,
    child: <FaChild className="text-yellow-500" />,
    elderly: <FaUserFriends className="text-purple-500" />
  };

  const categoryColors = {
    men: 'from-blue-500 to-blue-600',
    women: 'from-pink-500 to-pink-600',
    child: 'from-yellow-500 to-yellow-600',
    elderly: 'from-purple-500 to-purple-600'
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-white'
    }`}>
      <Sidebar />
      
      <div className="p-8 lg:p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              My Family
            </h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage health profiles for your loved ones
            </p>
          </div>
          <button
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition flex items-center gap-2"
          >
            <FaUserPlus /> Add Member
          </button>
        </div>

        {/* Family Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockMembers.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className={`rounded-2xl overflow-hidden ${
                darkMode ? 'bg-white/5' : 'bg-white shadow-lg'
              }`}
            >
              <div className={`bg-gradient-to-r ${categoryColors[member.category]} p-4 text-white`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{categoryIcons[member.category]}</div>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm opacity-90">{member.relationship}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-white/20 rounded">
                      <FaEdit size={14} />
                    </button>
                    <button className="p-1 hover:bg-white/20 rounded">
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className={`text-center p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Age</p>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{member.age}</p>
                  </div>
                  <div className={`text-center p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Blood</p>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{member.bloodGroup}</p>
                  </div>
                </div>
                <button className={`w-full py-2 rounded-lg text-sm ${
                  darkMode ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }`}>
                  View Health Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}