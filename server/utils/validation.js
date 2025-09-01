// utils/validation.js
import validator from 'validator';

// Validate ID card number (adjust based on your country's format)
export const validateIdCardNumber = (idCardNumber) => {
  if (!idCardNumber || typeof idCardNumber !== 'string') return false;
  
  // Basic validation - adjust regex for your country's ID card format
  const idCardRegex = /^[A-Z0-9]{5,20}$/;
  return idCardRegex.test(idCardNumber.trim());
};

// Validate email
export const validateEmail = (email) => {
  return validator.isEmail(email);
};

// Validate phone number
export const validatePhoneNumber = (phoneNumber) => {
  return validator.isMobilePhone(phoneNumber, 'any', { strictMode: false });
};

// Validate password strength
export const validatePassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
    requirements: {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    }
  };
};

// Validate property data
export const validatePropertyData = (propertyData) => {
  const errors = [];
  
  if (!propertyData.title || propertyData.title.length < 5) {
    errors.push('Title must be at least 5 characters long');
  }
  
  if (!propertyData.description || propertyData.description.length < 50) {
    errors.push('Description must be at least 50 characters long');
  }
  
  if (!propertyData.pricePerNight || propertyData.pricePerNight <= 0) {
    errors.push('Price per night must be greater than 0');
  }
  
  if (!propertyData.bedrooms || propertyData.bedrooms < 0) {
    errors.push('Number of bedrooms is required');
  }
  
  if (!propertyData.bathrooms || propertyData.bathrooms < 0) {
    errors.push('Number of bathrooms is required');
  }
  
  if (!propertyData.maxGuests || propertyData.maxGuests < 1) {
    errors.push('Maximum guests must be at least 1');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate booking dates
export const validateBookingDates = (checkIn, checkOut) => {
  const today = new Date();
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  if (checkInDate < today) {
    return { isValid: false, error: 'Check-in date cannot be in the past' };
  }
  
  if (checkOutDate <= checkInDate) {
    return { isValid: false, error: 'Check-out date must be after check-in date' };
  }
  
  const minStay = 1; // Minimum 1 night
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  
  if (nights < minStay) {
    return { isValid: false, error: `Minimum stay is ${minStay} night(s)` };
  }
  
  return { isValid: true, nights };
};