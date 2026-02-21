import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUserMd, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaStethoscope, FaGraduationCap, FaBriefcase, 
  FaClock, FaRupeeSign, FaStar, FaAward, FaEdit, 
  FaSave, FaTimes, FaIdCard, FaGlobe, FaLanguage,
  FaCalendarAlt, FaHospital, FaFileMedical, FaCheckCircle
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function DoctorProfile() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/doctor/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setFormData(response.data);
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

  const handleCancel = () => {
    setEditing(false);
    setFormData(profile);
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      const response = await axios.put(`http://localhost:5000/api/doctor/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
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
            <FaUserMd className="text-blue-400" />
            Doctor Profile
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your professional information
          </p>
        </div>
        <button
          onClick={() => navigate("/doctor/dashboard")}
          className="px-4 py-2 bg-gray-600/30 hover:bg-gray-600/50 rounded-lg transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-500/20 border-green-500 text-green-400' : 
          'bg-red-500/20 border-red-500 text-red-400'
        } border`}>
          {message.text}
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white/5 rounded-xl p-8 border border-white/10 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold">
              {profile?.name?.charAt(0)}
            </div>
            {profile?.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <FaCheckCircle className="text-white text-sm" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Dr. {profile?.name}</h2>
            <p className="text-blue-400">{profile?.specialization || 'Specialist'}</p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-sm text-gray-400">
                <FaStar className="text-yellow-400" /> 4.8 (120 reviews)
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-400">
                <FaBriefcase /> {profile?.experience || 'N/A'} experience
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-400">
                <FaIdCard /> Reg. No: {profile?.registrationNumber || 'N/A'}
              </span>
            </div>
          </div>
          {!editing ? (
            <button
              onClick={handleEdit}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition"
            >
              <FaEdit /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saveLoading}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
              >
                {saveLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FaSave />}
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg flex items-center gap-2 transition"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaUserMd className="text-blue-400" />
            Personal Information
          </h3>
          <div className="space-y-4">
            <ProfileField
              icon={<FaEnvelope />}
              label="Email"
              value={profile?.email}
              name="email"
              editing={editing}
              onChange={handleChange}
              type="email"
            />
            <ProfileField
              icon={<FaPhone />}
              label="Mobile"
              value={profile?.mobile}
              name="mobile"
              editing={editing}
              onChange={handleChange}
              type="tel"
            />
            <ProfileField
              icon={<FaCalendarAlt />}
              label="Date of Birth"
              value={profile?.dateOfBirth}
              name="dateOfBirth"
              editing={editing}
              onChange={handleChange}
              type="date"
            />
            <ProfileField
              icon={<FaLanguage />}
              label="Languages"
              value={profile?.languages}
              name="languages"
              editing={editing}
              onChange={handleChange}
              placeholder="English, Hindi, etc."
            />
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaStethoscope className="text-green-400" />
            Professional Information
          </h3>
          <div className="space-y-4">
            <ProfileField
              icon={<FaGraduationCap />}
              label="Qualification"
              value={profile?.qualification}
              name="qualification"
              editing={editing}
              onChange={handleChange}
            />
            <ProfileField
              icon={<FaBriefcase />}
              label="Experience"
              value={profile?.experience}
              name="experience"
              editing={editing}
              onChange={handleChange}
            />
            <ProfileField
              icon={<FaAward />}
              label="Specialization"
              value={profile?.specialization}
              name="specialization"
              editing={editing}
              onChange={handleChange}
            />
            <ProfileField
              icon={<FaIdCard />}
              label="Registration Number"
              value={profile?.registrationNumber}
              name="registrationNumber"
              editing={editing}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Clinic Information */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaHospital className="text-purple-400" />
            Clinic Information
          </h3>
          <div className="space-y-4">
            <ProfileField
              icon={<FaHospital />}
              label="Clinic/Hospital"
              value={profile?.clinicName}
              name="clinicName"
              editing={editing}
              onChange={handleChange}
            />
            <ProfileField
              icon={<FaMapMarkerAlt />}
              label="Address"
              value={profile?.clinicAddress}
              name="clinicAddress"
              editing={editing}
              onChange={handleChange}
              type="textarea"
            />
            <div className="grid grid-cols-2 gap-2">
              <ProfileField
                icon={<FaMapMarkerAlt />}
                label="City"
                value={profile?.city}
                name="city"
                editing={editing}
                onChange={handleChange}
              />
              <ProfileField
                icon={<FaMapMarkerAlt />}
                label="State"
                value={profile?.state}
                name="state"
                editing={editing}
                onChange={handleChange}
              />
            </div>
            <ProfileField
              icon={<FaRupeeSign />}
              label="Consultation Fee"
              value={profile?.consultationFee}
              name="consultationFee"
              editing={editing}
              onChange={handleChange}
              type="number"
            />
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaClock className="text-orange-400" />
            Availability
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Available Days</label>
              <div className="grid grid-cols-2 gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <label key={day} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.availableDays?.includes(day)}
                      onChange={(e) => {
                        const days = formData.availableDays || [];
                        const newDays = e.target.checked 
                          ? [...days, day]
                          : days.filter(d => d !== day);
                        setFormData({...formData, availableDays: newDays});
                      }}
                      disabled={!editing}
                      className="rounded bg-black/40 border-white/10"
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm text-gray-400 mb-2">From</label>
                <input
                  type="time"
                  name="availableTimeFrom"
                  value={formData.availableTimeFrom || '09:00'}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">To</label>
                <input
                  type="time"
                  name="availableTimeTo"
                  value={formData.availableTimeTo || '17:00'}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none text-white disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Profile Field Component
function ProfileField({ icon, label, value, name, editing, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <div className="flex items-center gap-3">
        <span className="text-gray-400">{icon}</span>
        {editing ? (
          type === "textarea" ? (
            <textarea
              name={name}
              value={value || ''}
              onChange={onChange}
              placeholder={placeholder}
              rows="2"
              className="flex-1 px-3 py-1 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-white"
            />
          ) : (
            <input
              type={type}
              name={name}
              value={value || ''}
              onChange={onChange}
              placeholder={placeholder}
              className="flex-1 px-3 py-1 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-white"
            />
          )
        ) : (
          <span className="text-white">{value || 'Not specified'}</span>
        )}
      </div>
    </div>
  );
}