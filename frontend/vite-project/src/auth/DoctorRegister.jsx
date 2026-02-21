import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { 
  FaUserMd, FaEnvelope, FaPhone, FaVenusMars, 
  FaGraduationCap, FaStethoscope, FaBriefcase, 
  FaHospital, FaIdCard, FaMapMarkerAlt, FaGlobe,
  FaClock, FaLanguage, FaAward, FaFileMedical,
  FaUpload, FaCheckCircle, FaLock
} from "react-icons/fa";

export default function DoctorRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1); // For multi-step form
  
  const [formData, setFormData] = useState({
    // Personal Information
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    alternateMobile: "",
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    aadharNumber: "",
    
    // Professional Information
    specialization: "",
    subSpecialization: "",
    experience: "",
    qualification: "",
    medicalCouncil: "",
    registrationNumber: "",
    registrationYear: "",
    
    // Practice Information
    clinicName: "",
    clinicAddress: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    consultationFee: "",
    availableDays: [], // Monday, Tuesday, etc.
    availableTimeFrom: "",
    availableTimeTo: "",
    
    // Additional Information
    languages: "",
    awards: "",
    publications: "",
    research: "",
    emergencyContact: "",
    website: "",
    
    // Documents (file uploads)
    degreeCertificate: null,
    medicalLicense: null,
    identityProof: null,
    profilePhoto: null,
    signature: null,
    
    // Account
    password: "",
    confirmPassword: "",
    
    // Terms
    acceptTerms: false,
    acceptVerification: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (e) => {
    const { value, checked } = e.target;
    let updatedDays = [...formData.availableDays];
    
    if (checked) {
      updatedDays.push(value);
    } else {
      updatedDays = updatedDays.filter(day => day !== value);
    }
    
    setFormData({ ...formData, availableDays: updatedDays });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!formData.acceptTerms || !formData.acceptVerification) {
      setError("Please accept all terms and conditions");
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'availableDays') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      // Set role
      submitData.append('role', 'doctor');
      
      // Combine name
      submitData.append('name', `${formData.title} ${formData.firstName} ${formData.lastName}`.trim());

      console.log("Sending doctor registration data");

      const response = await axios.post("http://localhost:5000/api/auth/register", submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log("Registration response:", response.data);
      
      setSuccess("Registration submitted successfully! Admin will verify your account within 24-48 hours.");
      
      // Clear form
      setFormData({
        title: "", firstName: "", lastName: "", email: "", mobile: "", alternateMobile: "",
        gender: "", dateOfBirth: "", bloodGroup: "", aadharNumber: "", specialization: "",
        subSpecialization: "", experience: "", qualification: "", medicalCouncil: "",
        registrationNumber: "", registrationYear: "", clinicName: "", clinicAddress: "",
        city: "", state: "", pincode: "", country: "India", consultationFee: "",
        availableDays: [], availableTimeFrom: "", availableTimeTo: "", languages: "",
        awards: "", publications: "", research: "", emergencyContact: "", website: "",
        degreeCertificate: null, medicalLicense: null, identityProof: null,
        profilePhoto: null, signature: null, password: "", confirmPassword: "",
        acceptTerms: false, acceptVerification: false
      });

      // Redirect to login after 5 seconds
      setTimeout(() => {
        navigate("/login/doctor");
      }, 5000);

    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= num ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300'
                }`}>
                  {step > num ? <FaCheckCircle /> : num}
                </div>
                {num < 4 && (
                  <div className={`w-20 h-1 ${
                    step > num ? 'bg-purple-600' : 'bg-gray-600'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Personal</span>
            <span>Professional</span>
            <span>Practice</span>
            <span>Documents</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Doctor Registration
          </h2>
          <p className="text-gray-300 text-center mb-8">
            Join as a verified medical professional - All fields are mandatory
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* STEP 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
                  <FaUserMd /> Personal Information
                </h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  >
                    <option value="">Title *</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                  </select>

                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="First Name *"
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  />

                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Last Name *"
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Email Address *"
                      className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                    />
                  </div>

                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      placeholder="Mobile Number *"
                      className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  >
                    <option value="">Gender *</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>

                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  />

                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  >
                    <option value="">Blood Group *</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  required
                  placeholder="Aadhar Number *"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Professional Information */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
                  <FaStethoscope /> Professional Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                    placeholder="Primary Specialization *"
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  />

                  <input
                    type="text"
                    name="subSpecialization"
                    value={formData.subSpecialization}
                    onChange={handleChange}
                    placeholder="Sub-specialization (if any)"
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                    placeholder="Qualification * (MBBS, MD, etc.)"
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  />

                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    placeholder="Years of Experience *"
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  />

                  <input
                    type="text"
                    name="medicalCouncil"
                    value={formData.medicalCouncil}
                    onChange={handleChange}
                    required
                    placeholder="Medical Council *"
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    required
                    placeholder="Registration Number *"
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  />

                  <input
                    type="text"
                    name="registrationYear"
                    value={formData.registrationYear}
                    onChange={handleChange}
                    required
                    placeholder="Registration Year *"
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Practice Information */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
                  <FaHospital /> Practice Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="clinicName"
                    value={formData.clinicName}
                    onChange={handleChange}
                    required
                    placeholder="Clinic/Hospital Name *"
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  />

                  <input
                    type="text"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    required
                    placeholder="Consultation Fee (₹) *"
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  />
                </div>

                <textarea
                  name="clinicAddress"
                  value={formData.clinicAddress}
                  onChange={handleChange}
                  required
                  placeholder="Clinic Address *"
                  rows="3"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                />

                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="City *"
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  />

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    placeholder="State *"
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  />

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    placeholder="Pincode *"
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Available Days *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <label key={day} className="flex items-center gap-2 text-white">
                        <input
                          type="checkbox"
                          value={day}
                          checked={formData.availableDays.includes(day)}
                          onChange={handleArrayChange}
                          className="rounded bg-black/40 border-white/10"
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="time"
                    name="availableTimeFrom"
                    value={formData.availableTimeFrom}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  />

                  <input
                    type="time"
                    name="availableTimeTo"
                    value={formData.availableTimeTo}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Documents & Account */}
            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
                  <FaFileMedical /> Documents & Account
                </h3>

                {/* Document Uploads */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Degree Certificate *
                    </label>
                    <input
                      type="file"
                      name="degreeCertificate"
                      onChange={handleChange}
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Medical License *
                    </label>
                    <input
                      type="file"
                      name="medicalLicense"
                      onChange={handleChange}
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Identity Proof (Aadhar/PAN) *
                    </label>
                    <input
                      type="file"
                      name="identityProof"
                      onChange={handleChange}
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Profile Photo *
                    </label>
                    <input
                      type="file"
                      name="profilePhoto"
                      onChange={handleChange}
                      required
                      accept=".jpg,.jpeg,.png"
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white"
                    />
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleChange}
                    required
                    placeholder="Languages Known * (comma separated)"
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  />

                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    required
                    placeholder="Emergency Contact Number *"
                    className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                  />
                </div>

                <textarea
                  name="awards"
                  value={formData.awards}
                  onChange={handleChange}
                  placeholder="Awards & Recognitions"
                  rows="2"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                />

                {/* Account */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="6"
                      placeholder="Password *"
                      className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                    />
                  </div>

                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm Password *"
                      className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-white"
                    />
                  </div>
                </div>

                {/* Terms */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-white">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      required
                      className="rounded bg-black/40 border-white/10"
                    />
                    <span>I confirm that all information provided is true and accurate *</span>
                  </label>

                  <label className="flex items-center gap-3 text-white">
                    <input
                      type="checkbox"
                      name="acceptVerification"
                      checked={formData.acceptVerification}
                      onChange={handleChange}
                      required
                      className="rounded bg-black/40 border-white/10"
                    />
                    <span>I agree to undergo verification process by the admin *</span>
                  </label>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      "Submit for Verification"
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}