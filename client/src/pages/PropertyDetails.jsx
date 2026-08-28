import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import { format, isBefore, startOfDay, isWithinInterval, addDays } from 'date-fns';
import 'react-day-picker/style.css';
import { PropertyContext } from '../contexts/PropertyContext';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { useLoading } from '../contexts/LoadingContext';
import OptimizedImage from '../components/OptimizedImage';
import { useImagePreloader } from '../hooks/useImagePreloader';
import ReviewList from '../components/ReviewList';
import PaymentOptionSelector from '../components/PaymentOptionSelector';
import { useToast } from '../hooks/use-toast';
import toast from 'react-hot-toast';
import {
  MapPin, Wifi, Home, Calendar, ChevronLeft, ChevronRight,
  Star, Users, Tv, Coffee, Wind, Snowflake, Bath, Car,
  Utensils, ShieldCheck, CheckCircle, Flag, X, Share2,
  Heart, BedDouble, Maximize2, Grid3X3,
  ArrowRight, Clock, CalendarDays
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Badge } from '@/components/ui/badge';
import ReportPropertyModal from '@/components/ReportPropertyModal';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Amenity helpers                                                            */
/* ─────────────────────────────────────────────────────────────────────────── */

const amenityIconMap = {
  wifi: Wifi, internet: Wifi,
  tv: Tv, television: Tv,
  kitchen: Utensils, 'coffee maker': Coffee, coffee: Coffee,
  'air conditioning': Wind, ac: Wind,
  heating: Snowflake,
  washer: Bath, 'washing machine': Bath, pool: Bath, gym: Bath,
  parking: Car, 'free parking': Car,
};

const getAmenityIcon = (name) => {
  const low = name.toLowerCase();
  for (const [key, icon] of Object.entries(amenityIconMap)) {
    if (low.includes(key)) return icon;
  }
  return ShieldCheck;
};



/* ─────────────────────────────────────────────────────────────────────────── */
/*  Page skeleton                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */

