const { RATE_LIMIT_WINDOW, RATE_LIMIT_REQUESTS } = require('../config/constants');
const requestCounts = {};

const rateLimiter = (req, res, next) => {
    const email = req.body.email;
    if (!email) return next();

    const currentTime = Date.now();
    if (!requestCounts[email]) {
        requestCounts[email] = { count: 1, firstRequestTime: currentTime };
    } else if (currentTime - requestCounts[email].firstRequestTime < RATE_LIMIT_WINDOW) {
        requestCounts[email].count++;
        if (requestCounts[email].count > RATE_LIMIT_REQUESTS) {
            return res.status(429).json({ message: 'Too many requests. Please try again later.' });
        }
    } else {
        requestCounts[email] = { count: 1, firstRequestTime: currentTime };
    }
    next();
};

module.exports = rateLimiter;
