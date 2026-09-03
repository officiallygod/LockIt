import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BarChart2, Volume2, VolumeX, Settings, Download, Sun, Moon } from 'lucide-react';
import { ThemeConfig } from '../theme/themeConfig';
import { TimerMode } from '../types';

interface NavbarProps {
  theme: ThemeConfig;
  userName: string;
  mode: TimerMode;
  isActive: boolean;
  isDarkMode: boolean;
  soundPlaying: boolean;
  onToggleDarkMode: () => void;
  onOpenSoundscapes: () => void;
  onOpenStats: () => void;
  onOpenAI: () => void;
  onOpenSettings: () => void;
  canInstallPwa: boolean;
  onInstallPwa: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  userName,
  mode,
  isActive,
  isDarkMode,
  soundPlaying,
  onToggleDarkMode,
  onOpenSoundscapes,
  onOpenStats,
  onOpenAI,
  onOpenSettings,
  canInstallPwa,
  onInstallPwa,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', emoji: '☀️' };
    if (hour < 18) return { text: 'Good afternoon', emoji: '🌤️' };
    return { text: 'Good evening', emoji: '🌙' };
  };

  const greeting = getGreeting();

  const getModeLabel = () => {
    switch (mode) {
      case 'focus':
        return 'Deep Focus';
      case 'shortBreak':
        return 'Rest & Stretch';
      case 'longBreak':
        return 'Full Recovery';
    }
  };

  return (
    <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between z-30 transition-colors duration-300">
      {/* Brand & Personalized Friendly Greeting */}
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.08, rotate: [0, -5, 5, 0] }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-white/80 shadow-md border border-black/5 dark:bg-white/10 dark:border-white/10 backdrop-blur-md overflow-hidden cursor-pointer"
        >
          <img src="./logo.svg" alt="LockIt" className="w-7 h-7 object-contain" />
        </motion.div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-base sm:text-lg font-black tracking-tight ${theme.textColor}`}>
              LockIt
            </h1>
            {isActive && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md">
                <span
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: theme.dotColor }}
                />
                <span style={{ color: theme.dotColor }}>FLOW</span>
              </span>
            )}
          </div>
          <p className={`text-xs ${theme.textMuted} font-medium flex items-center gap-1`}>
            <span>{greeting.text}, {userName}</span>
            <span>{greeting.emoji}</span>
            <span className="opacity-40 hidden sm:inline">•</span>
            <span className="hidden sm:inline font-semibold">{getModeLabel()}</span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* PWA Install Button */}
        {canInstallPwa && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onInstallPwa}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-all text-terracotta shadow-sm"
            title="Install LockIt as an App"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Install</span>
          </motion.button>
        )}

        {/* Dedicated Dark / Light Mode Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onToggleDarkMode}
          className={`p-2.5 rounded-full transition-all duration-300 shadow-sm bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 ${theme.textColor}`}
          title={isDarkMode ? 'Switch to Gentle Light Mode' : 'Switch to Midnight Dark Mode'}
        >
          {isDarkMode ? (
            <Sun size={18} className="text-amber-400 fill-amber-400/20 rotate-0 transition-transform duration-500" />
          ) : (
            <Moon size={18} className="text-slate-700 fill-slate-700/20 rotate-0 transition-transform duration-500" />
          )}
        </motion.button>

        {/* AI Study Coach */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onOpenAI}
          className={`p-2.5 rounded-full transition-all duration-300 shadow-sm bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 ${theme.textColor}`}
          title="Smart AI Study Companion & Goal Decomposer"
        >
          <Sparkles size={18} className="text-amber-500" />
        </motion.button>

        {/* Soundscapes Drawer */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onOpenSoundscapes}
          className={`relative p-2.5 rounded-full transition-all duration-300 shadow-sm bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 ${theme.textColor}`}
          title="Relaxing Biophilic Sounds & NCS Beats"
        >
          {soundPlaying ? (
            <>
              <Volume2 size={18} style={{ color: theme.waveColor }} />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: theme.dotColor }}
              />
            </>
          ) : (
            <VolumeX size={18} className="opacity-60" />
          )}
        </motion.button>

        {/* Analytics & Heatmap */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onOpenStats}
          className={`p-2.5 rounded-full transition-all duration-300 shadow-sm bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 ${theme.textColor}`}
          title="View Focus Log & Consistency Heatmap"
        >
          <BarChart2 size={18} />
        </motion.button>

        {/* Settings & Themes */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onOpenSettings}
          className={`p-2.5 rounded-full transition-all duration-300 shadow-sm bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 ${theme.textColor}`}
          title="Preferences, Sound & Durations"
        >
          <Settings size={18} />
        </motion.button>
      </div>
    </header>
  );
};
