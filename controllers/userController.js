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
        return res.status(400).json({ 
          error: 'Missing required fields',
          details: 'Email, password, and first name are required for registration'
        });
      }

      // Validate email format
      if (!validateEmail(email)) {
        return res.status(400).json({ 
          error: 'Invalid email format',
          details: 'Please provide a valid email address (e.g., user@example.com)'
        });
      }

      // Check if email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ 
          error: 'Email already registered',
          details: 'An account with this email address already exists. Please use a different email or try logging in'
        });
      }

      // Validate password strength
      if (!validatePassword(password)) {
        return res.status(400).json({ 
          error: 'Password does not meet requirements',
          details: 'Password must be 8-20 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'
        });
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
        message: 'User registered successfully',
        user: { 
          id: user.id, 
          email: user.email, 
          firstName: user.firstName, 
          lastName: user.lastName 
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          error: 'Validation error',
          details: error.errors.map(e => e.message)
        });
      }
      res.status(500).json({ 
        error: 'Registration failed',
        details: 'An unexpected error occurred during registration. Please try again later'
      });
    }
  },

  // Login user (store session)
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Missing credentials',
          details: 'Both email and password are required for login'
        });
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ 
          error: 'Invalid credentials',
          details: 'No account found with this email address'
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          error: 'Invalid credentials',
          details: 'Incorrect password. Please try again'
        });
      }

      // Save session data
      req.session.userId = user.id;

      res.json({
        message: 'Login successful',
        user: { 
          id: user.id, 
          email: user.email, 
          firstName: user.firstName, 
          lastName: user.lastName 
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Login failed',
        details: 'An unexpected error occurred during login. Please try again later'
      });
    }
  },

  // Logout user
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ 
          error: 'Logout failed',
          details: 'An error occurred while trying to log out. Please try again'
        });
      }
      res.clearCookie('connect.sid');
      res.json({ 
        message: 'Logged out successfully',
        details: 'Your session has been terminated'
      });
    });
  },

  // Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findByPk(req.session.userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({ 
          error: 'User not found',
          details: 'Your user profile could not be found. Please try logging in again'
        });
      }

      res.json({
        message: 'Profile retrieved successfully',
        user
      });
    } catch (error) {
      console.error('Profile retrieval error:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve profile',
        details: 'An unexpected error occurred while fetching your profile'
      });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { firstName, lastName, email } = req.body;
      const user = await User.findByPk(req.session.userId);

      if (!user) {
        return res.status(404).json({ 
          error: 'User not found',
          details: 'Your user profile could not be found. Please try logging in again'
        });
      }

      // Validate email if provided
      if (email && !validateEmail(email)) {
        return res.status(400).json({ 
          error: 'Invalid email format',
          details: 'Please provide a valid email address (e.g., user@example.com)'
        });
      }

      // Check if new email is already taken by another user
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).json({ 
            error: 'Email already in use',
            details: 'This email address is already registered to another account'
          });
        }
      }

      await user.update({ firstName, lastName, email });
      res.json({
        message: 'Profile updated successfully',
        user: { 
          id: user.id, 
          email: user.email, 
          firstName: user.firstName, 
          lastName: user.lastName 
        }
      });
    } catch (error) {
      console.error('Profile update error:', error);
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          error: 'Validation error',
          details: error.errors.map(e => e.message)
        });
      }
      res.status(500).json({ 
        error: 'Failed to update profile',
        details: 'An unexpected error occurred while updating your profile'
      });
    }
  }
};

module.exports = userController;