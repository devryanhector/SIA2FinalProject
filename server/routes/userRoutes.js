const express = require('express');
const userController = require('../controllers/userControllers.js');  // Correct path to the controller


const router = express.Router();

// Create a new user
router.post('/users', userController.createUser);

// Get all users
router.get('/users', userController.getUsers);

// Get a user by ID
router.get('/users/:id', userController.getUserById);

// Get current user by token
router.get('/users/me', require('../middleware/authMiddleware'), async (req, res) => {
  try {
    const User = require('../models/userModel');
    const userId = req.user.id || req.user._id;
    if (!userId) {
      return res.status(400).json({ message: 'Invalid or missing user in token', user: req.user });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found', userId });
    // Always return the username field from the database
    res.json({ username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.toString() });
  }
});

// Update a user by ID
router.put('/users/:id', userController.updateUser);

// Delete a user by ID
router.delete('/users/:id', userController.deleteUser);

// User login
router.post('/login', userController.loginUser);

// Register a new user
router.post('/register', userController.registerUser);

// Forgot password
router.post('/forgot-password', userController.forgotPassword);


module.exports = router;