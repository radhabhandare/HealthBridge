const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Chat = require("../models/Chat");

router.post("/send", protect, async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    
    const chat = await Chat.create({
      senderId: req.user._id,
      receiverId,
      message,
      senderRole: req.user.role,
      timestamp: new Date()
    });
    
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

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