import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/PageTransition';
import HostSidebar from '@/components/HostSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import useHostBookingDetails from '@/hooks/useHostBookingDetails';
import {
  PropertyInfoCard,
  StayDetailsCard,
  PaymentSummaryCard,
  ContactCard,
  BookingDetailHeader,
  BookingMapCard,
} from '@/components/booking';

const HostBookingDetails = () => {
  const { booking, loading, navigate } = useHostBookingDetails();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex bg-gray-50">
          <HostSidebar isMobile={isMobile} isOpen={sidebarOpen} onToggle={toggleSidebar} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-gray-600">Loading booking details...</p>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!booking) {
    return (
      <PageTransition>
        <div className="min-h-screen flex bg-gray-50">
          <HostSidebar isMobile={isMobile} isOpen={sidebarOpen} onToggle={toggleSidebar} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Booking not found</p>
              <Button onClick={() => navigate('/host/bookings')}>Back to Bookings</Button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-gray-50">
        <HostSidebar isMobile={isMobile} isOpen={sidebarOpen} onToggle={toggleSidebar} />

        <div className="flex-1 overflow-auto">
          <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
            <BookingDetailHeader booking={booking} variant="host" dark={false} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-6">
                <PropertyInfoCard booking={booking} dark={false} />
                <BookingMapCard property={booking.property} dark={false} />
                <StayDetailsCard booking={booking} dark={false} />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-6">
                  <ContactCard booking={booking} variant="guest" dark={false} />
                  <PaymentSummaryCard booking={booking} showHostPayout dark={false} />
                </div>
              </div>
            </div>

            {/* Back to bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 text-center"
            >
              <Button variant="outline" onClick={() => navigate('/host/bookings')}>
                Back to All Bookings
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HostBookingDetails;
