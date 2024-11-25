const jwt = require('jsonwebtoken');
const secretKey = '77b22a07938ccbb0565abc929d9ee5726affa3c4b197ea58ed28374d8f42161cadf47f74a95a10099d9c9d72541fbea1f579ba123b68cb9021edf8046ce030c6'; // Replace with your actual secret key

// Middleware to verify JWT and extract user ID
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']; // Retrieve the token from the Authorization header

  if (!token) {
    return res.status(403).send('No token provided.');
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, secretKey);

    // Attach user ID to the request object for use in routes
    req.userId = decoded.id;

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).send('Unauthorized: Invalid token');
  }
};

module.exports = verifyToken;
