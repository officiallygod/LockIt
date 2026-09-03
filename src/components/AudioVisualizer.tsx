import React from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  color: string;
  barCount?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying, color, barCount = 18 }) => {
  return (
    <div className="flex items-center justify-center gap-[3px] h-6 px-2">
      {Array.from({ length: barCount }).map((_, i) => {
        // Deterministic pseudo-random heights
        const delay = (i * 0.08) % 0.8;
        const duration = 0.6 + (i % 3) * 0.2;
        
        return (
          <div
            key={i}
            className="w-[3px] rounded-full transition-all"
            style={{
              backgroundColor: color,
              height: isPlaying ? '100%' : '20%',
              animation: isPlaying ? `waveBar ${duration}s ease-in-out ${delay}s infinite alternate` : 'none',
              opacity: isPlaying ? 0.85 : 0.35,
            }}
          />
        );
      })}

      <style>{`
        @keyframes waveBar {
          0% { height: 18%; }
          50% { height: 95%; }
          100% { height: 35%; }
        }
      `}</style>
    </div>
  );
};
