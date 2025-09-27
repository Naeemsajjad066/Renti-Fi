import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };
  return <motion.footer initial="hidden" whileInView="visible" viewport={{
    once: true
  }} variants={footerVariants} className="bg-gray-50 pt-16 pb-8 border-t">
      <div className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4">Rentifi</h3>
            <p className="text-gray-600 text-sm mb-6">
              Your premium platform for renting and booking properties worldwide. Experience comfort and luxury on your terms.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors duration-300">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors duration-300">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors duration-300">
                <Instagram size={16} />
              </a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/host/dashboard" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Become a Host
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Dispute Resolution
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail size={18} className="mr-3 text-gray-500 mt-0.5" />
                <span className="text-sm text-gray-600">Rentifi.project@gmail.com</span>
              </li>
              <li className="flex items-start">
                <Phone size={18} className="mr-3 text-gray-500 mt-0.5" />
                <span className="text-sm text-gray-600">+92 3059924066</span>
              </li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div variants={itemVariants} className="pt-8 mt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            © {currentYear} Rentifi. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>;
};
export default Footer;