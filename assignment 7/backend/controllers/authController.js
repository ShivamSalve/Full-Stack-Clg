const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { logAuthActivity } = require('../utils/excelSync');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  const { name, prn, email, password } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { prn }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this Email or PRN' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      prn,
      email,
      password: hashedPassword,
    });

    if (user) {
      // Dual-Sync: Save to MS Excel Log
      await logAuthActivity(user.name, user.prn, user.email, "Register");

      res.status(201).json({
        _id: user._id,
        name: user.name,
        prn: user.prn,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { prn, email, password } = req.body;

  try {
    // Allows login using either PRN or Email
    const user = await User.findOne({ 
      $or: [{ email: email || '' }, { prn: prn || '' }] 
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Dual-Sync: Save to MS Excel Log
      await logAuthActivity(user.name, user.prn, user.email, "Login");

      res.json({
        _id: user._id,
        name: user.name,
        prn: user.prn,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
