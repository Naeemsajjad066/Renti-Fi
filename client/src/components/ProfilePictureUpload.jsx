import { useState, useRef } from 'react';
import { Camera, Upload, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePictureUpload = ({ currentImage, onImageChange, disabled = false }) => {
  const [previewImage, setPreviewImage] = useState(currentImage);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateImage = (file) => {
    setError('');

    // Check file size (4MB limit to match server)
    const maxSize = 4 * 1024 * 1024; // 4MB
    if (file.size > maxSize) {
      const errorMsg = 'Image size too large. Please choose an image smaller than 4MB.';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = 'Unsupported image format. Please use JPEG, PNG, or WEBP.';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    }

    return true;
  };

  const handleImageChange = (file) => {
    if (!file || !validateImage(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target.result;
      setPreviewImage(base64Image);
      onImageChange(base64Image);
      setError('');
    };
    reader.onerror = () => {
      const errorMsg = 'Failed to read image file.';
      setError(errorMsg);
      toast.error(errorMsg);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = () => {
    setPreviewImage(null);
    onImageChange(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div
          className={`w-32 h-32 rounded-full border-4 border-dashed transition-all duration-200 overflow-hidden ${
            isDragging
              ? 'border-primary bg-primary/10'
              : error
                ? 'border-red-400 bg-red-50'
                : 'border-gray-300 hover:border-gray-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          {previewImage ? (
            <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {previewImage && !disabled && (
          <button
            type="button"
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
            onClick={removeImage}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="text-center">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Photo
        </button>
        <p className="text-xs text-gray-500 mt-2">Max 4MB • JPEG, PNG, WEBP</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default ProfilePictureUpload;
