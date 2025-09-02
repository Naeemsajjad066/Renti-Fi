import { AuthProvider } from './AuthContext';
import { UserProvider } from './UserContext';
import { BookingProvider } from './BookingContext';

// Combined provider that wraps all context providers
export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>
        <BookingProvider>
          {children}
        </BookingProvider>
      </UserProvider>
    </AuthProvider>
  );
};

// Export individual providers and hooks for direct usage
export { AuthProvider, useAuth } from './AuthContext';
export { UserProvider, useUser } from './UserContext';
export { BookingProvider, useBooking } from './BookingContext';