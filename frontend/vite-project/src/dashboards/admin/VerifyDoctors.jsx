import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserMd, FaCheckCircle, FaTimesCircle, FaClock, FaSearch, FaIdCard, FaGraduationCap, FaFileAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function VerifyDoctors() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Fetch pending doctors
  useEffect(() => {
    const fetchPendingDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/admin/pending-doctors", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPendingDoctors(response.data);
      } catch (err) {
        console.error("Error fetching pending doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingDoctors();
  }, [token]);

  const handleVerify = async (doctorId, status) => {
    try {
      setProcessingId(doctorId);
      await axios.put(
        `http://localhost:5000/api/admin/verify-doctor/${doctorId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove doctor from list
      setPendingDoctors(pendingDoctors.filter(doc => doc._id !== doctorId));
      
      if (selectedDoctor?._id === doctorId) {
        setSelectedDoctor(null);
      }
    } catch (err) {
      console.error("Error verifying doctor:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredDoctors = pendingDoctors.filter(doctor =>
    doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.speciality?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading pending verifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FaUserMd className="text-yellow-400" />
          Verify Doctors
        </h1>
        <p className="text-gray-400 mt-2">
          Review and approve doctor registrations
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-600/20 p-4 rounded-xl border border-yellow-500/30">
          <div className="text-yellow-400 text-2xl mb-2">⏳</div>
          <div className="text-2xl font-bold">{pendingDoctors.length}</div>
          <div className="text-sm text-gray-400">Pending Verification</div>
        </div>
        <div className="bg-green-600/20 p-4 rounded-xl border border-green-500/30">
          <div className="text-green-400 text-2xl mb-2">✅</div>
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-gray-400">Verified Today</div>
        </div>
        <div className="bg-blue-600/20 p-4 rounded-xl border border-blue-500/30">
          <div className="text-blue-400 text-2xl mb-2">👨‍⚕️</div>
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-gray-400">Total Doctors</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by doctor name, email, or speciality..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-600 outline-none text-white"
          />
        </div>
      </div>

      {pendingDoctors.length === 0 ? (
        <div className="bg-white/5 rounded-xl p-12 text-center border border-white/10">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold mb-2">No Pending Verifications</h3>
          <p className="text-gray-400">
            All doctor registrations have been reviewed. Check back later.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Doctors List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Pending Applications</h2>
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                onClick={() => setSelectedDoctor(doctor)}
                className={`bg-white/5 p-4 rounded-xl border cursor-pointer transition ${
                  selectedDoctor?._id === doctor._id
                    ? "border-yellow-500 bg-yellow-500/10"
                    : "border-white/10 hover:border-yellow-500/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-yellow-600 to-orange-600 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold">
                    {doctor.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Dr. {doctor.name}</h3>
                    <p className="text-sm text-yellow-400">{doctor.speciality || "Specialist"}</p>
                    <p className="text-xs text-gray-400 mt-1">{doctor.email}</p>
                  </div>
                  <div className="text-yellow-400">
                    <FaClock />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Doctor Details & Verification */}
          <div>
            {selectedDoctor ? (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 sticky top-8">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FaIdCard className="text-yellow-400" />
                  Doctor Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Full Name</label>
                    <p className="text-lg font-semibold">Dr. {selectedDoctor.name}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <p className="text-white">{selectedDoctor.email}</p>
                  </div>

                  {selectedDoctor.mobile && (
                    <div>
                      <label className="text-sm text-gray-400">Mobile</label>
                      <p className="text-white">{selectedDoctor.mobile}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-gray-400">Speciality</label>
                    <p className="text-yellow-400 font-medium">{selectedDoctor.speciality || "Not specified"}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Experience</label>
                    <p className="text-white">{selectedDoctor.experience || "Not specified"}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Qualifications</label>
                    <p className="text-white">{selectedDoctor.qualification || "Not specified"}</p>
                  </div>

                  <div className="border-t border-white/10 pt-4 mt-4">
                    <label className="text-sm text-gray-400 mb-2 block">Registration Date</label>
                    <p className="text-sm">
                      {new Date(selectedDoctor.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => handleVerify(selectedDoctor._id, "approved")}
                      disabled={processingId === selectedDoctor._id}
                      className="flex-1 py-3 bg-green-600 rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {processingId === selectedDoctor._id ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <FaCheckCircle />
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleVerify(selectedDoctor._id, "rejected")}
                      disabled={processingId === selectedDoctor._id}
                      className="flex-1 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FaTimesCircle />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-8 text-center border border-white/10 sticky top-8">
                <FaUserMd className="text-4xl text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Select a doctor from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}