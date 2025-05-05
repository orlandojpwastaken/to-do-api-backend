const User = require('../models/user');
const bcrypt = require('bcrypt');

const userController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      const user = await User.create({
        email,
        password,
        firstName,
        lastName
      });
      res.status(201).json({
        message: 'User created successfully',
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Login user (store session)
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Save session data
      req.session.userId = user.id;

      res.json({
        message: 'Login successful',
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Logout user
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  },

  // Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findByPk(req.session.userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { firstName, lastName, email } = req.body;
      const user = await User.findByPk(req.session.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await user.update({ firstName, lastName, email });
      res.json({
        message: 'Profile updated successfully',
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

  module.exports = userController;