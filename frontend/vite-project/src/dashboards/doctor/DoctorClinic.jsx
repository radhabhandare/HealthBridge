import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaHospital, FaMapMarkerAlt, FaClock, FaPhone,
  FaRupeeSign, FaSave, FaEdit, FaImage,
  FaWifi, FaParking, FaWheelchair, FaCoffee
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function DoctorClinic() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchClinicInfo();
  }, []);

  const fetchClinicInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/doctor/clinic", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClinic(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching clinic info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put("http://localhost:5000/api/doctor/clinic", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClinic(formData);
      setEditing(false);
      alert("Clinic information updated successfully!");
    } catch (error) {
      console.error("Error updating clinic:", error);
      alert("Failed to update clinic information");
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
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading clinic information...</p>
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
            <FaHospital className="text-purple-400" />
            Clinic Information
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your practice details and availability
          </p>
        </div>
        <button
          onClick={editing ? handleSave : () => setEditing(true)}
          className={`px-6 py-3 rounded-xl flex items-center gap-2 transition ${
            editing ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {editing ? <FaSave /> : <FaEdit />}
          {editing ? 'Save Changes' : 'Edit Clinic Info'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Clinic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Clinic Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Clinic/Hospital Name</label>
                <input
                  type="text"
                  name="clinicName"
                  value={editing ? formData.clinicName || '' : clinic?.clinicName || 'City Hospital'}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Complete Address</label>
                <textarea
                  name="clinicAddress"
                  value={editing ? formData.clinicAddress || '' : clinic?.clinicAddress || '123 Medical Street, Mumbai'}
                  onChange={handleChange}
                  disabled={!editing}
                  rows="3"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none text-white disabled:opacity-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={editing ? formData.city || '' : clinic?.city || 'Mumbai'}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none text-white disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={editing ? formData.pincode || '' : clinic?.pincode || '400001'}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none text-white disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Clinic Phone</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="clinicPhone"
                    value={editing ? formData.clinicPhone || '' : clinic?.clinicPhone || '+91 22 1234 5678'}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none text-white disabled:opacity-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Emergency Contact</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={editing ? formData.emergencyContact || '' : clinic?.emergencyContact || '+91 98765 43210'}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none text-white disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Timings & Fees */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Timings & Fees</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Consultation Fee</label>
                <div className="relative">
                  <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="consultationFee"
                    value={editing ? formData.consultationFee || '' : clinic?.consultationFee || '500'}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none text-white disabled:opacity-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Follow-up Fee</label>
                <div className="relative">
                  <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="followupFee"
                    value={editing ? formData.followupFee || '' : clinic?.followupFee || '300'}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none text-white disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Opening Time</label>
                <input
                  type="time"
                  name="openingTime"
                  value={editing ? formData.openingTime || '09:00' : clinic?.openingTime || '09:00'}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Closing Time</label>
                <input
                  type="time"
                  name="closingTime"
                  value={editing ? formData.closingTime || '17:00' : clinic?.closingTime || '17:00'}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none text-white disabled:opacity-50"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-400 mb-2">Working Days</label>
              <div className="flex flex-wrap gap-3">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <label key={day} className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={editing ? formData.workingDays?.includes(day) : clinic?.workingDays?.includes(day)}
                      onChange={(e) => {
                        const days = formData.workingDays || [];
                        if (e.target.checked) {
                          setFormData({ ...formData, workingDays: [...days, day] });
                        } else {
                          setFormData({ ...formData, workingDays: days.filter(d => d !== day) });
                        }
                      }}
                      disabled={!editing}
                      className="rounded bg-black/40 border-white/10"
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Today's Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Appointments</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Patients Seen</span>
                <span className="font-semibold">6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pending</span>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Revenue Today</span>
                <span className="font-semibold text-green-400">₹4,500</span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Amenities</h3>
            <div className="space-y-3">
              <AmenityCheck icon={<FaWifi />} label="Free WiFi" enabled />
              <AmenityCheck icon={<FaParking />} label="Parking Available" enabled />
              <AmenityCheck icon={<FaWheelchair />} label="Wheelchair Access" enabled />
              <AmenityCheck icon={<FaCoffee />} label="Refreshments" enabled />
            </div>
          </div>

          {/* Clinic Photos */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Clinic Photos</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-square bg-black/40 rounded-lg flex items-center justify-center">
                <FaImage className="text-2xl text-gray-600" />
              </div>
              <div className="aspect-square bg-black/40 rounded-lg flex items-center justify-center">
                <FaImage className="text-2xl text-gray-600" />
              </div>
              <button className="col-span-2 py-2 bg-purple-600/20 rounded-lg hover:bg-purple-600/30 text-purple-400 transition text-sm">
                Upload Photos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Amenity Check Component
function AmenityCheck({ icon, label, enabled }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-gray-400">
        {icon}
        {label}
      </span>
      <span className={`text-sm ${enabled ? 'text-green-400' : 'text-gray-600'}`}>
        {enabled ? '✓ Available' : '× Not Available'}
      </span>
    </div>
  );
}