import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  return token;
};

// Add this function to verify JWT tokens
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
