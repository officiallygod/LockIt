import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, SkipForward, Waves, Droplets } from 'lucide-react';
import { TimerMode, Task } from '../types';
import { ClockTicks } from './ClockTicks';
import { MorphingBlob } from './MorphingBlob';
import { BoilingOceanPill } from './BoilingOceanPill';
import { SubmergedLiquidText } from './SubmergedLiquidText';

interface TimerDisplayProps {
  userName: string;
  mode: TimerMode;
  timeLeft: number;
  totalDuration: number;
  isRunning: boolean;
  activeTask: Task | null;
  onTogglePlay: () => void;
  onReset: () => void;
  onSkip: () => void;
  onExitToDeck: () => void;
  onCheer: (text: string) => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  userName,
  mode,
  timeLeft,
  totalDuration,
  isRunning,
  activeTask,
  onTogglePlay,
  onReset,
  onSkip,
  onExitToDeck,
  onCheer,
}) => {
  const [timerStyle, setTimerStyle] = useState<'oceanPill' | 'submergedText'>('oceanPill');
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const isBreak = mode !== 'focus';

  const taskTitle = activeTask?.title || 'Project research';
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // State 2: Deep Focus Mode with Boiling Ocean Wave Pill & Submerged Typography
  if (!isBreak) {
    return (
      <div className="w-full h-full flex flex-col justify-between max-w-5xl mx-auto px-6 sm:px-12 py-6 sm:py-10 select-none">
        {/* Top Task Pill with (X) Exit button + Ocean Style Switcher */}
        <div className="w-full flex items-center justify-between max-w-md mx-auto">
          {/* Style Switcher: Ocean Pill vs Submerged Waves */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
            <button
              onClick={() => setTimerStyle('oceanPill')}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                timerStyle === 'oceanPill' ? 'bg-white text-[#4E3696] shadow-sm' : 'text-white/70 hover:text-white'
              }`}
              title="Ocean Capsule Pill (Media 4)"
            >
              <Droplets size={15} />
            </button>
            <button
              onClick={() => setTimerStyle('submergedText')}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                timerStyle === 'submergedText' ? 'bg-white text-[#4E3696] shadow-sm' : 'text-white/70 hover:text-white'
              }`}
              title="Submerged Liquid Typography (Image 1)"
            >
              <Waves size={15} />
            </button>
          </div>

          {/* Task Title Pill */}
          <div className="flex-1 mx-2.5 rounded-full bg-white/15 hover:bg-white/20 backdrop-blur-md border border-white/15 px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between shadow-sm transition-all">
            <span className="text-xs sm:text-sm font-semibold text-white/90 truncate max-w-[200px] sm:max-w-[260px]">
              {taskTitle}
            </span>
          </div>

          {/* Exit Button */}
          <motion.button
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.85 }}
            onClick={onExitToDeck}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#4E3696] shadow-sm shrink-0 cursor-pointer"
            title="Return to Priorities"
          >
            <X size={16} className="stroke-[2.5]" />
          </motion.button>
        </div>

        {/* Motivational Greeting with spacious breathing room */}
        <div className="text-center my-auto py-2 sm:py-6">
          <p className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-white/90">
            Focus on a process
          </p>
          <p className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F8C8BA] tracking-tight mt-1 sm:mt-2">
            {userName}!
          </p>

          {/* Radial Curved Dial with Center Red/Coral Indicator Dot (Media 1–3) */}
          <div className="relative w-full flex flex-col items-center justify-center mt-3 sm:mt-5 mb-1">
            {/* Center glowing indicator dot (Media 1–3) */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-3.5 h-3.5 rounded-full bg-[#FF5335] shadow-[0_0_14px_#FF5335] mb-1"
            />
            {/* Radial ticks arch */}
            <ClockTicks progress={progress} color="#FFFFFF" />
          </div>

          {/* Dual Ocean Timer Modes: Ocean Capsule Pill OR Submerged Typography */}
          <div className="w-full flex justify-center my-2 sm:my-4">
            <AnimatePresence mode="wait">
              {timerStyle === 'oceanPill' ? (
                <motion.div
                  key="oceanPill"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.3 }}
                >
                  <BoilingOceanPill
                    minutes={minutes}
                    seconds={seconds}
                    isRunning={isRunning}
                    color="#FF5335"
                    onTogglePlay={onTogglePlay}
                    onReset={onReset}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="submergedText"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-lg flex flex-col items-center justify-center"
                >
                  {/* Submerged Liquid Typography (Image 1 Style) */}
                  <SubmergedLiquidText
                    text={timeFormatted}
                    waterColor="#FF5335"
                    aboveColor="#FFFFFF"
                    waterLevelPercent={52}
                    onClick={onTogglePlay}
                  />
                  <p className="text-xs text-white/60 font-medium -mt-2">
                    Tap time to {isRunning ? 'pause' : 'resume'} • Submerged in ocean tide
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cheering Pills with Aaron Iker Liquid Gooey Physics (Screenshot 1) */}
          <div className="flex flex-col items-center gap-3 sm:gap-3.5 mt-4 sm:mt-5">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onCheer(`Come on, ${userName}! You've got this! 🤗`)}
              className="px-8 sm:px-10 py-3 sm:py-3.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-sm sm:text-base font-semibold text-white shadow-md transition-all border border-white/15 cursor-pointer"
            >
              Come on, {userName} 🤗
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onCheer(`Step on it, ${userName}! Pure flow momentum! 💪`)}
              className="px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium text-white/50 hover:text-white/90 transition-all cursor-pointer"
            >
              Step on it! 💪
            </motion.button>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="flex items-center justify-center gap-8 sm:gap-10 pt-4 pb-2 text-white/70">
          <motion.button
            whileHover={{ scale: 1.22 }}
            whileTap={{ scale: 0.85 }}
            onClick={onReset}
            className="p-2.5 rounded-full hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            title="Reset (R)"
          >
            <RotateCcw size={18} className="sm:w-5 sm:h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
            onClick={onTogglePlay}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all shadow-lg cursor-pointer"
            title="Play / Pause (Space)"
          >
            {isRunning ? (
              <Pause size={22} className="fill-current sm:w-6 sm:h-6" />
            ) : (
              <Play size={22} className="fill-current ml-0.5 sm:w-6 sm:h-6" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.22 }}
            whileTap={{ scale: 0.85 }}
            onClick={onSkip}
            className="p-2.5 rounded-full hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            title="Skip to Break (S)"
          >
            <SkipForward size={18} className="sm:w-5 sm:h-5" />
          </motion.button>
        </div>
      </div>
    );
  }

  // State 3: Break Mode (Screenshot 2 Right: Organic Blob + "Take a break Olivia!")
  return (
    <div className="w-full h-full flex flex-col justify-between max-w-5xl mx-auto px-6 sm:px-12 py-6 sm:py-10 select-none">
      {/* Top Task Pill with (X) Exit button */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-md rounded-full bg-black/5 dark:bg-white/10 px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-sm">
          <span className="text-xs sm:text-sm md:text-base font-semibold text-[#251E35] dark:text-white truncate max-w-[280px]">
            {taskTitle}
          </span>
          <motion.button
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.85 }}
            onClick={onExitToDeck}
            className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/20 flex items-center justify-center text-[#251E35] dark:text-white shadow-sm ml-2 shrink-0 cursor-pointer"
            title="Return to Priorities"
          >
            <X size={16} className="stroke-[2.5]" />
          </motion.button>
        </div>
      </div>

      {/* Center: Expansive Organic Fluid Blob & Floating Droplet (Screenshot 2 Right) */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto py-8">
        <MorphingBlob color="#FF5238" secondaryColor="#C6D2FD" size="responsive">
          <div className="text-white select-none">
            <span className="text-7xl sm:text-8xl md:text-9xl font-black font-sans tracking-tight leading-none drop-shadow-sm">
              {timeFormatted}
            </span>
          </div>
        </MorphingBlob>

        {/* Heading: "Take a break Olivia!" (Screenshot 2 Right) */}
        <div className="text-center mt-8 sm:mt-10">
          <p className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#251E35] dark:text-white tracking-tight">
            Take a break
          </p>
          <p className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FF5238] tracking-tight mt-1">
            {userName}!
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-center gap-8 sm:gap-10 pt-4 pb-2 text-[#251E35] dark:text-white/80">
        <motion.button
          whileHover={{ scale: 1.22 }}
          whileTap={{ scale: 0.85 }}
          onClick={onReset}
          className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer"
          title="Reset"
        >
          <RotateCcw size={18} className="sm:w-5 sm:h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          onClick={onTogglePlay}
          className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-[#FF5238] text-white flex items-center justify-center transition-all shadow-xl cursor-pointer"
          title="Play / Pause"
        >
          {isRunning ? (
            <Pause size={24} className="fill-current sm:w-7 sm:h-7" />
          ) : (
            <Play size={24} className="fill-current ml-0.5 sm:w-7 sm:h-7" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.22 }}
          whileTap={{ scale: 0.85 }}
          onClick={onSkip}
          className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer"
          title="End Break"
        >
          <SkipForward size={18} className="sm:w-5 sm:h-5" />
        </motion.button>
      </div>
    </div>
  );
};
