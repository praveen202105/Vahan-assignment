const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/jwt');

const authenticate = (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  // Split the header value to get the token part
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, secretKey);

    
    // Attach the decoded user ID to the request object for future use
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = authenticate;
