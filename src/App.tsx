import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { PriorityDeck } from './components/PriorityDeck';
import { TimerDisplay } from './components/TimerDisplay';
import { FloatingDock } from './components/FloatingDock';
import { StatsModal } from './components/StatsModal';
import { SoundscapesDrawer } from './components/SoundscapesDrawer';
import { AIStudyCompanion } from './components/AIStudyCompanion';
import { SettingsModal } from './components/SettingsModal';
import { CookieConsent } from './components/CookieConsent';
import { WaterWave } from './components/WaterWave';
import { GooeyFilter } from './components/GooeyFilter';

import { getThemeConfig } from './theme/themeConfig';
import { storage } from './services/storage';
import { soundEngine } from './services/soundEngine';
import { 
  TimerMode, 
  Task, 
  Project, 
  TaskPriority, 
  UserSettings, 
  UserStats, 
  SoundType 
} from './types';

export const App: React.FC = () => {
  // --- Persistent State ---
  const [settings, setSettings] = useState<UserSettings>(() => storage.getSettings());
  const [tasks, setTasks] = useState<Task[]>(() => storage.getTasks());
  const [projects, setProjects] = useState<Project[]>(() => storage.getProjects());
  const [stats, setStats] = useState<UserStats>(() => storage.getStats());
  const [cookieConsent, setCookieConsent] = useState<boolean>(() => storage.getCookieConsent());

  // --- Screen State: 'deck' | 'timer' ---
  const [activeScreen, setActiveScreen] = useState<'deck' | 'timer'>('deck');
  const [mode, setMode] = useState<TimerMode>('focus');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(() => settings.focusMinutes * 60);
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [activePriority, setActivePriority] = useState<TaskPriority>(1);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // --- Toast Notification for Cheer Pills ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Audio & Modals State ---
  const [activeSound, setActiveSound] = useState<SoundType>('none');
  const [soundVolume, setSoundVolume] = useState<number>(0.5);
  const [customStreamUrl, setCustomStreamUrl] = useState<string>('');

  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSoundscapesOpen, setIsSoundscapesOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync settings helper
  const updateSettings = (newPartial: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newPartial };
      storage.saveSettings(updated);
      return updated;
    });
  };

  const theme = getThemeConfig(settings.theme, settings.isDarkMode);

  // Sync document dark class
  useEffect(() => {
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.isDarkMode]);

  // Calculate current mode duration in seconds
  const getDurationForMode = useCallback(
    (targetMode: TimerMode) => {
      switch (targetMode) {
        case 'focus':
          return settings.focusMinutes * 60;
        case 'shortBreak':
          return settings.shortBreakMinutes * 60;
        case 'longBreak':
          return settings.longBreakMinutes * 60;
      }
    },
    [settings.focusMinutes, settings.shortBreakMinutes, settings.longBreakMinutes]
  );

  // Trigger celebration confetti
  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#FF5335', '#4E3696', '#F8C8BA', '#C6D2FD'],
    });
  };

  // Timer completion handler
  const handleSessionComplete = useCallback(() => {
    soundEngine.playCompletionChime();
    triggerCelebration();

    if (mode === 'focus') {
      const updatedStats = storage.recordCompletedSession({
        date: new Date().toISOString().split('T')[0],
        minutes: settings.focusMinutes,
        mode: 'focus',
        taskId: activeTask?.id,
        taskTitle: activeTask?.title || 'Project research',
        projectName: 'Deep Focus',
      });
      setStats(updatedStats);

      // Increment task pomodoro count
      if (activeTask) {
        setTasks((prev) => {
          const updated = prev.map((t) =>
            t.id === activeTask.id
              ? { ...t, completedPomodoros: t.completedPomodoros + 1 }
              : t
          );
          storage.saveTasks(updated);
          return updated;
        });
      }

      const nextCount = sessionCount + 1;
      setSessionCount(nextCount);

      // Switch to break mode
      const nextBreakMode = nextCount % settings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak';
      setMode(nextBreakMode);
      setTimeLeft(getDurationForMode(nextBreakMode));
      setIsRunning(settings.autoStartBreaks);
    } else {
      // Break finished, return to focus mode
      setMode('focus');
      setTimeLeft(settings.focusMinutes * 60);
      setIsRunning(settings.autoStartPomodoros);
    }
  }, [
    mode,
    activeTask,
    sessionCount,
    settings.focusMinutes,
    settings.longBreakInterval,
    settings.autoStartBreaks,
    settings.autoStartPomodoros,
    getDurationForMode,
  ]);

  // Main Timer Interval Loop
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSessionComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, handleSessionComplete]);

  // Start a specific task from Priority Deck
  const handleStartTask = (task: Task) => {
    soundEngine.playTickHaptic();
    setActiveTask(task);
    setMode('focus');
    setTimeLeft(settings.focusMinutes * 60);
    setIsRunning(true);
    setActiveScreen('timer');

    if (activeSound !== 'none') {
      soundEngine.playSoundscape(activeSound, soundVolume, customStreamUrl);
    }
  };

  // Exit back to Priority Deck
  const handleExitToDeck = () => {
    soundEngine.playTickHaptic();
    setIsRunning(false);
    setActiveScreen('deck');
  };

  // Handle Play/Pause
  const handleTogglePlay = () => {
    soundEngine.playTickHaptic();
    setIsRunning(!isRunning);

    if (!isRunning && activeSound !== 'none') {
      soundEngine.playSoundscape(activeSound, soundVolume, customStreamUrl);
    }
  };

  // Handle Reset
  const handleReset = () => {
    soundEngine.playTickHaptic();
    setIsRunning(false);
    setTimeLeft(getDurationForMode(mode));
  };

  // Handle Skip
  const handleSkip = () => {
    soundEngine.playTickHaptic();
    handleSessionComplete();
  };

  // Cheer Interaction (Screenshot 1)
  const handleCheer = (message: string) => {
    soundEngine.playTickHaptic();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#F8C8BA', '#FF5335', '#FFFFFF'],
    });
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Handle Soundscape Change
  const handleSelectSound = (sound: SoundType) => {
    soundEngine.playTickHaptic();
    setActiveSound(sound);
    soundEngine.playSoundscape(sound, soundVolume, customStreamUrl);
  };

  const handleVolumeChange = (vol: number) => {
    setSoundVolume(vol);
    soundEngine.setVolume(vol);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleSkip();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleExitToDeck();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, mode, activeScreen]);

  // Tasks Management
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'completedPomodoros' | 'isCompleted' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: 'task-' + Date.now(),
      completedPomodoros: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => {
      const updated = [newTask, ...prev];
      storage.saveTasks(updated);
      return updated;
    });
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === updatedTask.id ? updatedTask : t));
      storage.saveTasks(updated);
      return updated;
    });
    if (activeTask?.id === updatedTask.id) {
      setActiveTask(updatedTask);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== taskId);
      storage.saveTasks(updated);
      return updated;
    });
    if (activeTask?.id === taskId) {
      setActiveTask(null);
    }
  };

  // Service Worker Registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('./sw.js')
        .catch((err) => console.warn('SW notice:', err));
    }
  }, []);

  const totalDuration = getDurationForMode(mode);
  const isFocusMode = activeScreen === 'timer' && mode === 'focus';
  const isBreakMode = activeScreen === 'timer' && mode !== 'focus';

  // Dynamic Full-Screen Background based on Active Screen
  const getScreenBg = () => {
    if (isFocusMode) {
      return 'bg-gradient-to-b from-[#4E3696] to-[#3B2479] text-white';
    }
    if (isBreakMode) {
      return settings.isDarkMode ? 'bg-[#1A1429] text-white' : 'bg-[#FFFFFF] text-[#251E35]';
    }
    // Deck screen
    return settings.isDarkMode ? 'bg-[#120E24] text-white' : 'bg-[#FDECE7] text-[#251E35]';
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-between transition-colors duration-700 relative overflow-x-hidden ${getScreenBg()}`}
    >
      {/* Aaron Iker Liquid Gooey & Water Caustics Filters */}
      <GooeyFilter />

      {/* Real-time Full-Screen Ambient Fluid Wave Layer (Focus Mode) */}
      {isFocusMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25 z-0">
          <WaterWave
            progress={totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0}
            color="#FFFFFF"
            isPaused={!isRunning}
          />
        </div>
      )}

      {/* Toast Notification for Interactive Cheering */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-fadeIn pointer-events-none">
          <div className="px-6 py-3 rounded-full bg-black/85 text-white backdrop-blur-md shadow-2xl text-xs sm:text-sm font-bold tracking-wide flex items-center gap-2 border border-white/10">
            <span>✨</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Liquid Screen Transition Viewport */}
      <div className="w-full flex-1 flex flex-col justify-between z-10">
        <AnimatePresence mode="wait">
          {activeScreen === 'deck' ? (
            <motion.div
              key="screen-deck"
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex-1 flex flex-col justify-between"
            >
              <PriorityDeck
                userName={settings.userName}
                isDarkMode={settings.isDarkMode}
                tasks={tasks}
                projects={projects}
                activePriority={activePriority}
                onSelectPriority={setActivePriority}
                onStartTask={handleStartTask}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="screen-timer"
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex-1 flex flex-col justify-between"
            >
              <TimerDisplay
                userName={settings.userName}
                mode={mode}
                timeLeft={timeLeft}
                totalDuration={totalDuration}
                isRunning={isRunning}
                activeTask={activeTask}
                onTogglePlay={handleTogglePlay}
                onReset={handleReset}
                onSkip={handleSkip}
                onExitToDeck={handleExitToDeck}
                onCheer={handleCheer}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ambient Floating Controls Dock (Sound, Stats, AI, Dark/Light, Settings) */}
      <FloatingDock
        soundPlaying={activeSound !== 'none'}
        isDarkMode={settings.isDarkMode}
        onOpenSoundscapes={() => setIsSoundscapesOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleDarkMode={() => updateSettings({ isDarkMode: !settings.isDarkMode })}
      />

      {/* Modals & Drawers */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        theme={theme}
        stats={stats}
      />

      <SoundscapesDrawer
        isOpen={isSoundscapesOpen}
        onClose={() => setIsSoundscapesOpen(false)}
        theme={theme}
        activeSound={activeSound}
        volume={soundVolume}
        customStreamUrl={customStreamUrl}
        onSelectSound={handleSelectSound}
        onVolumeChange={handleVolumeChange}
        onCustomStreamChange={setCustomStreamUrl}
      />

      <AIStudyCompanion
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        theme={theme}
        userName={settings.userName}
        onApplyPreset={(preset, minutes) => {
          updateSettings({ preset, focusMinutes: minutes });
          setTimeLeft(minutes * 60);
          setIsAIOpen(false);
        }}
        onAddSubtasks={(subtaskTitles) => {
          const newTasksList: Task[] = subtaskTitles.map((title, i) => ({
            id: `ai-task-${Date.now()}-${i}`,
            title,
            projectId: 'proj-1',
            priority: activePriority,
            estPomodoros: 1,
            completedPomodoros: 0,
            isCompleted: false,
            createdAt: new Date().toISOString(),
          }));
          setTasks((prev) => {
            const updated = [...newTasksList, ...prev];
            storage.saveTasks(updated);
            return updated;
          });
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      {/* Discreet Local Storage Privacy Banner */}
      <CookieConsent
        isVisible={!cookieConsent}
        theme={theme}
        onAccept={() => {
          storage.setCookieConsent(true);
          setCookieConsent(true);
        }}
      />
    </div>
  );
};
