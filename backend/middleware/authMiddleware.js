const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Restrict route to a specific role (e.g. only artists can upload songs)
const artistOnly = (req, res, next) => {
  if (req.user && req.user.role === 'artist') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: artists only' });
  }
};

module.exports = { protect, artistOnly };