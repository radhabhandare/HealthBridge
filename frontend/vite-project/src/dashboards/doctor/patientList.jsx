import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUsers, FaComments, FaCalendarAlt, FaPhone, FaEnvelope, FaMale, FaFemale, FaUserCircle, FaVideo, FaNotesMedical } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function PatientList() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // Fetch real patients from backend
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/doctor/patients", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPatients(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError(err.response?.data?.message || "Failed to load patients");
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [token]);

  const filteredPatients = patients.filter(patient => {
    return patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           patient.condition?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const startChat = (patientId, patientName) => {
    navigate(`/doctor/chat?patientId=${patientId}&patientName=${encodeURIComponent(patientName)}`);
  };

  const viewMedicalHistory = (patientId) => {
    navigate(`/doctor/patient/${patientId}/medical-history`);
  };

  const scheduleAppointment = (patientId) => {
    navigate(`/doctor/appointments/new?patientId=${patientId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your patients...</p>
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
            <FaUsers className="text-blue-400" />
            My Patients
          </h1>
          <p className="text-gray-400 mt-2">
            Manage and communicate with your assigned patients
          </p>
        </div>
        <div className="bg-blue-600/30 px-6 py-3 rounded-xl">
          <span className="text-2xl font-bold text-blue-400">{patients.length}</span>
          <span className="text-gray-400 ml-2">Total Patients</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients by name, email, or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-white"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-400">
          {error}
        </div>
      )}

      {/* Patients List */}
      {filteredPatients.length === 0 ? (
        <div className="bg-white/5 rounded-xl p-12 text-center border border-white/10">
          <div className="text-6xl mb-4">👨‍⚕️</div>
          <h3 className="text-xl font-semibold mb-2">No Patients Assigned Yet</h3>
          <p className="text-gray-400 mb-6">
            You don't have any patients at the moment. Patients will appear here once they book appointments with you.
          </p>
          <button
            onClick={() => navigate("/doctor/dashboard")}
            className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPatients.map((patient) => (
            <div
              key={patient._id}
              className="bg-white/5 hover:bg-white/10 transition p-6 rounded-xl border border-white/10"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Patient Info */}
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold">
                    {patient.name?.charAt(0) || "P"}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{patient.name}</h3>
                    <div className="flex flex-wrap gap-3 mt-1">
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <FaEnvelope className="text-blue-400" />
                        {patient.email}
                      </span>
                      {patient.mobile && (
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <FaPhone className="text-green-400" />
                          {patient.mobile}
                        </span>
                      )}
                      {patient.gender && (
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          {patient.gender === "Male" ? <FaMale className="text-blue-400" /> : <FaFemale className="text-pink-400" />}
                          {patient.gender}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => startChat(patient._id, patient.name)}
                    className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition flex items-center gap-2"
                  >
                    <FaComments />
                    Chat
                  </button>
                  <button
                    onClick={() => scheduleAppointment(patient._id)}
                    className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg transition flex items-center gap-2"
                  >
                    <FaCalendarAlt />
                    Schedule
                  </button>
                  <button
                    onClick={() => viewMedicalHistory(patient._id)}
                    className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition flex items-center gap-2"
                  >
                    <FaNotesMedical />
                    Medical History
                  </button>
                </div>
              </div>

              {/* Last Visit & Condition */}
              {(patient.lastVisit || patient.condition) && (
                <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-4 text-sm">
                  {patient.condition && (
                    <span className="text-gray-400">
                      <span className="text-gray-500">Condition:</span>{" "}
                      <span className="text-yellow-400">{patient.condition}</span>
                    </span>
                  )}
                  {patient.lastVisit && (
                    <span className="text-gray-400">
                      <span className="text-gray-500">Last Visit:</span>{" "}
                      {new Date(patient.lastVisit).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}