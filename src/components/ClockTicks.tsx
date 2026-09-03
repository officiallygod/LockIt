import React from 'react';

interface ClockTicksProps {
  progress: number;
  color: string;
}

export const ClockTicks: React.FC<ClockTicksProps> = ({ progress, color }) => {
  // Total 40 curved ticks across a bottom arc
  const totalTicks = 38;
  const activeTicks = Math.round(progress * totalTicks);

  return (
    <div className="relative w-72 sm:w-96 md:w-[460px] h-16 sm:h-20 flex items-end justify-between px-4 sm:px-8 pointer-events-none select-none">
      {Array.from({ length: totalTicks }).map((_, i) => {
        const isActive = i <= activeTicks;
        const isMajor = i % 6 === 0;
        const height = isMajor ? 'h-6 sm:h-8' : 'h-3.5 sm:h-4.5';
        
        return (
          <div
            key={i}
            className="flex flex-col items-center justify-end transition-all duration-300"
          >
            <div
              className={`w-[2px] sm:w-[2.5px] rounded-full transition-all duration-300 ${height}`}
              style={{
                backgroundColor: isActive ? color : 'currentColor',
                opacity: isActive ? 0.95 : 0.22,
                transform: isActive ? 'scaleY(1.18)' : 'scaleY(1)',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
