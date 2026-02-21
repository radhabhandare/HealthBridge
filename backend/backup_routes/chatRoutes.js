const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Chat = require("../models/Chat");

// @desc    Send message
// @route   POST /api/chat/send
router.post("/send", protect, async (req, res) => {
  try {
    const { receiverId, message, role } = req.body;
    
    const chat = await Chat.create({
      senderId: req.user._id,
      receiverId,
      message,
      senderRole: role || req.user.role,
      timestamp: new Date()
    });
    
    res.status(201).json(chat);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Get chat history with specific user
// @route   GET /api/chat/:userId
router.get("/:userId", protect, async (req, res) => {
  try {
    const chats = await Chat.find({
      $or: [
        { senderId: req.user._id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user._id }
      ]
    }).sort({ timestamp: 1 });
    
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;