const PageSkeleton = () => (
  <div className="min-h-screen bg-white dark:bg-gray-900">
    <div className="page-container pt-28 pb-16 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-56 mb-7" />
      <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-xl w-2/3 mb-3" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3 mb-8" />
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[460px] rounded-2xl overflow-hidden mb-10">
        <div className="col-span-2 row-span-2 bg-gray-200 dark:bg-gray-700" />
        {[0,1,2,3].map(i => <div key={i} className="bg-gray-200 dark:bg-gray-700" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-5">
          {[100, 80, 140, 180, 220].map((h, i) => (
            <div key={i} style={{ height: h }} className="bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          ))}
        </div>
        <div className="h-[500px] bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Image Gallery                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */

const ImageGallery = ({ images }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  useImagePreloader(images);

  const openModal  = (i) => { setSelectedIdx(i); setShowModal(true); };
  const closeModal = () => setShowModal(false);
  const next = useCallback(() => setSelectedIdx(p => (p + 1) % images.length), [images.length]);
  const prev = useCallback(() => setSelectedIdx(p => (p - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (!showModal) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handler = (e) => {
      if (e.key === 'Escape')      closeModal();
      if (e.key === 'ArrowRight')  next();
      if (e.key === 'ArrowLeft')   prev();
    };
    document.addEventListener('keydown', handler);
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = orig; };
  }, [showModal, next, prev]);

  if (!images?.length) {
    return (
      <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
        <OptimizedImage src="/placeholder.svg" alt="No image" className="w-full h-full object-cover" />
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg group cursor-pointer" onClick={() => openModal(0)}>
        <OptimizedImage src={images[0]} alt="Property" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" priority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
          <Maximize2 size={11} /> View full screen
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* ── Desktop grid ── */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[480px] rounded-2xl overflow-hidden shadow-md">
        <div className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden" onClick={() => openModal(0)}>
          <OptimizedImage src={images[0]} alt="Main photo" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" priority="high" placeholder="/placeholder.svg" fallback="/placeholder.svg" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/12 transition-colors duration-300" />
        </div>
        {images.slice(1, 5).map((img, i) => (
          <div key={i} className="relative group cursor-pointer overflow-hidden" onClick={() => openModal(i + 1)}>
            <OptimizedImage src={img} alt={`Photo ${i + 2}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" placeholder="/placeholder.svg" fallback="/placeholder.svg" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/12 transition-colors duration-300" />
            {i === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">+{images.length - 5} more</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Mobile single image ── */}
      <div className="md:hidden relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md cursor-pointer" onClick={() => openModal(0)}>
        <OptimizedImage src={images[0]} alt="Main photo" className="w-full h-full object-cover" priority="high" placeholder="/placeholder.svg" fallback="/placeholder.svg" />
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
          1 / {images.length}
        </div>
      </div>

      {/* ── Show all button ── */}
      <button
        onClick={() => openModal(0)}
        className="absolute bottom-4 right-4 hidden md:flex items-center gap-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-xl text-sm font-medium shadow hover:shadow-md transition-all"
      >
        <Grid3X3 size={14} />
        Show all {images.length} photos
      </button>

      {/* ── Fullscreen modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/96 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 shrink-0">
              <span className="text-sm font-medium text-white/60">
                {selectedIdx + 1} <span className="text-white/30">/</span> {images.length}
              </span>
              <button onClick={closeModal} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center px-16 relative overflow-hidden">
              <motion.div
                key={selectedIdx}
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="max-w-5xl w-full"
              >
                <OptimizedImage src={images[selectedIdx]} alt={`Photo ${selectedIdx + 1}`} className="max-h-[72vh] w-full object-contain rounded-xl" />
              </motion.div>
              {images.length > 1 && (
                <>
                  <button onClick={prev} aria-label="Previous" className="absolute left-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
                    <ChevronLeft size={22} />
                  </button>
                  <button onClick={next} aria-label="Next" className="absolute right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            <div className="shrink-0 px-6 pb-5 pt-3 overflow-x-auto">
              <div className="flex gap-2 w-max mx-auto">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedIdx(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 ring-2 transition-all ${i === selectedIdx ? 'ring-white opacity-100' : 'ring-transparent opacity-45 hover:opacity-70'}`}
                  >
                    <OptimizedImage src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Quick-stats row                                                            */
/* ─────────────────────────────────────────────────────────────────────────── */

const QuickStats = ({ property }) => {
  const beds  = property.bedrooms ?? property.beds ?? 1;
  const baths = property.bathrooms ?? property.baths ?? 1;
  const items = [
    { icon: BedDouble, label: `${beds} Bedroom${beds !== 1 ? 's' : ''}` },
    { icon: Bath,      label: `${baths} Bathroom${baths !== 1 ? 's' : ''}` },
    { icon: Users,     label: `Up to ${property.maxGuests || 4} guests` },
    { icon: Maximize2, label: (property.propertyType || 'Property').charAt(0).toUpperCase() + (property.propertyType || 'Property').slice(1) },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-xl px-4 py-3">
          <div className="w-8 h-8 rounded-lg bg-earth-brown/10 dark:bg-earth-brown/20 flex items-center justify-center shrink-0">
            <item.icon size={16} className="text-earth-brown" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-tight">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Booking Card                                                               */
/* ─────────────────────────────────────────────────────────────────────────── */

const BookingCard = ({ property }) => {
  /* date range state — DayPicker uses { from, to } Date objects */
  const [range,         setRange]         = useState({ from: undefined, to: undefined });
  const [guests,        setGuests]        = useState(1);
  const [pricing,       setPricing]       = useState(null);
  const [isAvailable,   setIsAvailable]   = useState(true);
  const [showSuccess,   setShowSuccess]   = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [futureRanges,  setFutureRanges]  = useState([]); // booked periods (future only)
  const [paymentOption, setPaymentOption] = useState('');
  const [submitting,    setSubmitting]    = useState(false);
  const [calOpen,       setCalOpen]       = useState(false);

  const navigate                         = useNavigate();
  const { showLoading, hideLoading }     = useLoading();
  const { loading: bookingLoading, fetchGuestBookings } = useBooking();

  const today = startOfDay(new Date());

  /* ── fetch booked ranges; discard past ones ── */
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!property?._id) return;
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res  = await fetch(`${base}/api/bookings/property/${property._id}/booked`);
        if (!res.ok || !alive) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.ranges)) {
          const parsed = data.ranges
            .map(r => ({ from: startOfDay(new Date(r.from)), to: startOfDay(new Date(r.to)) }))
            .filter(r => r.to >= today);           // ← strip past bookings
          setFutureRanges(parsed);
        }
      } catch { /* silent */ }
    })();
    return () => { alive = false; };
  }, [property?._id]);

  /* ── build DayPicker disabled array ──
       Disabled = past days  +  every day that falls within a booked range */
  const disabledDays = [
    { before: today },                             // all past days
    ...futureRanges.map(r => ({ from: r.from, to: r.to })), // booked ranges
  ];

  /* ── helper: does a day fall in any booked range? ── */
  const isBooked = (day) =>
    futureRanges.some(r =>
      isWithinInterval(startOfDay(day), { start: r.from, end: r.to })
    );

  /* ── handle DayPicker range selection ── */
  const handleRangeSelect = (newRange) => {
    if (!newRange) { setRange({ from: undefined, to: undefined }); return; }

    const { from, to } = newRange;

    // If user picked a start date that is booked, reject it
    if (from && isBooked(from)) {
      toast.error('That date is already booked. Please choose another.');
      return;
    }

    // If the selected range crosses a booked period, trim the end to the day before the booking
    if (from && to) {
      let safeEnd = to;
      for (const br of futureRanges) {
        if (from < br.from && to >= br.from) {
          safeEnd = addDays(br.from, -1);
          break;
        }
      }
      setRange({ from, to: safeEnd });
      if (safeEnd < to) {
        toast('Check-out adjusted — your stay cannot include booked dates.', { icon: 'ℹ️' });
      }
    } else {
      setRange(newRange);
    }
  };

  /* ── recalculate pricing when range changes ── */
  useEffect(() => {
    const { from, to } = range;
    if (from && to && to > from) {
      const nights = Math.ceil((to - from) / 86400000);
      setPricing({ nights, basePrice: property.price * nights, totalPrice: property.price * nights });
      setIsAvailable(true); // local check already handled above
    } else {
      setPricing(null);
      setIsAvailable(true);
    }
  }, [range, property.price]);

  /* ── display strings ── */
  const checkInStr  = range.from ? format(range.from, 'dd MMM yyyy') : 'Add date';
  const checkOutStr = range.to   ? format(range.to,   'dd MMM yyyy') : 'Add date';
  const nightsLabel = pricing ? `${pricing.nights} night${pricing.nights !== 1 ? 's' : ''}` : null;

  /* ── ISO strings for API ── */
  const checkInISO  = range.from ? format(range.from, 'yyyy-MM-dd') : '';
  const checkOutISO = range.to   ? format(range.to,   'yyyy-MM-dd') : '';

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to make a booking.');
      navigate('/login');
      return;
    }
    if (!paymentOption) {
      toast.error('Please choose a payment method.');
      return;
    }
    if (!pricing || !range.from || !range.to) {
      toast.error('Please select check-in and check-out dates.');
      return;
    }

    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const bookingData = {
      propertyId: property._id,
      checkIn:  checkInISO,
      checkOut: checkOutISO,
      guests: { adults: guests, children: 0, infants: 0, pets: 0 },
      nights: pricing.nights,
      basePrice: pricing.basePrice,
      totalPrice: pricing.totalPrice,
      paymentOption,
    };

    setSubmitting(true);
    showLoading(paymentOption === 'early' ? 'Redirecting to checkout…' : 'Creating reservation…');

    try {
      if (paymentOption === 'early') {
        const res  = await fetch(`${base}/api/payments/create-checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ bookingData }),
        });
        const data = await res.json();
        if (data.success && data.url) {
          window.location.href = data.url;
          return; // page is navigating away — no cleanup needed
        }
        throw new Error(data.message || 'Could not create checkout session.');
      }

      // ── Arrival / on-site payment ──
      const res  = await fetch(`${base}/api/payments/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookingData }),
      });
      const data = await res.json();

      if (data.success) {
        // Immediately refresh the booking context so the list pages show the new booking
        fetchGuestBookings();

        setBookingResult(data.booking);
        setShowSuccess(true);
        setRange({ from: undefined, to: undefined });
        setGuests(1);
        setPricing(null);
        setPaymentOption('');
        toast.success('Booking confirmed! Payment due on arrival.');
      } else {
        throw new Error(data.message || 'Reservation failed. Please try again.');
      }
    } catch (err) {
      // Always visible — uses react-hot-toast which IS mounted in App.tsx
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      hideLoading();
      setSubmitting(false);
    }
  };

  /* ── success state ── */
  if (showSuccess && bookingResult) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 text-center">
        <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={26} className="text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Booking Confirmed!</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Your reservation is all set.</p>

        <div className="text-left bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 mb-5 space-y-2.5 text-sm">
          {[
            ['Check-in',  new Date(bookingResult.checkIn).toLocaleDateString('en-PK',  { weekday: 'short', day: 'numeric', month: 'long' })],
            ['Check-out', new Date(bookingResult.checkOut).toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric', month: 'long' })],
            ['Guests',    bookingResult.guests?.adults],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">{k}</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{v}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-2.5 flex justify-between font-bold">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-earth-brown">Rs {bookingResult.totalPrice?.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/bookings')}
          className="w-full py-3 bg-earth-brown hover:bg-earth-brown/90 text-white rounded-xl font-semibold text-sm mb-2 transition-colors"
        >
          View My Bookings
        </button>
        <button onClick={() => setShowSuccess(false)} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          Book another stay
        </button>
      </div>
    );
  }

  const canSubmit = !submitting && !bookingLoading && range.from && range.to && isAvailable && paymentOption && pricing;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">

      {/* ── Price header ── */}
      <div className="px-6 pt-6 pb-5 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Rs {property.price?.toLocaleString()}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">/night</span>
          </div>
          {property.rating > 0 && property.totalReviews > 0 && (
            <div className="flex items-center gap-1.5 text-sm">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">{property.rating.toFixed(1)}</span>
              <span className="text-gray-400 dark:text-gray-500">
                · {property.totalReviews} review{property.totalReviews !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
        {nightsLabel && (
          <p className="mt-2 text-xs font-medium text-earth-brown flex items-center gap-1">
            <Clock size={11} /> {nightsLabel} selected
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-3">

        {/* ── Date trigger block ── */}
        <button
          type="button"
          onClick={() => setCalOpen(p => !p)}
          className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden hover:border-earth-brown/50 focus:border-earth-brown/70 focus:outline-none transition-colors text-left"
        >
          <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-600">
            <div className="px-4 pt-3 pb-2.5">
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Check‑in</p>
              <p className={`text-sm font-semibold ${range.from ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                {checkInStr}
              </p>
            </div>
            <div className="px-4 pt-3 pb-2.5">
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Check‑out</p>
              <p className={`text-sm font-semibold ${range.to ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                {checkOutStr}
              </p>
            </div>
          </div>
        </button>

        {/* ── Calendar panel ── */}
        <AnimatePresence>
          {calOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl overflow-hidden"
            >
              {/* calendar header */}
              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {range.from && range.to
                    ? `${format(range.from, 'dd MMM')} → ${format(range.to, 'dd MMM yyyy')}`
                    : range.from
                    ? 'Select check-out date'
                    : 'Select check-in date'}
                </p>
                <button
                  type="button"
                  onClick={() => { setRange({ from: undefined, to: undefined }); }}
                  className="text-xs text-earth-brown hover:underline"
                >
                  Clear
                </button>
              </div>

              {/* ── legend ── */}
              <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-100 dark:border-gray-700 text-[11px] text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#A0937D] inline-block" /> Selected
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-red-100 border border-red-300 inline-block" /> Booked
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200 inline-block" /> Unavailable
                </span>
              </div>

              {/* DayPicker v9 */}
              <div className="rdp-rentifi px-2 pb-3">
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={handleRangeSelect}
                  disabled={disabledDays}
                  fromDate={today}
                  numberOfMonths={1}
                  showOutsideDays={false}
                  classNames={{
                    root: 'w-full',
                    months: 'w-full',
                    month: 'w-full',
                    month_caption: 'flex justify-center items-center py-2 relative',
                    caption_label: 'text-sm font-semibold text-gray-800 dark:text-gray-200',
                    nav: 'flex items-center gap-1',
                    button_previous: 'absolute left-1 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400',
                    button_next: 'absolute right-1 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400',
                    month_grid: 'w-full border-collapse',
                    weekdays: 'flex',
                    weekday: 'flex-1 text-center text-[11px] font-medium text-gray-400 dark:text-gray-500 py-1',
                    week: 'flex w-full mt-1',
                    day: 'flex-1 flex items-center justify-center',
                    day_button: [
                      'w-8 h-8 rounded-full text-xs font-medium transition-all duration-150',
                      'hover:bg-gray-100 dark:hover:bg-gray-700',
                      'focus:outline-none focus:ring-2 focus:ring-earth-brown/30',
                    ].join(' '),
                    selected: '!bg-[#A0937D] !text-white hover:!bg-[#8a7d6a] rounded-full',
                    range_start: 'rounded-full !bg-[#A0937D] !text-white',
                    range_end: 'rounded-full !bg-[#A0937D] !text-white',
                    range_middle: '!bg-[#A0937D]/15 dark:!bg-[#A0937D]/25 !text-gray-800 dark:!text-gray-200 !rounded-none',
                    today: 'font-bold text-earth-brown underline underline-offset-2',
                    disabled: '!text-gray-300 dark:!text-gray-600 !cursor-not-allowed line-through !bg-red-50 dark:!bg-red-900/10 rounded-full',
                    outside: 'opacity-0 pointer-events-none',
                    hidden: 'invisible',
                  }}
                  components={{
                    Chevron: ({ orientation }) =>
                      orientation === 'left'
                        ? <ChevronLeft size={16} />
                        : <ChevronRight size={16} />,
                  }}
                />
              </div>

              {/* Done button */}
              <div className="px-4 pb-3">
                <button
                  type="button"
                  onClick={() => setCalOpen(false)}
                  className="w-full py-2.5 bg-earth-brown hover:bg-earth-brown/90 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  {range.from && range.to ? 'Confirm Dates' : 'Close'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Guests ── */}
        <div className="border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 pt-3 pb-2.5 hover:border-gray-300 dark:hover:border-gray-500 focus-within:border-earth-brown/70 transition-colors relative">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Guests</p>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full text-sm font-semibold text-gray-900 dark:text-gray-100 bg-transparent border-none outline-none appearance-none cursor-pointer pr-6"
          >
            {[...Array(property.maxGuests || 4)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'Guest' : 'Guests'}</option>
            ))}
          </select>
          <Users size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* ── Payment options ── */}
        {pricing && isAvailable && property.paymentOptions && (
          <PaymentOptionSelector
            selectedOption={paymentOption}
            onOptionChange={setPaymentOption}
            totalPrice={pricing.totalPrice}
            propertyPaymentOptions={property.paymentOptions}
          />
        )}

        {/* ── CTA button ── */}
        <motion.button
          type="submit"
          disabled={!canSubmit}
          whileHover={canSubmit ? { scale: 1.01 } : {}}
          whileTap={canSubmit ? { scale: 0.98 } : {}}
          className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all
            bg-earth-brown hover:bg-earth-brown/90 text-white
            disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {submitting || bookingLoading ? (
            <>
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                className="block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              {submitting ? 'Processing…' : 'Please wait…'}
            </>
          ) : !range.from || !range.to ? (
            <><CalendarDays size={15} /> Select dates to book</>
          ) : !paymentOption ? (
            'Choose a payment method'
          ) : paymentOption === 'early' ? (
            <><Calendar size={15} /> Continue to Payment</>
          ) : (
            <><Calendar size={15} /> Reserve Now</>
          )}
        </motion.button>

        {range.from && range.to && isAvailable && paymentOption && (
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            {paymentOption === 'early'
              ? '40% charged now · remaining due on arrival'
              : "You won't be charged yet"}
          </p>
        )}
      </form>

      {/* ── Price breakdown ── */}
      <AnimatePresence>
        {pricing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 dark:border-gray-700 mx-5 mb-5 pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Rs {property.price?.toLocaleString()} × {pricing.nights} night{pricing.nights !== 1 ? 's' : ''}</span>
                <span>Rs {pricing.basePrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-[15px] text-gray-900 dark:text-white pt-2.5 border-t border-gray-100 dark:border-gray-700">
                <span>Total</span>
                <span>Rs {pricing.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  PropertyDetails page                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */

const PropertyDetails = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { selectedProperty, fetchPropertyById, loading } = useContext(PropertyContext);
  const { authUser }                                     = useAuth();
  const [showReport,      setShowReport]      = useState(false);
  const [isLiked,         setIsLiked]         = useState(false);
  const [showMobileBar,   setShowMobileBar]   = useState(false);
  const bookingRef  = useRef(null);
  const { toast: shadcnToast } = useToast();

  useEffect(() => { if (id) fetchPropertyById(id); }, [id, fetchPropertyById]);

  useEffect(() => {
    const handler = () => setShowMobileBar(window.scrollY > 560);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const property = selectedProperty;

  // Compare logged-in user ID against the property's host ID (handles both populated and unpopulated host)
  const isOwnProperty = authUser && property
    ? (property.host?._id || property.host)?.toString() === authUser._id?.toString()
    : false;

  if (loading) return <><Navbar /><PageSkeleton /></>;

  if (!loading && !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-5">
            <Home size={30} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Property not found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">This listing may have been removed or doesn't exist.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-earth-brown text-white rounded-xl font-medium text-sm hover:bg-earth-brown/90 transition-colors">
            <ChevronLeft size={15} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const title    = property.title || property.name;
  const location = property.city && property.state
    ? `${property.city}, ${property.state}`
    : property.location || property.address;

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <Navbar />

        <main className="flex-grow pt-20 pb-16">
          <div className="page-container py-8">

            {/* ── Breadcrumb + actions ── */}
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-7 flex-wrap gap-3"
            >
              <nav className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500" aria-label="Breadcrumb">
                <Link to="/"           className="hover:text-earth-brown transition-colors">Home</Link>
                <ChevronRight size={12} />
                <Link to="/properties" className="hover:text-earth-brown transition-colors">Properties</Link>
                <ChevronRight size={12} />
                <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[220px]">{title}</span>
              </nav>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => { navigator.clipboard?.writeText(window.location.href); toast({ title: 'Link copied to clipboard' }); }}
                  className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Share2 size={14} /> Share
                </button>
                <button
                  onClick={() => setIsLiked(p => !p)}
                  className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg transition-colors ${isLiked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <Heart size={14} className={isLiked ? 'fill-current' : ''} /> Save
                </button>
                <button
                  onClick={() => setShowReport(true)}
                  className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition-colors"
                >
                  <Flag size={14} /> Report
                </button>
              </div>
            </motion.div>

            {/* ── Title ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
              className="mb-6"
            >
              <div className="flex flex-wrap gap-2 mb-2.5">
                {property.propertyType && (
                  <Badge className="bg-earth-brown/10 text-earth-brown border-earth-brown/20 rounded-full text-xs px-3 py-0.5">
                    {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
                  </Badge>
                )}
                {(property.featured || property.isActive) && (
                  <Badge className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700/40 rounded-full text-xs px-3 py-0.5">
                    Featured
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-[2.4rem] font-display font-bold text-gray-900 dark:text-white leading-tight mb-3">
                {title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <MapPin size={14} className="text-earth-brown" />
                  <span className="font-medium">{location}</span>
                </span>
                {property.rating > 0 && property.totalReviews > 0 && (
                  <span className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{property.rating.toFixed(1)}</span>
                    <span className="text-gray-400 dark:text-gray-500">({property.totalReviews} review{property.totalReviews !== 1 ? 's' : ''})</span>
                  </span>
                )}
              </div>
            </motion.div>

            {/* ── Gallery ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8">
              <ImageGallery images={property.images} />
            </motion.div>

            {/* ── Quick stats ── */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
              <QuickStats property={property} />
            </motion.div>

            {/* ── Content grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">

              {/* ── Left ── */}
              <div className="space-y-6 min-w-0">

                {/* Host summary strip */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                  className="flex items-center gap-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-5 py-4"
                >
                  <Link to={`/host/${property.host?._id || property.host}`} className="shrink-0">
                    <img
                      src={property.host?.profilePic || property.host?.profilePicture || '/placeholder.svg'}
                      alt={property.host?.name || 'Host'}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-cream-beige dark:ring-earth-brown/30"
                      onError={(e) => { if (e.target.src !== '/placeholder.svg') e.target.src = '/placeholder.svg'; }}
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 dark:text-gray-500">Hosted by</p>
                    <Link to={`/host/${property.host?._id || property.host}`} className="font-semibold text-gray-900 dark:text-white text-sm hover:text-earth-brown transition-colors truncate block">
                      {property.host?.name || property.host?.fullName || 'Host'}
                    </Link>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-xs font-medium text-green-700 dark:text-green-400">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <ShieldCheck size={12} className="text-green-600 dark:text-green-400" />
                    </div>
                    Verified
                  </div>
                </motion.div>

                {/* About */}
                <motion.section
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
                  className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6"
                >
                  <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-3">About this place</h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-[1.75] text-[15px]">{property.description}</p>
                </motion.section>

                {/* Amenities */}
                {property.amenities?.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
                    className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6"
                  >
                    <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-4">What this place offers</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {property.amenities.map((amenity, i) => {
                        const Icon = getAmenityIcon(amenity);
                        return (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors group">
                            <div className="w-8 h-8 rounded-lg bg-earth-brown/10 dark:bg-earth-brown/20 flex items-center justify-center shrink-0 group-hover:bg-earth-brown/20 transition-colors">
                              <Icon size={15} className="text-earth-brown" />
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.section>
                )}

                {/* Location */}
                <motion.section
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white">Where you'll be</h2>
                    {property.isLocationVerified && (
                      <Badge className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40 rounded-full text-xs px-3">
                        <CheckCircle size={10} className="mr-1" /> Verified
                      </Badge>
                    )}
                  </div>

                  <div className="relative h-64 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4">
                    <iframe
                      className="w-full h-full"
                      src={
                        property.latitude && property.longitude
                          ? `https://maps.google.com/maps?q=${property.latitude},${property.longitude}&output=embed&z=15`
                          : `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`
                      }
                      allowFullScreen
                      style={{ border: 'none' }}
                      title="Property location"
                    />
                    {property.latitude && property.longitude && (
                      <button
                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`, '_blank')}
                        className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium shadow hover:shadow-md transition-all"
                      >
                        <MapPin size={12} className="text-earth-brown" /> Get Directions
                      </button>
                    )}
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin size={15} className="text-earth-brown mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{location}</p>
                      <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                        {property.isLocationVerified
                          ? <span className="text-green-600 dark:text-green-400 flex items-center gap-1"><CheckCircle size={10} /> Location verified by host{property.locationCapturedAt ? ` · ${new Date(property.locationCapturedAt).toLocaleDateString()}` : ''}</span>
                          : 'Exact location shared after booking confirmation'}
                      </p>
                    </div>
                  </div>
                </motion.section>

                {/* Reviews */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
                  <ReviewList propertyId={property._id} />
                </motion.div>

                {/* Meet host */}
                <motion.section
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
                  className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6"
                >
                  <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-4">Meet your host</h2>
                  <Link to={`/host/${property.host?._id || property.host}`} className="block group">
                    <div className="flex items-start gap-5 p-5 rounded-xl bg-gradient-to-br from-earth-brown/5 to-soft-peach/10 dark:from-earth-brown/10 dark:to-gray-700/40 group-hover:from-earth-brown/10 group-hover:to-soft-peach/20 transition-all duration-300">
                      <div className="relative shrink-0">
                        <img
                          src={property.host?.profilePic || property.host?.profilePicture || '/placeholder.svg'}
                          alt={property.host?.name || 'Host'}
                          className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white dark:ring-gray-700 shadow-md group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { if (e.target.src !== '/placeholder.svg') e.target.src = '/placeholder.svg'; }}
                        />
                        <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                          <ShieldCheck size={11} className="text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-earth-brown transition-colors">
                          {property.host?.name || property.host?.fullName || 'Host'}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                          Host since {property.host?.createdAt ? new Date(property.host.createdAt).getFullYear() : 'recently'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {property.host?.rating > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs bg-white dark:bg-gray-700 px-2.5 py-1 rounded-lg shadow-sm font-medium">
                              <Star size={11} className="fill-amber-400 text-amber-400" />
                              {property.host.rating.toFixed(1)} rating
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-lg font-medium">
                            <ShieldCheck size={11} /> Verified Host
                          </span>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-earth-brown group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                    </div>
                  </Link>
                </motion.section>

              </div>

              {/* ── Right: booking card ── */}
              <div ref={bookingRef} className="lg:sticky lg:top-24">
                <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }}>
                  {isOwnProperty ? (
                    /* ── Own property banner ── */
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
                      {/* header strip */}
                      <div className="bg-gradient-to-r from-earth-brown/10 to-soft-peach/20 dark:from-earth-brown/20 dark:to-gray-700 px-6 pt-6 pb-5 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            Rs {property.price?.toLocaleString()}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">/night</span>
                        </div>
                        {property.rating > 0 && property.totalReviews > 0 && (
                          <div className="flex items-center gap-1.5 text-sm mt-1">
                            <Star size={13} className="fill-amber-400 text-amber-400" />
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{property.rating.toFixed(1)}</span>
                            <span className="text-gray-400 dark:text-gray-500">· {property.totalReviews} review{property.totalReviews !== 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>

                      {/* message */}
                      <div className="p-6 text-center">
                        <div className="w-14 h-14 rounded-full bg-earth-brown/10 dark:bg-earth-brown/20 flex items-center justify-center mx-auto mb-4">
                          <Home size={24} className="text-earth-brown" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1.5">This is your listing</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
                          You can't book your own property. Manage it from your host dashboard.
                        </p>
                        <Link
                          to="/host/dashboard"
                          className="w-full inline-flex items-center justify-center gap-2 py-3 bg-earth-brown hover:bg-earth-brown/90 text-white rounded-xl font-semibold text-sm transition-colors"
                        >
                          <Home size={15} /> Go to Host Dashboard
                        </Link>
                        <Link
                          to={`/host/add-listing/${property._id}`}
                          className="w-full inline-flex items-center justify-center gap-2 py-2.5 mt-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-earth-brown/40 hover:text-earth-brown dark:hover:text-cream-beige rounded-xl text-sm transition-colors"
                        >
                          Edit Listing
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <BookingCard property={property} />
                  )}
                </motion.div>
              </div>

            </div>
          </div>
        </main>

        {/* ── Mobile sticky bar — hidden for own listings ── */}
        <AnimatePresence>
          {showMobileBar && !isOwnProperty && (
            <motion.div
              initial={{ y: 72 }} animate={{ y: 0 }} exit={{ y: 72 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-5 py-3 flex items-center justify-between"
              style={{ boxShadow: '0 -4px 24px rgba(0,0,0,0.10)' }}
            >
              <div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">Rs {property.price?.toLocaleString()}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/night</span>
              </div>
              <button
                onClick={() => bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                className="flex items-center gap-2 px-5 py-2.5 bg-earth-brown hover:bg-earth-brown/90 text-white rounded-xl text-sm font-semibold transition-colors shadow-md"
              >
                <Calendar size={14} /> Book Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />

        <ReportPropertyModal
          property={property}
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          onSuccess={() => toast({ title: 'Report submitted', description: 'Our team will review it shortly.' })}
        />
      </div>
    </PageTransition>
  );
};

export default PropertyDetails;

