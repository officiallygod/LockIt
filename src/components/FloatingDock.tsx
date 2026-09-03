import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, BarChart2, Sparkles, Sun, Moon, Settings } from 'lucide-react';

interface FloatingDockProps {
  soundPlaying: boolean;
  isDarkMode: boolean;
  onOpenSoundscapes: () => void;
  onOpenStats: () => void;
  onOpenAI: () => void;
  onOpenSettings: () => void;
  onToggleDarkMode: () => void;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  soundPlaying,
  isDarkMode,
  onOpenSoundscapes,
  onOpenStats,
  onOpenAI,
  onOpenSettings,
  onToggleDarkMode,
}) => {
  return (
    <div className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-[#1E1733]/80 backdrop-blur-xl border border-black/5 dark:border-white/15 shadow-xl select-none"
      >
        {/* Soundscapes quick toggle */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenSoundscapes}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#251E35] dark:text-white transition-all relative"
          title="Soundscapes & Audio"
        >
          {soundPlaying ? (
            <>
              <Volume2 size={17} className="text-[#FF5335]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FF5335] animate-ping" />
            </>
          ) : (
            <VolumeX size={17} className="opacity-60" />
          )}
        </motion.button>

        <span className="w-[1px] h-4 bg-black/10 dark:bg-white/15" />

        {/* Stats & Heatmap */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenStats}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#251E35] dark:text-white transition-all"
          title="Focus Stats & Consistency Heatmap"
        >
          <BarChart2 size={17} />
        </motion.button>

        {/* AI Study Coach */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenAI}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-amber-500 transition-all"
          title="AI Goal Decomposer"
        >
          <Sparkles size={17} />
        </motion.button>

        <span className="w-[1px] h-4 bg-black/10 dark:bg-white/15" />

        {/* Light / Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleDarkMode}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#251E35] dark:text-white transition-all"
          title="Toggle Light / Dark Mode"
        >
          {isDarkMode ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
        </motion.button>

        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenSettings}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#251E35] dark:text-white transition-all"
          title="Settings & Time Intervals"
        >
          <Settings size={17} />
        </motion.button>
      </motion.div>
    </div>
  );
};
