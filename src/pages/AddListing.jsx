import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, 
  MapPin, 
  DollarSign, 
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

const propertyTypes = [
  { id: 'apartment', label: 'Apartment' },
  { id: 'house', label: 'House' },
  { id: 'villa', label: 'Villa' },
  { id: 'cabin', label: 'Cabin' },
  { id: 'cottage', label: 'Cottage' },
  { id: 'loft', label: 'Loft' },
];

const amenities = [
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
  
  // Form state
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    propertyType: '',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    price: '',
    selectedAmenities: [],
    minimumStay: '1',
    instantBooking: false,
    availableDates: {
      from: null,
      to: null,
    },
  });
  
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
  
  const handleRadioChange = (value) => {
    setFormData(prev => ({ ...prev, minimumStay: value }));
  };
  
  const toggleInstantBooking = () => {
    setFormData(prev => ({ ...prev, instantBooking: !prev.instantBooking }));
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

  const handleDateSelect = (range) => {
    setFormData(prev => ({
      ...prev,
      availableDates: range,
    }));
  };
  
  const nextStep = () => {
    setActiveStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setActiveStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'availableDates' || key === 'selectedAmenities') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add the first image if exists
      if (images.length > 0) {
        formDataToSend.append('image', images[0].file);
      }
      
      const response = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to create property listing');
      }
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message || "Your property has been listed successfully.",
          variant: "success"
        });
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          propertyType: '',
          bedrooms: 1,
          bathrooms: 1,
          maxGuests: 2,
          price: '',
          selectedAmenities: [],
          minimumStay: '1',
          instantBooking: false,
          availableDates: {
            from: null,
            to: null,
          },
        });
        setImages([]);
        
        // Redirect to dashboard
        window.location.href = '/host/dashboard';
      } else {
        throw new Error(result.message || 'Failed to create property listing');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
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
                Add New Listing
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
                  {[1, 2, 3, 4].map((step) => (
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
                      <div className="text-xs text-gray-600">
                        {step === 1 && "Basic Info"}
                        {step === 2 && "Details & Amenities"}
                        {step === 3 && "Photos"}
                        {step === 4 && "Availability & Price"}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 grid grid-cols-3 gap-1">
                  <div className={`h-1 rounded-l ${activeStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                  <div className={`h-1 ${activeStep >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                  <div className={`h-1 rounded-r ${activeStep >= 4 ? 'bg-primary' : 'bg-gray-200'}`}></div>
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
                          placeholder="e.g. Cozy Beachfront Apartment"
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
                              placeholder="New York"
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
                          <div className="md:col-span-2">
                            <Label htmlFor="country" className="text-xs text-gray-600">
                              Country
                            </Label>
                            <Select
                              value={formData.country}
                              onValueChange={(value) => handleSelectChange('country', value)}
                            >
                              <SelectTrigger className="mt-1 w-full">
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem value="US">United States</SelectItem>
                                <SelectItem value="CA">Canada</SelectItem>
                                <SelectItem value="MX">Mexico</SelectItem>
                                <SelectItem value="UK">United Kingdom</SelectItem>
                                <SelectItem value="FR">France</SelectItem>
                                <SelectItem value="DE">Germany</SelectItem>
                                <SelectItem value="IT">Italy</SelectItem>
                                <SelectItem value="ES">Spain</SelectItem>
                                <SelectItem value="AU">Australia</SelectItem>
                                <SelectItem value="JP">Japan</SelectItem>
                              </SelectContent>
                            </Select>
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
                
                {/* Step 2: Details & Amenities */}
                {activeStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Details & Amenities</h2>
                    
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
                          Available Amenities
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {amenities.map((amenity) => (
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
                {activeStep === 3 && (
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
                
                {/* Step 4: Availability & Price */}
                {activeStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Availability & Pricing</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 block mb-3">
                          Select Availability Dates
                        </Label>
                        <div className="border rounded-lg p-4">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.availableDates.from ? (
                                  formData.availableDates.to ? (
                                    <>
                                      {format(formData.availableDates.from, "LLL dd, y")} -{" "}
                                      {format(formData.availableDates.to, "LLL dd, y")}
                                    </>
                                  ) : (
                                    format(formData.availableDates.from, "LLL dd, y")
                                  )
                                ) : (
                                  <span>Select available dates</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white shadow-lg" align="start">
                              <Calendar
                                initialFocus
                                mode="range"
                                selected={formData.availableDates}
                                onSelect={handleDateSelect}
                                numberOfMonths={2}
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="price" className="text-sm font-medium text-gray-700 block mb-3">
                          Price Per Night/Day
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign size={16} className="text-gray-500" />
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
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-700 block mb-3">
                          Minimum Stay
                        </Label>
                        <RadioGroup 
                          value={formData.minimumStay} 
                          onValueChange={handleRadioChange} 
                          className="grid grid-cols-3 sm:grid-cols-6 gap-2"
                        >
                          {[1, 2, 3, 5, 7, 14].map((days) => (
                            <div key={days}>
                              <RadioGroupItem
                                value={days.toString()}
                                id={`stay-${days}`}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={`stay-${days}`}
                                className="flex flex-col items-center justify-center rounded-md border-2 border-gray-200 bg-white px-3 py-2 hover:bg-gray-50 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                              >
                                <span className="text-sm font-semibold">{days}</span>
                                <span className="text-xs text-gray-500">
                                  {days === 1 ? 'night' : 'nights'}
                                </span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="instant-booking" 
                          checked={formData.instantBooking}
                          onCheckedChange={toggleInstantBooking}
                        />
                        <Label htmlFor="instant-booking" className="text-sm">
                          Enable instant booking
                        </Label>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Back
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <><span className="mr-2">Publishing...</span><Loader2 className="h-4 w-4 animate-spin" /></>
                        ) : (
                          <>Publish Listing <Check size={16} className="ml-2" /></>
                        )}
                      </Button>
                    </div>
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
