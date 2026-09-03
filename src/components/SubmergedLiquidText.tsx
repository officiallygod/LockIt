import React, { useEffect, useRef } from 'react';

interface SubmergedLiquidTextProps {
  text: string;
  className?: string;
  waterColor?: string;
  aboveColor?: string;
  waterLevelPercent?: number; // 0 to 100
  onClick?: () => void;
}

export const SubmergedLiquidText: React.FC<SubmergedLiquidTextProps> = ({
  text,
  className = '',
  waterColor = '#FF5335',
  aboveColor = '#FFFFFF',
  waterLevelPercent = 52,
  onClick,
}) => {
  const pathRef = useRef<SVGPathElement | null>(null);
  const pathCrestRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    let animId: number;
    let step = 0;

    const animate = () => {
      step += 0.04;
      const width = 400;
      const height = 140;
      const baseY = height * (waterLevelPercent / 100);

      // Generate dynamic fluid wave path
      let d = `M 0 ${baseY} `;
      for (let x = 0; x <= width; x += 10) {
        const y = baseY + Math.sin(x * 0.025 + step) * 6 + Math.cos(x * 0.015 - step * 0.7) * 3;
        d += `L ${x} ${y.toFixed(2)} `;
      }
      d += `L ${width} ${height} L 0 ${height} Z`;

      // Wave crest line path
      let dCrest = `M 0 ${baseY} `;
      for (let x = 0; x <= width; x += 10) {
        const y = baseY + Math.sin(x * 0.025 + step) * 6 + Math.cos(x * 0.015 - step * 0.7) * 3;
        dCrest += `L ${x} ${y.toFixed(2)} `;
      }

      if (pathRef.current) {
        pathRef.current.setAttribute('d', d);
      }
      if (pathCrestRef.current) {
        pathCrestRef.current.setAttribute('d', dCrest);
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [waterLevelPercent]);

  const uniqueId = `submerged-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      onClick={onClick}
      className={`relative inline-block select-none cursor-pointer ${className}`}
    >
      <svg
        viewBox="0 0 400 140"
        className="w-full h-auto overflow-visible"
        style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.18))' }}
      >
        <defs>
          {/* Wave Clip Path that cuts through the text */}
          <clipPath id={`${uniqueId}-water-clip`}>
            <path ref={pathRef} d="M 0 70 L 400 70 L 400 140 L 0 140 Z" />
          </clipPath>

          {/* Inverted clip path for dry top half */}
          <clipPath id={`${uniqueId}-dry-clip`}>
            <rect x="0" y="0" width="400" height="140" />
          </clipPath>
        </defs>

        {/* --- Layer 1: Dry Above-Water Typography (Crisp Top Half) --- */}
        <text
          x="200"
          y="105"
          textAnchor="middle"
          fill={aboveColor}
          className="font-black font-sans tracking-tight leading-none text-[84px] sm:text-[96px]"
          style={{ letterSpacing: '-0.04em' }}
        >
          {text}
        </text>

        {/* --- Layer 2: Submerged Water Wave (Image 1 Style) --- */}
        <g clipPath={`url(#${uniqueId}-water-clip)`}>
          {/* Submerged text in water hue with refraction */}
          <text
            x="200"
            y="105"
            textAnchor="middle"
            fill={waterColor}
            className="font-black font-sans tracking-tight leading-none text-[84px] sm:text-[96px]"
            style={{
              letterSpacing: '-0.04em',
              filter: 'url(#water-refraction)',
              opacity: 0.9,
            }}
          >
            {text}
          </text>

          {/* Translucent water overlay tint */}
          <rect
            x="0"
            y="0"
            width="400"
            height="140"
            fill={waterColor}
            opacity="0.25"
          />
        </g>

        {/* --- Layer 3: Surface Water Crest / Foam Line --- */}
        <path
          ref={pathCrestRef}
          d="M 0 70 L 400 70"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity="0.85"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.6))' }}
        />
      </svg>
    </div>
  );
};
