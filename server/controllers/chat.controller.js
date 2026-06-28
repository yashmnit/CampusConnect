const Message = require("../models/message.model");

// GET /api/chat/:userId
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ],
    })
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ createdAt: 1 });

    res.json(messages || []);
  } catch (error) {
    console.error("getMessages error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/chat/conversations
const getConversations = async (req, res) => {
  try {
    // Safely return empty array if no messages exist
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id },
      ],
    })
      .populate("sender", "name isOnline")
      .populate("receiver", "name isOnline")
      .sort({ createdAt: -1 })
      .lean(); // .lean() converts to plain JS objects — safer to work with

    if (!messages || messages.length === 0) {
      return res.json([]);
    }

    const seen = new Set();
    const conversations = [];

    for (const msg of messages) {
      try {
        // Skip if sender or receiver is missing (deleted user etc)
        if (!msg.sender || !msg.receiver) continue;

        const myId = req.user._id.toString();

        // Handle both populated object and raw ObjectId
        const senderId = msg.sender._id
          ? msg.sender._id.toString()
          : msg.sender.toString();

        const partner = senderId === myId ? msg.receiver : msg.sender;

        if (!partner) continue;

        const partnerId = partner._id
          ? partner._id.toString()
          : partner.toString();

        if (!seen.has(partnerId)) {
          seen.add(partnerId);
          conversations.push({
            user: partner,
            lastMessage: {
              content: msg.content,
              sender: msg.sender,
              createdAt: msg.createdAt,
            },
          });
        }
      } catch (innerErr) {
        // Skip this message if something goes wrong, don't crash everything
        console.error("Skipping message due to error:", innerErr.message);
        continue;
      }
    }

    res.json(conversations);
  } catch (error) {
    console.error("getConversations error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages, getConversations };