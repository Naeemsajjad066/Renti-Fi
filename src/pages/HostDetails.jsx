import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star,
  Users,
  Home,
  MapPin,
  ShieldCheck,
  Calendar,
  ChevronLeft,
  MessageSquare
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

// Updated mock data structure
const mockHosts = {
  'sarah-johnson': {
    id: 1,
    name: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    responseRate: 99,
    joined: 'January 2020',
    about: "I'm a passionate host who loves to provide comfortable and memorable stays for my guests...",
    listings: [
      {
        id: 1,
        name: 'Modern Apartment in Downtown',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        location: 'New York, NY',
        price: 120,
        rating: 4.8,
        beds: 2,
        baths: 1,
        reviews: [
          {
            id: 1,
            guestName: 'Michael Brown',
            guestImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80',
            date: 'March 2023',
            rating: 5,
            comment: 'Sarah was an amazing host! The apartment was spotless and exactly as described. Great location too!',
            propertyId: 1
          },
          {
            id: 2,
            guestName: 'Jessica Wilson',
            guestImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80',
            date: 'February 2023',
            rating: 4,
            comment: 'Great stay overall. The apartment was clean and comfortable. Sarah was responsive to all our questions.',
            propertyId: 1
          }
        ]
      },
      {
        id: 2,
        name: 'Cozy Beachfront Cottage',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        location: 'Malibu, CA',
        price: 250,
        rating: 4.9,
        beds: 3,
        baths: 2,
        reviews: [
          {
            id: 3,
            guestName: 'David Miller',
            guestImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80',
            date: 'January 2023',
            rating: 5,
            comment: 'Absolutely stunning location! Sarah was very helpful with local recommendations. Would definitely stay again!',
            propertyId: 2
          }
        ]
      }
    ]
  }
};

const HostDetail = () => {
  const { hostId } = useParams();
  const [host, setHost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchHost = () => {
      setIsLoading(true);
      setTimeout(() => {
        const foundHost = mockHosts[hostId];
        setHost(foundHost);
        setIsLoading(false);
      }, 800);
    };
    
    fetchHost();
  }, [hostId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse space-y-8 w-full max-w-6xl p-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!host) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Host Not Found</h1>
          <p className="text-gray-600 mb-6">
            The host you're looking for doesn't exist.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors"
          >
            <ChevronLeft size={16} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Calculate average rating from all reviews
  const allReviews = host.listings.flatMap(listing => listing.reviews);
  const averageRating = allReviews.length > 0 
    ? (allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length).toFixed(1)
    : host.rating;

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-20">
          <div className="page-container py-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <Link to="/" className="flex items-center text-gray-600 hover:text-primary transition-colors">
                  <ChevronLeft size={16} className="mr-1" />
                  <span>Back to listings</span>
                </Link>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 mb-12">
                <div className="md:w-1/3 lg:w-1/4">
                  <div className="sticky top-24">
                    <img
                      src={host.image}
                      alt={host.name}
                      className="w-full h-auto rounded-lg mb-4"
                    />
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h1 className="text-2xl font-bold mb-2">{host.name}</h1>
                      
                      <div className="flex items-center mb-4">
                        <Star size={16} className="text-primary mr-1" />
                        <span className="font-medium">{averageRating} Rating</span>
                        <span className="text-gray-500 ml-1">({allReviews.length} reviews)</span>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        <ShieldCheck size={16} className="text-green-600 mr-1" />
                        <span>{host.responseRate}% Response Rate</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-600 mr-1" />
                        <span>Joined {host.joined}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3 lg:w-3/4">
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">About</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {host.about}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-6">
                      {host.name}'s Listings ({host.listings.length})
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {host.listings.map((listing) => (
                        <Link 
                          to={`/property/${listing.id}`} 
                          key={listing.id}
                          className="group"
                        >
                          <div className="overflow-hidden rounded-lg mb-2">
                            <img
                              src={listing.image}
                              alt={listing.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium group-hover:text-primary transition-colors">
                              {listing.name}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <MapPin size={14} className="mr-1" />
                              <span>{listing.location}</span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center">
                                <Star size={14} className="text-primary mr-1" />
                                <span>{listing.rating}</span>
                                <span className="text-gray-500 ml-1">({listing.reviews.length})</span>
                              </div>
                              <div>
                                <span className="font-medium">${listing.price}</span>
                                <span className="text-gray-600">/night</span>
                              </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <Home size={14} className="mr-1" />
                              <span>{listing.beds} beds · {listing.baths} bath</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-6 flex items-center">
                      <MessageSquare className="mr-2" />
                      Guest Reviews ({allReviews.length})
                    </h2>
                    
                    {allReviews.length > 0 ? (
                      <div className="space-y-6">
                        {allReviews.map(review => (
                          <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                <img 
                                  src={review.guestImage} 
                                  alt={review.guestName} 
                                  className="w-10 h-10 rounded-full mr-3 object-cover"
                                />
                                <div>
                                  <h4 className="font-medium">{review.guestName}</h4>
                                  <p className="text-sm text-gray-500">{review.date}</p>
                                </div>
                              </div>
                              <div className="flex items-center bg-primary/10 px-2 py-1 rounded">
                                <Star size={16} className="text-primary mr-1" />
                                <span>{review.rating}</span>
                              </div>
                            </div>
                            
                            <div className="mb-2">
                              <Link 
                                to={`/property/${review.propertyId}`} 
                                className="text-sm text-primary hover:underline inline-flex items-center"
                              >
                                <Home size={14} className="mr-1" />
                                {
                                  host.listings.find(p => p.id === review.propertyId)?.name || 
                                  'Property'
                                }
                              </Link>
                            </div>
                            
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No reviews yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default HostDetail;