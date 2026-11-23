import { Search, Calendar, Home as HomeIcon, Shield, Zap, Users, Award } from 'lucide-react';

export const DESTINATIONS = [
  {
    id: 1,
    name: 'Karachi',
    properties: 243,
    tag: 'City Escapes',
    image:
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Lahore',
    properties: 186,
    tag: 'Cultural Hub',
    image:
      'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Islamabad',
    properties: 312,
    tag: 'Capital Stays',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Murree',
    properties: 167,
    tag: 'Hill Retreats',
    image:
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];

export const PROPERTY_TYPES = [
  'All',
  'Apartment',
  'House',
  'Villa',
  'Cabin',
  'Beachfront',
  'Countryside',
];

export const STATS = [
  { value: '10K+', label: 'Properties Listed' },
  { value: '50K+', label: 'Happy Guests' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '120+', label: 'Cities Covered' },
];

export const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Search,
    title: 'Search Your Destination',
    desc: 'Enter your city and travel dates to browse hundreds of verified properties.',
  },
  {
    step: '02',
    icon: Calendar,
    title: 'Book Instantly',
    desc: 'Choose your perfect stay and confirm in seconds with secure online payment.',
  },
  {
    step: '03',
    icon: HomeIcon,
    title: 'Enjoy Your Stay',
    desc: 'Check in seamlessly and experience the comfort of a home away from home.',
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Ayesha Khan',
    location: 'Lahore',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    text: 'Rentifi made finding a weekend villa in Murree effortless. The property was exactly as described and check-in was a breeze!',
  },
  {
    id: 2,
    name: 'Bilal Ahmed',
    location: 'Karachi',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    text: 'I listed my apartment and had bookings within the first week. The host dashboard is incredibly easy to use.',
  },
  {
    id: 3,
    name: 'Sara Malik',
    location: 'Islamabad',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
    text: 'Best rental platform in Pakistan. Verified listings and responsive support made my whole trip stress-free.',
  },
];

export const FEATURES = [
  {
    icon: Shield,
    title: 'Verified & Trusted',
    desc: 'Every listing is manually reviewed. Our hosts go through identity verification before going live.',
    color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  },
  {
    icon: Zap,
    title: 'Instant Booking',
    desc: 'No waiting for approvals. Confirm your stay in seconds with real-time availability.',
    color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    desc: 'Curated properties that meet strict quality standards — from cozy flats to luxury villas.',
    color: 'bg-earth-brown/10 dark:bg-earth-brown/20 text-earth-brown',
  },
  {
    icon: Users,
    title: 'Local Expertise',
    desc: 'Our hosts are local insiders who provide tips, recommendations, and genuine hospitality.',
    color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  },
];

export const POPULAR_SEARCH_TERMS = ['Karachi', 'Lahore', 'Islamabad', 'Murree'];

export const TRUST_BADGES = [
  'Verified Hosts',
  'Instant Booking',
  'Free Cancellation',
  'Secure Payments',
];

export const HERO_SOCIAL_PROOF_AVATARS = [11, 12, 13, 14];

export const PROPERTY_TYPE_OPTIONS = [
  'All',
  'Apartment',
  'House',
  'Villa',
  'Cabin',
  'Cottage',
  'Loft',
  'Condo',
  'Townhouse',
];

export const SORT_OPTIONS = [
  'Price: Low to High',
  'Price: High to Low',
  'Rating: High to Low',
  'Latest',
];

export const PRICE_RANGE_DEFAULT = [0, 100000];
export const PRICE_RANGE_MIN = 0;
export const PRICE_RANGE_MAX = 100000;
export const PRICE_RANGE_STEP = 1000;
