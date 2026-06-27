const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const generateToken = (id) => {
  return jwt.sign(
    { id },                        
    process.env.JWT_SECRET,        
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};
const registerUser = async (req, res) => {
    
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const user = await User.create({ name, email, password });


   const userObj = user.toJSON();
res.status(201).json({
  ...userObj,
  token: generateToken(user._id),
});
  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password" });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }
    res.json({
      ...user.toJSON(),
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { registerUser, loginUser, getMe };