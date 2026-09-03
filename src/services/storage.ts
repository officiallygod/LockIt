import { Task, Project, FocusSessionRecord, UserStats, UserSettings, ThemeId } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'lockit_settings_v1',
  TASKS: 'lockit_tasks_v1',
  PROJECTS: 'lockit_projects_v1',
  STATS: 'lockit_stats_v1',
  COOKIES: 'lockit_cookie_consent_v1',
};

export const DEFAULT_PROJECTS: Project[] = [
  { id: 'proj-1', name: 'Deep Focus', color: '#E07A5F', badge: '🎯' },
  { id: 'proj-2', name: 'Research & Study', color: '#818CF8', badge: '📚' },
  { id: 'proj-3', name: 'Creative Build', color: '#FBBF24', badge: '⚡' },
  { id: 'proj-4', name: 'Reading & Synthesis', color: '#34D399', badge: '🌿' },
];

export const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Project research & synthesis',
    projectId: 'proj-2',
    priority: 1,
    estPomodoros: 4,
    completedPomodoros: 2,
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Review lecture slide concepts',
    projectId: 'proj-1',
    priority: 2,
    estPomodoros: 2,
    completedPomodoros: 1,
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Organize study flashcards',
    projectId: 'proj-3',
    priority: 3,
    estPomodoros: 3,
    completedPomodoros: 0,
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_SETTINGS: UserSettings = {
  userName: 'Allen',
  theme: 'terracotta',
  isDarkMode: false,
  preset: 'classic',
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  zenMode: false,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundVolume: 0.5,
  activeSound: 'none',
  cookieConsentAccepted: false,
  hapticsEnabled: true,
};

// Seed sample historical sessions for the current week so charts look gorgeous right away
const getInitialHistory = (): FocusSessionRecord[] => {
  const history: FocusSessionRecord[] = [];
  const today = new Date();
  
  // Past 7 days with realistic study sessions
  const pastDays = [6, 5, 4, 3, 2, 1, 0];
  const minutesPattern = [75, 50, 100, 125, 75, 150, 50];

  pastDays.forEach((daysAgo, idx) => {
    const d = new Date();
    d.setDate(today.getDate() - daysAgo);
    const dateStr = d.toISOString().split('T')[0];
    const mins = minutesPattern[idx];
    const count = Math.floor(mins / 25);
    
    for (let i = 0; i < count; i++) {
      history.push({
        id: `seed-${daysAgo}-${i}`,
        date: dateStr,
        timestamp: d.getTime() + i * 3600000,
        minutes: 25,
        mode: 'focus',
        taskTitle: 'Deep Study Session',
        projectName: 'Deep Focus',
      });
    }
  });

  return history;
};

export const DEFAULT_STATS: UserStats = {
  totalMinutes: 625,
  sessionsCompleted: 25,
  currentStreak: 5,
  longestStreak: 12,
  lastSessionDate: new Date().toISOString().split('T')[0],
  history: getInitialHistory(),
};

export const storage = {
  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  },

  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  },

  saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  },

  getProjects(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return data ? JSON.parse(data) : DEFAULT_PROJECTS;
    } catch {
      return DEFAULT_PROJECTS;
    }
  },

  saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects', e);
    }
  },

  getStats(): UserStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      return data ? JSON.parse(data) : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  },

  recordCompletedSession(record: Omit<FocusSessionRecord, 'id' | 'timestamp'>): UserStats {
    const stats = this.getStats();
    const today = new Date().toISOString().split('T')[0];
    const newRecord: FocusSessionRecord = {
      ...record,
      id: 'session-' + Date.now(),
      timestamp: Date.now(),
    };

    const newHistory = [...stats.history, newRecord];
    const totalMinutes = stats.totalMinutes + record.minutes;
    const sessionsCompleted = stats.sessionsCompleted + 1;

    // Calculate streak
    let currentStreak = stats.currentStreak;
    if (stats.lastSessionDate !== today) {
      const lastDate = new Date(stats.lastSessionDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak += 1;
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    }

    const longestStreak = Math.max(currentStreak, stats.longestStreak);

    const updatedStats: UserStats = {
      totalMinutes,
      sessionsCompleted,
      currentStreak,
      longestStreak,
      lastSessionDate: today,
      history: newHistory,
    };

    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updatedStats));
    } catch (e) {
      console.error('Failed to save stats', e);
    }

    return updatedStats;
  },

  getCookieConsent(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.COOKIES) === 'accepted';
    } catch {
      return false;
    }
  },

  setCookieConsent(accepted: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COOKIES, accepted ? 'accepted' : 'declined');
    } catch (e) {
      console.error('Failed to save cookie preference', e);
    }
  }
};
