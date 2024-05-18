const jwt = require('jsonwebtoken');
const { secretKey } = require('../confiq/jwt');

const authorize = (req, res, next) => {
  // Extract token from headers
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ error: 'Forbidden: No token provided' });
  }

  try {
    // Decode the token and check its validity including expiration
    const decodedToken = jwt.verify(token, secretKey);
  
    // Check if the role is TEAM_LEAD or OWNER
    if (decodedToken.role === 'TEAM_LEAD' || decodedToken.role === 'OWNER') {
      next();
    } else {
      return res.status(403).json({ error: 'Forbidden: Invalid role' });
    }
  } catch (error) {
    console.error('Token verification failed:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Forbidden: Token has expired' });
    }
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
};

module.exports = authorize;


