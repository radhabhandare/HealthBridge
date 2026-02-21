import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaStar, FaMapMarkerAlt, FaRupeeSign, FaClock, FaGraduationCap, FaBriefcase, FaStethoscope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Doctors() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    experience: 0
  });

  useEffect(() => {
    fetchVerifiedDoctors();
  }, []);

  const fetchVerifiedDoctors = async () => {
    try {
      setLoading(true);
      // Fetch only verified doctors
      const response = await axios.get("http://localhost:5000/api/doctors/verified");
      setDoctors(response.data);
      
      // Calculate stats
      setStats({
        total: response.data.length,
        available: response.data.filter(d => d.available).length,
        experience: Math.round(response.data.reduce((acc, d) => acc + (parseInt(d.experience) || 0), 0) / response.data.length)
      });
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = 
      doc.name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization?.toLowerCase().includes(search.toLowerCase()) ||
      doc.qualification?.toLowerCase().includes(search.toLowerCase()) ||
      doc.clinicName?.toLowerCase().includes(search.toLowerCase());
    
    const matchesSpecialty = specialty === "all" || doc.specialization === specialty;
    
    return matchesSearch && matchesSpecialty;
  });

  // Get unique specialties for filter
  const specialties = [...new Set(doctors.map(d => d.specialization).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header with Stats */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-700 mb-4">
            Find Your Expert Doctor
          </h1>
          <p className="text-gray-500 text-lg">
            {stats.total} Verified Specialists • Avg {stats.experience}+ Years Experience
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by doctor name, specialization, or clinic..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
            
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            >
              <option value="all">All Specializations</option>
              {specialties.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-4">
          Found <span className="font-semibold text-green-700">{filteredDoctors.length}</span> doctors
        </p>

        {/* Doctors Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc, index) => (
              <motion.div
                key={doc._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Doctor Card Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold border-4 border-white/30">
                      {doc.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Dr. {doc.name}</h3>
                      <p className="text-green-100 flex items-center gap-1 mt-1">
                        <FaStethoscope className="text-sm" />
                        {doc.specialization || "General Physician"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="flex items-center gap-1 text-sm bg-white/20 px-2 py-0.5 rounded-full">
                          <FaStar className="text-yellow-300" /> 4.8
                        </span>
                        <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaBriefcase className="text-green-600" />
                      <span className="text-sm">{doc.experience || "5+"} years</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaGraduationCap className="text-green-600" />
                      <span className="text-sm">{doc.qualification?.split(',')[0] || "MBBS"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt className="text-green-600" />
                      <span className="text-sm">{doc.city || "Mumbai"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaClock className="text-green-600" />
                      <span className="text-sm">Mon-Sat</span>
                    </div>
                  </div>

                  {/* Clinic Info */}
                  {doc.clinicName && (
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-sm text-gray-500">Clinic: {doc.clinicName}</p>
                    </div>
                  )}

                  {/* Fee & Action */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-sm text-gray-500">Consultation Fee</span>
                      <p className="text-xl font-bold text-green-700">
                        <FaRupeeSign className="inline" /> {doc.consultationFee || "500"}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/appointments?doctor=${doc._id}`)}
                      className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition shadow-md"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">👨‍⚕️</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Doctors Found</h3>
            <p className="text-gray-500">
              {search || specialty !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "No verified doctors available at the moment"}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}