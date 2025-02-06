const jwt = require('jsonwebtoken');
const secretKey = '77b22a07938ccbb0565abc929d9ee5726affa3c4b197ea58ed28374d8f42161cadf47f74a95a10099d9c9d72541fbea1f579ba123b68cb9021edf8046ce030c6'; // Replace with your actual secret key

// Middleware to verify JWT and extract user ID
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return res.status(403).send('No token provided.');
  }

  try {
    const decoded = jwt.verify(token, secretKey); // Use the same secret key
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).send('Unauthorized: Invalid token');
  }
};

module.exports = verifyToken;
