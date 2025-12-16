
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  PlusCircle, 
  LogOut,
  User,
  Menu,
  X,
  Calendar,
  BarChart2,
  HelpCircle,
} from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const HostSidebar = ({ isMobile, isOpen, onToggle }) => {
  const location = useLocation();
  const { toggleTheme } = useTheme();
  
  const menuItems = [
    {
      title: 'Dashboard',
      icon: BarChart2,
      path: '/host/dashboard',
    },
    {
      title: 'Add Property',
      icon: PlusCircle,
      path: '/host/add-listing',
    },
    {
      title: 'Bookings',
      icon: Calendar,
      path: '/host/bookings',
    },
    {
      title: 'Help & Support',
      icon: HelpCircle,
      path: '/host/support',
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-background shadow-md"
        >
          {isOpen ? <X size={24} className="text-gray-800" /> : <Menu size={24} className="text-gray-800" />}
        </button>
      )}
      
      {/* Sidebar */}
      <div
        className={`${
          isMobile
            ? `fixed inset-y-0 left-0 z-40 w-64 transform ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
              } transition-transform duration-300 ease-in-out`
            : 'sticky top-0 h-screen w-64 flex-shrink-0'
        } bg-cream-beige border-r border-light-beige shadow-sm`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="p-6 border-b border-light-beige">
            <Link to="/" className="flex items-center">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-earth-brown to-soft-peach rounded-lg flex items-center justify-center shadow-md">
                  <Home size={20} className="text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-soft-peach"></div>
              </div>
              <span className="ml-2 text-xl font-display font-bold">
                <span className="text-earth-brown">Rent</span>
                <span className="text-soft-peach">ifi</span>
              </span>
            </Link>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      isActive(item.path)
                        ? 'bg-earth-brown/10 text-earth-brown font-semibold'
                        : 'text-gray-700 hover:bg-earth-brown/10 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 mt-auto border-t border-light-beige">
            <Link to="/" className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-earth-brown/10 hover:text-gray-900 rounded-md transition-colors">
              <User className="mr-3 h-5 w-5" />
              <span>Switch to Guest</span>
            </Link>
            <button className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors mt-1">
              <LogOut className="mr-3 h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={onToggle}
        ></div>
      )}
    </>
  );
};

export default HostSidebar;
