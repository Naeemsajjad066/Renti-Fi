// utils/jwt.js
import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (userId, expiresIn = process.env.JWT_EXPIRE) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Generate refresh token
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Decode token without verification (for getting user ID)
export const decodeToken = (token) => {
  return jwt.decode(token);
};