import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, Settings, Calendar, ChevronDown, Home, Menu, X, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from'react-router-dom';  
import { useContext } from 'react';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { logout,authUser } = useContext(AuthContext);
  const isLoggedIn=!!authUser

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
      y: -20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: -10
    },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -5,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    }
  };

  return (
    <motion.header 
      initial="hidden" 
      animate="visible" 
      variants={navVariants} 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300", 
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent",
        theme === 'dark' && isScrolled ? "bg-gray-900/80" : ""
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
                "nav-item", 
                location.pathname === "/" && "active",
                theme === 'dark' && "text-gray-300 hover:text-white"
              )}
            >
              Home
            </Link>
            <Link 
              to="/properties" 
              className={cn(
                "nav-item", 
                location.pathname === "/properties" && "active",
                theme === 'dark' && "text-gray-300 hover:text-white"
              )}
            >
              Properties
            </Link>
            <Link 
              to="/bookings" 
              className={cn(
                "nav-item", 
                location.pathname === "/bookings" && "active",
                theme === 'dark' && "text-gray-300 hover:text-white"
              )}
            >
              Bookings
            </Link>
 
          </motion.nav>

          <motion.div variants={itemVariants} className="md:hidden">
            <button 
              onClick={toggleMobileMenu} 
              className={cn(
                "p-2 rounded-md hover:text-primary focus:outline-none",
                theme === 'dark' ? "text-gray-300 hover:text-white" : "text-gray-600"
              )}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="hidden md:flex items-center space-x-3">
            <button 
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-full hover:bg-gray-100 transition-colors",
                theme === 'dark' && "hover:bg-gray-700"
              )}
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
                  className={cn(
                    "flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors",
                    theme === 'dark' && "hover:bg-gray-700"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    theme === 'dark' ? "bg-primary/20" : "bg-primary/10"
                  )}>
                    <User size={18} className="text-primary" />
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={cn(
                      "transition-transform", 
                      isDropdownOpen && "rotate-180",
                      theme === 'dark' ? "text-gray-300" : "text-gray-600"
                    )} 
                  />
                </button>

                {isDropdownOpen && (
                  <motion.div 
                    initial="hidden" 
                    animate="visible" 
                    variants={dropdownVariants} 
                    className={cn(
                      "absolute right-0 mt-2 w-48 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50",
                      theme === 'dark' ? "bg-gray-800" : "bg-white"
                    )}
                  >
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link 
                        to="/profile" 
                        className={cn(
                          "flex items-center px-4 py-2 text-sm hover:bg-gray-100",
                          theme === 'dark' ? "text-gray-300 hover:bg-gray-700" : "text-gray-700"
                        )}
                        onClick={closeDropdown}
                      >
                        <User size={16} className="mr-3" />
                        <span>My Profile</span>
                      </Link>


                      <Link 
                        to="/bookings" 
                        className={cn(
                          "flex items-center px-4 py-2 text-sm hover:bg-gray-100",
                          theme === 'dark' ? "text-gray-300 hover:bg-gray-700" : "text-gray-700"
                        )}
                        onClick={closeDropdown}
                      >
                        <Calendar size={16} className="mr-3" />
                        <span>My Bookings</span>
                      </Link>
                      
                      {userType === 'guest' ? (
                        <Link 
                          to="/host/dashboard" 
                          className={cn(
                            "flex items-center px-4 py-2 text-sm hover:bg-gray-100",
                            theme === 'dark' ? "text-gray-300 hover:bg-gray-700" : "text-gray-700"
                          )}
                          onClick={closeDropdown}
                        >
                          <Home size={16} className="mr-3" />
                          <span>Switch to Host</span>
                        </Link>
                      ) : (
                        <button 
                          className={cn(
                            "flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100",
                            theme === 'dark' ? "text-gray-300 hover:bg-gray-700" : "text-gray-700"
                          )}
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
                        className={cn(
                          "flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 text-red-600",
                          theme === 'dark' && "hover:bg-gray-700"
                        )}
                        onClick={() => {
                          logout();         // clear token, user, etc.
                          closeDropdown();  
                          navigate("/login");
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
                  className={cn(
                    "text-sm font-medium hover:text-primary transition-colors",
                    theme === 'dark' ? "text-gray-300 hover:text-white" : "text-gray-700"
                  )}
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
          className={cn(
            "md:hidden px-4 py-4 border-t",
            theme === 'dark' ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
          )}
        >
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className={cn(
                "px-3 py-2 rounded-md text-base font-medium",
                theme === 'dark' ? "text-gray-300" : "text-gray-900"
              )}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link 
              to="/bookings" 
              className={cn(
                "px-3 py-2 rounded-md text-base font-medium",
                theme === 'dark' ? "text-gray-300" : "text-gray-900"
              )}
              onClick={closeMobileMenu}
            >
              Bookings
            </Link>

            
            <button 
              onClick={toggleTheme} 
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-base font-medium",
                theme === 'dark' ? "text-gray-300" : "text-gray-900"
              )}
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
                <div className={cn(
                  "h-px my-2",
                  theme === 'dark' ? "bg-gray-700" : "bg-gray-200"
                )}></div>
                <Link 
                  to="/profile" 
                  className={cn(
                    "px-3 py-2 rounded-md text-base font-medium",
                    theme === 'dark' ? "text-gray-300" : "text-gray-900"
                  )}
                  onClick={closeMobileMenu}
                >
                  My Profile
                </Link>
                

                
                {userType === 'guest' ? (
                  <Link 
                    to="/host/dashboard" 
                    className={cn(
                      "px-3 py-2 rounded-md text-base font-medium",
                      theme === 'dark' ? "text-gray-300" : "text-gray-900"
                    )}
                    onClick={closeMobileMenu}
                  >
                    Switch to Host
                  </Link>
                ) : (
                  <button 
                    className={cn(
                      "px-3 py-2 rounded-md text-base font-medium text-left",
                      theme === 'dark' ? "text-gray-300" : "text-gray-900"
                    )}
                    onClick={() => {
                      setUserType('guest');
                      closeMobileMenu();
                    }}
                  >
                    Switch to Guest
                  </button>
                )}
                <button 
                  className={cn(
                    "px-3 py-2 rounded-md text-base font-medium text-left text-red-600",
                    theme === 'dark' && "text-red-400"
                  )}
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className={cn(
                  "h-px my-2",
                  theme === 'dark' ? "bg-gray-700" : "bg-gray-200"
                )}></div>
                <Link 
                  to="/login" 
                  className={cn(
                    "px-3 py-2 rounded-md text-base font-medium",
                    theme === 'dark' ? "text-gray-300" : "text-gray-900"
                  )}
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className={cn(
                    "px-3 py-2 rounded-md text-base font-medium text-primary",
                    theme === 'dark' && "text-primary-400"
                  )}
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