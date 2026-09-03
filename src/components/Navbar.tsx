import React from 'react';
import { Sparkles, BarChart2, Volume2, VolumeX, Settings, Download } from 'lucide-react';
import { ThemeConfig } from '../theme/themeConfig';
import { TimerMode } from '../types';

interface NavbarProps {
  theme: ThemeConfig;
  userName: string;
  mode: TimerMode;
  isActive: boolean;
  soundPlaying: boolean;
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
  soundPlaying,
  onOpenSoundscapes,
  onOpenStats,
  onOpenAI,
  onOpenSettings,
  canInstallPwa,
  onInstallPwa,
}) => {
  const getModeLabel = () => {
    switch (mode) {
      case 'focus':
        return 'FOCUS';
      case 'shortBreak':
        return 'REST';
      case 'longBreak':
        return 'RECOVERY';
    }
  };

  return (
    <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between z-30">
      {/* Brand & Personalized greeting */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-white/70 shadow-sm border border-black/5 dark:bg-white/10 overflow-hidden">
          <img src="/logo.svg" alt="LockIt" className="w-6 h-6 object-contain" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className={`text-base sm:text-lg font-extrabold tracking-tight ${theme.textColor}`}>
              LockIt
            </h1>
            {isActive && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: theme.dotColor }} />
                <span>LIVE</span>
              </span>
            )}
          </div>
          <p className={`text-xs ${theme.textMuted} font-medium`}>
            Time to <span className="font-semibold uppercase tracking-wider">{getModeLabel()}</span>, {userName}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* PWA Install Button */}
        {canInstallPwa && (
          <button
            onClick={onInstallPwa}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-all text-terracotta"
            title="Install LockIt App"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Install</span>
          </button>
        )}

        {/* AI Study Coach */}
        <button
          onClick={onOpenAI}
          className={`p-2.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 bg-black/5 dark:bg-white/10 ${theme.textColor}`}
          title="Smart AI Study Companion"
        >
          <Sparkles size={18} className="text-amber-500" />
        </button>

        {/* Soundscapes Drawer */}
        <button
          onClick={onOpenSoundscapes}
          className={`relative p-2.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 bg-black/5 dark:bg-white/10 ${theme.textColor}`}
          title="Relaxing Soundscapes & Music"
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
        </button>

        {/* Analytics & Heatmap */}
        <button
          onClick={onOpenStats}
          className={`p-2.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 bg-black/5 dark:bg-white/10 ${theme.textColor}`}
          title="View Stats & Habit Heatmap"
        >
          <BarChart2 size={18} />
        </button>

        {/* Settings & Themes */}
        <button
          onClick={onOpenSettings}
          className={`p-2.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 bg-black/5 dark:bg-white/10 ${theme.textColor}`}
          title="Preferences & Themes"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};
