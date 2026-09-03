import React from 'react';
import { motion } from 'framer-motion';

interface MorphingBlobProps {
  children?: React.ReactNode;
  color: string;
  secondaryColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'responsive';
  className?: string;
}

export const MorphingBlob: React.FC<MorphingBlobProps> = ({
  children,
  color,
  secondaryColor,
  size = 'responsive',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-48 h-48 sm:w-56 sm:h-56',
    md: 'w-64 h-64 sm:w-72 sm:h-72',
    lg: 'w-72 h-72 sm:w-84 sm:h-84',
    responsive: 'w-64 h-64 sm:w-84 sm:h-84 md:w-[420px] md:h-[420px]',
  }[size];

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Decorative floating droplet above (Screenshot 2 Right) */}
      <motion.div
        animate={{
          y: [-8, 8, -8],
          scale: [1, 1.08, 1],
          borderRadius: [
            '50% 50% 40% 60% / 60% 40% 60% 40%',
            '60% 40% 60% 40% / 40% 60% 50% 50%',
            '50% 50% 40% 60% / 60% 40% 60% 40%',
          ],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-10 sm:-top-14 -right-2 sm:-right-6 w-16 sm:w-22 md:w-26 h-20 sm:h-28 md:h-32 opacity-50 blur-[0.5px] pointer-events-none"
        style={{
          backgroundColor: secondaryColor || `${color}80`,
        }}
      />

      {/* Main Organic Morphing Liquid Pebble / Blob (Screenshot 2 Right) */}
      <motion.div
        animate={{
          borderRadius: [
            '58% 42% 38% 62% / 54% 48% 52% 46%',
            '45% 55% 62% 38% / 40% 58% 42% 60%',
            '62% 38% 45% 55% / 58% 42% 58% 42%',
            '40% 60% 50% 50% / 48% 40% 60% 52%',
            '58% 42% 38% 62% / 54% 48% 52% 46%',
          ],
          scale: [1, 1.03, 0.98, 1.02, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`relative ${sizeClasses} flex flex-col items-center justify-center p-8 sm:p-12 shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer active:scale-95`}
        style={{
          backgroundColor: color,
          boxShadow: `0 28px 70px -15px ${color}65`,
        }}
      >
        {/* Subtle inner liquid highlight reflection */}
        <div className="absolute top-6 left-8 w-28 sm:w-36 h-12 sm:h-16 rounded-full bg-white/20 blur-lg pointer-events-none transform -rotate-12" />

        {/* Content inside the organic shape */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
