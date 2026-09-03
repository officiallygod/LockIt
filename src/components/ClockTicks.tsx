import React from 'react';

interface ClockTicksProps {
  progress: number;
  color: string;
}

export const ClockTicks: React.FC<ClockTicksProps> = ({ progress, color }) => {
  // Total 40 curved ticks across a bottom arc
  const totalTicks = 36;
  const activeTicks = Math.round(progress * totalTicks);

  return (
    <div className="relative w-72 sm:w-80 h-16 flex items-end justify-between px-6 pointer-events-none select-none">
      {Array.from({ length: totalTicks }).map((_, i) => {
        const isActive = i <= activeTicks;
        const isMajor = i % 6 === 0;
        const height = isMajor ? 'h-6' : 'h-3.5';
        
        return (
          <div
            key={i}
            className="flex flex-col items-center justify-end transition-all duration-300"
          >
            <div
              className={`w-[2px] rounded-full transition-all duration-300 ${height}`}
              style={{
                backgroundColor: isActive ? color : 'currentColor',
                opacity: isActive ? 0.9 : 0.22,
                transform: isActive ? 'scaleY(1.15)' : 'scaleY(1)',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
