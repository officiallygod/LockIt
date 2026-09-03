import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

interface BoilingOceanPillProps {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  color?: string;
  onTogglePlay: () => void;
  onReset: () => void;
}

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  phase: number;
  opacity: number;
}

export const BoilingOceanPill: React.FC<BoilingOceanPillProps> = ({
  minutes,
  seconds,
  isRunning,
  color = '#FF5335',
  onTogglePlay,
  onReset,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isRunningRef = useRef(isRunning);
  const colorRef = useRef(color);

  useEffect(() => {
    isRunningRef.current = isRunning;
    colorRef.current = color;
  }, [isRunning, color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize boiling bubbles particle system (Media 1–3)
    const bubbleCount = 32;
    const bubbles: Bubble[] = [];

    const spawnBubble = (width: number, height: number): Bubble => ({
      x: 18 + Math.random() * (width - 36),
      y: height - 4 - Math.random() * 24,
      radius: 2 + Math.random() * 4.5,
      speedY: 1.0 + Math.random() * 2.0,
      wobbleSpeed: 0.04 + Math.random() * 0.07,
      wobbleAmp: 1.5 + Math.random() * 3.0,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.35 + Math.random() * 0.55,
    });

    const render = () => {
      if (!canvas) return;
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, width, height);

      // Continuous ocean wave propagation
      step += isRunningRef.current ? 0.042 : 0.024;

      // Base water surface level (~34% from top, filling bottom 66% of the pill)
      const waterY = height * 0.34;
      const themeCol = colorRef.current;

      // --- Layer 1: Background Softer Ocean Wave ---
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 4) {
        const y = Math.sin(x * 0.015 + step * 0.82) * 8 + Math.cos(x * 0.009 - step * 0.42) * 4 + waterY;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = themeCol;
      ctx.globalAlpha = 0.52;
      ctx.fill();
      ctx.restore();

      // --- Layer 2: Main Active Rolling Ocean Wave (Media 4) ---
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 4) {
        const y = Math.sin(x * 0.02 + step) * 10 + Math.cos(x * 0.013 + step * 0.68) * 5 + waterY;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = themeCol;
      ctx.globalAlpha = 0.94;
      ctx.fill();
      ctx.restore();

      // --- Layer 3: White Surface Froth / Crest Line ---
      ctx.save();
      ctx.beginPath();
      for (let x = 0; x <= width; x += 4) {
        const y = Math.sin(x * 0.02 + step) * 10 + Math.cos(x * 0.013 + step * 0.68) * 5 + waterY;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.8;
      ctx.globalAlpha = 0.88;
      ctx.stroke();
      ctx.restore();

      // --- Layer 4: Boiling Water Bubbles System (Media 1–3) ---
      while (bubbles.length < bubbleCount) {
        bubbles.push(spawnBubble(width, height));
      }

      ctx.save();
      bubbles.forEach((b, idx) => {
        const surfaceAtX = Math.sin(b.x * 0.02 + step) * 10 + Math.cos(b.x * 0.013 + step * 0.68) * 5 + waterY;

        // Rise upwards with buoyancy
        b.y -= b.speedY * (isRunningRef.current ? 1.3 : 0.85);
        b.phase += b.wobbleSpeed;
        const currentX = b.x + Math.sin(b.phase) * b.wobbleAmp;

        // Translucent boiling bubble with white rim
        ctx.beginPath();
        ctx.arc(currentX, b.y, b.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.globalAlpha = b.opacity;
        ctx.fill();
        ctx.stroke();

        // Bubble burst at ocean surface and respawn at bottom
        if (b.y <= surfaceAtX + b.radius || b.y < 0) {
          bubbles[idx] = spawnBubble(width, height);
        }
      });
      ctx.restore();

      // --- Layer 5: Cute Floating Rubber Duck / Buoy (Image 2 Inspired) ---
      const duckX = width * 0.76;
      const duckWaveY = Math.sin(duckX * 0.02 + step) * 10 + Math.cos(duckX * 0.013 + step * 0.68) * 5 + waterY;
      const duckTilt = Math.cos(duckX * 0.02 + step) * 0.18;

      ctx.save();
      ctx.translate(duckX, duckWaveY - 4);
      ctx.rotate(duckTilt);
      // Draw small yellow rubber duck / buoy
      ctx.font = '16px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐤', 0, 0);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative w-full flex items-center justify-center py-4 select-none">
      {/* Floating Ocean Wave Capsule Pill with Buoy Physics (Media 4) */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
          rotate: [-1.2, 1.2, -1.2],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-80 sm:w-96 md:w-[460px] h-24 sm:h-28 md:h-30 rounded-full overflow-hidden border-4 border-white/95 dark:border-white/30 shadow-2xl backdrop-blur-xl bg-white/20 dark:bg-black/30 flex items-center justify-between px-6 sm:px-9 cursor-pointer active:scale-98 transition-transform"
        style={{
          boxShadow: '0 24px 60px -12px rgba(255, 83, 53, 0.4), 0 10px 24px -6px rgba(0,0,0,0.12)',
        }}
      >
        {/* Real-time Canvas Rendering Ocean Waves + Boiling Bubbles */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none rounded-full"
        />

        {/* --- Inner Controls: Left Pause/Play ||, Center Time 05:43, Right Stop □ (Media 4) --- */}
        {/* Left: Pause / Play icon */}
        <motion.button
          whileHover={{ scale: 1.22 }}
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            onTogglePlay();
          }}
          className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer shadow-md"
          title={isRunning ? 'Pause' : 'Play'}
        >
          {isRunning ? (
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-5 sm:h-6 rounded-full bg-white block shadow-md" />
              <span className="w-1.5 h-5 sm:h-6 rounded-full bg-white block shadow-md" />
            </div>
          ) : (
            <Play size={24} className="fill-white text-white ml-0.5" />
          )}
        </motion.button>

        {/* Center: Minimalist Bold Time Numerals (Media 4: "05:43") */}
        <div
          onClick={onTogglePlay}
          className="relative z-10 text-center flex items-center justify-center cursor-pointer select-none"
        >
          <span className="text-4xl sm:text-5xl md:text-6xl font-black font-sans tracking-tight text-white drop-shadow-lg leading-none">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>

        {/* Right: Stop / Reset Square icon □ (Media 4) */}
        <motion.button
          whileHover={{ scale: 1.22 }}
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            onReset();
          }}
          className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer shadow-md"
          title="Stop / Reset"
        >
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md border-2 border-white bg-transparent flex items-center justify-center shadow-md" />
        </motion.button>
      </motion.div>
    </div>
  );
};
