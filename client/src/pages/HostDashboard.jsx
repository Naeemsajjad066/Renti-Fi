import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Home, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/PageTransition';
import HostSidebar from '@/components/HostSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import useHostDashboard from '@/hooks/useHostDashboard';
import { PROPERTIES_PREVIEW_LIMIT } from '@/constants/dashboard';
import {
  DashboardStatCard,
  DashboardPropertyCard,
  DashboardPropertySkeleton,
  DashboardRecentBookingRow,
  DashboardPendingPanel,
} from '@/components/dashboard';

/* ─── Empty state ─────────────────────────────────────────────────────────── */
const PropertiesEmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
    <div className="w-14 h-14 rounded-2xl bg-earth-brown/10 flex items-center justify-center mb-4">
      <Home size={24} className="text-earth-brown" />
    </div>
    <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">No properties yet</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
      Add your first listing to start earning.
    </p>
    <Link to="/host/add-listing">
      <Button
        size="sm"
        className="bg-earth-brown hover:bg-earth-brown/90 text-white rounded-xl gap-1.5"
      >
        <Plus size={14} />
        Add Property
      </Button>
    </Link>
  </div>
);

const BookingsEmptyState = () => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3">
      <Calendar size={20} className="text-blue-500 dark:text-blue-400" />
    </div>
    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">No bookings yet</p>
    <p className="text-xs text-gray-400 dark:text-gray-500">
      Bookings will appear here once guests reserve your properties.
    </p>
  </div>
);

/* ─── Section header ──────────────────────────────────────────────────────── */
const SectionHeader = ({ title, subtitle, linkTo, linkLabel, linkIcon: LinkIcon }) => (
  <div className="flex items-center justify-between mb-5">
    <div>
      <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
    </div>
    {linkTo && (
      <Link to={linkTo}>
        <Button
          variant="ghost"
          size="sm"
          className="text-earth-brown hover:bg-earth-brown/5 dark:hover:bg-earth-brown/10 rounded-xl text-sm gap-1"
        >
          {linkLabel}
          {LinkIcon && <LinkIcon size={13} />}
        </Button>
      </Link>
    )}
  </div>
);

/* ─── Page ────────────────────────────────────────────────────────────────── */
const HostDashboard = () => {
  const isMobile = useIsMobile();
  const {
    sidebarOpen,
    toggleSidebar,
    authUser,
    userProperties,
    propertiesLoading,
    handleDeleteProperty,
    recentBookings,
    statCards,
    stats,
    formatDate,
    formatCurrency,
  } = useHostDashboard();

  const firstName = authUser?.fullName?.split(' ')[0] ?? 'Host';

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
        <HostSidebar isMobile={isMobile} isOpen={sidebarOpen} onToggle={toggleSidebar} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-earth-brown mb-1">Host Dashboard</p>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
                    Welcome back, {firstName}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Manage your properties and track your bookings.
                  </p>
                </div>
                <Link to="/host/add-listing" className="shrink-0">
                  <Button className="bg-earth-brown hover:bg-earth-brown/90 text-white rounded-xl gap-2 shadow-sm">
                    <Plus size={16} />
                    Add Property
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((card) => (
                <DashboardStatCard key={card.label} {...card} />
              ))}
            </div>

            {/* Properties + Recent Bookings */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Properties — 2 cols */}
              <div className="xl:col-span-2">
                <SectionHeader
                  title="Your Properties"
                  subtitle={`${userProperties.length} listing${userProperties.length !== 1 ? 's' : ''}`}
                  linkTo="/host/properties"
                  linkLabel="View all"
                  linkIcon={TrendingUp}
                />

                {propertiesLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <DashboardPropertySkeleton />
                    <DashboardPropertySkeleton />
                  </div>
                ) : userProperties.length === 0 ? (
                  <PropertiesEmptyState />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {userProperties.slice(0, PROPERTIES_PREVIEW_LIMIT).map((property) => (
                      <DashboardPropertyCard
                        key={property._id}
                        property={property}
                        onDelete={handleDeleteProperty}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Bookings — 1 col */}
              <div>
                <SectionHeader
                  title="Recent Bookings"
                  subtitle="Latest activity"
                  linkTo="/host/bookings"
                  linkLabel="View all"
                />

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                  {recentBookings.length === 0 ? (
                    <BookingsEmptyState />
                  ) : (
                    recentBookings.map((booking) => (
                      <DashboardRecentBookingRow
                        key={booking._id}
                        booking={booking}
                        formatDate={formatDate}
                        formatCurrency={formatCurrency}
                      />
                    ))
                  )}
                </div>

                <DashboardPendingPanel count={stats.pending} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HostDashboard;
