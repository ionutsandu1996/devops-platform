// auth.js — JWT authentication middleware
// This function runs BEFORE any protected route handler
// If the token is missing or invalid, the request is rejected here
// and never reaches the route

const jwt = require('jsonwebtoken');

// This is a middleware function — it receives req, res, and next
// next() = "everything is ok, continue to the route handler"
// If we don't call next(), the request stops here
const auth = (req, res, next) => {

    // The token is sent in the Authorization header
    // Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const authHeader = req.headers['authorization'];

    // If the header is missing, reject immediately
    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
        // 401 Unauthorized — the request lacks valid authentication
    }

    // The header value is "Bearer <token>"
    // We split by space and take the second part — the actual token
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. Invalid token format.' });
    }

    try {
        // jwt.verify() does two things:
        // 1. Checks that the token was signed with our JWT_SECRET
        // 2. Checks that the token has not expired
        // If either check fails, it throws an error
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded payload to the request object
        // so the route handler can access it with req.admin
        // The payload contains: { id, email, iat, exp }
        req.admin = decoded;

        // Everything is valid — continue to the route handler
        next();

    } catch (err) {
        // JsonWebTokenError: token was tampered with or signed with wrong secret
        // TokenExpiredError: token is older than JWT_EXPIRES_IN
        return res.status(403).json({ error: 'Invalid or expired token.' });
        // 403 Forbidden — we understood the request but refuse to authorize it
    }
};

module.exports = auth;