import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense, useMemo } from 'react';
import { StripeProvider } from './contexts/StripeContext';

const Home = lazy(() => import('./pages/Home'));
const HostDetails = lazy(() => import('./pages/HostDetails'));
const HostProfile = lazy(() => import('./pages/HostProfile'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const EmailVerification = lazy(() => import('./pages/EmailVerification'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const HostDashboard = lazy(() => import('./pages/HostDashboard'));
const AddListing = lazy(() => import('./pages/AddListing'));
const Bookings = lazy(() => import('./pages/Bookings'));
const HostBookings = lazy(() => import('./pages/HostBookings'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const AllProperties = lazy(() => import('./pages/AllProperties'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const Settings = lazy(() => import('./pages/Settings'));
import GlobalLoader from './components/GlobalLoader';
import ProtectedRoute from './components/ProtectedRoute';
const StripeReturn = lazy(() => import('./pages/StripeReturn'));
const StripeRefresh = lazy(() => import('./pages/StripeRefresh'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const BookingDetails = lazy(() => import('./pages/BookingDetails'));
const HostBookingDetails = lazy(() => import('./pages/HostBookingDetails'));
const AdminComplaints = lazy(() => import('./pages/AdminComplaints'));
const ComplaintDetails = lazy(() => import('./pages/ComplaintDetails'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// AnimatePresence wrapper component
const AnimatedRoutes = () => {
  const location = useLocation();
  const routes = useMemo(
    () => (
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/host/:hostId" element={<HostProfile />} />
        <Route path="/host-details/:hostId" element={<HostDetails />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/host/dashboard" element={<HostDashboard />} />
        <Route path="/host/add-listing" element={<AddListing />} />
        <Route path="/host/add-listing/:id" element={<AddListing />} />
        <Route path="/host/properties" element={<AllProperties />} />
        <Route path="/host/properties/:id" element={<PropertyDetails />} />
        <Route path="/host/bookings" element={<HostBookings />} />
        <Route path="/host/bookings/:id" element={<HostBookingDetails />} />
        <Route path="/host/messages" element={<NotFound />} />
        <Route path="/host/support" element={<NotFound />} />
        <Route path="/host/stripe/return" element={<StripeReturn />} />
        <Route path="/host/stripe/refresh" element={<StripeRefresh />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/bookings/:id" element={<BookingDetails />} />
        <Route path="/properties" element={<AllProperties />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute requireAdmin>
              <AdminComplaints />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/complaints/:id"
          element={
            <ProtectedRoute requireAdmin>
              <ComplaintDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    ),
    [location]
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense fallback={<div className="min-h-screen" aria-label="Loading" />}>{routes}</Suspense>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StripeProvider>
        <Toaster />
        <Sonner position="top-right" closeButton theme="light" richColors />
        <BrowserRouter>
          <AnimatedRoutes />
          <GlobalLoader />
        </BrowserRouter>
      </StripeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
