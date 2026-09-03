import React, { useEffect, useRef } from 'react';

interface ClockTicksProps {
  progress: number;
  color: string;
}

export const ClockTicks: React.FC<ClockTicksProps> = ({ progress, color }) => {
  const containerRef = useRef<SVGSVGElement | null>(null);
  const progressRef = useRef(progress);
  const colorRef = useRef(color);

  useEffect(() => {
    progressRef.current = progress;
    colorRef.current = color;
  }, [progress, color]);

  const totalTicks = 42;

  useEffect(() => {
    const svg = containerRef.current;
    if (!svg) return;

    let animId: number;
    const tickElements = svg.querySelectorAll<SVGLineElement>('.clock-tick-line');

    const animate = (time: number) => {
      // Continuous non-stop traveling wave phase (never stops, repeats infinitely)
      const phase = time * 0.0028;
      const currentProgress = progressRef.current;
      const activeLimit = currentProgress * totalTicks;

      tickElements.forEach((line, i) => {
        // Traveling fluid wave formula
        const wave = Math.sin(i * 0.28 - phase);
        const waveSecondary = Math.cos(i * 0.14 - phase * 0.6);
        const combinedWave = (wave + waveSecondary * 0.5) / 1.5; // normalized -1 to 1

        const isElapsed = i <= activeLimit;
        const isCurrentHead = Math.abs(i - activeLimit) < 1.5;

        // Base opacity + smooth continuous wave shimmer
        let baseOpacity = isElapsed ? 0.95 : 0.28;
        if (isCurrentHead) {
          baseOpacity = 1.0;
        }

        // Continuous non-stop undulating wave modulation
        const waveOpacityBoost = (combinedWave + 1) * 0.18; // 0 to 0.36
        const finalOpacity = Math.min(1.0, baseOpacity + waveOpacityBoost);

        // Continuous length undulation (+/- 4px smooth wave)
        const isMajor = i % 5 === 0;
        const baseLength = isMajor ? 14 : 8;
        const waveLength = baseLength + combinedWave * 3.5;

        // Read geometric angle from data attributes
        const x1 = parseFloat(line.getAttribute('data-x1') || '0');
        const y1 = parseFloat(line.getAttribute('data-y1') || '0');
        const sin = parseFloat(line.getAttribute('data-sin') || '0');
        const cos = parseFloat(line.getAttribute('data-cos') || '0');

        // Update inner end point smoothly
        const x2 = x1 - sin * waveLength;
        const y2 = y1 + cos * waveLength;

        line.setAttribute('x2', x2.toFixed(2));
        line.setAttribute('y2', y2.toFixed(2));
        line.setAttribute('stroke-opacity', finalOpacity.toFixed(3));
        line.setAttribute('stroke', isElapsed ? colorRef.current : 'currentColor');
        line.setAttribute('stroke-width', isMajor ? '2.4' : '1.8');
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animId);
  }, [totalTicks]);

  // Pre-calculate radial geometry for arch (∩ dome curve matching Screenshot 1)
  // Arc center (240, 240), Radius 200, Angle from -54 deg to +54 deg
  const viewBoxWidth = 480;
  const viewBoxHeight = 100;
  const centerX = viewBoxWidth / 2;
  const centerY = 240;
  const radius = 200;
  const maxAngleDeg = 52;

  const ticksData = Array.from({ length: totalTicks }).map((_, i) => {
    const t = i / (totalTicks - 1); // 0 to 1
    const angleDeg = -maxAngleDeg + t * (maxAngleDeg * 2);
    const angleRad = (angleDeg * Math.PI) / 180;

    const sin = Math.sin(angleRad);
    const cos = Math.cos(angleRad);

    // Outer point on the curve
    const x1 = centerX + radius * sin;
    const y1 = centerY - radius * cos;

    // Default inner point
    const defaultLength = i % 5 === 0 ? 14 : 8;
    const x2 = x1 - sin * defaultLength;
    const y2 = y1 + cos * defaultLength;

    return {
      index: i,
      x1,
      y1,
      x2,
      y2,
      sin,
      cos,
    };
  });

  return (
    <div className="relative w-72 sm:w-96 md:w-[460px] h-18 sm:h-22 flex items-center justify-center pointer-events-none select-none">
      <svg
        ref={containerRef}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-full overflow-visible"
        style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.12))' }}
      >
        {ticksData.map((tick) => (
          <line
            key={tick.index}
            className="clock-tick-line"
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            data-x1={tick.x1}
            data-y1={tick.y1}
            data-sin={tick.sin}
            data-cos={tick.cos}
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.4"
          />
        ))}
      </svg>
    </div>
  );
};
