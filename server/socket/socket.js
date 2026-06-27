const User = require("../models/user.model");
const Message = require("../models/message.model");


const onlineUsers = new Map();

const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("user:online", async (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      await User.findByIdAndUpdate(userId, { isOnline: true });

      io.emit("users:online", Array.from(onlineUsers.keys()));
    });

    socket.on("message:send", async ({ senderId, receiverId, content }) => {
      try {
    
        const message = await Message.create({
          sender: senderId,
          receiver: receiverId,
          content,
        });
        const populated = await Message.findById(message._id).populate(
          "sender",
          "name"
        );
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("message:receive", populated);
        }
        socket.emit("message:sent", populated);
      } catch (error) {
        socket.emit("error", { message: "Failed to send message" });
      }
    });
    socket.on("typing:start", ({ receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing:start", { senderId: socket.userId });
      }
    });

    socket.on("typing:stop", ({ receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing:stop", { senderId: socket.userId });
      }
    });
    socket.on("disconnect", async () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        await User.findByIdAndUpdate(socket.userId, { isOnline: false });
        io.emit("users:online", Array.from(onlineUsers.keys()));
        console.log("User went offline:", socket.userId);
      }
    });
  });
};

module.exports = initSocket;