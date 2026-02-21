import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaCalendarCheck, FaSearch, FaFilter, FaClock,
  FaUserCircle, FaPhone, FaEnvelope, FaCheckCircle,
  FaTimesCircle, FaVideo, FaMapMarkerAlt, FaNotesMedical
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function DoctorAppointments() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, today, upcoming, completed
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/doctor/appointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments(); // Refresh list
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = 
      app.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "today") {
      const today = new Date().toDateString();
      return matchesSearch && new Date(app.date).toDateString() === today;
    }
    if (filter === "upcoming") {
      return matchesSearch && app.status === "pending";
    }
    if (filter === "completed") {
      return matchesSearch && app.status === "completed";
    }
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaCalendarCheck className="text-green-400" />
            My Appointments
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your patient appointments
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition ${
              filter === "all" ? 'bg-green-600' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("today")}
            className={`px-4 py-2 rounded-lg transition ${
              filter === "today" ? 'bg-green-600' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-4 py-2 rounded-lg transition ${
              filter === "upcoming" ? 'bg-green-600' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            Upcoming
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-green-600 outline-none text-white"
          />
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white/5 rounded-xl p-12 text-center border border-white/10">
          <FaCalendarCheck className="text-5xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Appointments Found</h3>
          <p className="text-gray-400">You don't have any appointments at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-green-500/50 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Patient Info */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-teal-600 rounded-full flex items-center justify-center text-xl font-bold">
                    {appointment.userId?.name?.charAt(0) || "P"}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{appointment.userId?.name}</h3>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <FaEnvelope className="text-green-400" />
                        {appointment.userId?.email}
                      </span>
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <FaPhone className="text-blue-400" />
                        {appointment.userId?.mobile || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="flex flex-wrap gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="font-semibold">{new Date(appointment.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Time</p>
                    <p className="font-semibold">{appointment.time}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      appointment.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      appointment.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {appointment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(appointment._id, 'confirmed')}
                        className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition text-sm"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(appointment._id, 'cancelled')}
                        className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {appointment.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(appointment._id, 'completed')}
                      className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      Mark Completed
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/doctor/chat/${appointment.userId?._id}`)}
                    className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition text-sm"
                  >
                    Message
                  </button>
                </div>
              </div>

              {/* Issue/Notes */}
              {appointment.issue && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400 flex items-start gap-2">
                    <FaNotesMedical className="mt-1 text-gray-500" />
                    <span>{appointment.issue}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}