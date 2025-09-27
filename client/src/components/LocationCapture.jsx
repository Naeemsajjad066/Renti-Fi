// components/LocationCapture.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, CheckCircle, Loader, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LocationCapture = ({ onLocationCapture, onLocationError, isRequired = true }) => {
  const [locationState, setLocationState] = useState({
    isCapturing: false,
    location: null,
    error: null,
    accuracy: null,
    timestamp: null
  });

  const [hasUserConfirmed, setHasUserConfirmed] = useState(false);

  const captureLocation = () => {
    if (!navigator.geolocation) {
      const error = 'Geolocation is not supported by this browser';
      setLocationState(prev => ({ ...prev, error }));
      onLocationError?.(error);
      return;
    }

    setLocationState(prev => ({ ...prev, isCapturing: true, error: null }));

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const timestamp = new Date();
        
        const locationData = {
          latitude,
          longitude,
          accuracy,
          timestamp
        };

        setLocationState({
          isCapturing: false,
          location: locationData,
          error: null,
          accuracy,
          timestamp
        });

        onLocationCapture?.(locationData);
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = `Unknown error: ${error.message}`;
            break;
        }

        setLocationState(prev => ({
          ...prev,
          isCapturing: false,
          error: errorMessage
        }));

        onLocationError?.(errorMessage);
      },
      options
    );
  };

  const formatAccuracy = (accuracy) => {
    if (!accuracy) return 'Unknown';
    if (accuracy < 10) return `Very High (±${accuracy.toFixed(1)}m)`;
    if (accuracy < 50) return `High (±${accuracy.toFixed(1)}m)`;
    if (accuracy < 100) return `Medium (±${accuracy.toFixed(1)}m)`;
    return `Low (±${accuracy.toFixed(1)}m)`;
  };

  const formatCoordinates = (lat, lng) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  return (
    <div className="w-full space-y-4">
      {/* Warning Message */}
      <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <strong>Important:</strong> Please make sure you are physically present at the property location 
          before capturing the location. This helps verify the authenticity of your listing.
        </AlertDescription>
      </Alert>

      {/* Confirmation Checkbox */}
      <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <input
          type="checkbox"
          id="location-confirm"
          checked={hasUserConfirmed}
          onChange={(e) => setHasUserConfirmed(e.target.checked)}
          className="mt-1 h-4 w-4 text-earth-brown focus:ring-earth-brown border-gray-300 rounded"
        />
        <label htmlFor="location-confirm" className="text-sm text-gray-700 dark:text-gray-300">
          I confirm that I am currently at the property location and ready to capture its coordinates.
        </label>
      </div>

      {/* Location Capture Button */}
      <div className="flex flex-col space-y-3">
        <Button
          onClick={captureLocation}
          disabled={!hasUserConfirmed || locationState.isCapturing}
          className="w-full bg-earth-brown hover:bg-earth-brown/90 text-white"
        >
          {locationState.isCapturing ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Capturing Location...
            </>
          ) : locationState.location ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Recapture Location
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Capture Current Location
            </>
          )}
        </Button>

        {!hasUserConfirmed && (
          <p className="text-xs text-gray-500 text-center">
            Please confirm you are at the property location first
          </p>
        )}
      </div>

      {/* Location Status */}
      {locationState.location && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
        >
          <div className="flex items-center mb-2">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              Location Captured Successfully
            </span>
          </div>
          
          <div className="space-y-2 text-xs text-green-700 dark:text-green-300">
            <div>
              <strong>Coordinates:</strong> {formatCoordinates(
                locationState.location.latitude, 
                locationState.location.longitude
              )}
            </div>
            <div>
              <strong>Accuracy:</strong> {formatAccuracy(locationState.accuracy)}
            </div>
            <div>
              <strong>Captured:</strong> {locationState.timestamp?.toLocaleString()}
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {locationState.error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-sm font-medium text-red-800 dark:text-red-200">
              Location Capture Failed
            </span>
          </div>
          <p className="text-xs text-red-700 dark:text-red-300">
            {locationState.error}
          </p>
          
          <div className="mt-3 text-xs text-red-600 dark:text-red-400">
            <p><strong>Troubleshooting:</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Make sure location services are enabled</li>
              <li>Allow location access when prompted</li>
              <li>Try moving to an area with better GPS signal</li>
              <li>Refresh the page and try again</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* Optional/Required Status */}
      <div className="text-xs text-gray-500 text-center">
        {isRequired ? (
          <span className="text-red-500">* Location capture is required for property verification</span>
        ) : (
          <span>Location capture is optional but recommended for better visibility</span>
        )}
      </div>
    </div>
  );
};

export default LocationCapture;