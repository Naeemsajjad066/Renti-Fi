import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Mail,
  Eye,
  CreditCard,
  Share2,
  Lock,
  UserCheck,
  RefreshCw,
  ChevronRight,
  ArrowUp,
} from 'lucide-react';

const sections = [
  { id: 'information-we-collect', title: 'Information We Collect', icon: Eye, number: '01' },
  { id: 'how-we-use', title: 'How We Use Your Information', icon: UserCheck, number: '02' },
  { id: 'verification', title: 'Verification Process', icon: Shield, number: '03' },
  { id: 'sharing', title: 'Sharing of Information', icon: Share2, number: '04' },
  { id: 'data-security', title: 'Data Security', icon: Lock, number: '05' },
  { id: 'user-responsibilities', title: 'User Responsibilities', icon: UserCheck, number: '06' },
  { id: 'changes', title: 'Changes to this Policy', icon: RefreshCw, number: '07' },
  { id: 'contact', title: 'Contact Us', icon: Mail, number: '08' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, type: 'spring', stiffness: 260, damping: 28 },
  }),
};

const InfoBadge = ({ color, children }) => {
  const styles = {
    teal: 'bg-[#e6f4f4] border-earth-brown text-[#005f5f] dark:bg-earth-brown/10 dark:border-earth-brown/60 dark:text-cream-beige',
    orange:
      'bg-orange-50 border-soft-peach text-orange-800 dark:bg-soft-peach/10 dark:border-soft-peach/60 dark:text-orange-200',
    blue: 'bg-blue-50 border-blue-400 text-blue-800 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-200',
  };
  return (
    <div className={`border-l-4 rounded-r-lg p-4 mt-5 ${styles[color]}`}>
      <p className="text-sm font-medium leading-relaxed">{children}</p>
    </div>
  );
};

const SectionCard = ({ id, icon: Icon, number, title, children }) => (
  <motion.section
    id={id}
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-60px' }}
    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
  >
    {/* Card header */}
    <div className="flex items-center gap-4 px-7 py-5 border-b border-gray-100 dark:border-gray-700 bg-[#f7fdfd] dark:bg-gray-800/60">
      <span className="text-xs font-bold text-earth-brown/50 dark:text-earth-brown/40 tracking-widest font-mono">
        {number}
      </span>
      <div className="w-9 h-9 rounded-xl bg-earth-brown/10 dark:bg-earth-brown/20 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-earth-brown" />
      </div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h2>
    </div>

    {/* Card body */}
    <div className="px-7 py-6 text-gray-600 dark:text-gray-300 text-sm leading-7 space-y-4">
      {children}
    </div>
  </motion.section>
);

