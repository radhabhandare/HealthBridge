const Chat = require("../models/Chat");

// @desc    Send message
// @route   POST /api/chat/send
exports.sendMessage = async (req, res) => {
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
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get messages with specific user
// @route   GET /api/chat/:userId
exports.getMessages = async (req, res) => {
  try {
    const messages = await Chat.find({
      $or: [
        { senderId: req.user._id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user._id }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};