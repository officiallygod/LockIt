import React, { useEffect, useRef } from 'react';

interface WaterWaveProps {
  progress: number; // 0 to 1
  color: string;
  isPaused: boolean;
  className?: string;
}

export const WaterWave: React.FC<WaterWaveProps> = ({ progress, color, isPaused, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      if (!canvas) return;
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, width, height);

      if (!isPaused) {
        step += 0.035;
      }

      // Fill height based on progress (from bottom to top)
      // Clamped between 5% and 95% for aesthetic visibility
      const clampedProgress = Math.max(0.04, Math.min(0.96, progress));
      const waterHeight = height * (1 - clampedProgress);

      // Layer 1: Background softer wave
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 4) {
        const y = Math.sin(x * 0.015 + step * 0.8) * 8 + Math.cos(x * 0.01 - step * 0.5) * 4 + waterHeight;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.18;
      ctx.fill();
      ctx.restore();

      // Layer 2: Foreground active fluid wave
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 4) {
        const y = Math.sin(x * 0.02 + step) * 10 + Math.cos(x * 0.015 + step * 0.7) * 5 + waterHeight;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.28;
      ctx.fill();
      ctx.restore();

      // Layer 3: Surface highlight froth
      ctx.save();
      ctx.beginPath();
      for (let x = 0; x <= width; x += 4) {
        const y = Math.sin(x * 0.02 + step) * 10 + Math.cos(x * 0.015 + step * 0.7) * 5 + waterHeight;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.55;
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [progress, color, isPaused]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full pointer-events-none ${className}`}
    />
  );
};
