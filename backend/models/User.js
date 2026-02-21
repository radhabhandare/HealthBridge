const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Personal Information
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String },
    alternateMobile: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dateOfBirth: { type: Date },
    bloodGroup: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
    aadharNumber: { type: String },
    
    // Role & Verification
    role: { type: String, enum: ["user", "doctor", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    
    // Professional Information (for doctors)
    specialization: { type: String },
    subSpecialization: { type: String },
    experience: { type: String },
    qualification: { type: String },
    medicalCouncil: { type: String },
    registrationNumber: { type: String },
    registrationYear: { type: String },
    
    // Practice Information
    clinicName: { type: String },
    clinicAddress: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String, default: "India" },
    consultationFee: { type: Number, default: 500 },
    followupFee: { type: Number, default: 300 },
    workingDays: [{ type: String }],
    openingTime: { type: String, default: "09:00" },
    closingTime: { type: String, default: "17:00" },
    
    // Additional Information
    languages: [{ type: String }],
    awards: { type: String },
    publications: { type: String },
    research: { type: String },
    emergencyContact: { type: String },
    website: { type: String },
    
    // Documents
    degreeCertificate: { type: String },
    medicalLicense: { type: String },
    identityProof: { type: String },
    profilePhoto: { type: String, default: "" },
    signature: { type: String },
    
    // Ratings
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    
    // Timestamps
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Add indexes for faster queries
userSchema.index({ role: 1, isVerified: 1 });
userSchema.index({ email: 1 });
userSchema.index({ specialization: 1 });

module.exports = mongoose.model("User", userSchema);