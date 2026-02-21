const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

// Get all family members
router.get("/family", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.familyMembers || []);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add family member
router.post("/family", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const newMember = {
      ...req.body,
      createdAt: new Date()
    };
    
    user.familyMembers.push(newMember);
    await user.save();
    
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update family member
router.put("/family/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
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
    res.status(500).json({ message: "Server error" });
  }
});

// Delete family member
router.delete("/family/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.familyMembers = user.familyMembers.filter(
      m => m._id.toString() !== req.params.id
    );
    
    await user.save();
    res.json({ message: "Family member removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;