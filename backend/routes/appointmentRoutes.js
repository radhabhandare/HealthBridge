const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Appointment = require("../models/Appointment");

router.post("/", protect, async (req, res) => {
  try {
    const { doctorId, date, time, issue } = req.body;
    
    const appointment = await Appointment.create({
      userId: req.user._id,
      doctorId,
      date,
      time,
      issue,
      status: "pending"
    });
    
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/my-appointments", protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .populate("doctorId", "name email speciality");
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;