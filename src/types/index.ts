export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export type TimerPreset = 'classic' | 'ultradian' | 'sprint' | 'micro' | 'custom';

export type ThemeId = 'terracotta' | 'pastel' | 'violet' | 'midnight';

export type TaskPriority = 1 | 2 | 3;

export interface Task {
  id: string;
  title: string;
  projectId: string;
  priority: TaskPriority;
  estPomodoros: number;
  completedPomodoros: number;
  isCompleted: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  badge: string;
}

export interface FocusSessionRecord {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  minutes: number;
  mode: TimerMode;
  taskId?: string;
  taskTitle?: string;
  projectName?: string;
}

export interface UserStats {
  totalMinutes: number;
  sessionsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string; // YYYY-MM-DD
  history: FocusSessionRecord[];
}

export type SoundType = 
  | 'none'
  | 'rain' 
  | 'ocean' 
  | 'stream' 
  | 'brownNoise' 
  | 'pinkNoise' 
  | 'tibetanBowl' 
  | 'ncsLofi';

export interface SoundPreset {
  id: SoundType;
  name: string;
  description: string;
  iconName: string;
  isProcedural: boolean;
  audioUrl?: string;
}

export interface UserSettings {
  userName: string;
  theme: ThemeId;
  preset: TimerPreset;
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
  zenMode: boolean; // Hide seconds, focus on fluid breathing
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundVolume: number;
  activeSound: SoundType;
  customStreamUrl?: string;
  cookieConsentAccepted: boolean;
  hapticsEnabled: boolean;
}
