const express = require("express");
const router = express.Router();
const { register, login, resetPassword } = require("../controllers/authController");

// @route   POST /api/auth/register
router.post("/register", register); // Removed upload.any()

// @route   POST /api/auth/login
router.post("/login", login);

// @route   POST /api/auth/reset-password
router.post("/reset-password", resetPassword);

module.exports = router;