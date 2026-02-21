import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUserMd, FaUsers, FaCheckCircle, FaClock, 
  FaSignOutAlt, FaShieldAlt, FaUserCheck, 
  FaUserTimes, FaChartBar, FaCalendarCheck,
  FaBell, FaHospital, FaStar, FaMoneyBill
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const [stats, setStats] = useState({
    totalDoctors: 0,
    pendingDoctors: 0,
    verifiedDoctors: 0,
    totalUsers: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [recentDoctors, setRecentDoctors] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all stats in parallel
      const [doctorsRes, pendingRes, usersRes, appointmentsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/all-doctors", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/api/admin/pending-doctors", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/api/admin/all-users", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/api/admin/all-appointments", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const allDoctors = doctorsRes.data;
      const pendingDoctors = pendingRes.data;
      const users = usersRes.data;
      const appointments = appointmentsRes.data;

      // Calculate stats
      const verifiedDoctors = allDoctors.filter(doc => doc.isVerified).length;
      const today = new Date().toDateString();
      const todayApps = appointments.filter(app => 
        new Date(app.createdAt).toDateString() === today
      ).length;

      setStats({
        totalDoctors: allDoctors.length,
        pendingDoctors: pendingDoctors.length,
        verifiedDoctors: verifiedDoctors,
        totalUsers: users.length,
        totalAppointments: appointments.length,
        todayAppointments: todayApps
      });

      // Get recent pending doctors
      setRecentDoctors(pendingDoctors.slice(0, 5));

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <FaShieldAlt className="text-yellow-400" />
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Welcome back, {user?.name} • Platform overview
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-yellow-600/30 px-4 py-2 rounded-lg flex items-center gap-2">
            <FaBell className="text-yellow-400" />
            <span className="text-yellow-400 font-semibold">{stats.pendingDoctors} Pending</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition flex items-center gap-2"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FaUserMd />}
          title="Total Doctors"
          value={stats.totalDoctors}
          color="blue"
          details={[
            { label: "Verified", value: stats.verifiedDoctors, color: "green" },
            { label: "Pending", value: stats.pendingDoctors, color: "yellow" }
          ]}
        />
        
        <StatCard
          icon={<FaUsers />}
          title="Total Users"
          value={stats.totalUsers}
          color="green"
          details={[
            { label: "Active Today", value: "24", color: "blue" }
          ]}
        />
        
        <StatCard
          icon={<FaCalendarCheck />}
          title="Appointments"
          value={stats.totalAppointments}
          color="purple"
          details={[
            { label: "Today", value: stats.todayAppointments, color: "green" }
          ]}
        />
        
        <StatCard
          icon={<FaClock />}
          title="Pending Verifications"
          value={stats.pendingDoctors}
          color="yellow"
          details={[
            { label: "Urgent", value: "2", color: "red" }
          ]}
          onClick={() => navigate("/admin/verify-doctors")}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Verifications */}
        <div className="lg:col-span-2 bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FaClock className="text-yellow-400" />
              Pending Doctor Verifications
            </h2>
            {stats.pendingDoctors > 0 && (
              <span className="bg-yellow-600/30 text-yellow-400 px-3 py-1 rounded-full text-sm">
                {stats.pendingDoctors} pending
              </span>
            )}
          </div>

          {recentDoctors.length > 0 ? (
            <div className="space-y-4">
              {recentDoctors.map((doctor) => (
                <div key={doctor._id} className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-yellow-500/50 transition cursor-pointer"
                  onClick={() => navigate(`/admin/verify-doctors?doctor=${doctor._id}`)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-full flex items-center justify-center text-lg font-bold">
                      {doctor.name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Dr. {doctor.name}</h3>
                      <p className="text-sm text-gray-400">{doctor.speciality || "Specialist"}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="text-gray-500">{doctor.email}</span>
                        <span className="text-gray-500">{doctor.mobile}</span>
                      </div>
                    </div>
                    <div className="text-yellow-400">
                      <FaClock />
                    </div>
                  </div>
                </div>
              ))}
              
              {stats.pendingDoctors > 5 && (
                <button
                  onClick={() => navigate("/admin/verify-doctors")}
                  className="w-full mt-4 py-2 bg-yellow-600/30 hover:bg-yellow-600/50 text-yellow-400 rounded-lg transition"
                >
                  View All {stats.pendingDoctors} Pending Verifications
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-3" />
              <p className="text-gray-400">No pending verifications</p>
            </div>
          )}
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaChartBar className="text-purple-400" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <QuickActionButton
                icon={<FaUserMd />}
                label="Verify Doctors"
                onClick={() => navigate("/admin/verify-doctors")}
                badge={stats.pendingDoctors}
                color="yellow"
              />
              <QuickActionButton
                icon={<FaUsers />}
                label="Manage Users"
                onClick={() => navigate("/admin/users")}
                color="blue"
              />
              <QuickActionButton
                icon={<FaHospital />}
                label="Manage Doctors"
                onClick={() => navigate("/admin/doctors")}
                color="green"
              />
              <QuickActionButton
                icon={<FaCalendarCheck />}
                label="All Appointments"
                onClick={() => navigate("/admin/appointments")}
                color="purple"
              />
            </div>
          </div>

          {/* Platform Stats */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Platform Statistics</h2>
            <div className="space-y-3">
              <ProgressBar 
                label="Doctors Verified" 
                value={stats.verifiedDoctors} 
                total={stats.totalDoctors}
                color="green"
              />
              <ProgressBar 
                label="Users Active" 
                value={stats.totalUsers} 
                total={100}
                color="blue"
              />
              <ProgressBar 
                label="Appointments Completed" 
                value={45} 
                total={stats.totalAppointments}
                color="purple"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <ActivityItem
            icon={<FaUserMd />}
            action="New doctor registration"
            user="Dr. John Smith"
            time="5 minutes ago"
            status="pending"
          />
          <ActivityItem
            icon={<FaCheckCircle />}
            action="Doctor verified"
            user="Dr. Sarah Johnson"
            time="1 hour ago"
            status="approved"
          />
          <ActivityItem
            icon={<FaCalendarCheck />}
            action="New appointment booked"
            user="Patient: Rahul Sharma"
            time="2 hours ago"
            status="info"
          />
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, title, value, color, details, onClick }) {
  const colors = {
    blue: "bg-blue-600/20 border-blue-500/30 text-blue-400",
    green: "bg-green-600/20 border-green-500/30 text-green-400",
    purple: "bg-purple-600/20 border-purple-500/30 text-purple-400",
    yellow: "bg-yellow-600/20 border-yellow-500/30 text-yellow-400",
    red: "bg-red-600/20 border-red-500/30 text-red-400"
  };

  return (
    <div 
      className={`${colors[color]} p-6 rounded-xl border cursor-pointer hover:scale-105 transition`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        <div className="text-3xl font-bold">{value}</div>
      </div>
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      {details && (
        <div className="flex gap-4 text-xs">
          {details.map((detail, i) => (
            <div key={i} className={`text-${detail.color}-400`}>
              {detail.label}: {detail.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Quick Action Button Component
function QuickActionButton({ icon, label, onClick, badge, color }) {
  const colors = {
    yellow: "hover:bg-yellow-600/20 text-yellow-400",
    blue: "hover:bg-blue-600/20 text-blue-400",
    green: "hover:bg-green-600/20 text-green-400",
    purple: "hover:bg-purple-600/20 text-purple-400"
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition ${colors[color]}`}
    >
      <span className="flex items-center gap-3">
        {icon}
        {label}
      </span>
      {badge > 0 && (
        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}

// Progress Bar Component
function ProgressBar({ label, value, total, color }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const colors = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500"
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white">{value}/{total}</span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors[color]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ icon, action, user, time, status }) {
  const statusColors = {
    pending: "text-yellow-400",
    approved: "text-green-400",
    info: "text-blue-400"
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
      <div className={`text-${status === 'pending' ? 'yellow' : status === 'approved' ? 'green' : 'blue'}-400`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm">{action}</p>
        <p className="text-xs text-gray-400">{user}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-400">{time}</p>
        <p className={`text-xs ${statusColors[status]}`}>{status}</p>
      </div>
    </div>
  );
}