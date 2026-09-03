import React from 'react';
import { Play, Pause, RotateCcw, SkipForward, Eye, EyeOff } from 'lucide-react';
import { ThemeConfig } from '../theme/themeConfig';
import { TimerMode } from '../types';
import { WaterWave } from './WaterWave';
import { ClockTicks } from './ClockTicks';

interface TimerDisplayProps {
  theme: ThemeConfig;
  userName: string;
  mode: TimerMode;
  timeLeft: number; // in seconds
  totalDuration: number; // in seconds
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
    if (mode !== 'focus') {
      return `Take a break, ${userName}! ☕`;
    }
    if (progress < 0.25) {
      return `Focus on a process, ${userName}!`;
    } else if (progress < 0.7) {
      return `Come on, ${userName} 🤗`;
    } else {
      return `Step on it, ${userName}! 💪`;
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center justify-center pt-2 pb-6 px-4">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-full bg-black/5 dark:bg-white/10 mb-6 backdrop-blur-md">
        <button
          onClick={() => onModeSelect('focus')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${
            mode === 'focus'
              ? `${theme.primary} ${theme.primaryText} shadow-sm`
              : `${theme.textMuted} hover:${theme.textColor}`
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => onModeSelect('shortBreak')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${
            mode === 'shortBreak'
              ? `${theme.primary} ${theme.primaryText} shadow-sm`
              : `${theme.textMuted} hover:${theme.textColor}`
          }`}
        >
          Short Break
        </button>
        <button
          onClick={() => onModeSelect('longBreak')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${
            mode === 'longBreak'
              ? `${theme.primary} ${theme.primaryText} shadow-sm`
              : `${theme.textMuted} hover:${theme.textColor}`
          }`}
        >
          Long Break
        </button>
      </div>

      {/* Main Fluid Glass Timer Card */}
      <div
        className={`relative w-full rounded-[40px] overflow-hidden p-8 flex flex-col items-center justify-center border transition-all duration-500 shadow-xl ${theme.cardBg} ${theme.cardBorder}`}
        style={{ minHeight: '380px' }}
      >
        {/* Real-time Water Wave layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <WaterWave
            progress={progress}
            color={theme.waveColor}
            isPaused={!isRunning}
          />
        </div>

        {/* Top Micro-intention badge */}
        <div className="relative z-10 w-full max-w-xs mb-4">
          <input
            type="text"
            placeholder={`What are you locking in for, ${userName}?`}
            value={intention}
            onChange={(e) => onIntentionChange(e.target.value)}
            className={`w-full text-center text-xs sm:text-sm font-semibold py-2 px-4 rounded-full bg-black/5 dark:bg-white/10 border border-transparent focus:border-terracotta/40 outline-none transition-all placeholder:text-muted-foreground/60 ${theme.textColor}`}
          />
        </div>

        {/* Motivational Header */}
        <div className="relative z-10 text-center mb-1">
          <p className={`text-sm sm:text-base font-bold tracking-wide ${theme.textColor}`}>
            {getEncouragement()}
          </p>
        </div>

        {/* Digital Time Display (Extra Large Editorial Typography) */}
        <div className="relative z-10 my-2 text-center select-none">
          {zenMode ? (
            <div className="flex flex-col items-center py-4">
              <span
                className="w-20 h-20 rounded-full border-4 flex items-center justify-center animate-gentle-pulse"
                style={{ borderColor: theme.waveColor }}
              >
                <span
                  className="w-12 h-12 rounded-full opacity-60"
                  style={{ backgroundColor: theme.waveColor }}
                />
              </span>
              <p className={`text-xs mt-3 font-semibold uppercase tracking-widest ${theme.textMuted}`}>
                {minutes}m in flow
              </p>
            </div>
          ) : (
            <div className={`text-7xl sm:text-8xl font-black tracking-tighter ${theme.textColor} font-mono leading-none`}>
              <span>{String(minutes).padStart(2, '0')}</span>
              <span className="opacity-40 animate-pulse">:</span>
              <span>{String(seconds).padStart(2, '0')}</span>
            </div>
          )}

          {/* Session Progress info */}
          <p className={`text-xs sm:text-sm font-medium mt-2 ${theme.textMuted}`}>
            session {(sessionCount % maxSessionsBeforeLongBreak) + 1} of {maxSessionsBeforeLongBreak} today
          </p>
        </div>

        {/* Clock Ticks Dial Arc */}
        <div className="relative z-10 my-1">
          <ClockTicks progress={progress} color={theme.waveColor} />
        </div>

        {/* Primary Tactile Play / Pause Controller */}
        <div className="relative z-10 flex items-center gap-5 mt-4">
          {/* Reset button */}
          <button
            onClick={onReset}
            className={`p-3 rounded-full bg-black/5 dark:bg-white/10 hover:scale-110 active:scale-95 transition-all ${theme.textColor}`}
            title="Reset timer (R)"
          >
            <RotateCcw size={16} />
          </button>

          {/* Giant Round Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-90 transition-all duration-300 ${theme.primary} ${theme.primaryHover} ${theme.primaryText}`}
            title="Start / Pause (Space)"
          >
            {isRunning ? (
              <Pause size={28} className="fill-current" />
            ) : (
              <Play size={28} className="fill-current ml-1" />
            )}
          </button>

          {/* Skip button */}
          <button
            onClick={onSkip}
            className={`p-3 rounded-full bg-black/5 dark:bg-white/10 hover:scale-110 active:scale-95 transition-all ${theme.textColor}`}
            title="Skip to next session (S)"
          >
            <SkipForward size={16} />
          </button>
        </div>

        {/* Zen Mode Toggle pill */}
        <div className="relative z-10 mt-6">
          <button
            onClick={onToggleZen}
            className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 hover:opacity-80 transition-all opacity-70"
            title="Toggle Zen Mode (hide numbers for peaceful focus)"
          >
            {zenMode ? <Eye size={12} /> : <EyeOff size={12} />}
            <span>{zenMode ? 'Show countdown' : 'Zen mode'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
