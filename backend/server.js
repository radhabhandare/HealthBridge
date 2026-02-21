const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require("dotenv").config();

const app = express();

// ========== MIDDLEWARE ==========
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Body parsers for JSON and urlencoded
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Make upload available globally
app.use((req, res, next) => {
  req.upload = upload;
  next();
});

// Logger middleware
app.use((req, res, next) => {
  console.log(`\n📨 ${req.method} ${req.url}`);
  console.log('📦 Headers:', req.headers['content-type']);
  console.log('📦 Body:', req.body);
  console.log('📦 Files:', req.files ? 'Files present' : 'No files');
  next();
});

// ========== MONGODB CONNECTION ==========
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// ========== USER MODEL ==========
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "doctor", "admin"], default: "user" },
  isVerified: { type: Boolean, default: false },
  mobile: String,
  gender: String,
  specialization: String,
  experience: String,
  qualification: String,
  clinicName: String,
  clinicAddress: String,
  city: String,
  consultationFee: { type: Number, default: 500 },
  familyMembers: { type: Array, default: [] },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

// ========== APPOINTMENT MODEL ==========
const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: String,
  time: String,
  issue: String,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

// ========== ROOT ROUTE ==========
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 HealthBridge API is running",
    endpoints: {
      auth: {
        login: "POST /api/auth/login",
        register: "POST /api/auth/register"
      },
      user: {
        profile: "GET /api/user/profile",
        updateProfile: "PUT /api/user/profile",
        notifications: "GET /api/user/notifications",
        family: "GET /api/user/family",
        addFamily: "POST /api/user/family"
      },
      doctor: {
        stats: "GET /api/doctor/stats",
        profile: "GET /api/doctor/profile",
        patients: "GET /api/doctor/patients",
        appointments: "GET /api/doctor/appointments",
        analytics: "GET /api/doctor/analytics"
      },
      admin: {
        stats: "GET /api/admin/stats",
        allDoctors: "GET /api/admin/all-doctors",
        pendingDoctors: "GET /api/admin/pending-doctors",
        allUsers: "GET /api/admin/all-users",
        allAppointments: "GET /api/admin/all-appointments",
        verifyDoctor: "PUT /api/admin/verify-doctor/:id"
      },
      doctors: {
        verified: "GET /api/doctors/verified"
      },
      chat: {
        unread: "GET /api/chat/unread"
      }
    }
  });
});

// ========== AUTH ROUTES ==========

// Register - Handle both JSON and multipart/form-data
app.post("/api/auth/register", upload.any(), async (req, res) => {
  try {
    console.log("📝 Register request received");
    console.log("Body:", req.body);
    console.log("Files:", req.files ? `${req.files.length} files` : 'No files');
    
    // Get data from either req.body (JSON) or req.body (form-data)
    const { name, email, password, role, mobile, gender, specialization } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Name, email and password required",
        received: req.body 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password, // Plain password
      role: role || "user",
      mobile,
      gender,
      specialization,
      isVerified: role === "user" ? true : false
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "30d" }
    );

    console.log("✅ User created:", email);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      token: token
    });

  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    console.log("🔐 Login request body:", req.body);
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "30d" }
    );

    console.log("✅ Login successful for:", email);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      token: token
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ========== USER ROUTES ==========

