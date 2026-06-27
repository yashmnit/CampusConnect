const User = require("../models/user.model");
const getAvailableUsers = async (req, res) => {
  try {
    const users = await User.find({
      isAvailable: true,
      _id: { $ne: req.user._id }, 
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, location, isAvailable, canBring, statusMessage } = req.body;
    if (name !== undefined) user.name = name;
    if (location !== undefined) user.location = location;
    if (isAvailable !== undefined) user.isAvailable = isAvailable;
    if (canBring !== undefined) user.canBring = canBring;
    if (statusMessage !== undefined) user.statusMessage = statusMessage;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAvailableUsers, getAllUsers, getUserById, updateProfile };