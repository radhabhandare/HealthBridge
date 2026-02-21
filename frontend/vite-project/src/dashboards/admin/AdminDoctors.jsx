import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUserMd, FaSearch, FaCheckCircle, FaTimesCircle,
  FaClock, FaStar, FaHospital, FaGraduationCap,
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaFilter,
  FaEye, FaEdit, FaTrash, FaBan, FaDownload
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function AdminDoctors() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, verified, pending
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/admin/all-doctors", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "verified") return matchesSearch && doctor.isVerified;
    if (filter === "pending") return matchesSearch && !doctor.isVerified;
    return matchesSearch;
  });

  const stats = {
    total: doctors.length,
    verified: doctors.filter(d => d.isVerified).length,
    pending: doctors.filter(d => !d.isVerified).length,
    active: doctors.filter(d => d.isActive !== false).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading doctors...</p>
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
            <FaUserMd className="text-purple-400" />
            Manage Doctors
          </h1>
          <p className="text-gray-400 mt-2">
            View and manage all registered doctors
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/verify-doctors")}
            className="px-4 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700 transition flex items-center gap-2"
          >
            <FaClock />
            Pending ({stats.pending})
          </button>
          <button
            onClick={fetchDoctors}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          icon={<FaUserMd />}
          value={stats.total}
          label="Total Doctors"
          color="purple"
        />
        <StatCard 
          icon={<FaCheckCircle />}
          value={stats.verified}
          label="Verified"
          color="green"
        />
        <StatCard 
          icon={<FaClock />}
          value={stats.pending}
          label="Pending"
          color="yellow"
        />
        <StatCard 
          icon={<FaStar />}
          value="4.8"
          label="Avg Rating"
          color="blue"
        />
      </div>

      {/* Search and Filter */}
      <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or specialization..."
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
            <option value="all">All Doctors</option>
            <option value="verified">Verified Only</option>
            <option value="pending">Pending Only</option>
          </select>
          <button className="px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition flex items-center gap-2">
            <FaDownload />
            Export
          </button>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor._id}
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition cursor-pointer"
            onClick={() => setSelectedDoctor(doctor)}
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold">
                {doctor.name?.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Dr. {doctor.name}</h3>
                <p className="text-purple-400 text-sm">{doctor.specialization || "General Physician"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    doctor.isVerified
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {doctor.isVerified ? 'Verified' : 'Pending'}
                  </span>
                  <span className="text-xs text-gray-400">
                    <FaStar className="inline text-yellow-400 mr-1" />
                    4.8
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <p className="text-gray-400 flex items-center gap-2">
                <FaEnvelope className="text-gray-500" />
                {doctor.email}
              </p>
              <p className="text-gray-400 flex items-center gap-2">
                <FaPhone className="text-gray-500" />
                {doctor.mobile || "Not provided"}
              </p>
              <p className="text-gray-400 flex items-center gap-2">
                <FaGraduationCap className="text-gray-500" />
                {doctor.qualification || "MBBS, MD"}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/verify-doctors?doctor=${doctor._id}`);
                }}
                className="flex-1 py-2 bg-purple-600/20 rounded-lg hover:bg-purple-600/30 text-purple-400 transition text-sm"
              >
                View Details
              </button>
              {!doctor.isVerified && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Quick approve
                  }}
                  className="px-4 py-2 bg-green-600/20 rounded-lg hover:bg-green-600/30 text-green-400 transition"
                >
                  <FaCheckCircle />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <DoctorDetailsModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onVerify={fetchDoctors}
          token={token}
        />
      )}
    </div>
  );
}

// Doctor Details Modal Component
function DoctorDetailsModal({ doctor, onClose, onVerify, token }) {
  const [loading, setLoading] = useState(false);

  const handleVerify = async (status) => {
    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5000/api/admin/verify-doctor/${doctor._id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onVerify();
      onClose();
    } catch (error) {
      console.error("Error verifying doctor:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaUserMd className="text-purple-400" />
            Doctor Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <FaTimesCircle />
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-3xl font-bold">
              {doctor.name?.charAt(0)}
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Dr. {doctor.name}</h3>
              <p className="text-purple-400">{doctor.specialization || "General Physician"}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  doctor.isVerified
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {doctor.isVerified ? 'Verified' : 'Pending Verification'}
                </span>
                <span className="text-sm text-gray-400">
                  <FaStar className="inline text-yellow-400 mr-1" />
                  4.8 (120 reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Email" value={doctor.email} icon={<FaEnvelope />} />
            <DetailItem label="Mobile" value={doctor.mobile || "Not provided"} icon={<FaPhone />} />
            <DetailItem label="Qualification" value={doctor.qualification || "MBBS, MD"} icon={<FaGraduationCap />} />
            <DetailItem label="Experience" value={doctor.experience || "8 years"} icon={<FaStar />} />
            <DetailItem label="Specialization" value={doctor.specialization || "Cardiologist"} icon={<FaUserMd />} />
            <DetailItem label="Registration No." value={doctor.registrationNumber || "MRC-12345"} icon={<FaCheckCircle />} />
            <DetailItem label="Clinic" value={doctor.clinicName || "City Hospital"} icon={<FaHospital />} />
            <DetailItem label="Address" value={doctor.clinicAddress || "Mumbai"} icon={<FaMapMarkerAlt />} />
          </div>

          {/* Documents */}
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Uploaded Documents</h4>
            <div className="grid grid-cols-2 gap-3">
              <DocumentLink label="Degree Certificate" file={doctor.degreeCertificate} />
              <DocumentLink label="Medical License" file={doctor.medicalLicense} />
              <DocumentLink label="Identity Proof" file={doctor.identityProof} />
              <DocumentLink label="Profile Photo" file={doctor.profilePhoto} />
            </div>
          </div>

          {/* Action Buttons */}
          {!doctor.isVerified && (
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => handleVerify("approved")}
                disabled={loading}
                className="flex-1 py-3 bg-green-600 rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (
                  <>
                    <FaCheckCircle />
                    Approve Doctor
                  </>
                )}
              </button>
              <button
                onClick={() => handleVerify("rejected")}
                disabled={loading}
                className="flex-1 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FaTimesCircle />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, value, label, color }) {
  const colors = {
    purple: "bg-purple-600/20 border-purple-500/30 text-purple-400",
    green: "bg-green-600/20 border-green-500/30 text-green-400",
    yellow: "bg-yellow-600/20 border-yellow-500/30 text-yellow-400",
    blue: "bg-blue-600/20 border-blue-500/30 text-blue-400"
  };

  return (
    <div className={`${colors[color]} p-4 rounded-xl border`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  );
}

// Detail Item Component
function DetailItem({ label, value, icon }) {
  return (
    <div className="bg-white/5 p-3 rounded-lg flex items-start gap-3">
      <div className="text-gray-400 mt-1">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm mt-1">{value}</p>
      </div>
    </div>
  );
}

// Document Link Component
function DocumentLink({ label, file }) {
  if (!file) return null;
  
  return (
    <a
      href={`http://localhost:5000/uploads/${file}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition"
    >
      <FaEye className="text-blue-400" />
      <span className="text-sm">{label}</span>
    </a>
  );
}