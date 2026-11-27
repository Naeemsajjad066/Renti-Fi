import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cardFadeUp } from '@/constants/animations';

const DashboardStatCard = ({ label, value, icon: Icon, iconBg, valueColor, trend, delay }) => (
  <motion.div
    variants={cardFadeUp}
    initial="hidden"
    animate="visible"
    transition={{ delay }}
    className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={20} />
      </div>
      {trend !== undefined && (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
          <ArrowUpRight size={11} />
          {trend}%
        </span>
      )}
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
    <p className={`text-2xl font-display font-bold ${valueColor}`}>{value}</p>
  </motion.div>
);

export default DashboardStatCard;
