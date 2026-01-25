
const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      message: "Registered successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN (optional)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const access = auth.createAccessToken(user);

    res.json({
      access,
      message: "Login successful"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserDetails = (req, res) => {
  res.json({
    _id: req.user.id,
    email: req.user.email,
    role: req.user.role
  });
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // exclude password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};