// Get user profile
app.get("/api/user/profile", async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    
    // Find user
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
app.put("/api/user/profile", async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).select("-password");
    
    res.json(updatedUser);
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user notifications
app.get("/api/user/notifications", async (req, res) => {
  try {
    // Return empty array for now (you can implement later)
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ========== FAMILY MEMBERS ROUTES ==========

// Get family members
app.get("/api/user/family", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    const user = await User.findById(decoded.id);
    
    res.json(user.familyMembers || []);
  } catch (error) {
    console.error("❌ Error fetching family members:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add family member
app.post("/api/user/family", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    const user = await User.findById(decoded.id);
    
    const newMember = {
      ...req.body,
      _id: new mongoose.Types.ObjectId(),
      createdAt: new Date()
    };
    
    user.familyMembers = user.familyMembers || [];
    user.familyMembers.push(newMember);
    await user.save();
    
    res.status(201).json(newMember);
  } catch (error) {
    console.error("❌ Error adding family member:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update family member
app.put("/api/user/family/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    const user = await User.findById(decoded.id);
    
    const memberIndex = user.familyMembers.findIndex(
      m => m._id.toString() === req.params.id
    );
    
    if (memberIndex === -1) {
      return res.status(404).json({ message: "Family member not found" });
    }
    
    user.familyMembers[memberIndex] = {
      ...user.familyMembers[memberIndex].toObject(),
      ...req.body,
      updatedAt: new Date()
    };
    
    await user.save();
    res.json(user.familyMembers[memberIndex]);
  } catch (error) {
    console.error("❌ Error updating family member:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete family member
app.delete("/api/user/family/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    const user = await User.findById(decoded.id);
    
    user.familyMembers = user.familyMembers.filter(
      m => m._id.toString() !== req.params.id
    );
    
    await user.save();
    res.json({ message: "Family member removed" });
  } catch (error) {
    console.error("❌ Error deleting family member:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ========== DOCTOR ROUTES ==========

// Get all verified doctors (public)
app.get("/api/doctors/verified", async (req, res) => {
  try {
    const doctors = await User.find({ 
      role: "doctor", 
      isVerified: true 
    }).select("-password");
    
    res.json(doctors);
  } catch (error) {
    console.error("❌ Error fetching verified doctors:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get doctor stats
app.get("/api/doctor/stats", async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    
    // Get doctor's patients count
    const patients = await Appointment.distinct('userId', { doctorId: decoded.id });
    
    // Get today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayAppointments = await Appointment.countDocuments({
      doctorId: decoded.id,
      date: { $gte: today, $lt: tomorrow }
    });
    
    // Get pending appointments
    const pendingAppointments = await Appointment.countDocuments({
      doctorId: decoded.id,
      status: 'pending'
    });
    
    // Get completed appointments
    const completedAppointments = await Appointment.countDocuments({
      doctorId: decoded.id,
      status: 'completed'
    });

    res.json({
      totalPatients: patients.length,
      todayAppointments,
      pendingAppointments,
      completedAppointments,
      rating: 4.8
    });
  } catch (error) {
    console.error("❌ Error fetching doctor stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get doctor profile
app.get("/api/doctor/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    const doctor = await User.findById(decoded.id).select("-password");
    
    res.json(doctor);
  } catch (error) {
    console.error("❌ Error fetching doctor profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update doctor profile
app.put("/api/doctor/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    
    const updatedDoctor = await User.findByIdAndUpdate(
      decoded.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).select("-password");
    
    res.json(updatedDoctor);
  } catch (error) {
    console.error("❌ Error updating doctor profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get doctor patients
app.get("/api/doctor/patients", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    
    const appointments = await Appointment.find({ doctorId: decoded.id })
      .populate('userId', 'name email mobile');
    
    // Get unique patients
    const patients = [];
    const seen = new Set();
    
    appointments.forEach(app => {
      if (app.userId && !seen.has(app.userId._id.toString())) {
        seen.add(app.userId._id.toString());
        patients.push(app.userId);
      }
    });
    
    res.json(patients);
  } catch (error) {
    console.error("❌ Error fetching patients:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get doctor appointments
app.get("/api/doctor/appointments", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    
    const appointments = await Appointment.find({ doctorId: decoded.id })
      .populate('userId', 'name email mobile')
      .sort({ date: -1, time: -1 });
    
    res.json(appointments);
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update appointment status
app.put("/api/appointments/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { status } = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    res.json(appointment);
  } catch (error) {
    console.error("❌ Error updating appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get doctor analytics
app.get("/api/doctor/analytics", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    const { timeframe } = req.query;
    
    const today = new Date();
    let startDate = new Date();
    
    if (timeframe === "week") {
      startDate.setDate(today.getDate() - 7);
    } else if (timeframe === "month") {
      startDate.setMonth(today.getMonth() - 1);
    } else if (timeframe === "year") {
      startDate.setFullYear(today.getFullYear() - 1);
    }

    const appointments = await Appointment.find({
      doctorId: decoded.id,
      createdAt: { $gte: startDate }
    });

    const uniquePatients = [...new Set(appointments.map(a => a.userId.toString()))];
    const revenue = appointments.filter(a => a.status === 'completed').length * 500;

    res.json({
      patients: {
        total: uniquePatients.length,
        new: appointments.filter(a => a.status === 'completed').length,
      },
      appointments: {
        total: appointments.length,
        completed: appointments.filter(a => a.status === 'completed').length,
        pending: appointments.filter(a => a.status === 'pending').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length
      },
      revenue: {
        total: revenue,
        monthly: revenue,
      },
      ratings: {
        average: 4.8,
        total: appointments.length,
      }
    });
  } catch (error) {
    console.error("❌ Error fetching analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get doctor clinic info
app.get("/api/doctor/clinic", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    const doctor = await User.findById(decoded.id).select(
      "clinicName clinicAddress city consultationFee workingDays openingTime closingTime"
    );
    
    res.json(doctor);
  } catch (error) {
    console.error("❌ Error fetching clinic info:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get unread messages count
app.get("/api/chat/unread", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Return 0 for now (implement actual chat later)
    res.json({ count: 0 });
  } catch (error) {
    console.error("❌ Error fetching unread messages:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ========== ADMIN ROUTES ==========

// Get admin dashboard stats
app.get("/api/admin/stats", async (req, res) => {
  try {
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const pendingDoctors = await User.countDocuments({ role: "doctor", isVerified: false });
    const verifiedDoctors = await User.countDocuments({ role: "doctor", isVerified: true });
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalAppointments = await Appointment.countDocuments();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAppointments = await Appointment.countDocuments({
      createdAt: { $gte: today }
    });

    res.json({
      totalDoctors,
      pendingDoctors,
      verifiedDoctors,
      totalUsers,
      totalAppointments,
      todayAppointments
    });
  } catch (error) {
    console.error("❌ Error fetching stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all doctors
app.get("/api/admin/all-doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    console.error("❌ Error fetching all doctors:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get pending doctors
app.get("/api/admin/pending-doctors", async (req, res) => {
  try {
    const pendingDoctors = await User.find({ 
      role: "doctor", 
      isVerified: false 
    }).select("-password");
    res.json(pendingDoctors);
  } catch (error) {
    console.error("❌ Error fetching pending doctors:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users
app.get("/api/admin/all-users", async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching all users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all appointments
app.get("/api/admin/all-appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("userId", "name email")
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify doctor
app.put("/api/admin/verify-doctor/:id", async (req, res) => {
  try {
    const { status } = req.body;
    
    if (status === "approved") {
      await User.findByIdAndUpdate(req.params.id, { isVerified: true });
      res.json({ message: "Doctor verified successfully" });
    } else {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "Doctor rejected" });
    }
  } catch (error) {
    console.error("❌ Error verifying doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ========== CREATE ADMIN (Helper Route) ==========
app.post("/api/create-admin", async (req, res) => {
  try {
    console.log("👑 Creating admin...");
    
    const existingAdmin = await User.findOne({ email: "radhabhandare2004@gmail.com" });
    
    if (existingAdmin) {
      return res.json({ 
        message: "Admin already exists", 
        email: existingAdmin.email,
        password: "radha@123"
      });
    }

    const admin = await User.create({
      name: "Radha Bhandare",
      email: "radhabhandare2004@gmail.com",
      password: "radha@123",
      role: "admin",
      isVerified: true
    });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "30d" }
    );

    res.json({ 
      success: true,
      message: "Admin created successfully", 
      email: admin.email,
      token: token
    });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ========== DEBUG LOGIN ==========
app.post("/api/debug-login", async (req, res) => {
  try {
    console.log("🔍 Debug login - Body:", req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.json({ found: false, email });
    }

    res.json({
      found: true,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
      passwordMatch: (password === user.password)
    });

  } catch (error) {
    console.error("❌ Debug login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ========== 404 HANDLER ==========
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    path: req.originalUrl
  });
});

// ========== SERVER START ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🔗 Auth: POST /api/auth/login`);
  console.log(`🔗 Auth: POST /api/auth/register`);
  console.log(`🔗 User: GET /api/user/profile`);
  console.log(`🔗 User: PUT /api/user/profile`);
  console.log(`🔗 User: GET /api/user/notifications`);
  console.log(`🔗 User: GET /api/user/family`);
  console.log(`🔗 Doctor: GET /api/doctor/stats`);
  console.log(`🔗 Doctor: GET /api/doctor/profile`);
  console.log(`🔗 Doctor: PUT /api/doctor/profile`);
  console.log(`🔗 Doctor: GET /api/doctor/patients`);
  console.log(`🔗 Doctor: GET /api/doctor/appointments`);
  console.log(`🔗 Doctor: GET /api/doctor/analytics`);
  console.log(`🔗 Doctor: GET /api/doctor/clinic`);
  console.log(`🔗 Doctors: GET /api/doctors/verified`);
  console.log(`🔗 Chat: GET /api/chat/unread`);
  console.log(`🔗 Admin: GET /api/admin/stats`);
  console.log(`🔗 Admin: GET /api/admin/all-doctors`);
  console.log(`🔗 Admin: GET /api/admin/pending-doctors`);
  console.log(`🔗 Admin: GET /api/admin/all-users`);
  console.log(`🔗 Admin: GET /api/admin/all-appointments`);
  console.log(`🔗 Admin: PUT /api/admin/verify-doctor/:id\n`);
});