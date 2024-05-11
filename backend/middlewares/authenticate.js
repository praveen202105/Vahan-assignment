

const jwt = require('jsonwebtoken');
const { secretKey } = require('../confiq/jwt');

const authenticate = (req, res, next) => {
  
  const token = req.header('Authorization');

  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
   
    const decoded = jwt.verify(token, secretKey);

   
    req.userId = decoded.userId;

 
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = authenticate;
