import { useNavigate } from "react-router-dom";
import { 
  FaBrain, FaUserMd, FaUser, FaCalendarAlt, FaHeartbeat,
  FaVenusMars, FaMars, FaChild, FaUserFriends, FaBell,
  FaChartLine, FaClock, FaVideo, FaComment, FaStar
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [stats, setStats] = useState({
    appointments: 0,
    doctors: 0,
    reports: 0,
    familyMembers: 0
  });
  const [recommendedDoctors, setRecommendedDoctors] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const doctorsRes = await axios.get("http://localhost:5000/api/doctors/verified", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecommendedDoctors(doctorsRes.data.slice(0, 3));
      
      setStats({
        appointments: 3,
        doctors: doctorsRes.data.length,
        reports: 2,
        familyMembers: 0
      });

      setRecentActivities([
        { id: 1, action: "Appointment booked with Dr. Sharma", time: "2 hours ago", icon: <FaCalendarAlt /> },
        { id: 2, action: "Health report uploaded", time: "1 day ago", icon: <FaChartLine /> },
        { id: 3, action: "Consultation completed", time: "2 days ago", icon: <FaVideo /> },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const categories = [
    { id: "women", icon: <FaVenusMars />, title: "Women's Health", color: "pink", gradient: "from-pink-500 to-rose-500", count: "12+ features", path: "/user/health/women" },
    { id: "men", icon: <FaMars />, title: "Men's Health", color: "blue", gradient: "from-blue-500 to-cyan-500", count: "10+ features", path: "/user/health/men" },
    { id: "elderly", icon: <FaUserFriends />, title: "Elderly Care", color: "purple", gradient: "from-purple-500 to-indigo-500", count: "8+ features", path: "/user/health/elderly" },
    { id: "child", icon: <FaChild />, title: "Child Care", color: "yellow", gradient: "from-yellow-500 to-orange-500", count: "6+ features", path: "/user/health/child" },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-white'
    }`}>
      <Sidebar />
      
      <div className="lg:ml-64">
        <div className="p-8 lg:p-10">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Welcome back, <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {user?.name?.split(" ")[0] || "User"}!
                </span>
              </h1>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your health, your way. Track, monitor, and thrive.
              </p>
            </div>
            
            <button className={`p-3 rounded-xl relative ${
              darkMode ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
            }`}>
              <FaBell />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-4 gap-6 mb-8"
          >
            <StatCard 
              icon={<FaCalendarAlt />}
              value={stats.appointments}
              label="Upcoming Appointments"
              change="+2 this week"
              color="purple"
              darkMode={darkMode}
            />
            <StatCard 
              icon={<FaUserMd />}
              value={stats.doctors}
              label="Available Doctors"
              change="12 online now"
              color="blue"
              darkMode={darkMode}
            />
            <StatCard 
              icon={<FaChartLine />}
              value={stats.reports}
              label="Health Reports"
              change="Updated today"
              color="green"
              darkMode={darkMode}
            />
            <StatCard 
              icon={<FaUserFriends />}
              value={stats.familyMembers}
              label="Family Members"
              change="Add new +"
              color="orange"
              darkMode={darkMode}
              onClick={() => navigate("/user/family")}
            />
          </motion.div>

          {/* Health Categories */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Health Categories
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => navigate(cat.path)}
                  className={`bg-gradient-to-br ${cat.gradient} p-6 rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-all relative overflow-hidden group`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
                  <div className="text-4xl text-white mb-3">{cat.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-1">{cat.title}</h3>
                  <p className="text-white/80 text-sm">{cat.count}</p>
                  <div className="mt-4 flex gap-2">
                    <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">Track</span>
                    <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">Insights</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Quick Actions
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <QuickActionCard
                  icon={<FaBrain />}
                  title="AI Health Overview"
                  description="Get personalized insights"
                  onClick={() => navigate("/user/health")}
                  color="purple"
                  darkMode={darkMode}
                />
                <QuickActionCard
                  icon={<FaUserMd />}
                  title="Find Doctors"
                  description="Search & book appointments"
                  onClick={() => navigate("/doctors")}
                  color="blue"
                  darkMode={darkMode}
                />
                <QuickActionCard
                  icon={<FaUserFriends />}
                  title="Family Members"
                  description="Manage family health"
                  onClick={() => navigate("/user/family")}
                  color="green"
                  darkMode={darkMode}
                />
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`rounded-2xl p-6 ${darkMode ? 'bg-white/5' : 'bg-white shadow-lg'}`}
            >
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{activity.action}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recommended Doctors */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Recommended Doctors
              </h2>
              <button 
                onClick={() => navigate("/doctors")}
                className={`text-sm ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
              >
                View All →
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {recommendedDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor._id}
                  whileHover={{ scale: 1.02 }}
                  className={`rounded-2xl p-6 cursor-pointer ${
                    darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white shadow-lg hover:shadow-xl'
                  } transition-all`}
                  onClick={() => navigate(`/doctors/${doctor._id}`)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                      {doctor.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dr. {doctor.name}</h3>
                      <p className="text-sm text-purple-400">{doctor.specialization}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <FaStar className="text-yellow-400" />
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>4.8</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Available Today</span>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition">
                      Book
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, change, color, darkMode, onClick }) {
  const colors = {
    purple: darkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-600',
    blue: darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600',
    green: darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-600',
    orange: darkMode ? 'bg-orange-600/20 text-orange-400' : 'bg-orange-100 text-orange-600'
  };

  return (
    <div 
      onClick={onClick}
      className={`${colors[color]} p-6 rounded-2xl cursor-pointer hover:scale-105 transition-all ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-2xl">{icon}</div>
        <div className="text-3xl font-bold">{value}</div>
      </div>
      <h3 className="text-sm font-medium mb-1">{label}</h3>
      <p className="text-xs opacity-80">{change}</p>
    </div>
  );
}

function QuickActionCard({ icon, title, description, onClick, color, darkMode }) {
  const colors = {
    purple: darkMode ? 'hover:border-purple-500/50' : 'hover:border-purple-300',
    blue: darkMode ? 'hover:border-blue-500/50' : 'hover:border-blue-300',
    green: darkMode ? 'hover:border-green-500/50' : 'hover:border-green-300'
  };

  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-2xl cursor-pointer hover:scale-105 transition-all border ${
        darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-md'
      } ${colors[color]}`}
    >
      <div className={`text-3xl mb-3 ${darkMode ? `text-${color}-400` : `text-${color}-600`}`}>{icon}</div>
      <h3 className={`text-lg font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
    </div>
  );
}