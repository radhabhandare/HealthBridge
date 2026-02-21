// createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const User = require('./models/User');

const createAdmin = async () => {
  try {
    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'radhabhandare2004@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Rad@123', salt);

    // Create admin
    const admin = await User.create({
      name: 'Radha Bhandare',
      email: 'radhabhandare2004@gmail.com',
      password: hashedPassword,
      role: 'admin',
      isVerified: true
    });

    console.log('Admin created successfully:');
    console.log('Email:', admin.email);
    console.log('Password: Rad@123');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();