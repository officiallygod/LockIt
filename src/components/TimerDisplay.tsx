import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, SkipForward, Coffee } from 'lucide-react';
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

  // State 2: Deep Focus Mode (Screenshot 1 & 2 Center)
  if (!isBreak) {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-[#4E3696] to-[#402B82] text-white flex flex-col justify-between p-6 sm:p-7 select-none overflow-hidden transition-colors duration-500">
        {/* Top Task Pill with (X) Exit button (Screenshot 1) */}
        <div className="pt-2">
          <div className="w-full rounded-full bg-white/15 backdrop-blur-md border border-white/10 px-5 py-2 flex items-center justify-between shadow-sm">
            <span className="text-xs sm:text-sm font-medium text-white/90 truncate max-w-[220px]">
              {taskTitle}
            </span>
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.85 }}
              onClick={onExitToDeck}
              className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#4E3696] shadow-sm ml-2 shrink-0"
              title="Return to Priorities"
            >
              <X size={14} className="stroke-[2.5]" />
            </motion.button>
          </div>
        </div>

        {/* Motivational Greeting (Screenshot 1: "Focus on a process Olivia!") */}
        <div className="text-center my-auto pt-4">
          <p className="text-xl sm:text-2xl font-medium tracking-tight text-white/90">
            Focus on a process
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#F8C8BA] tracking-tight mt-0.5">
            {userName}!
          </p>

          {/* Giant Minimalist Timer (Screenshot 1: "0:01") */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onTogglePlay}
            className="cursor-pointer py-6 sm:py-8 my-2 flex items-center justify-center"
            title="Click to Pause / Resume"
          >
            <span className="text-7xl sm:text-8xl font-black font-sans tracking-tight text-white drop-shadow-sm leading-none">
              {minutes}:{String(seconds).padStart(2, '0')}
            </span>
          </motion.div>

          {/* Curved Clock Tick Marks (Screenshot 1) */}
          <div className="w-full flex justify-center -mt-2 mb-4">
            <ClockTicks progress={progress} color="#FFFFFF" />
          </div>

          {/* Cheering Pills (Screenshot 1: "Come on, Olivia 🤗" and "Step on it! 💪") */}
          <div className="flex flex-col items-center gap-2.5 mt-2">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onCheer(`Come on, ${userName}! You've got this! 🤗`)}
              className="px-6 py-2.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-sm font-medium text-white shadow-sm transition-all border border-white/10"
            >
              Come on, {userName} 🤗
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onCheer(`Step on it, ${userName}! Pure momentum! 💪`)}
              className="px-4 py-1 rounded-full text-xs font-medium text-white/40 hover:text-white/80 transition-all"
            >
              Step on it! 💪
            </motion.button>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="flex items-center justify-center gap-6 pt-2 pb-1 text-white/70">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={onReset}
            className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-all"
            title="Reset (R)"
          >
            <RotateCcw size={16} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onTogglePlay}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all shadow-md"
            title="Play / Pause (Space)"
          >
            {isRunning ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current ml-0.5" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={onSkip}
            className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-all"
            title="Skip to Break (S)"
          >
            <SkipForward size={16} />
          </motion.button>
        </div>
      </div>
    );
  }

  // State 3: Break Mode (Screenshot 2 Right: Organic Blob + "Take a break Olivia!")
  return (
    <div className="relative w-full h-full bg-white dark:bg-[#1A1429] flex flex-col justify-between p-6 sm:p-7 select-none overflow-hidden transition-colors duration-500">
      {/* Top Task Pill with (X) Exit button */}
      <div className="pt-2">
        <div className="w-full rounded-full bg-black/5 dark:bg-white/10 px-5 py-2 flex items-center justify-between shadow-sm">
          <span className="text-xs sm:text-sm font-medium text-[#251E35] dark:text-white truncate max-w-[220px]">
            {taskTitle}
          </span>
          <motion.button
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.85 }}
            onClick={onExitToDeck}
            className="w-7 h-7 rounded-full bg-black/10 dark:bg-white/20 flex items-center justify-center text-[#251E35] dark:text-white shadow-sm ml-2 shrink-0"
            title="Return to Priorities"
          >
            <X size={14} className="stroke-[2.5]" />
          </motion.button>
        </div>
      </div>

      {/* Center: Organic Fluid Blob & Floating Droplet (Screenshot 2 Right) */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto">
        <MorphingBlob color="#FF5238" secondaryColor="#C6D2FD" size="lg">
          <div className="text-white select-none">
            <span className="text-6xl sm:text-7xl font-black font-sans tracking-tight leading-none drop-shadow-sm">
              {minutes}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </MorphingBlob>

        {/* Heading: "Take a break Olivia!" (Screenshot 2 Right) */}
        <div className="text-center mt-6">
          <p className="text-2xl sm:text-3xl font-semibold text-[#251E35] dark:text-white tracking-tight">
            Take a break
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#FF5238] tracking-tight">
            {userName}!
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-center gap-6 pt-2 pb-2 text-[#251E35] dark:text-white/80">
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={onReset}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all"
          title="Reset"
        >
          <RotateCcw size={16} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onTogglePlay}
          className="w-12 h-12 rounded-full bg-[#FF5238] text-white flex items-center justify-center transition-all shadow-lg"
          title="Play / Pause"
        >
          {isRunning ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-0.5" />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={onSkip}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all"
          title="End Break"
        >
          <SkipForward size={16} />
        </motion.button>
      </div>
    </div>
  );
};
