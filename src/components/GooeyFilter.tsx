import React from 'react';

export const GooeyFilter: React.FC = () => {
  return (
    <svg
      className="fixed pointer-events-none -z-50 w-0 h-0 opacity-0 overflow-hidden"
      aria-hidden="true"
    >
      <defs>
        {/* Aaron Iker Iconic Gooey Liquid Filter */}
        <filter id="liquid-gooey">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>

        {/* Liquid Water Caustics Refraction Filter */}
        <filter id="water-refraction">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02 0.04"
            numOctaves="2"
            result="waterNoise"
          >
            <animate
              attributeName="baseFrequency"
              dur="12s"
              values="0.02 0.04;0.025 0.05;0.02 0.04"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="waterNoise"
            scale="5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
};
