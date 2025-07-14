const User = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key';

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, userRole } = req.body;

    // Check for duplicate email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email or username' });
    }

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username: username,
      email: email,
      password: hashedPassword,
      userRole: userRole // Optionally include user role during user creation
    });

    const savedUser = await user.save();
    res.status(201).json({ message: 'User created successfully', user: savedUser });
  } catch (error) {
    console.error('Registration error:', error); // Log the real error
    res.status(400).json({ message: 'Error creating user', error });
  }
};

// Register a new user (same as createUser for now)
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, userRole } = req.body;
    // Check for duplicate email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email or username' });
    }
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username: username,
      email: email,
      password: hashedPassword,
      userRole: userRole || 'user'
    });
    const savedUser = await user.save();
    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: 'Error registering user', error });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving users', error });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving user', error });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const { username, email, password, userRole } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.userRole = userRole || user.userRole; // Update userRole if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error });
  }
};


// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    if (user = await User.findByIdAndDelete(id)) {
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting user', error });
  }
};

exports.loginUser = async (req, res) => {
  const { loginID, password } = req.body;

  try {
    // Accept login by username or email
    const user = await User.findOne({ $or: [ { email: loginID }, { username: loginID } ] });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.userRole !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can login here' });
    }

    // Ensure token contains correct id and username (use _id as string)
    const token = jwt.sign(
      { id: user._id ? user._id.toString() : user.id, username: user.username, role: user.userRole },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      userRole: user.userRole,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Forgot password (simple: set new password by email)
exports.forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Error resetting password', error });
  }
};

