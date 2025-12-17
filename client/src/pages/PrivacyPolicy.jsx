import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="page-container max-w-4xl"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Effective Date: December 17, 2025
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300">
              RentiFi ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the 
              RentiFi platform ("Platform"). RentiFi provides verified listings and a trusted platform to connect hosts and 
              guests. By using our Platform, you agree to the terms of this Privacy Policy.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                1. Information We Collect
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                When you use RentiFi, we may collect the following types of information:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    a. Personal Information:
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Name, email address, phone number</li>
                    <li>Government-issued ID (for verification purposes)</li>
                    <li>Profile information and uploaded documents for property listings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    b. Payment Information:
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Payment details (processed securely through our payment provider; RentiFi does not store sensitive payment data)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    c. Usage Information:
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Browsing and interaction data on the Platform</li>
                    <li>Booking history and reviews</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    d. Host Verification Data:
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Contact information and ID for hosts verifying users</li>
                    <li>Property-related documents uploaded by hosts</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                RentiFi uses your information for purposes including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Operating, maintaining, and improving the Platform</li>
                <li>Verifying users and hosts to provide verified listings for safe transactions</li>
                <li>Processing bookings, payments, and cancellations</li>
                <li>Maintaining a trusted platform for property rentals</li>
                <li>Communicating with users and hosts regarding bookings or Platform updates</li>
                <li>Enforcing our terms, policies, and applicable laws</li>
              </ul>
              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 mt-4">
                <p className="text-gray-800 dark:text-gray-200 font-semibold">
                  RentiFi provides verified listings and a trusted platform for property rentals. We implement verification 
                  processes to ensure the safety and authenticity of our listings and users.
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mt-4">
                <p className="text-gray-800 dark:text-gray-200 font-semibold">
                  Important: While RentiFi provides verified listings and platform tools, users are encouraged to conduct 
                  their own additional verification for extra security. RentiFi is a platform provider and does not take 
                  responsibility for any illegal, fraudulent, or unethical actions performed by users or hosts. Users are 
                  responsible for their own actions and due diligence.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                3. Verification Process
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                RentiFi provides verified listings through our platform verification process:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>RentiFi verifies property listings and host identities to maintain platform quality and safety.</li>
                <li>Hosts can contact users directly for additional verification purposes.</li>
                <li>Hosts may request personal details necessary for trust and safety (e.g., phone number, ID verification).</li>
                <li>Users must provide accurate information during verification.</li>
                <li><strong>Users are encouraged to conduct their own additional verification</strong> for extra security and peace of mind.</li>
              </ul>
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mt-4">
                <p className="text-gray-800 dark:text-gray-200 font-semibold">
                  Note: RentiFi provides a good platform with verified listings and verification tools. However, users should 
                  perform their own due diligence and additional verification when necessary. RentiFi is not liable for any 
                  disputes, fraud, or illegal actions between users and hosts.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                4. Sharing of Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We do not sell, rent, or trade your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Hosts or users for verification and booking purposes</li>
                <li>Payment service providers for processing transactions</li>
                <li>Legal authorities if required by law or to protect rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                5. Data Security
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                We take reasonable measures to protect your information from unauthorized access, alteration, disclosure, 
                or destruction. However, no online platform can guarantee complete security. Users should exercise caution 
                when sharing personal information with others.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                6. User Responsibilities
              </h2>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Provide accurate information during registration, verification, and bookings</li>
                <li><strong>Conduct your own additional verification</strong> of listings, hosts, or guests for extra security</li>
                <li>Exercise due diligence when booking or accepting bookings</li>
                <li>Report any suspicious or illegal activity to RentiFi or relevant authorities</li>
                <li>Understand that while RentiFi provides verified listings and a trusted platform, users should perform their own verification</li>
                <li>Understand that RentiFi is not responsible for any illegal acts committed by users or hosts</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                7. Changes to this Privacy Policy
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                RentiFi may update this Privacy Policy from time to time. Changes will be effective upon posting on the 
                Platform. Continued use of the Platform constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                8. Contact Us
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:support@rentifi.com" className="text-primary hover:underline font-medium">
                  support@rentifi.com
                </a>
              </div>
            </section>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
