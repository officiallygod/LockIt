import React from 'react';
import { motion } from 'framer-motion';
import { X, Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { TimerMode, Task } from '../types';
import { ClockTicks } from './ClockTicks';
import { MorphingBlob } from './MorphingBlob';

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
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const isBreak = mode !== 'focus';

  const taskTitle = activeTask?.title || 'Project research';

  // State 2: Deep Focus Mode (Screenshot 1 & Full-screen Desktop)
  if (!isBreak) {
    return (
      <div className="w-full h-full flex flex-col justify-between max-w-5xl mx-auto px-6 sm:px-12 py-6 sm:py-10 select-none">
        {/* Top Task Pill with (X) Exit button (Screenshot 1) */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-md rounded-full bg-white/15 hover:bg-white/20 backdrop-blur-md border border-white/15 px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-sm transition-all">
            <span className="text-xs sm:text-sm md:text-base font-semibold text-white/90 truncate max-w-[280px]">
              {taskTitle}
            </span>
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.85 }}
              onClick={onExitToDeck}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#4E3696] shadow-sm ml-2 shrink-0 cursor-pointer"
              title="Return to Priorities"
            >
              <X size={16} className="stroke-[2.5]" />
            </motion.button>
          </div>
        </div>

        {/* Motivational Greeting & Giant Timer with spacious vertical breathing room */}
        <div className="text-center my-auto py-6 sm:py-12">
          <p className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-white/90">
            Focus on a process
          </p>
          <p className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F8C8BA] tracking-tight mt-1 sm:mt-2">
            {userName}!
          </p>

          {/* Giant Minimalist Timer (Screenshot 1: "0:01") */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onTogglePlay}
            className="cursor-pointer py-4 sm:py-8 md:py-12 my-2 flex items-center justify-center select-none"
            title="Click anywhere on time to Pause / Resume"
          >
            <span className="text-8xl sm:text-9xl md:text-[11rem] lg:text-[12rem] font-bold font-sans tracking-tight text-white drop-shadow-sm leading-none">
              {minutes}:{String(seconds).padStart(2, '0')}
            </span>
          </motion.div>

          {/* Curved Clock Tick Marks (Screenshot 1) */}
          <div className="w-full flex justify-center -mt-2 sm:-mt-4 mb-6 sm:mb-8">
            <ClockTicks progress={progress} color="#FFFFFF" />
          </div>

          {/* Cheering Pills with comfortable padding (Screenshot 1) */}
          <div className="flex flex-col items-center gap-3 sm:gap-4 mt-2">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onCheer(`Come on, ${userName}! You've got this! 🤗`)}
              className="px-8 sm:px-10 py-3 sm:py-3.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-sm sm:text-base font-semibold text-white shadow-md transition-all border border-white/15"
            >
              Come on, {userName} 🤗
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onCheer(`Step on it, ${userName}! Pure flow momentum! 💪`)}
              className="px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium text-white/50 hover:text-white/90 transition-all"
            >
              Step on it! 💪
            </motion.button>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="flex items-center justify-center gap-8 sm:gap-10 pt-4 pb-2 text-white/70">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.85 }}
            onClick={onReset}
            className="p-2.5 rounded-full hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            title="Reset (R)"
          >
            <RotateCcw size={18} className="sm:w-5 sm:h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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
            whileHover={{ scale: 1.2 }}
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
              {minutes}:{String(seconds).padStart(2, '0')}
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
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.85 }}
          onClick={onReset}
          className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer"
          title="Reset"
        >
          <RotateCcw size={18} className="sm:w-5 sm:h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
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
          whileHover={{ scale: 1.2 }}
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
