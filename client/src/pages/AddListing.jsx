import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, 
  MapPin, 
  Banknote, 
  Home, 
  CalendarIcon, 
  Check, 
  X, 
  Plus, 
  Image,
  Bed,
  Bath,
  Users,
  Smartphone,
  Wifi,
  Tv,
  Utensils,
  Car,
  Wind,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import PageTransition from '@/components/PageTransition';
import HostSidebar from '@/components/HostSidebar';
import LocationCapture from '@/components/LocationCapture';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { PropertyContext } from '../contexts/PropertyContext';
import { useContext } from 'react';
const propertyTypes = [
  { id: 'apartment', label: 'Apartment' },
  { id: 'house', label: 'House' },
  { id: 'villa', label: 'Villa' },
  { id: 'cabin', label: 'Cabin' },
  { id: 'cottage', label: 'Cottage' },
  { id: 'loft', label: 'Loft' },
];

const selectedAmenities = [
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { id: 'tv', label: 'TV', icon: Tv },
  { id: 'kitchen', label: 'Kitchen', icon: Utensils },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'ac', label: 'Air Conditioning', icon: Wind },
];

const AddListing = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { createProperty, updateProperty, fetchPropertyById, selectedProperty } = useContext(PropertyContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  // Form state
  const [images, setImages] = useState([]);
  const [idCardImage, setIdCardImage] = useState(null);
  const [propertyDocuments, setPropertyDocuments] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
    propertyType: '',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    price: '',
    selectedAmenities: [],
    instantBooking: false,
    latitude: null,
    longitude: null,
    locationAccuracy: null,
    paymentOptions: '',
    cancellationPolicy: '',
  });
  
  // Location capture state
  const [locationCaptured, setLocationCaptured] = useState(false);
  
  // Load property data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchPropertyById(id);
    }
  }, [id, isEditMode]);
  
  // Populate form data when property is loaded
  useEffect(() => {
    if (isEditMode && selectedProperty) {
      setFormData({
        title: selectedProperty.title || '',
        description: selectedProperty.description || '',
        address: selectedProperty.address || '',
        city: selectedProperty.city || '',
        state: selectedProperty.state || '',
        zipCode: selectedProperty.zipCode || '',
        country: 'Pakistan',
        propertyType: selectedProperty.propertyType || '',
        bedrooms: selectedProperty.bedrooms || 1,
        bathrooms: selectedProperty.bathrooms || 1,
        maxGuests: selectedProperty.maxGuests || 2,
        price: selectedProperty.price || '',
        selectedAmenities: selectedProperty.amenities || [],
        instantBooking: selectedProperty.instantBooking || false,
        latitude: selectedProperty.latitude || null,
        longitude: selectedProperty.longitude || null,
        locationAccuracy: selectedProperty.locationAccuracy || null,
        paymentOptions: selectedProperty.paymentOptions || '',
        cancellationPolicy: selectedProperty.cancellationPolicy || '',
      });
      
      if (selectedProperty.images && selectedProperty.images.length > 0) {
        setImages(selectedProperty.images.map((url, index) => ({
          id: index,
          preview: url,
          isExisting: true
        })));
      }
      
      if (selectedProperty.latitude && selectedProperty.longitude) {
        setLocationCaptured(true);
      }
    }
  }, [selectedProperty, isEditMode]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => {
      const selected = [...prev.selectedAmenities];
      if (selected.includes(amenityId)) {
        return { ...prev, selectedAmenities: selected.filter(id => id !== amenityId) };
      } else {
        return { ...prev, selectedAmenities: [...selected, amenityId] };
      }
    });
  };
  
  // Location capture handlers
  const handleLocationCapture = (locationData) => {
    setFormData(prev => ({
      ...prev,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      locationAccuracy: locationData.accuracy
    }));
    setLocationCaptured(true);
    toast({
      title: "Location Captured!",
      description: "Property location has been successfully captured.",
      variant: "success",
    });
  };
  
  const handleLocationError = (error) => {
    toast({
      title: "Location Error",
      description: error,
      variant: "destructive",
    });
  };
  

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Create preview URLs for the images
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };
  
  const removeImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // ID Card upload handler
  const handleIdCardUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdCardImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const removeIdCard = () => {
    if (idCardImage) {
      URL.revokeObjectURL(idCardImage.preview);
      setIdCardImage(null);
    }
  };

  // Property documents upload handler
  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setPropertyDocuments(prev => [...prev, ...newDocuments]);
  };

  const removeDocument = (index) => {
    setPropertyDocuments(prev => {
      const newDocs = [...prev];
      URL.revokeObjectURL(newDocs[index].preview);
      newDocs.splice(index, 1);
      return newDocs;
    });
  };


  
  const nextStep = () => {
    setActiveStep(prev => {
      // Skip step 5 (Documents) when in edit mode
      if (isEditMode && prev === 4) {
        return 6;
      }
      return prev + 1;
    });
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setActiveStep(prev => {
      // Skip step 5 (Documents) when in edit mode
      if (isEditMode && prev === 6) {
        return 4;
      }
      return prev - 1;
    });
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const formDataToSend = new FormData();
  
      // Append all text/number/boolean fields
      Object.keys(formData).forEach((key) => {
        if (key === "selectedAmenities") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
  
      // Append images (only new images with file property)
      if (images.length > 0) {
        images.forEach((img) => {
          if (img.file) {
            formDataToSend.append("images", img.file);
          }
        });
      }

      // Append ID card (only in create mode)
      if (!isEditMode && idCardImage) {
        formDataToSend.append("idCard", idCardImage.file);
      }

      // Append property documents (only in create mode)
      if (!isEditMode && propertyDocuments.length > 0) {
        propertyDocuments.forEach((doc) => {
          formDataToSend.append("propertyDocuments", doc.file);
        });
      }
  
      // Call appropriate context function
      let result;
      if (isEditMode) {
        result = await updateProperty(id, formDataToSend);
      } else {
        result = await createProperty(formDataToSend);
      }
  
      if (result.success) {
        toast({
          title: isEditMode ? "Property Updated!" : "Property Submitted for Verification!",
          description: isEditMode 
            ? "Your property has been updated successfully."
            : "Your property has been submitted and is pending admin verification. You'll receive an email once it's reviewed.",
          variant: "success",
        });
  
        // Navigate to dashboard
        navigate("/host/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 flex">
        <HostSidebar 
          isMobile={isMobile}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />
        
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-display font-bold text-gray-900">
                {isEditMode ? 'Edit Listing' : 'Add New Listing'}
              </h1>
              
              <Link 
                to="/host/dashboard" 
                className="text-gray-600 hover:text-gray-900"
              >
                Cancel
              </Link>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              {/* Progress steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {[1, 2, 3, 4, 5, 6].filter(step => !(isEditMode && step === 5)).map((step) => (
                    <div key={step} className="flex flex-col items-center">
                      <div 
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 transition-colors",
                          activeStep >= step 
                            ? "bg-primary text-white" 
                            : "bg-gray-200 text-gray-600"
                        )}
                      >
                        {step}
                      </div>
                      <div className="text-xs text-gray-600 text-center">
                        {step === 1 && "Basic Info"}
                        {step === 2 && "Location"}
                        {step === 3 && "Details"}
                        {step === 4 && "Photos"}
                        {step === 5 && "Documents"}
                        {step === 6 && "Price"}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-1">
                  <div className={`flex-1 h-1 rounded-l ${activeStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                  <div className={`flex-1 h-1 ${activeStep >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                  <div className={`flex-1 h-1 ${activeStep >= 4 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                  <div className={`flex-1 h-1 ${activeStep >= 5 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                  <div className={`flex-1 h-1 ${activeStep >= 6 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                  <div className={`flex-1 h-1 rounded-r ${activeStep >= 7 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                {/* Step 1: Basic Info */}
                {activeStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Basic Information</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                          Property Title
                        </Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="e.g. Cozy DHA Apartment"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Describe your property..."
                          value={formData.description}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                          rows={5}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="propertyType" className="text-sm font-medium text-gray-700">
                          Property Type
                        </Label>
                        <Select
                          value={formData.propertyType}
                          onValueChange={(value) => handleSelectChange('propertyType', value)}
                        >
                          <SelectTrigger className="mt-1 w-full">
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {propertyTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-700 block mb-3">
                          Location
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="address" className="text-xs text-gray-600">
                              Street Address
                            </Label>
                            <Input
                              id="address"
                              name="address"
                              placeholder="123 Main St"
                              value={formData.address}
                              onChange={handleInputChange}
                              required
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="city" className="text-xs text-gray-600">
                              City
                            </Label>
                            <Input
                              id="city"
                              name="city"
                              placeholder="Karachi"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="state" className="text-xs text-gray-600">
                              State/Province
                            </Label>
                            <Input
                              id="state"
                              name="state"
                              placeholder="NY"
                              value={formData.state}
                              onChange={handleInputChange}
                              required
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="zipCode" className="text-xs text-gray-600">
                              Zip/Postal Code
                            </Label>
                            <Input
                              id="zipCode"
                              name="zipCode"
                              placeholder="10001"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              required
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <Button type="button" onClick={nextStep}>
                        Next <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}
                
                {/* Step 2: Location Verification */}
                {activeStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Location Verification</h2>
                    
                    <div className="mb-6">
                      <p className="text-gray-600 mb-4">
                        To ensure the authenticity of your listing, we need to verify the property's location. 
                        This helps build trust with potential guests and improves your listing's credibility.
                      </p>
                    </div>
                    
                    <LocationCapture
                      onLocationCapture={handleLocationCapture}
                      onLocationError={handleLocationError}
                      isRequired={true}
                    />
                    
                    <div className="mt-8 flex justify-between">
                      <Button type="button" onClick={prevStep} variant="outline">
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        disabled={!locationCaptured}
                        className={locationCaptured ? '' : 'opacity-50 cursor-not-allowed'}
                      >
                        Next <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}
                
                {/* Step 3: Details & selectedAmenities */}
                {activeStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Details & selectedAmenities</h2>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="bedrooms" className="text-sm font-medium text-gray-700 block mb-2">
                            Bedrooms
                          </Label>
                          <Select
                            value={formData.bedrooms.toString()}
                            onValueChange={(value) => handleSelectChange('bedrooms', parseInt(value))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} {num === 1 ? 'bedroom' : 'bedrooms'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="bathrooms" className="text-sm font-medium text-gray-700 block mb-2">
                            Bathrooms
                          </Label>
                          <Select
                            value={formData.bathrooms.toString()}
                            onValueChange={(value) => handleSelectChange('bathrooms', parseInt(value))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} {num === 1 ? 'bathroom' : 'bathrooms'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="maxGuests" className="text-sm font-medium text-gray-700 block mb-2">
                            Max Guests
                          </Label>
                          <Select
                            value={formData.maxGuests.toString()}
                            onValueChange={(value) => handleSelectChange('maxGuests', parseInt(value))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} {num === 1 ? 'guest' : 'guests'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-700 block mb-3">
                          Property Size
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Input
                              id="size"
                              name="size"
                              type="number"
                              placeholder="Size"
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Select
                              defaultValue="sqft"
                              onValueChange={(value) => handleSelectChange('sizeUnit', value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem value="sqft">sq ft</SelectItem>
                                <SelectItem value="sqm">sq m</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-700 block mb-3">
                          Available selectedAmenities
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedAmenities.map((amenity) => (
                            <div key={amenity.id} className="flex items-center space-x-2">
                              <Switch 
                                checked={formData.selectedAmenities.includes(amenity.id)}
                                onCheckedChange={() => handleAmenityToggle(amenity.id)}
                                id={`amenity-${amenity.id}`}
                              />
                              <Label 
                                htmlFor={`amenity-${amenity.id}`}
                                className="cursor-pointer flex items-center"
                              >
                                <amenity.icon className="mr-2 h-4 w-4 text-gray-600" />
                                {amenity.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Back
                      </Button>
                      <Button type="button" onClick={nextStep}>
                        Next <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}
                
                {/* Step 3: Photos */}
                {activeStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Photos</h2>
                    
                    <div className="mb-6">
                      <p className="text-gray-600 mb-4">
                        Upload high-quality photos of your property. Add at least 5 photos including the exterior, living room, bedrooms, and bathrooms.
                      </p>
                      
                      <label className="block">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                          <p className="text-sm text-gray-600 mb-1">Drag and drop files here, or click to browse</p>
                          <p className="text-xs text-gray-500">JPG, PNG or WEBP (max. 10MB each)</p>
                          <input 
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </div>
                      </label>
                    </div>
                    
                    {images.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Uploaded Photos</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {images.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden">
                                <img 
                                  src={image.preview} 
                                  alt={`Preview ${index + 1}`} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                          
                          <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                            <Plus size={24} className="text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500">Add More</span>
                            <input 
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-8 flex justify-between">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        disabled={images.length === 0}
                      >
                        Next <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}
                
                {/* Step 5: Verification Documents */}
                {!isEditMode && activeStep === 5 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Verification Documents</h2>
                    
                    <div className="mb-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800">
                          <strong>Why do we need these documents?</strong> To ensure the safety and authenticity of all listings, 
                          we require verification documents. Your information is kept secure and will only be used for verification purposes.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {/* ID Card Upload */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700 block mb-3">
                          Host ID Card/Passport * <span className="text-red-500">(Required)</span>
                        </Label>
                        <p className="text-xs text-gray-600 mb-3">
                          Upload a clear photo of your government-issued ID card or passport for identity verification.
                        </p>
                        
                        {!idCardImage ? (
                          <label className="block">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                              <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600 mb-1">Click to upload ID card</p>
                              <p className="text-xs text-gray-500">JPG, PNG (max. 10MB)</p>
                              <input 
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleIdCardUpload}
                              />
                            </div>
                          </label>
                        ) : (
                          <div className="relative inline-block">
                            <div className="w-64 h-40 rounded-lg overflow-hidden border-2 border-green-500">
                              <img 
                                src={idCardImage.preview} 
                                alt="ID Card" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={removeIdCard}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md"
                            >
                              <X size={16} />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              <Check size={12} className="inline mr-1" />
                              Uploaded
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Property Documents Upload */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700 block mb-3">
                          Property Documents * <span className="text-red-500">(Required - At least 1 document)</span>
                        </Label>
                        <p className="text-xs text-gray-600 mb-3">
                          Upload proof of ownership or authorization (e.g., property deed, rental agreement, authorization letter, utility bills).
                        </p>
                        
                        <label className="block">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                            <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 mb-1">Click to upload property documents</p>
                            <p className="text-xs text-gray-500">JPG, PNG, PDF (max. 10MB each)</p>
                            <input 
                              type="file"
                              multiple
                              accept="image/*,.pdf"
                              className="hidden"
                              onChange={handleDocumentUpload}
                            />
                          </div>
                        </label>

                        {propertyDocuments.length > 0 && (
                          <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents ({propertyDocuments.length})</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {propertyDocuments.map((doc, index) => (
                                <div key={index} className="relative group">
                                  <div className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                                    {doc.file.type === 'application/pdf' ? (
                                      <div className="w-full h-full bg-red-50 flex flex-col items-center justify-center">
                                        <svg className="w-12 h-12 text-red-500 mb-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z"/>
                                        </svg>
                                        <span className="text-xs text-gray-600 px-2 text-center truncate w-full">
                                          {doc.name}
                                        </span>
                                      </div>
                                    ) : (
                                      <img 
                                        src={doc.preview} 
                                        alt={`Document ${index + 1}`} 
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeDocument(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                              
                              <label className="aspect-video rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                                <Plus size={20} className="text-gray-400 mb-1" />
                                <span className="text-xs text-gray-500">Add More</span>
                                <input 
                                  type="file"
                                  multiple
                                  accept="image/*,.pdf"
                                  className="hidden"
                                  onChange={handleDocumentUpload}
                                />
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        disabled={!idCardImage || propertyDocuments.length === 0}
                        className={(!idCardImage || propertyDocuments.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}
                      >
                        Next <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 6: Pricing */}
                {activeStep === 6 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing & Payment</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="price" className="text-sm font-medium text-gray-700 block mb-3">
                          Price Per Night/Day *
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Banknote size={16} className="text-gray-500" />
                          </div>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                            className="pl-8"
                          />
                        </div>
                      </div>

                      {/* Payment Options */}
                      <div>
                        <Label htmlFor="paymentOptions" className="text-sm font-medium text-gray-700 block mb-3">
                          Payment Options * <span className="text-red-500">(Required)</span>
                        </Label>
                        <p className="text-xs text-gray-600 mb-3">
                          Select how guests can pay for their bookings
                        </p>
                        <Select 
                          value={formData.paymentOptions} 
                          onValueChange={(value) => setFormData(prev => ({...prev, paymentOptions: value}))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select payment option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="arrival">Pay on Arrival Only (Cash)</SelectItem>
                            <SelectItem value="early">Online Payment Only (40% upfront + 60% on arrival)</SelectItem>
                            <SelectItem value="both">Both Options Available</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {formData.paymentOptions && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs text-blue-900">
                              {formData.paymentOptions === 'arrival' && '✓ Guests will pay the full amount in cash when they check in.'}
                              {formData.paymentOptions === 'early' && '✓ Guests will pay 40% online via Stripe to confirm booking, and 60% on arrival.'}
                              {formData.paymentOptions === 'both' && '✓ Guests can choose between paying online (40% upfront) or paying full amount on arrival.'}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Cancellation Policy */}
                      <div>
                        <Label htmlFor="cancellationPolicy" className="text-sm font-medium text-gray-700 block mb-3">
                          Cancellation Policy * <span className="text-red-500">(Required)</span>
                        </Label>
                        <p className="text-xs text-gray-600 mb-3">
                          Choose your cancellation policy for refunds
                        </p>
                        <Select 
                          value={formData.cancellationPolicy} 
                          onValueChange={(value) => setFormData(prev => ({...prev, cancellationPolicy: value}))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select cancellation policy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="flexible">Flexible - Full refund 1 day before check-in</SelectItem>
                            <SelectItem value="moderate">Moderate - Full refund 7 days before check-in</SelectItem>
                            <SelectItem value="strict">Strict - Full refund 14 days before check-in</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {formData.cancellationPolicy && (
                          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-xs text-amber-900 font-medium mb-2">Refund Schedule:</p>
                            <ul className="text-xs text-amber-900 space-y-1">
                              {formData.cancellationPolicy === 'flexible' && (
                                <>
                                  <li>• 1+ days before: 100% refund</li>
                                  <li>• Less than 1 day: 50% refund</li>
                                </>
                              )}
                              {formData.cancellationPolicy === 'moderate' && (
                                <>
                                  <li>• 7+ days before: 100% refund</li>
                                  <li>• 3-6 days before: 50% refund</li>
                                  <li>• Less than 3 days: No refund</li>
                                </>
                              )}
                              {formData.cancellationPolicy === 'strict' && (
                                <>
                                  <li>• 14+ days before: 100% refund</li>
                                  <li>• 7-13 days before: 50% refund</li>
                                  <li>• Less than 7 days: No refund</li>
                                </>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={loading || !formData.paymentOptions || !formData.cancellationPolicy}
                        className={(!formData.paymentOptions || !formData.cancellationPolicy) ? 'opacity-50 cursor-not-allowed' : ''}
                      >
                        {loading ? (
                          <><span className="mr-2">Publishing...</span><Loader2 className="h-4 w-4 animate-spin" /></>
                        ) : (
                          <>Publish Listing <Check size={16} className="ml-2" /></>
                        )}
                      </Button>
                    </div>
                    
                    {(!formData.paymentOptions || !formData.cancellationPolicy) && (
                      <p className="text-sm text-red-600 text-center mt-4">
                        Please configure payment options and cancellation policy to publish your listing.
                      </p>
                    )}
                  </motion.div>
                )}
              </form>
            </div>
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default AddListing;
