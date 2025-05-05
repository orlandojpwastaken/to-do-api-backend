const User = require('../models/user');
const bcrypt = require('bcrypt');

// Methods
const validateEmail = (email) => {
  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // 8-20 characters, with upper, lower, number, special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
  return passwordRegex.test(password);
};

const userController = {
  register: async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Check for required fields
      if (!email || !password || !firstName) {
        return res.status(400).json({ error: 'Email, password, and first name are required.' });
      }

      // Validate email format
      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
      }

      // Check if email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered.' });
      }

      // Validate password strength
      if (!validatePassword(password)) {
        return res.status(400).json({ error: 'Password must be 8-20 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        email,
        password: hashedPassword,
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
        // return res.status(401).json({ error: 'Invalid credentials' });
        return res.status(401).json({ error: 'Invalid credentials, email' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        // return res.status(401).json({ error: 'Invalid credentials' });
        return res.status(401).json({ error: 'Invalid password' });
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