import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaVenusMars, FaMars, FaChild, FaUserFriends, 
  FaHome, FaUser, FaCog, FaSignOutAlt, FaBars,
  FaTimes, FaUserMd, FaUsers, FaComments,
  FaClock, FaHospital, FaStar, FaChartLine,
  FaBell, FaMoon, FaSun, FaChevronLeft,
  FaChevronRight, FaShieldAlt, FaHeartbeat
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Don't show sidebar on landing page
  if (location.pathname === '/') {
    return null;
  }

  // Different menu items based on user role
  const getMenuItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          { 
            category: 'Main',
            items: [
              { name: 'Dashboard', icon: <FaHome />, path: '/admin/dashboard' },
              { name: 'Verify Doctors', icon: <FaShieldAlt />, path: '/admin/verify-doctors' },
            ]
          },
          {
            category: 'Management',
            items: [
              { name: 'All Doctors', icon: <FaUserMd />, path: '/admin/doctors' },
              { name: 'All Users', icon: <FaUsers />, path: '/admin/users' },
              { name: 'Appointments', icon: <FaClock />, path: '/admin/appointments' },
            ]
          }
        ];

      case 'doctor':
        return [
          {
            category: 'Main',
            items: [
              { name: 'Dashboard', icon: <FaHome />, path: '/doctor/dashboard' },
              { name: 'My Profile', icon: <FaUser />, path: '/doctor/profile' },
              { name: 'Patients', icon: <FaUsers />, path: '/doctor/patients' },
              { name: 'Appointments', icon: <FaClock />, path: '/doctor/appointments' },
              { name: 'Chat', icon: <FaComments />, path: '/doctor/chat' },
            ]
          },
          {
            category: 'Practice',
            items: [
              { name: 'Clinic Info', icon: <FaHospital />, path: '/doctor/clinic' },
              { name: 'Analytics', icon: <FaChartLine />, path: '/doctor/analytics' },
              { name: 'Reviews', icon: <FaStar />, path: '/doctor/reviews' },
            ]
          }
        ];

      default: // user
        return [
          {
            category: 'Main',
            items: [
              { name: 'Dashboard', icon: <FaHome />, path: '/user/dashboard' },
              { name: 'My Profile', icon: <FaUser />, path: '/user/profile' },
              { name: 'Family Members', icon: <FaUserFriends />, path: '/user/family' },
              { name: 'Find Doctors', icon: <FaUserMd />, path: '/doctors' },
            ]
          },
          {
            category: 'Health Categories',
            items: [
              { name: "Women's Health", icon: <FaVenusMars />, path: '/user/health/women' },
              { name: "Men's Health", icon: <FaMars />, path: '/user/health/men' },
              { name: "Elderly Care", icon: <FaUserFriends />, path: '/user/health/elderly' },
              { name: "Child Care", icon: <FaChild />, path: '/user/health/child' },
            ]
          },
          {
            category: 'Health Tools',
            items: [
              { name: 'Health Overview', icon: <FaHeartbeat />, path: '/user/health' },
              { name: 'Appointments', icon: <FaClock />, path: '/appointments' },
            ]
          }
        ];
    }
  };

  const menuSections = getMenuItems();

  // Sidebar content
  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Logo and collapse button */}
      <div className={`p-4 flex items-center justify-between border-b ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              HealthBridge
            </h1>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-lg hidden lg:block ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          {collapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
        </button>
      </div>

      {/* User info */}
      {!collapsed && user && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {user?.name?.split(' ')[0]}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation menu */}
      <div className="flex-1 overflow-y-auto py-4">
        {menuSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            {!collapsed && (
              <h3 className={`px-4 mb-2 text-xs font-semibold uppercase ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {section.category}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item, itemIdx) => (
                <NavLink
                  key={itemIdx}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3 mx-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : darkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom actions */}
      <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-2 rounded-lg mb-2 ${
            darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
          {!collapsed && <span className="text-sm">Theme</span>}
        </button>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-2 rounded-lg ${
            darkMode ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-600'
          }`}
        >
          <FaSignOutAlt />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button - only show when not on landing page */}
      {location.pathname !== '/' && (
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          } shadow-lg`}
        >
          {mobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      )}
      
      {/* Desktop sidebar */}
      {location.pathname !== '/' && (
        <motion.aside
          animate={{ width: collapsed ? 80 : 256 }}
          className={`hidden lg:block fixed left-0 top-0 h-screen ${
            darkMode ? 'bg-gray-800/95' : 'bg-white/95'
          } backdrop-blur-xl border-r ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          } shadow-xl z-30 transition-all duration-300`}
        >
          <SidebarContent />
        </motion.aside>
      )}

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && location.pathname !== '/' && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className={`fixed left-0 top-0 h-screen w-64 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-xl z-50 lg:hidden`}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}