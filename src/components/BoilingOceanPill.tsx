import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square } from 'lucide-react';

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
  color = '#FF6B4A',
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
    const bubbleCount = 28;
    const bubbles: Bubble[] = [];

    const spawnBubble = (width: number, height: number): Bubble => ({
      x: 20 + Math.random() * (width - 40),
      y: height - 6 - Math.random() * 20,
      radius: 2 + Math.random() * 4.5,
      speedY: 0.9 + Math.random() * 1.8,
      wobbleSpeed: 0.04 + Math.random() * 0.06,
      wobbleAmp: 1.5 + Math.random() * 2.5,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.35 + Math.random() * 0.5,
    });

    const render = () => {
      if (!canvas) return;
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, width, height);

      // Advance ocean wave phase continuously (never stops, tranquil when paused)
      step += isRunningRef.current ? 0.038 : 0.022;

      // Base water surface line (approx 35% from top, filling bottom 65% of the pill like Media 4)
      const waterY = height * 0.32;
      const themeCol = colorRef.current;

      // --- Layer 1: Background Softer Ocean Wave ---
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 4) {
        const y = Math.sin(x * 0.016 + step * 0.8) * 8 + Math.cos(x * 0.01 - step * 0.4) * 4 + waterY;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = themeCol;
      ctx.globalAlpha = 0.55;
      ctx.fill();
      ctx.restore();

      // --- Layer 2: Main Active Rolling Ocean Wave (Media 4) ---
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 4) {
        const y = Math.sin(x * 0.022 + step) * 10 + Math.cos(x * 0.014 + step * 0.7) * 5 + waterY;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = themeCol;
      ctx.globalAlpha = 0.92;
      ctx.fill();
      ctx.restore();

      // --- Layer 3: White Surface Froth / Crest Line ---
      ctx.save();
      ctx.beginPath();
      for (let x = 0; x <= width; x += 4) {
        const y = Math.sin(x * 0.022 + step) * 10 + Math.cos(x * 0.014 + step * 0.7) * 5 + waterY;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.85;
      ctx.stroke();
      ctx.restore();

      // --- Layer 4: Boiling Bubbles Particle System (Media 1–3) ---
      while (bubbles.length < bubbleCount) {
        bubbles.push(spawnBubble(width, height));
      }

      ctx.save();
      bubbles.forEach((b, idx) => {
        // Calculate current wave surface height at bubble's X
        const surfaceAtX = Math.sin(b.x * 0.022 + step) * 10 + Math.cos(b.x * 0.014 + step * 0.7) * 5 + waterY;

        // Rise upwards with buoyancy
        b.y -= b.speedY * (isRunningRef.current ? 1.2 : 0.8);
        b.phase += b.wobbleSpeed;
        const currentX = b.x + Math.sin(b.phase) * b.wobbleAmp;

        // Draw translucent boiling bubble with white rim
        ctx.beginPath();
        ctx.arc(currentX, b.y, b.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.globalAlpha = b.opacity;
        ctx.fill();
        ctx.stroke();

        // Bubble burst at the ocean surface and respawn at bottom
        if (b.y <= surfaceAtX + b.radius || b.y < 0) {
          bubbles[idx] = spawnBubble(width, height);
        }
      });
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
          y: [-5, 5, -5],
          rotate: [-1.2, 1.2, -1.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-76 sm:w-96 md:w-[440px] h-22 sm:h-26 md:h-28 rounded-full overflow-hidden border-4 border-white/90 dark:border-white/30 shadow-2xl backdrop-blur-xl bg-white/20 dark:bg-black/20 flex items-center justify-between px-6 sm:px-8 cursor-pointer active:scale-98 transition-transform"
        style={{
          boxShadow: '0 20px 50px -10px rgba(255, 107, 74, 0.35), 0 8px 20px -5px rgba(0,0,0,0.1)',
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
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            onTogglePlay();
          }}
          className="relative z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer shadow-sm"
          title={isRunning ? 'Pause' : 'Play'}
        >
          {isRunning ? (
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-5 rounded-full bg-white block shadow-sm" />
              <span className="w-1.5 h-5 rounded-full bg-white block shadow-sm" />
            </div>
          ) : (
            <Play size={22} className="fill-white text-white ml-0.5" />
          )}
        </motion.button>

        {/* Center: Minimalist Bold Time Numerals (Media 4: "05:43") */}
        <div
          onClick={onTogglePlay}
          className="relative z-10 text-center flex items-center justify-center cursor-pointer select-none"
        >
          <span className="text-4xl sm:text-5xl md:text-6xl font-black font-sans tracking-tight text-white drop-shadow-md leading-none">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>

        {/* Right: Stop / Reset Square icon □ (Media 4) */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            onReset();
          }}
          className="relative z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer shadow-sm"
          title="Stop / Reset"
        >
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md border-2 border-white bg-transparent flex items-center justify-center shadow-sm" />
        </motion.button>
      </motion.div>
    </div>
  );
};
