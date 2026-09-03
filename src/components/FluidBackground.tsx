import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FluidBackgroundProps {
  blobColors: [string, string, string];
  isDark: boolean;
}

export const FluidBackground: React.FC<FluidBackgroundProps> = ({ blobColors, isDark }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates (-1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 select-none transition-opacity duration-1000">
      {/* Abstract Morphing Blob 1 (Top Left) */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.12, 0.94, 1],
          borderRadius: [
            '60% 40% 30% 70% / 60% 30% 70% 40%',
            '30% 60% 70% 40% / 50% 60% 30% 60%',
            '60% 40% 60% 40% / 40% 50% 50% 60%',
            '60% 40% 30% 70% / 60% 30% 70% 40%',
          ],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          transform: `translate3d(${mousePos.x * 0.7}px, ${mousePos.y * 0.7}px, 0)`,
          backgroundColor: blobColors[0],
          filter: 'blur(70px)',
          opacity: isDark ? 0.22 : 0.16,
        }}
        className="absolute -top-24 -left-24 w-80 sm:w-[480px] h-80 sm:h-[480px] transition-colors duration-700 will-change-transform"
      />

      {/* Abstract Morphing Blob 2 (Center Right) */}
      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 60, -40, 0],
          scale: [1, 0.92, 1.15, 1],
          borderRadius: [
            '40% 60% 70% 30% / 40% 40% 60% 60%',
            '60% 30% 40% 70% / 60% 50% 50% 40%',
            '50% 60% 30% 70% / 50% 40% 60% 50%',
            '40% 60% 70% 30% / 40% 40% 60% 60%',
          ],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          transform: `translate3d(${-mousePos.x * 0.8}px, ${-mousePos.y * 0.8}px, 0)`,
          backgroundColor: blobColors[1],
          filter: 'blur(85px)',
          opacity: isDark ? 0.20 : 0.14,
        }}
        className="absolute top-1/4 -right-28 w-96 sm:w-[540px] h-96 sm:h-[540px] transition-colors duration-700 will-change-transform"
      />

      {/* Abstract Morphing Blob 3 (Bottom Left / Center) */}
      <motion.div
        animate={{
          x: [0, 50, -40, 0],
          y: [0, -40, 50, 0],
          scale: [0.95, 1.1, 0.92, 0.95],
          borderRadius: [
            '50% 50% 40% 60% / 60% 40% 60% 40%',
            '70% 30% 50% 50% / 30% 60% 40% 70%',
            '40% 60% 70% 30% / 50% 30% 70% 50%',
            '50% 50% 40% 60% / 60% 40% 60% 40%',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          transform: `translate3d(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px, 0)`,
          backgroundColor: blobColors[2],
          filter: 'blur(80px)',
          opacity: isDark ? 0.18 : 0.12,
        }}
        className="absolute -bottom-32 left-1/4 w-80 sm:w-[500px] h-80 sm:h-[500px] transition-colors duration-700 will-change-transform"
      />

      {/* Subtle organic floating fluid droplets */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            y: [-15, 15, -15],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-10 sm:left-24 w-12 h-12 rounded-full border border-current opacity-10 blur-[1px]"
          style={{ borderColor: blobColors[0] }}
        />
        <motion.div
          animate={{
            y: [20, -20, 20],
            rotate: [0, -15, 15, 0],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/3 right-12 sm:right-28 w-16 h-16 rounded-full border border-current opacity-10 blur-[1px]"
          style={{ borderColor: blobColors[1] }}
        />
      </div>
    </div>
  );
};
