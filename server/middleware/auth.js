// middleware/auth.js
import { verifyToken } from '../lib/utils.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {

  try {
    let token;
    
    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    
    // Verify token
    const decoded = verifyToken(token);

    
    // Get user from token
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

// Optional: Admin protection middleware
export const adminProtect = async (req, res, next) => {
  try {
    await protect(req, res, () => {});
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized as admin'
      });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

// Optional: Host protection middleware
export const hostProtect = async (req, res, next) => {
  try {
    await protect(req, res, () => {});
    
    if (req.user.role !== 'host' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized as host'
      });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};