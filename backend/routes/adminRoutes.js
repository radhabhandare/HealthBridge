const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const User = require("../models/User");

// @desc    Get all pending doctors
// @route   GET /api/admin/pending-doctors
router.get("/pending-doctors", protect, adminOnly, async (req, res) => {
  try {
    console.log("🔍 Fetching pending doctors...");
    const pendingDoctors = await User.find({ 
      role: "doctor", 
      isVerified: false 
    }).select("-password");
    
    console.log(`✅ Found ${pendingDoctors.length} pending doctors`);
    res.json(pendingDoctors);
  } catch (error) {
    console.error("❌ Error fetching pending doctors:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Verify or reject doctor
// @route   PUT /api/admin/verify-doctor/:id
router.put("/verify-doctor/:id", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    console.log(`🔍 Verifying doctor ${req.params.id} with status: ${status}`);
    
    const doctor = await User.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    
    if (status === "approved") {
      doctor.isVerified = true;
      await doctor.save();
      console.log(`✅ Doctor ${doctor.email} verified successfully`);
      res.json({ 
        message: "Doctor verified successfully", 
        doctor: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          isVerified: doctor.isVerified
        }
      });
    } else if (status === "rejected") {
      await User.findByIdAndDelete(req.params.id);
      console.log(`❌ Doctor registration rejected and deleted`);
      res.json({ message: "Doctor registration rejected" });
    } else {
      res.status(400).json({ message: "Invalid status" });
    }
  } catch (error) {
    console.error("❌ Error verifying doctor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Get all doctors (verified + pending)
// @route   GET /api/admin/all-doctors
router.get("/all-doctors", protect, adminOnly, async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" })
      .select("-password")
      .sort({ createdAt: -1 });
    
    res.json(doctors);
  } catch (error) {
    console.error("❌ Error fetching all doctors:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Get all users
// @route   GET /api/admin/all-users
router.get("/all-users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Get all appointments
// @route   GET /api/admin/all-appointments
router.get("/all-appointments", protect, adminOnly, async (req, res) => {
  try {
    const Appointment = require("../models/Appointment");
    const appointments = await Appointment.find()
      .populate("userId", "name email")
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;