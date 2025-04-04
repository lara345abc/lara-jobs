const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env; 

const verifyJwt = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify the token using the JWT_SECRET
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach the decoded information to the request object
        req.candidate = decoded;

        // Call the next middleware/route handler
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = verifyJwt;
