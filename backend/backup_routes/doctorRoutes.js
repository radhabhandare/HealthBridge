const express = require("express");
const router = express.Router();
const { protect, doctorOnly } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

// @desc    Get doctor's patients
// @route   GET /api/doctor/patients
router.get("/patients", protect, doctorOnly, async (req, res) => {
  try {
    // Get all patients who have appointments with this doctor
    const appointments = await Appointment.find({ 
      doctorId: req.user._id 
    }).populate("userId", "name email mobile gender");
    
    // Extract unique patients
    const patients = appointments.map(app => app.userId);
    const uniquePatients = [...new Map(patients.map(p => [p._id.toString(), p])).values()];
    
    res.json(uniquePatients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Get doctor's appointments
// @route   GET /api/doctor/appointments
router.get("/appointments", protect, doctorOnly, async (req, res) => {
  try {
    const appointments = await Appointment.find({ 
      doctorId: req.user._id 
    }).populate("userId", "name email mobile");
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;