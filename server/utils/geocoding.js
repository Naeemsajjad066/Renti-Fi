// utils/geocoding.js
import axios from 'axios';

// Geocode address using Google Maps API
export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });
    
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
        formattedAddress: response.data.results[0].formatted_address
      };
    } else {
      throw new Error('Geocoding failed: ' + response.data.status);
    }
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw error;
  }
};

// Reverse geocode coordinates
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${lat},${lng}`,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });
    
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      return response.data.results[0].formatted_address;
    } else {
      throw new Error('Reverse geocoding failed: ' + response.data.status);
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error.message);
    throw error;
  }
};

// Calculate distance between two points
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

// Find properties within radius
export const findPropertiesWithinRadius = async (centerLat, centerLng, radius, properties) => {
  return properties.filter(property => {
    if (!property.location.coordinates) return false;
    const [lng, lat] = property.location.coordinates;
    const distance = calculateDistance(centerLat, centerLng, lat, lng);
    return distance <= radius;
  });
};