const Message = require("../models/message.model");
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

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id },
      ],
    })
      .populate("sender", "name isOnline")
      .populate("receiver", "name isOnline")
      .sort({ createdAt: -1 }); 
    const seen = new Set();
    const conversations = [];

    for (const msg of messages) {
      const partner =
        msg.sender._id.toString() === req.user._id.toString()
          ? msg.receiver
          : msg.sender;

      if (!seen.has(partner._id.toString())) {
        seen.add(partner._id.toString());
        conversations.push({ user: partner, lastMessage: msg });
      }
    }

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages, getConversations };