import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaCalendar, FaEdit, FaSave, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Profile() {
  const navigate = useNavigate();
  const { user, authRequest } = useAuth();
  const { darkMode } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const result = await authRequest('get', '/api/user/profile');
      if (result.success) {
        setProfile(result.data);
        setFormData(result.data);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    try {
      const result = await authRequest('put', '/api/user/profile', formData);
      if (result.success) {
        setProfile(result.data);
        setEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData(profile);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading profile...</p>
        </div>
      </div>
    );
  }

  const displayData = profile || user || {};

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-purple-50 to-white'
    } p-8`}>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/user/dashboard')}
          className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-lg ${
            darkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-purple-100 text-gray-700'
          } transition`}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            My Profile
          </h1>
          {!editing ? (
            <button
              onClick={handleEdit}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center gap-2 transition"
            >
              <FaEdit /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center gap-2 transition"
              >
                <FaSave /> Save
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl flex items-center gap-2 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Message */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-500/20 border-green-500 text-green-400' 
                : 'bg-red-500/20 border-red-500 text-red-400'
            } border`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Profile Card */}
        <div className={`rounded-2xl overflow-hidden ${
          darkMode ? 'bg-white/5 border border-white/10' : 'bg-white shadow-xl'
        }`}>
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/30">
                {displayData.name?.charAt(0) || "U"}
              </div>
              <div>
                <h2 className="text-3xl font-bold">{displayData.name || "User"}</h2>
                <p className="text-purple-100 mt-1 capitalize">{displayData.role || "User"}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Premium Member</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <ProfileField
                icon={<FaUser />}
                label="Full Name"
                name="name"
                value={displayData.name}
                editing={editing}
                onChange={handleChange}
                darkMode={darkMode}
              />
              
              <ProfileField
                icon={<FaEnvelope />}
                label="Email"
                name="email"
                value={displayData.email}
                editing={editing}
                onChange={handleChange}
                type="email"
                darkMode={darkMode}
              />
              
              <ProfileField
                icon={<FaPhone />}
                label="Mobile"
                name="mobile"
                value={displayData.mobile}
                editing={editing}
                onChange={handleChange}
                darkMode={darkMode}
              />
              
              <ProfileField
                icon={<FaVenusMars />}
                label="Gender"
                name="gender"
                value={displayData.gender}
                editing={editing}
                onChange={handleChange}
                type="select"
                options={["Male", "Female", "Other"]}
                darkMode={darkMode}
              />

              <ProfileField
                icon={<FaCalendar />}
                label="Date of Birth"
                name="dateOfBirth"
                value={displayData.dateOfBirth}
                editing={editing}
                onChange={handleChange}
                type="date"
                darkMode={darkMode}
              />
            </div>

            {/* Account Information */}
            <div className={`mt-8 pt-8 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Account Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Member Since</p>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {displayData.createdAt ? new Date(displayData.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last Login</p>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {displayData.lastLogin ? new Date(displayData.lastLogin).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ icon, label, name, value, editing, onChange, type = "text", options = [], darkMode }) {
  return (
    <div>
      <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</label>
      <div className="flex items-center gap-3">
        <span className={`${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{icon}</span>
        {editing ? (
          type === "select" ? (
            <select
              name={name}
              value={value || ""}
              onChange={onChange}
              className={`flex-1 px-3 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white text-gray-800 border-gray-300'
              } border focus:ring-2 focus:ring-purple-500 outline-none`}
            >
              <option value="">Select {label}</option>
              {options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={name}
              value={value || ""}
              onChange={onChange}
              className={`flex-1 px-3 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white text-gray-800 border-gray-300'
              } border focus:ring-2 focus:ring-purple-500 outline-none`}
            />
          )
        ) : (
          <span className={`flex-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {value || "Not provided"}
          </span>
        )}
      </div>
    </div>
  );
}