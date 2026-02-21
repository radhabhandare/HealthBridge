import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaCalendarCheck, FaSearch, FaFilter, FaDownload,
  FaUserMd, FaUser, FaClock, FaCheckCircle,
  FaTimesCircle, FaEye, FaFileExport
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function AdminAppointments() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    completed: 0,
    pending: 0
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/admin/all-appointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
      
      // Calculate stats
      const today = new Date().toDateString();
      setStats({
        total: response.data.length,
        today: response.data.filter(app => new Date(app.date).toDateString() === today).length,
        completed: response.data.filter(app => app.status === 'completed').length,
        pending: response.data.filter(app => app.status === 'pending').length
      });
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = 
      app.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.doctorId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "today") {
      return matchesSearch && new Date(app.date).toDateString() === new Date().toDateString();
    }
    if (filter === "completed") {
      return matchesSearch && app.status === "completed";
    }
    if (filter === "pending") {
      return matchesSearch && app.status === "pending";
    }
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaCalendarCheck className="text-purple-400" />
            All Appointments
          </h1>
          <p className="text-gray-400 mt-2">
            Monitor all appointments across the platform
          </p>
        </div>
        <button
          onClick={() => {/* Export functionality */}}
          className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <FaFileExport />
          Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          icon={<FaCalendarCheck />}
          value={stats.total}
          label="Total Appointments"
          color="purple"
        />
        <StatCard 
          icon={<FaClock />}
          value={stats.today}
          label="Today"
          color="blue"
        />
        <StatCard 
          icon={<FaCheckCircle />}
          value={stats.completed}
          label="Completed"
          color="green"
        />
        <StatCard 
          icon={<FaClock />}
          value={stats.pending}
          label="Pending"
          color="yellow"
        />
      </div>

      {/* Search and Filter */}
      <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient or doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
          >
            <option value="all">All Appointments</option>
            <option value="today">Today</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <button className="px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition">
            <FaDownload />
          </button>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Patient</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Doctor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date & Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                        <FaUser className="text-blue-400 text-sm" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.userId?.name || "Unknown"}</p>
                        <p className="text-xs text-gray-400">{appointment.userId?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
                        <FaUserMd className="text-green-400 text-sm" />
                      </div>
                      <div>
                        <p className="font-medium">Dr. {appointment.doctorId?.name || "Unknown"}</p>
                        <p className="text-xs text-gray-400">{appointment.doctorId?.specialization}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{new Date(appointment.date).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-400">{appointment.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      appointment.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      appointment.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {/* View details */}}
                      className="p-2 bg-blue-600/20 rounded-lg hover:bg-blue-600/30 text-blue-400 transition"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <FaCalendarCheck className="text-4xl text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No appointments found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, value, label, color }) {
  const colors = {
    purple: "bg-purple-600/20 border-purple-500/30 text-purple-400",
    blue: "bg-blue-600/20 border-blue-500/30 text-blue-400",
    green: "bg-green-600/20 border-green-500/30 text-green-400",
    yellow: "bg-yellow-600/20 border-yellow-500/30 text-yellow-400"
  };

  return (
    <div className={`${colors[color]} p-4 rounded-xl border`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  );
}