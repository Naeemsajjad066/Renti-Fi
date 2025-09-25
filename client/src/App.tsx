
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast"


import Home from "./pages/Home";
import HostDetails from "./pages/HostDetails";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import EmailVerification from "./pages/EmailVerification";
import PropertyDetails from "./pages/PropertyDetails";
import HostDashboard from "./pages/HostDashboard";
import AddListing from "./pages/AddListing";
import Bookings from "./pages/Bookings";
import UserProfile from './pages/UserProfile';
import NotFound from "./pages/NotFound";
import AllProperties from "./pages/AllProperties";
import AdminPanel from "./components/AdminPanel";
import Settings from "./pages/Settings";
import GlobalLoader from "./components/GlobalLoader";


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
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/host/:hostId" element={<HostDetails />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/host/dashboard" element={<HostDashboard />} />
        <Route path="/host/add-listing" element={<AddListing />} />
        <Route path="/host/properties" element={<AllProperties />} />
        <Route path="/host/properties/:id" element={<PropertyDetails />} />
        <Route path="/host/bookings" element={<Bookings />} />
        <Route path="/host/messages" element={<NotFound />} />
        <Route path="/host/support" element={<NotFound />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/properties" element={<AllProperties />} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin" element={<AdminPanel/>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" closeButton theme="light" richColors />
      <BrowserRouter>
        <AnimatedRoutes />
        <GlobalLoader />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
