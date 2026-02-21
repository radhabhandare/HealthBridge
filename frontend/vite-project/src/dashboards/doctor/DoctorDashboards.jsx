import { useNavigate } from "react-router-dom";
import { 
  FaUsers, FaComments, FaCalendarCheck, FaUserMd, 
  FaSignOutAlt, FaUserCircle, FaStar, FaClock,
  FaRupeeSign, FaHospital, FaChartBar
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    rating: 4.8
  });

  useEffect(() => {
    fetchDoctorStats();
  }, []);

  const fetchDoctorStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("http://localhost:5000/api/doctor/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Check if doctor is verified
  if (user && !user.isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 flex items-center justify-center">
        <div className="max-w-md text-center bg-yellow-500/10 p-8 rounded-2xl border border-yellow-500/30">
          <h1 className="text-3xl font-bold text-yellow-400 mb-4">Account Pending Verification</h1>
          <p className="text-gray-300 mb-6">
            Your doctor account is awaiting approval from the admin. 
            You'll be able to access your dashboard once verified.
          </p>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      {/* Header with Doctor Info */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            Dr. {user?.name?.split(" ")[0] || "Doctor"}
          </h1>
          <p className="text-gray-400 mt-2">
            Welcome to your dashboard • Verified Doctor
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || "D"}
            </div>
            <div>
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-gray-400">Verified Doctor</p>
            </div>
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

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          icon={<FaUsers />}
          value={stats.totalPatients}
          label="Total Patients"
          color="blue"
        />
        <StatCard 
          icon={<FaCalendarCheck />}
          value={stats.todayAppointments}
          label="Today's Appointments"
          color="green"
        />
        <StatCard 
          icon={<FaClock />}
          value={stats.pendingAppointments}
          label="Pending"
          color="yellow"
        />
        <StatCard 
          icon={<FaStar />}
          value={stats.rating}
          label="Rating"
          color="purple"
        />
      </div>

      {/* Main Dashboard Actions */}
      <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        <DashboardCard
          icon={<FaUsers size={28} />}
          title="Patient List"
          description="View and manage your patients"
          onClick={() => navigate("/doctor/patients")}
          color="blue"
        />

        <DashboardCard
          icon={<FaComments size={28} />}
          title="Chat with Patients"
          description="Respond to patient queries"
          onClick={() => navigate("/doctor/chat")}
          color="green"
        />

        <DashboardCard
          icon={<FaCalendarCheck size={28} />}
          title="Appointments"
          description="Manage your schedule"
          onClick={() => navigate("/doctor/appointments")}
          color="purple"
        />

        <DashboardCard
          icon={<FaUserCircle size={28} />}
          title="My Profile"
          description="View and edit profile"
          onClick={() => navigate("/doctor/profile")}
          color="orange"
        />

        <DashboardCard
          icon={<FaHospital size={28} />}
          title="Clinic Info"
          description="Manage practice details"
          onClick={() => navigate("/doctor/clinic")}
          color="indigo"
        />

        <DashboardCard
          icon={<FaChartBar size={28} />}
          title="Analytics"
          description="View performance metrics"
          onClick={() => navigate("/doctor/analytics")}
          color="pink"
        />
      </div>

      {/* Today's Schedule */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Today's Schedule</h2>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="space-y-4">
            <ScheduleItem 
              time="10:00 AM"
              patient="Rahul Sharma"
              type="Consultation"
              status="confirmed"
            />
            <ScheduleItem 
              time="11:30 AM"
              patient="Priya Patel"
              type="Follow-up"
              status="pending"
            />
            <ScheduleItem 
              time="2:00 PM"
              patient="Amit Kumar"
              type="New Patient"
              status="confirmed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ icon, title, description, onClick, color = "purple" }) {
  const colorClasses = {
    purple: "hover:border-purple-500/50 group-hover:text-purple-300",
    blue: "hover:border-blue-500/50 group-hover:text-blue-300",
    green: "hover:border-green-500/50 group-hover:text-green-300",
    orange: "hover:border-orange-500/50 group-hover:text-orange-300",
    indigo: "hover:border-indigo-500/50 group-hover:text-indigo-300",
    pink: "hover:border-pink-500/50 group-hover:text-pink-300"
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white/5 p-6 rounded-2xl cursor-pointer hover:scale-105 transition border border-white/10 ${colorClasses[color]} group`}
    >
      <div className={`text-${color}-400 mb-3 group-hover:text-${color}-300`}>{icon}</div>
      <h2 className="text-xl font-semibold mb-1">{title}</h2>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function StatCard({ icon, value, label, color = "purple" }) {
  const colorClasses = {
    purple: "text-purple-400",
    blue: "text-blue-400",
    green: "text-green-400",
    yellow: "text-yellow-400",
    orange: "text-orange-400",
    pink: "text-pink-400"
  };

  return (
    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
      <div className={`${colorClasses[color]} text-2xl mb-2`}>{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

function ScheduleItem({ time, patient, type, status }) {
  const statusColors = {
    confirmed: "text-green-400 bg-green-400/10",
    pending: "text-yellow-400 bg-yellow-400/10",
    cancelled: "text-red-400 bg-red-400/10"
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
      <div className="flex items-center gap-4">
        <span className="text-blue-400 font-medium">{time}</span>
        <div>
          <p className="font-medium">{patient}</p>
          <p className="text-xs text-gray-400">{type}</p>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs ${statusColors[status]}`}>
        {status}
      </span>
    </div>
  );
}