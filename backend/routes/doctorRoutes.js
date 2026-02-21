const express = require("express");
const router = express.Router();
const { protect, doctorOnly } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

// ===== PUBLIC ROUTES (No authentication required) =====
// These routes are accessible without login - for public doctor listing

// @desc    Get all verified doctors for public listing
// @route   GET /api/doctors/verified
router.get("/verified", async (req, res) => {
  try {
    console.log("🔍 Fetching verified doctors for public listing...");
    
    const doctors = await User.find({ 
      role: "doctor", 
      isVerified: true 
    }).select("name email mobile specialization experience qualification clinicName clinicAddress city consultationFee rating reviewCount profilePhoto");
    
    console.log(`✅ Found ${doctors.length} verified doctors`);
    res.json(doctors);
  } catch (error) {
    console.error("❌ Error fetching verified doctors:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Get single doctor details by ID
// @route   GET /api/doctors/:id
router.get("/:id", async (req, res) => {
  try {
    const doctor = await User.findOne({ 
      _id: req.params.id, 
      role: "doctor", 
      isVerified: true 
    }).select("name email mobile specialization experience qualification clinicName clinicAddress city consultationFee rating reviewCount profilePhoto workingDays openingTime closingTime");
    
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    
    res.json(doctor);
  } catch (error) {
    console.error("❌ Error fetching doctor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Get doctors by specialization
// @route   GET /api/doctors/specialty/:specialty
router.get("/specialty/:specialty", async (req, res) => {
  try {
    const doctors = await User.find({ 
      role: "doctor", 
      isVerified: true,
      specialization: { $regex: req.params.specialty, $options: 'i' }
    }).select("name email mobile specialization experience qualification clinicName city consultationFee rating profilePhoto");
    
    res.json(doctors);
  } catch (error) {
    console.error("❌ Error fetching doctors by specialty:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Search doctors by name or specialization
// @route   GET /api/doctors/search/:query
router.get("/search/:query", async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const doctors = await User.find({
      role: "doctor",
      isVerified: true,
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { specialization: { $regex: searchQuery, $options: 'i' } },
        { clinicName: { $regex: searchQuery, $options: 'i' } },
        { city: { $regex: searchQuery, $options: 'i' } }
      ]
    }).select("name email mobile specialization experience qualification clinicName city consultationFee rating profilePhoto");
    
    res.json(doctors);
  } catch (error) {
    console.error("❌ Error searching doctors:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ===== PROTECTED DOCTOR ROUTES (Authentication required) =====
// These routes require the doctor to be logged in

// @desc    Get doctor's own profile
// @route   GET /api/doctor/profile
router.get("/profile", protect, doctorOnly, async (req, res) => {
  try {
    console.log("🔍 Fetching profile for doctor:", req.user._id);
    
    const doctor = await User.findById(req.user._id)
      .select("-password -__v -token -aadharNumber -degreeCertificate -medicalLicense -identityProof");
    
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    
    res.json(doctor);
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Update doctor's own profile
// @route   PUT /api/doctor/profile
router.put("/profile", protect, doctorOnly, async (req, res) => {
  try {
    console.log("📝 Updating profile for doctor:", req.user._id);
    
    const updatedDoctor = await User.findByIdAndUpdate(
      req.user._id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).select("-password -__v -token");
    
    console.log("✅ Doctor profile updated successfully");
    res.json(updatedDoctor);
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Get doctor's patients (unique patients who have booked appointments)
// @route   GET /api/doctor/patients
router.get("/patients", protect, doctorOnly, async (req, res) => {
  try {
    console.log("🔍 Fetching patients for doctor:", req.user._id);
    
    // Get all appointments for this doctor
    const appointments = await Appointment.find({ 
      doctorId: req.user._id 
    }).populate("userId", "name email mobile gender bloodGroup dateOfBirth");
    
    // Extract unique patients (remove duplicates)
    const patientMap = new Map();
    appointments.forEach(app => {
      if (app.userId) {
        patientMap.set(app.userId._id.toString(), app.userId);
      }
    });
    
    const uniquePatients = Array.from(patientMap.values());
    
    console.log(`✅ Found ${uniquePatients.length} unique patients`);
    res.json(uniquePatients);
  } catch (error) {
    console.error("❌ Error fetching patients:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Get doctor's appointments
// @route   GET /api/doctor/appointments
router.get("/appointments", protect, doctorOnly, async (req, res) => {
  try {
    console.log("🔍 Fetching appointments for doctor:", req.user._id);
    
    const appointments = await Appointment.find({ 
      doctorId: req.user._id 
    })
    .populate("userId", "name email mobile")
    .sort({ date: -1, time: -1 });
    
    console.log(`✅ Found ${appointments.length} appointments`);
    res.json(appointments);
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Get doctor's dashboard stats
// @route   GET /api/doctor/stats
router.get("/stats", protect, doctorOnly, async (req, res) => {
  try {
    console.log("🔍 Fetching stats for doctor:", req.user._id);
    
    // Total unique patients
    const appointments = await Appointment.find({ doctorId: req.user._id });
    const uniquePatients = [...new Set(appointments.map(a => a.userId.toString()))];
    
    // Today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayAppointments = await Appointment.countDocuments({
      doctorId: req.user._id,
      date: { $gte: today, $lt: tomorrow }
    });
    
    // Pending appointments
    const pendingAppointments = await Appointment.countDocuments({
      doctorId: req.user._id,
      status: "pending"
    });
    
    // Completed appointments
    const completedAppointments = await Appointment.countDocuments({
      doctorId: req.user._id,
      status: "completed"
    });
    
    // This week's appointments
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekAppointments = await Appointment.countDocuments({
      doctorId: req.user._id,
      date: { $gte: weekStart }
    });
    
    res.json({
      totalPatients: uniquePatients.length,
      todayAppointments,
      pendingAppointments,
      completedAppointments,
      weekAppointments,
      rating: 4.8,
      totalAppointments: appointments.length
    });
  } catch (error) {
    console.error("❌ Error fetching stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Get doctor's clinic information
// @route   GET /api/doctor/clinic
router.get("/clinic", protect, doctorOnly, async (req, res) => {
  try {
    const doctor = await User.findById(req.user._id).select(
      "clinicName clinicAddress city state pincode clinicPhone consultationFee followupFee workingDays openingTime closingTime"
    );
    
    res.json(doctor || {});
  } catch (error) {
    console.error("❌ Error fetching clinic info:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Update doctor's clinic information
// @route   PUT /api/doctor/clinic
router.put("/clinic", protect, doctorOnly, async (req, res) => {
  try {
    console.log("📝 Updating clinic info for doctor:", req.user._id);
    
    const doctor = await User.findByIdAndUpdate(
      req.user._id,
      { 
        ...req.body, 
        updatedAt: new Date() 
      },
      { new: true }
    ).select("clinicName clinicAddress city state pincode clinicPhone consultationFee followupFee workingDays openingTime closingTime");
    
    console.log("✅ Clinic info updated successfully");
    res.json(doctor);
  } catch (error) {
    console.error("❌ Error updating clinic info:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Get doctor's analytics
// @route   GET /api/doctor/analytics
router.get("/analytics", protect, doctorOnly, async (req, res) => {
  try {
    const { timeframe = "month" } = req.query;
    const today = new Date();
    let startDate = new Date();
    
    // Set date range based on timeframe
    if (timeframe === "week") {
      startDate.setDate(today.getDate() - 7);
    } else if (timeframe === "month") {
      startDate.setMonth(today.getMonth() - 1);
    } else if (timeframe === "year") {
      startDate.setFullYear(today.getFullYear() - 1);
    }

    // Get appointments for the period
    const appointments = await Appointment.find({
      doctorId: req.user._id,
      date: { $gte: startDate }
    });

    // Calculate unique patients
    const uniquePatients = [...new Set(appointments.map(a => a.userId.toString()))];

    // Calculate revenue (assuming ₹500 per appointment)
    const consultationFee = req.user.consultationFee || 500;
    const revenue = appointments.filter(a => a.status === 'completed').length * consultationFee;

    // Group appointments by month
    const monthlyData = {};
    appointments.forEach(app => {
      const month = new Date(app.date).toLocaleString('default', { month: 'short' });
      if (!monthlyData[month]) {
        monthlyData[month] = { appointments: 0, revenue: 0 };
      }
      monthlyData[month].appointments++;
      if (app.status === 'completed') {
        monthlyData[month].revenue += consultationFee;
      }
    });

    // Calculate analytics
    const analytics = {
      overview: {
        totalPatients: uniquePatients.length,
        totalAppointments: appointments.length,
        completedAppointments: appointments.filter(a => a.status === 'completed').length,
        pendingAppointments: appointments.filter(a => a.status === 'pending').length,
        cancelledAppointments: appointments.filter(a => a.status === 'cancelled').length,
        totalRevenue: revenue,
        averageRating: 4.8
      },
      monthlyData: Object.keys(monthlyData).map(month => ({
        month,
        appointments: monthlyData[month].appointments,
        revenue: monthlyData[month].revenue
      })),
      patientDemographics: {
        newPatients: Math.floor(uniquePatients.length * 0.4),
        returningPatients: Math.floor(uniquePatients.length * 0.6)
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error("❌ Error fetching analytics:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Update doctor's availability
// @route   PUT /api/doctor/availability
router.put("/availability", protect, doctorOnly, async (req, res) => {
  try {
    const { workingDays, openingTime, closingTime, isAvailable } = req.body;
    
    const doctor = await User.findByIdAndUpdate(
      req.user._id,
      { 
        workingDays, 
        openingTime, 
        closingTime,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        updatedAt: new Date()
      },
      { new: true }
    ).select("workingDays openingTime closingTime isAvailable");
    
    res.json(doctor);
  } catch (error) {
    console.error("❌ Error updating availability:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Get today's schedule
// @route   GET /api/doctor/today-schedule
router.get("/today-schedule", protect, doctorOnly, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const appointments = await Appointment.find({
      doctorId: req.user._id,
      date: { $gte: today, $lt: tomorrow }
    })
    .populate("userId", "name email mobile")
    .sort({ time: 1 });
    
    res.json(appointments);
  } catch (error) {
    console.error("❌ Error fetching today's schedule:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Get upcoming appointments
// @route   GET /api/doctor/upcoming
router.get("/upcoming", protect, doctorOnly, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const appointments = await Appointment.find({
      doctorId: req.user._id,
      date: { $gte: today },
      status: { $in: ["pending", "confirmed"] }
    })
    .populate("userId", "name email mobile")
    .sort({ date: 1, time: 1 });
    
    res.json(appointments);
  } catch (error) {
    console.error("❌ Error fetching upcoming appointments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Update appointment status
// @route   PUT /api/doctor/appointment/:id/status
router.put("/appointment/:id/status", protect, doctorOnly, async (req, res) => {
  try {
    const { status } = req.body;
    
    const appointment = await Appointment.findOneAndUpdate(
      { 
        _id: req.params.id, 
        doctorId: req.user._id 
      },
      { status },
      { new: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    
    res.json(appointment);
  } catch (error) {
    console.error("❌ Error updating appointment status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;