const BulletList = ({ items }) => (
  <ul className="space-y-2">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2.5">
        <ChevronRight size={15} className="text-earth-brown shrink-0 mt-0.5" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const SubSection = ({ title, items }) => (
  <div>
    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
    <BulletList items={items} />
  </div>
);

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#f4fafa] dark:bg-gray-950">
      {/* ── Hero ── */}
      <div className="bg-earth-brown dark:bg-earth-brown/90 text-white">
        <div className="page-container max-w-5xl py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm mb-6">
              <Shield size={32} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">Privacy Policy</h1>
            <p className="text-white/70 text-sm">Effective Date: December 17, 2025</p>
            <p className="mt-4 text-white/80 max-w-xl mx-auto text-sm leading-relaxed">
              RentiFi is committed to protecting your personal information and being transparent
              about what we collect and how we use it.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="page-container max-w-5xl py-12">
        <div className="flex gap-8 items-start">
          {/* Sticky TOC */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block w-60 shrink-0 sticky top-24"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-2">
                Contents
              </p>
              <nav className="space-y-0.5">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      activeSection === s.id
                        ? 'bg-earth-brown/10 text-earth-brown dark:bg-earth-brown/20 font-semibold'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-50">{s.number}</span>
                    <span className="leading-tight">{s.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.aside>

          {/* Sections */}
          <div className="flex-1 space-y-5">
            <SectionCard
              id="information-we-collect"
              icon={Eye}
              number="01"
              title="Information We Collect"
            >
              <p>When you use RentiFi, we may collect the following types of information:</p>
              <SubSection
                title="a. Personal Information"
                items={[
                  'Name, email address, phone number',
                  'Government-issued ID (for verification purposes)',
                  'Profile information and uploaded documents for property listings',
                ]}
              />
              <SubSection
                title="b. Payment Information"
                items={[
                  'Payment details processed securely through our payment provider — RentiFi does not store sensitive payment data.',
                ]}
              />
              <SubSection
                title="c. Usage Information"
                items={[
                  'Browsing and interaction data on the Platform',
                  'Booking history and reviews',
                ]}
              />
              <SubSection
                title="d. Host Verification Data"
                items={[
                  'Contact information and ID for hosts verifying users',
                  'Property-related documents uploaded by hosts',
                ]}
              />
            </SectionCard>

            <SectionCard
              id="how-we-use"
              icon={UserCheck}
              number="02"
              title="How We Use Your Information"
            >
              <p>RentiFi uses your information for purposes including:</p>
              <BulletList
                items={[
                  'Operating, maintaining, and improving the Platform',
                  'Verifying users and hosts to provide verified listings for safe transactions',
                  'Processing bookings, payments, and cancellations',
                  'Maintaining a trusted platform for property rentals',
                  'Communicating with users and hosts regarding bookings or Platform updates',
                  'Enforcing our terms, policies, and applicable laws',
                ]}
              />
              <InfoBadge color="teal">
                RentiFi provides verified listings and a trusted platform for property rentals. We
                implement verification processes to ensure the safety and authenticity of our
                listings and users.
              </InfoBadge>
              <InfoBadge color="orange">
                Important: While RentiFi provides verified listings and platform tools, users are
                encouraged to conduct their own additional verification for extra security. RentiFi
                is a platform provider and does not take responsibility for any illegal, fraudulent,
                or unethical actions performed by users or hosts.
              </InfoBadge>
            </SectionCard>

            <SectionCard id="verification" icon={Shield} number="03" title="Verification Process">
              <p>RentiFi provides verified listings through our platform verification process:</p>
              <BulletList
                items={[
                  'RentiFi verifies property listings and host identities to maintain platform quality and safety.',
                  'Hosts can contact users directly for additional verification purposes.',
                  'Hosts may request personal details necessary for trust and safety (e.g., phone number, ID verification).',
                  'Users must provide accurate information during verification.',
                  'Users are encouraged to conduct their own additional verification for extra security and peace of mind.',
                ]}
              />
              <InfoBadge color="blue">
                Note: RentiFi provides verified listings and verification tools. However, users
                should perform their own due diligence and additional verification when necessary.
                RentiFi is not liable for any disputes, fraud, or illegal actions between users and
                hosts.
              </InfoBadge>
            </SectionCard>

            <SectionCard id="sharing" icon={Share2} number="04" title="Sharing of Information">
              <p>
                We do not sell, rent, or trade your personal information. We may share your
                information with:
              </p>
              <BulletList
                items={[
                  'Hosts or users for verification and booking purposes',
                  'Payment service providers for processing transactions',
                  'Legal authorities if required by law or to protect rights',
                ]}
              />
            </SectionCard>

            <SectionCard id="data-security" icon={Lock} number="05" title="Data Security">
              <p>
                We take reasonable measures to protect your information from unauthorized access,
                alteration, disclosure, or destruction. However, no online platform can guarantee
                complete security. Users should exercise caution when sharing personal information
                with others.
              </p>
            </SectionCard>

            <SectionCard
              id="user-responsibilities"
              icon={UserCheck}
              number="06"
              title="User Responsibilities"
            >
              <BulletList
                items={[
                  'Provide accurate information during registration, verification, and bookings',
                  'Conduct your own additional verification of listings, hosts, or guests for extra security',
                  'Exercise due diligence when booking or accepting bookings',
                  'Report any suspicious or illegal activity to RentiFi or relevant authorities',
                  'Understand that while RentiFi provides verified listings and a trusted platform, users should perform their own verification',
                  'Understand that RentiFi is not responsible for any illegal acts committed by users or hosts',
                ]}
              />
            </SectionCard>

            <SectionCard
              id="changes"
              icon={RefreshCw}
              number="07"
              title="Changes to this Privacy Policy"
            >
              <p>
                RentiFi may update this Privacy Policy from time to time. Changes will be effective
                upon posting on the Platform. Continued use of the Platform constitutes acceptance
                of the updated Privacy Policy.
              </p>
            </SectionCard>

            <SectionCard id="contact" icon={Mail} number="08" title="Contact Us">
              <p>If you have questions about this Privacy Policy, please contact us at:</p>
              <a
                href="mailto:support@rentifi.com"
                className="inline-flex items-center gap-2.5 mt-2 px-5 py-3 rounded-xl bg-earth-brown text-white text-sm font-semibold hover:bg-earth-brown/90 transition-colors shadow-sm"
              >
                <Mail size={16} />
                support@rentifi.com
              </a>
            </SectionCard>
          </div>
        </div>
      </div>

      {/* Scroll-to-top */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-11 h-11 rounded-full bg-earth-brown text-white shadow-lg flex items-center justify-center hover:bg-earth-brown/90 transition-colors z-50"
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </div>
  );
};

export default PrivacyPolicy;
