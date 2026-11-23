import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Star, Trash2, Edit3, Eye, CheckCircle2, Clock, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import { PropertyContext } from '../contexts/PropertyContext';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/PageTransition';
import HostSidebar from '@/components/HostSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cardFadeUp } from '@/constants/animations';

/* ─── Property card (same as DashboardPropertyCard but standalone) ─────────── */
const HostPropertyCard = ({ property, onDelete }) => {
  const image = property.images?.[0] || property.image || '/placeholder.svg';
  const bookings = property.bookings ?? property.bookingsCount ?? 0;
  const income = property.monthlyIncome ?? property.income ?? 0;
  const isApproved = property.isVerified === true || property.verificationStatus === 'approved';

  return (
    <motion.div
      variants={cardFadeUp}
      initial="hidden"
      animate="visible"
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute top-3 left-3">
          {isApproved ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-500/90 text-white backdrop-blur-sm px-2.5 py-1 rounded-full">
              <CheckCircle2 size={11} /> Live
            </span>
          ) : property.verificationStatus === 'rejected' ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-red-500/90 text-white backdrop-blur-sm px-2.5 py-1 rounded-full">
              <Clock size={11} /> Rejected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-500/90 text-white backdrop-blur-sm px-2.5 py-1 rounded-full">
              <Clock size={11} /> Pending
            </span>
          )}
        </div>

        {property.rating && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-2.5 py-1 rounded-full shadow-sm">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              {property.rating}
            </span>
          </div>
        )}

        <div className="absolute bottom-3 left-3 text-white">
          <span className="text-lg font-bold drop-shadow">
            Rs {(property.price ?? 0).toLocaleString()}
          </span>
          <span className="text-xs text-white/75 ml-1">/night</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
          {property.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-4">
          <MapPin size={13} className="text-earth-brown shrink-0" />
          {property.city || property.location || '—'}
          {property.state ? `, ${property.state}` : ''}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Bookings</p>
            <p className="font-bold text-gray-900 dark:text-white text-base">{bookings}</p>
          </div>
          <div className="bg-earth-brown/5 dark:bg-earth-brown/10 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Revenue</p>
            <p className="font-bold text-earth-brown text-base">
              Rs {Number(income).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/host/add-listing/${property._id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-earth-brown/40 hover:text-earth-brown dark:hover:text-cream-beige rounded-xl text-xs gap-1.5"
            >
              <Edit3 size={13} /> Edit
            </Button>
          </Link>
          <Link to={`/properties/${property._id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-earth-brown/40 hover:text-earth-brown dark:hover:text-cream-beige rounded-xl text-xs gap-1.5"
            >
              <Eye size={13} /> View
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl px-2.5"
            onClick={() => onDelete(property)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Skeleton ────────────────────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>
  </div>
);

/* ─── Page ────────────────────────────────────────────────────────────────── */
const HostProperties = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { authUser } = useContext(AuthContext);
  const { userProperties, fetchUserProperties, deleteProperty, loading } =
    useContext(PropertyContext);

  useEffect(() => {
    if (authUser?._id) fetchUserProperties(authUser._id);
  }, [authUser, fetchUserProperties]);

  const handleDelete = async (property) => {
    if (!window.confirm(`Delete "${property.title}"? This cannot be undone.`)) return;
    const result = await deleteProperty(property._id);
    if (result?.success) fetchUserProperties(authUser._id);
  };

  const visible = userProperties.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q)
    );
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
        <HostSidebar
          isMobile={isMobile}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((p) => !p)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 md:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                  Your Properties
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {userProperties.length} listing{userProperties.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Link to="/host/add-listing">
                <Button className="bg-earth-brown hover:bg-earth-brown/90 text-white rounded-xl gap-2 shadow-sm">
                  <Plus size={16} />
                  Add Property
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            {/* Search */}
            <div className="relative max-w-sm mb-6">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search your listings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-earth-brown/50 focus:ring-2 focus:ring-earth-brown/10 transition"
              />
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} />
                ))}
              </div>
            ) : visible.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <div className="w-14 h-14 rounded-2xl bg-earth-brown/10 flex items-center justify-center mb-4">
                  <Plus size={24} className="text-earth-brown" />
                </div>
                <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {search ? 'No listings match your search' : 'No properties yet'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                  {search
                    ? 'Try a different search term.'
                    : 'Add your first listing to start earning.'}
                </p>
                {!search && (
                  <Link to="/host/add-listing">
                    <Button
                      size="sm"
                      className="bg-earth-brown hover:bg-earth-brown/90 text-white rounded-xl gap-1.5"
                    >
                      <Plus size={14} /> Add Property
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {visible.map((property) => (
                  <HostPropertyCard
                    key={property._id}
                    property={property}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HostProperties;
