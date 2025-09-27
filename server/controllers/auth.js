


// Middleware to protect route

import User from "../models/User.js";
import jwt from "jsonwebtoken"

export const protectRoute = async (req, res, next) => {
    try {
        let token = null;

        // Prefer standard Authorization: Bearer <token>
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        // Fallback to legacy custom header 'token'
        if (!token && req.headers.token) {
            token = req.headers.token;
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(401).json({ success: false, message: error.message });
    }
}