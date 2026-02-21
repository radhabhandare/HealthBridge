const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    console.log("📝 Registration request received");
    console.log("Body:", req.body);
    
    const { 
      name, email, password, role, mobile, gender,
      specialization, experience, qualification, 
      clinicName, clinicAddress, city, consultationFee
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Name, email and password are required",
        received: req.body 
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user object based on role - STORE PLAIN PASSWORD
    const userData = {
      name,
      email,
      password: password, // STORE AS PLAIN TEXT - NO HASHING
      role: role || "user",
      mobile,
      gender,
      isVerified: role === "user" ? true : false // Doctors need verification
    };

    // Add doctor-specific fields
    if (role === "doctor") {
      userData.specialization = specialization;
      userData.experience = experience;
      userData.qualification = qualification;
      userData.clinicName = clinicName;
      userData.clinicAddress = clinicAddress;
      userData.city = city;
      userData.consultationFee = consultationFee || 500;
    }

    // Create user
    const user = await User.create(userData);

    console.log("✅ User created successfully:", user.email);
    console.log("Password stored:", user.password);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      token: generateToken(user._id, user.role)
    });

  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    console.log("🔐 Login request received");
    console.log("Request body:", req.body);
    
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required",
        receivedBody: req.body 
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("✅ User found:", user.email);
    console.log("Stored password:", user.password);
    console.log("Received password:", password);

    // DIRECT COMPARISON - NO BCRYPT
    if (password !== user.password) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if account is blocked
    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked" });
    }

    // Check verification for doctors
    if (user.role === "doctor" && !user.isVerified) {
      console.log("❌ Doctor not verified:", email);
      return res.status(403).json({ 
        message: "Your account is pending admin verification",
        status: "pending"
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    console.log("✅ Login successful for:", email);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      token: generateToken(user._id, user.role)
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Reset password 
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    console.log("🔐 Password reset request received");
    
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password required" });
    }
    
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update password - STORE PLAIN TEXT
    user.password = newPassword; // NO HASHING
    user.updatedAt = new Date();
    await user.save();
    
    console.log("✅ Password reset for:", email);
    console.log("New password:", newPassword);
    
    res.json({ 
      success: true,
      message: "Password reset successfully",
      email: user.email
    });
    
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};