import React from 'react';
import { motion } from 'framer-motion';

interface MorphingBlobProps {
  children?: React.ReactNode;
  color: string;
  secondaryColor?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MorphingBlob: React.FC<MorphingBlobProps> = ({
  children,
  color,
  secondaryColor,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-48 h-48 sm:w-56 sm:h-56',
    md: 'w-64 h-64 sm:w-72 sm:h-72',
    lg: 'w-72 h-72 sm:w-84 sm:h-84',
  }[size];

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Decorative floating droplet above (from Image 5) */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
          scale: [1, 1.05, 1],
          borderRadius: [
            '50% 50% 40% 60% / 60% 40% 60% 40%',
            '60% 40% 60% 40% / 40% 60% 50% 50%',
            '50% 50% 40% 60% / 60% 40% 60% 40%',
          ],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-10 sm:-top-12 -right-2 sm:-right-4 w-14 sm:w-16 h-18 sm:h-20 opacity-40 blur-[0.5px] pointer-events-none"
        style={{
          backgroundColor: secondaryColor || `${color}80`,
        }}
      />

      {/* Main Organic Morphing Liquid Pebble / Blob (Image 5 style) */}
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
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`relative ${sizeClasses} flex flex-col items-center justify-center p-6 shadow-2xl transition-colors duration-500 overflow-hidden cursor-pointer active:scale-95`}
        style={{
          backgroundColor: color,
          boxShadow: `0 20px 50px -15px ${color}60`,
        }}
      >
        {/* Subtle inner liquid highlight reflection */}
        <div className="absolute top-4 left-6 w-20 h-10 rounded-full bg-white/20 blur-md pointer-events-none transform -rotate-12" />

        {/* Content inside the organic shape */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
