import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, Calendar, ChevronDown, Home, Menu, X, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { logout, authUser } = useAuth();
  const isLoggedIn = !!authUser;

  // Mock authentication state
  // const [isLoggedIn, setIsLoggedIn] = useState(true); // Changed to true to show settings link
  const [userType, setUserType] = useState('guest'); // 'guest' or 'host'

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navVariants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: -10,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -5,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 20,
      },
    },
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm dark:shadow-gray-800/30'
          : 'bg-transparent'
      )}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <motion.div variants={itemVariants} className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-earth-brown to-soft-peach rounded-lg flex items-center justify-center shadow-md">
                    <Home size={20} className="text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-soft-peach"></div>
                </div>
                <span className="ml-2 text-xl sm:text-2xl font-display font-bold">
                  <span className="text-earth-brown">Rent</span>
                  <span className="text-soft-peach">ifi</span>
                </span>
              </div>
            </Link>
          </motion.div>

          <motion.nav variants={itemVariants} className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={cn(
                'nav-item dark:text-gray-300 dark:hover:text-white',
                location.pathname === '/' && 'active'
              )}
            >
              Home
            </Link>
            <Link
              to="/properties"
              className={cn(
                'nav-item dark:text-gray-300 dark:hover:text-white',
                location.pathname === '/properties' && 'active'
              )}
            >
              Properties
            </Link>
            <Link
              to="/bookings"
              className={cn(
                'nav-item dark:text-gray-300 dark:hover:text-white',
                location.pathname === '/bookings' && 'active'
              )}
            >
              Bookings
            </Link>
          </motion.nav>

          <motion.div variants={itemVariants} className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="hidden md:flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-gray-600" />
              )}
            </button>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <User size={18} className="text-primary" />
                  </div>
                  <ChevronDown
                    size={16}
                    className={cn(
                      'text-gray-600 dark:text-gray-300 transition-transform',
                      isDropdownOpen && 'rotate-180'
                    )}
                  />
                </button>

                {isDropdownOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={dropdownVariants}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                  >
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={closeDropdown}
                      >
                        <User size={16} className="mr-3" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/bookings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={closeDropdown}
                      >
                        <Calendar size={16} className="mr-3" />
                        <span>My Bookings</span>
                      </Link>

                      {userType === 'guest' ? (
                        <Link
                          to="/host/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={closeDropdown}
                        >
                          <Home size={16} className="mr-3" />
                          <span>Switch to Host</span>
                        </Link>
                      ) : (
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => {
                            setUserType('guest');
                            closeDropdown();
                          }}
                        >
                          <User size={16} className="mr-3" />
                          <span>Switch to Guest</span>
                        </button>
                      )}
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          logout(); // clear token, user, etc.
                          closeDropdown();
                          navigate('/login');
                        }}
                      >
                        <LogOut size={16} className="mr-3" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden px-4 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
        >
          <nav className="flex flex-col space-y-4">
            <Link
              to="/"
              className="px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-300"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/bookings"
              className="px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-300"
              onClick={closeMobileMenu}
            >
              Bookings
            </Link>

            <button
              onClick={toggleTheme}
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-300"
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={18} className="text-yellow-400 mr-2" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={18} className="text-gray-600 mr-2" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            {isLoggedIn ? (
              <>
                <div className="h-px my-2 bg-gray-200 dark:bg-gray-700"></div>
                <Link
                  to="/profile"
                  className="px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-300"
                  onClick={closeMobileMenu}
                >
                  My Profile
                </Link>

                {userType === 'guest' ? (
                  <Link
                    to="/host/dashboard"
                    className="px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-300"
                    onClick={closeMobileMenu}
                  >
                    Switch to Host
                  </Link>
                ) : (
                  <button
                    className="px-3 py-2 rounded-md text-base font-medium text-left text-gray-900 dark:text-gray-300"
                    onClick={() => {
                      setUserType('guest');
                      closeMobileMenu();
                    }}
                  >
                    Switch to Guest
                  </button>
                )}
                <button
                  className="px-3 py-2 rounded-md text-base font-medium text-left text-red-600 dark:text-red-400"
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                    navigate('/login');
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="h-px my-2 bg-gray-200 dark:bg-gray-700"></div>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-300"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 rounded-md text-base font-medium text-primary dark:text-primary-400"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;
