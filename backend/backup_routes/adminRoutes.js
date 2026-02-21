const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const User = require("../models/User");

// @desc    Get all pending doctors
// @route   GET /api/admin/pending-doctors
router.get("/pending-doctors", protect, adminOnly, async (req, res) => {
  try {
    const pendingDoctors = await User.find({ 
      role: "doctor", 
      isVerified: false 
    }).select("-password");
    
    res.json(pendingDoctors);
  } catch (error) {
    console.error("Error fetching pending doctors:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Verify or reject doctor
// @route   PUT /api/admin/verify-doctor/:id
router.put("/verify-doctor/:id", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    
    if (status === "approved") {
      await User.findByIdAndUpdate(req.params.id, { isVerified: true });
      res.json({ message: "Doctor verified successfully" });
    } else if (status === "rejected") {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "Doctor registration rejected" });
    } else {
      res.status(400).json({ message: "Invalid status" });
    }
  } catch (error) {
    console.error("Error verifying doctor:", error);
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;