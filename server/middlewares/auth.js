import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    // FIX: Check if token exists and if it is not empty. If missing, return 401 immediately.
    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized, token missing" });
    }
    
    try {
        // Assuming the token is just the JWT string based on previous code.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "Not authorized, user not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        // FIX: Ensure status code 401 for token failure.
        res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
};