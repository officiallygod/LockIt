import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { TimerDisplay } from './components/TimerDisplay';
import { PriorityDeck } from './components/PriorityDeck';
import { StatsModal } from './components/StatsModal';
import { SoundscapesDrawer } from './components/SoundscapesDrawer';
import { AIStudyCompanion } from './components/AIStudyCompanion';
import { SettingsModal } from './components/SettingsModal';
import { CookieConsent } from './components/CookieConsent';
import { Footer } from './components/Footer';
import { FluidBackground } from './components/FluidBackground';

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
  SoundType, 
  TimerPreset 
} from './types';

export const App: React.FC = () => {
  // --- Persistent State ---
  const [settings, setSettings] = useState<UserSettings>(() => storage.getSettings());
  const [tasks, setTasks] = useState<Task[]>(() => storage.getTasks());
  const [projects, setProjects] = useState<Project[]>(() => storage.getProjects());
  const [stats, setStats] = useState<UserStats>(() => storage.getStats());
  const [cookieConsent, setCookieConsent] = useState<boolean>(() => storage.getCookieConsent());

  // --- Timer State ---
  const [mode, setMode] = useState<TimerMode>('focus');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(() => settings.focusMinutes * 60);
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [activePriority, setActivePriority] = useState<TaskPriority>(1);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [intention, setIntention] = useState<string>('');

  // --- Audio & Modals State ---
  const [activeSound, setActiveSound] = useState<SoundType>('none');
  const [soundVolume, setSoundVolume] = useState<number>(0.5);
  const [customStreamUrl, setCustomStreamUrl] = useState<string>('');

  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSoundscapesOpen, setIsSoundscapesOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // --- PWA Installation Event ---
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState(false);

  // Sync settings helper
  const updateSettings = (newPartial: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newPartial };
      storage.saveSettings(updated);
      return updated;
    });
  };

  // Dynamically resolve theme based on active theme ID & Dark/Light mode
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

  // Switch timer mode
  const handleModeSelect = (newMode: TimerMode) => {
    if (settings.hapticsEnabled) soundEngine.playTickHaptic();
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(getDurationForMode(newMode));
  };

  // Trigger celebration confetti
  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: [theme.waveColor, '#FFC93C', '#34D399', '#FA5246'],
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
        taskTitle: activeTask?.title || intention || 'Deep Study Session',
        projectName: projects.find((p) => p.id === activeTask?.projectId)?.name || 'Deep Focus',
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

      // Switch to break
      if (nextCount % settings.longBreakInterval === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreakMinutes * 60);
      } else {
        setMode('shortBreak');
        setTimeLeft(settings.shortBreakMinutes * 60);
      }

      setIsRunning(settings.autoStartBreaks);
    } else {
      // Break finished, return to focus
      setMode('focus');
      setTimeLeft(settings.focusMinutes * 60);
      setIsRunning(settings.autoStartPomodoros);
    }
  }, [
    mode,
    activeTask,
    intention,
    projects,
    sessionCount,
    settings.focusMinutes,
    settings.shortBreakMinutes,
    settings.longBreakMinutes,
    settings.longBreakInterval,
    settings.autoStartBreaks,
    settings.autoStartPomodoros,
    theme.waveColor,
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

  // Handle Play/Pause
  const handleTogglePlay = () => {
    if (settings.hapticsEnabled) soundEngine.playTickHaptic();
    setIsRunning(!isRunning);

    // Auto-resume sound if soundscape was selected
    if (!isRunning && activeSound !== 'none') {
      soundEngine.playSoundscape(activeSound, soundVolume, customStreamUrl);
    }
  };

  // Handle Reset
  const handleReset = () => {
    if (settings.hapticsEnabled) soundEngine.playTickHaptic();
    setIsRunning(false);
    setTimeLeft(getDurationForMode(mode));
  };

  // Handle Skip
  const handleSkip = () => {
    if (settings.hapticsEnabled) soundEngine.playTickHaptic();
    handleSessionComplete();
  };

  // Handle Soundscape Change
  const handleSelectSound = (sound: SoundType) => {
    if (settings.hapticsEnabled) soundEngine.playTickHaptic();
    setActiveSound(sound);
    soundEngine.playSoundscape(sound, soundVolume, customStreamUrl);
  };

  const handleVolumeChange = (vol: number) => {
    setSoundVolume(vol);
    soundEngine.setVolume(vol);
  };

  // PWA beforeinstallprompt Listener
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setCanInstallPwa(false);
    }
    setDeferredPrompt(null);
  };

  // Service Worker Registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('LockIt PWA Service Worker Registered'))
        .catch((err) => console.warn('SW registration notice:', err));
    }
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, mode, getDurationForMode]);

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
    setIntention(newTask.title);
    setActiveTask(newTask);
  };

  const handleToggleCompleteTask = (taskId: string) => {
    if (settings.hapticsEnabled) soundEngine.playTickHaptic();
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      );
      storage.saveTasks(updated);
      return updated;
    });
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

  const handleSelectTask = (task: Task) => {
    setActiveTask(task);
    setIntention(task.title);
  };

  // AI Preset application
  const handleApplyPreset = (preset: TimerPreset, minutes: number) => {
    updateSettings({ preset, focusMinutes: minutes });
    setTimeLeft(minutes * 60);
    setIsRunning(false);
    setIsAIOpen(false);
  };

  // AI Subtasks batch addition
  const handleAddBatchSubtasks = (subtaskTitles: string[]) => {
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
  };

  const totalDuration = getDurationForMode(mode);

  return (
    <div className={`relative min-h-screen flex flex-col justify-between transition-colors duration-700 ${theme.bg}`}>
      {/* Abstract Living Fluid Background & Morphing Blobs */}
      <FluidBackground blobColors={theme.blobColors} isDark={settings.isDarkMode} />

      {/* Top Navbar */}
      <Navbar
        theme={theme}
        userName={settings.userName}
        mode={mode}
        isActive={isRunning}
        isDarkMode={settings.isDarkMode}
        soundPlaying={activeSound !== 'none'}
        onToggleDarkMode={() => updateSettings({ isDarkMode: !settings.isDarkMode })}
        onOpenSoundscapes={() => setIsSoundscapesOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        canInstallPwa={canInstallPwa}
        onInstallPwa={handleInstallPwa}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto px-4 z-10">
        {/* Giant Editorial Timer / Organic Morphing Break */}
        <TimerDisplay
          theme={theme}
          userName={settings.userName}
          mode={mode}
          timeLeft={timeLeft}
          totalDuration={totalDuration}
          isRunning={isRunning}
          sessionCount={sessionCount}
          maxSessionsBeforeLongBreak={settings.longBreakInterval}
          zenMode={settings.zenMode}
          intention={intention}
          onIntentionChange={setIntention}
          onTogglePlay={handleTogglePlay}
          onReset={handleReset}
          onSkip={handleSkip}
          onModeSelect={handleModeSelect}
          onToggleZen={() => updateSettings({ zenMode: !settings.zenMode })}
        />

        {/* Priority Task Deck with Squishy Physics */}
        <PriorityDeck
          theme={theme}
          tasks={tasks}
          projects={projects}
          activePriority={activePriority}
          onSelectPriority={(p) => setActivePriority(p)}
          onSelectTask={handleSelectTask}
          onToggleComplete={handleToggleCompleteTask}
          onDeleteTask={handleDeleteTask}
          onAddTask={handleAddTask}
        />
      </main>

      {/* Footer with Allen Benny attribution */}
      <Footer theme={theme} />

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
        onApplyPreset={handleApplyPreset}
        onAddSubtasks={handleAddBatchSubtasks}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      {/* Privacy / Cookie Consent Banner */}
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
