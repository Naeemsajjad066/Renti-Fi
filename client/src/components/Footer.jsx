import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Home,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const SOCIAL_LINKS = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

const LEGAL_LINKS = [
  { label: 'Terms of Service', href: '#' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Cookie Policy', href: '#' },
  { label: 'Dispute Resolution', href: '#' },
];

const Footer = () => {
  const { authUser } = useAuth();
  const currentYear = new Date().getFullYear();

  const quickLinks = authUser
    ? [
        { label: 'Browse Properties', to: '/properties' },
        { label: 'My Bookings', to: '/bookings' },
        { label: 'Host Dashboard', to: '/host/dashboard' },
        { label: 'My Profile', to: '/profile' },
      ]
    : [
        { label: 'Browse Properties', to: '/properties' },
        { label: 'Sign Up', to: '/signup' },
        { label: 'Login', to: '/login' },
        { label: 'Become a Host', to: '/host/dashboard' },
      ];

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={stagger}
      className="bg-cream-beige/40 border-t border-earth-brown/15"
    >
      {/* ── Top band ── */}
      <div className="border-b border-earth-brown/15">
        <div className="page-container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand column */}
            <motion.div variants={fadeUp} className="lg:col-span-1">
              <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
                <div className="w-9 h-9 rounded-xl bg-earth-brown flex items-center justify-center shadow-md">
                  <Home size={18} className="text-white" />
                </div>
                <span className="text-xl font-display font-bold text-gray-900 tracking-tight">
                  Rentifi
                </span>
              </Link>

              <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-xs">
                Pakistan's premier platform for discovering and booking exceptional properties.
                Comfort, trust, and flexibility — all in one place.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-9 h-9 rounded-full bg-earth-brown/10 hover:bg-earth-brown flex items-center justify-center text-earth-brown hover:text-white transition-all duration-200"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Quick links */}
            <motion.div variants={fadeUp}>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-5">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-gray-600 hover:text-earth-brown inline-flex items-center gap-1.5 group transition-colors duration-200"
                    >
                      <ArrowRight
                        size={12}
                        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-earth-brown"
                      />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div variants={fadeUp}>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-5">
                Legal
              </h4>
              <ul className="space-y-3">
                {LEGAL_LINKS.map(({ label, to, href }) => (
                  <li key={label}>
                    {to ? (
                      <Link
                        to={to}
                        className="text-sm text-gray-600 hover:text-earth-brown inline-flex items-center gap-1.5 group transition-colors duration-200"
                      >
                        <ArrowRight
                          size={12}
                          className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-earth-brown"
                        />
                        {label}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        className="text-sm text-gray-600 hover:text-earth-brown inline-flex items-center gap-1.5 group transition-colors duration-200"
                      >
                        <ArrowRight
                          size={12}
                          className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-earth-brown"
                        />
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div variants={fadeUp}>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-5">
                Contact Us
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-earth-brown/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail size={14} className="text-earth-brown" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Email</p>
                    <a
                      href="mailto:rentifi.project@gmail.com"
                      className="text-sm text-gray-700 hover:text-earth-brown transition-colors"
                    >
                      rentifi.project@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-earth-brown/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone size={14} className="text-earth-brown" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                    <a
                      href="tel:+923713324066"
                      className="text-sm text-gray-700 hover:text-earth-brown transition-colors"
                    >
                      0371-3324066
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-earth-brown/15 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={14} className="text-earth-brown" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Based in</p>
                    <p className="text-sm text-gray-700">Pakistan</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <motion.div variants={fadeUp}>
        <div className="page-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {currentYear} <span className="text-gray-700 font-medium">Rentifi</span>. All rights
            reserved.
          </p>
          <p className="text-xs text-gray-400">Made with ♥ in Pakistan</p>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
