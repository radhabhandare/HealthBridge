const Appointment = require("../models/Appointment");

// @desc    Book appointment
// @route   POST /api/appointments
exports.bookAppointment = async (req, res) => {
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
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get user appointments
// @route   GET /api/appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .populate("doctorId", "name email speciality");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};