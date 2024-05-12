

const authorize = (req, res, next) => {
    const { role } = req.body;
  
    if (role === 'OWNER' ) {
      next();
    } else {
      return res.status(403).json({ error: 'Forbidden: Invalid role' });
    }
  };
  
  module.exports = authorize;
  