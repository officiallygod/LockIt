import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, Eye, EyeOff, Sparkles, Coffee } from 'lucide-react';
import { ThemeConfig } from '../theme/themeConfig';
import { TimerMode } from '../types';
import { WaterWave } from './WaterWave';
import { ClockTicks } from './ClockTicks';
import { MorphingBlob } from './MorphingBlob';

interface TimerDisplayProps {
  theme: ThemeConfig;
  userName: string;
  mode: TimerMode;
  timeLeft: number;
  totalDuration: number;
  isRunning: boolean;
  sessionCount: number;
  maxSessionsBeforeLongBreak: number;
  zenMode: boolean;
  intention: string;
  onIntentionChange: (text: string) => void;
  onTogglePlay: () => void;
  onReset: () => void;
  onSkip: () => void;
  onModeSelect: (mode: TimerMode) => void;
  onToggleZen: () => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  theme,
  userName,
  mode,
  timeLeft,
  totalDuration,
  isRunning,
  sessionCount,
  maxSessionsBeforeLongBreak,
  zenMode,
  intention,
  onIntentionChange,
  onTogglePlay,
  onReset,
  onSkip,
  onModeSelect,
  onToggleZen,
}) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;

  // Personalized dynamic encouragement based on mode and progress
  const getEncouragement = () => {
    if (mode === 'shortBreak') {
      return `Take a break, ${userName}! ☕`;
    }
    if (mode === 'longBreak') {
      return `Recharge & refresh, ${userName}! 🌿`;
    }
    if (progress < 0.25) {
      return `Focus on a process, ${userName}!`;
    } else if (progress < 0.7) {
      return `Come on, ${userName} 🤗`;
    } else {
      return `Step on it, ${userName}! 💪`;
    }
  };

  const isBreak = mode !== 'focus';

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center justify-center pt-2 pb-6 px-4">
      {/* Mode Switcher Tabs with Fluid Spring Pill */}
      <div className="flex items-center gap-1 p-1.5 rounded-full bg-black/5 dark:bg-white/10 mb-6 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-inner">
        {(['focus', 'shortBreak', 'longBreak'] as TimerMode[]).map((tabMode) => {
          const isSelected = mode === tabMode;
          const labels = {
            focus: 'Focus',
            shortBreak: 'Short Break',
            longBreak: 'Long Break',
          };

          return (
            <motion.button
              key={tabMode}
              whileTap={{ scale: 0.95 }}
              onClick={() => onModeSelect(tabMode)}
              className={`relative px-4 py-2 rounded-full text-xs font-black tracking-wide transition-all z-10 ${
                isSelected
                  ? `${theme.primary} ${theme.primaryText} shadow-md`
                  : `${theme.textMuted} hover:${theme.textColor}`
              }`}
            >
              {labels[tabMode]}
            </motion.button>
          );
        })}
      </div>

      {/* Main Fluid Glass Timer Card */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`relative w-full rounded-[44px] overflow-hidden p-8 flex flex-col items-center justify-center border transition-all duration-500 shadow-2xl backdrop-blur-2xl ${theme.cardBg} ${theme.cardBorder}`}
        style={{ minHeight: '400px' }}
      >
        {/* Real-time Fluid Water Wave Background (Focus Mode) */}
        {!isBreak && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-45">
            <WaterWave
              progress={progress}
              color={theme.waveColor}
              isPaused={!isRunning}
            />
          </div>
        )}

        {/* Top Micro-Intention Pill */}
        <div className="relative z-10 w-full max-w-xs mb-4">
          <input
            type="text"
            placeholder={
              isBreak
                ? `Resting deeply... 🍵`
                : `What are you locking in for, ${userName}?`
            }
            value={intention}
            onChange={(e) => onIntentionChange(e.target.value)}
            disabled={isBreak}
            className={`w-full text-center text-xs sm:text-sm font-bold py-2.5 px-4 rounded-full bg-black/5 dark:bg-white/10 border border-transparent focus:border-terracotta/40 outline-none transition-all placeholder:text-muted-foreground/60 shadow-inner ${theme.textColor}`}
          />
        </div>

        {/* Motivational Header */}
        <div className="relative z-10 text-center mb-1">
          <motion.p
            key={getEncouragement()}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm sm:text-base font-black tracking-wide ${theme.textColor}`}
          >
            {getEncouragement()}
          </motion.p>
        </div>

        {/* Break Mode: Organic Morphing Pebble (Directly inspired by Image 5) */}
        {isBreak ? (
          <div className="relative z-10 my-3">
            <MorphingBlob
              color={theme.waveColor}
              secondaryColor={theme.blobColors[1]}
              size="md"
            >
              <div className="text-white select-none">
                <Coffee size={28} className="mx-auto mb-2 opacity-90 animate-bounce" />
                <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight leading-none drop-shadow-sm">
                  <span>{String(minutes).padStart(2, '0')}</span>
                  <span className="opacity-60 animate-pulse">:</span>
                  <span>{String(seconds).padStart(2, '0')}</span>
                </div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/80 mt-2">
                  Breathe & Stretch
                </p>
              </div>
            </MorphingBlob>
          </div>
        ) : (
          /* Focus Mode: Digital Time Display & Clock Ticks */
          <div className="relative z-10 my-2 text-center select-none flex flex-col items-center">
            {zenMode ? (
              <div className="flex flex-col items-center py-4">
                <div
                  className="w-24 h-24 rounded-full border-4 flex items-center justify-center animate-gentle-pulse shadow-lg"
                  style={{ borderColor: theme.waveColor }}
                >
                  <div
                    className="w-16 h-16 rounded-full opacity-70 animate-ping"
                    style={{ backgroundColor: theme.waveColor }}
                  />
                </div>
                <p className={`text-xs mt-4 font-black uppercase tracking-widest ${theme.textMuted}`}>
                  {minutes}m in deep flow
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className={`text-7xl sm:text-8xl font-black tracking-tighter ${theme.textColor} font-mono leading-none drop-shadow-sm`}
              >
                <span>{String(minutes).padStart(2, '0')}</span>
                <span className="opacity-40 animate-pulse">:</span>
                <span>{String(seconds).padStart(2, '0')}</span>
              </motion.div>
            )}

            {/* Session Indicator */}
            <p className={`text-xs sm:text-sm font-semibold mt-2.5 ${theme.textMuted}`}>
              session {(sessionCount % maxSessionsBeforeLongBreak) + 1} of {maxSessionsBeforeLongBreak} today
            </p>

            {/* Clock Ticks Arc */}
            <div className="my-1">
              <ClockTicks progress={progress} color={theme.waveColor} />
            </div>
          </div>
        )}

        {/* Primary Tactile Controls */}
        <div className="relative z-10 flex items-center gap-5 mt-4">
          {/* Reset button */}
          <motion.button
            whileHover={{ scale: 1.15, rotate: -25 }}
            whileTap={{ scale: 0.9 }}
            onClick={onReset}
            className={`p-3.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all shadow-sm ${theme.textColor}`}
            title="Reset timer (R)"
          >
            <RotateCcw size={17} />
          </motion.button>

          {/* Giant Round Play/Pause Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={onTogglePlay}
            className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${theme.primary} ${theme.primaryHover} ${theme.primaryText}`}
            style={{
              boxShadow: `0 12px 30px -8px ${theme.waveColor}65`,
            }}
            title="Start / Pause (Space)"
          >
            {isRunning ? (
              <Pause size={30} className="fill-current" />
            ) : (
              <Play size={30} className="fill-current ml-1" />
            )}
          </motion.button>

          {/* Skip button */}
          <motion.button
            whileHover={{ scale: 1.15, x: 3 }}
            whileTap={{ scale: 0.9 }}
            onClick={onSkip}
            className={`p-3.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all shadow-sm ${theme.textColor}`}
            title="Skip to next session (S)"
          >
            <SkipForward size={17} />
          </motion.button>
        </div>

        {/* Zen Mode Toggle Pill */}
        <div className="relative z-10 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleZen}
            className="flex items-center gap-1.5 text-[11px] font-bold px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all opacity-80"
            title="Toggle Zen Mode"
          >
            {zenMode ? <Eye size={13} /> : <EyeOff size={13} />}
            <span>{zenMode ? 'Show countdown' : 'Zen breathing mode'}</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
