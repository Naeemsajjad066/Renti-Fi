import React, { useState } from 'react';
import PageTransition from '@/components/PageTransition';
import HostSidebar from '@/components/HostSidebar';
import StripeConnectSetup from '../components/StripeConnectSetup';
import { useIsMobile } from '@/hooks/use-mobile';

const HostSettings = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
        <HostSidebar
          isMobile={isMobile}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((p) => !p)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 md:px-8 py-6">
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your payment methods and account preferences.
            </p>
          </div>

          <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Payment method */}
            <section>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Payment Method
              </h2>
              <StripeConnectSetup />
            </section>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HostSettings;
