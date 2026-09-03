import React from 'react';
import { motion } from 'framer-motion';

interface PhoneContainerProps {
  children: React.ReactNode;
  isDark: boolean;
}

export const PhoneContainer: React.FC<PhoneContainerProps> = ({ children, isDark }) => {
  return (
    <div className="relative w-full max-w-[400px] h-full sm:min-h-[760px] sm:max-h-[820px] rounded-none sm:rounded-[52px] shadow-none sm:shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 border-0 sm:border sm:border-black/5 dark:sm:border-white/10 select-none">
      {children}
    </div>
  );
};
