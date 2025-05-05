const auth = (req, res, next) => {
    if (req.session && req.session.userId) {
      // Set user's info in the request
      req.user = { id: req.session.userId };
      next();
    } else {
      console.log('Session:', req.session); 
      return res.status(401).json({ error: 'Unauthorized - Please login first' });
    }
};

module.exports = auth;