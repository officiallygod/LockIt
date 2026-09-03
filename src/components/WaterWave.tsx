import React, { useEffect, useRef } from 'react';

interface WaterWaveProps {
  progress: number; // 0 to 1
  color: string;
  isPaused: boolean;
  className?: string;
}

export const WaterWave: React.FC<WaterWaveProps> = ({ progress, color, isPaused, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(progress);
  const colorRef = useRef(color);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    progressRef.current = progress;
    colorRef.current = color;
    isPausedRef.current = isPaused;
  }, [progress, color, isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;
    let smoothedWaterHeight: number | null = null;

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

    const render = () => {
      if (!canvas) return;
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, width, height);

      // Continuous non-stop wave advancement (never freezes, calm swell when paused)
      const waveSpeed = isPausedRef.current ? 0.018 : 0.034;
      step += waveSpeed;

      // Smooth lerp for water height to eliminate ANY 1-second discrete stepping jitter
      const clampedProgress = Math.max(0.04, Math.min(0.96, progressRef.current));
      const targetWaterHeight = height * (1 - clampedProgress);

      if (smoothedWaterHeight === null) {
        smoothedWaterHeight = targetWaterHeight;
      } else {
        // Silky smooth exponential decay filter (lerp)
        smoothedWaterHeight += (targetWaterHeight - smoothedWaterHeight) * 0.045;
      }

      const waterY = smoothedWaterHeight;
      const waveColor = colorRef.current;

      // Layer 1: Softer background fluid swell (repeats continuously)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 4) {
        const y = Math.sin(x * 0.014 + step * 0.85) * 8 + Math.cos(x * 0.009 - step * 0.45) * 4 + waterY;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = waveColor;
      ctx.globalAlpha = 0.16;
      ctx.fill();
      ctx.restore();

      // Layer 2: Main active foreground fluid wave
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 4) {
        const y = Math.sin(x * 0.018 + step) * 10 + Math.cos(x * 0.012 + step * 0.7) * 5 + waterY;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = waveColor;
      ctx.globalAlpha = 0.26;
      ctx.fill();
      ctx.restore();

      // Layer 3: Surface highlight crest line
      ctx.save();
      ctx.beginPath();
      for (let x = 0; x <= width; x += 4) {
        const y = Math.sin(x * 0.018 + step) * 10 + Math.cos(x * 0.012 + step * 0.7) * 5 + waterY;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = waveColor;
      ctx.lineWidth = 2.2;
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full pointer-events-none ${className}`}
    />
  );
};
