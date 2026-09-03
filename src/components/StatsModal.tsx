import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, Trophy, Calendar, X, BarChart } from 'lucide-react';
import { ThemeConfig } from '../theme/themeConfig';
import { UserStats } from '../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  stats: UserStats;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  theme,
  stats,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = stats.history.filter((h) => h.date === todayStr);
  const todayMinutes = todaySessions.reduce((acc, curr) => acc + curr.minutes, 0);

  // Prepare "THIS WEEK" data: Last 7 days
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weekData = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date();
    // Monday as start or last 7 days ending today
    d.setDate(d.getDate() - (6 - idx));
    const dStr = d.toISOString().split('T')[0];
    const daySessions = stats.history.filter((h) => h.date === dStr);
    const dayMins = daySessions.reduce((acc, curr) => acc + curr.minutes, 0);
    const dayLetter = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()];

    return {
      date: dStr,
      label: dayLetter,
      minutes: dayMins,
      sessions: daySessions.length,
    };
  });

  const maxWeekMins = Math.max(...weekData.map((w) => w.minutes), 60);

  // Month Heatmap: 28 days grid
  const heatmapDays = Array.from({ length: 28 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const dStr = d.toISOString().split('T')[0];
    const dayMins = stats.history
      .filter((h) => h.date === dStr)
      .reduce((acc, curr) => acc + curr.minutes, 0);

    let intensity = 0;
    if (dayMins > 0) intensity = 1;
    if (dayMins >= 50) intensity = 2;
    if (dayMins >= 100) intensity = 3;
    if (dayMins >= 150) intensity = 4;

    return {
      date: dStr,
      minutes: dayMins,
      intensity,
    };
  });

  const currentMonthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        className={`w-full max-w-md rounded-[36px] p-6 sm:p-7 shadow-2xl border overflow-hidden relative ${theme.cardBg} ${theme.cardBorder}`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-2xl ${theme.accentBg}`}>
              <BarChart size={20} style={{ color: theme.waveColor }} />
            </div>
            <div>
              <h2 className={`text-lg font-black tracking-tight ${theme.textColor}`}>
                Focus Analytics
              </h2>
              <p className={`text-xs ${theme.textMuted} font-medium`}>
                Deep work rhythm & habit tracking
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 hover:opacity-70 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* YOUR FOCUS LOG summary card (Image 2 style) */}
        <div className="rounded-3xl p-5 bg-[#1C1A19] text-white shadow-md mb-5">
          <div className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
            Your Focus Log
          </div>
          <div className="flex items-baseline gap-6">
            <div>
              <span className="text-3xl sm:text-4xl font-black">{todaySessions.length}</span>
              <span className="text-xs font-semibold text-neutral-400 ml-1.5">today</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black">{stats.sessionsCompleted}</span>
              <span className="text-xs font-semibold text-neutral-400 ml-1.5">total</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-neutral-800 text-xs">
            <div className="flex items-center gap-2">
              <Flame size={15} className="text-amber-400" />
              <span className="text-neutral-300 font-semibold">{stats.currentStreak} day streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-terracotta" />
              <span className="text-neutral-300 font-semibold">
                {Math.round(stats.totalMinutes / 60)}h total locked in
              </span>
            </div>
          </div>
        </div>

        {/* THIS WEEK Bar Chart (Image 2 style) */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-black uppercase tracking-wider ${theme.textMuted}`}>
              This Week
            </span>
            <span className={`text-xs font-bold ${theme.textColor}`}>
              {Math.round(weekData.reduce((a, c) => a + c.minutes, 0) / 60)} hrs
            </span>
          </div>

          <div className="h-32 flex items-end justify-between gap-2 px-2 pt-4 pb-2 bg-black/5 dark:bg-white/5 rounded-2xl">
            {weekData.map((d, i) => {
              const heightPercent = Math.max(12, (d.minutes / maxWeekMins) * 100);
              const isToday = d.date === todayStr;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
                    className="w-full rounded-t-xl transition-all"
                    style={{
                      backgroundColor: theme.waveColor,
                      opacity: isToday ? 1 : 0.65,
                    }}
                    title={`${d.date}: ${d.minutes} mins (${d.sessions} pomos)`}
                  />
                  <span
                    className={`text-[11px] font-bold ${
                      isToday ? theme.textColor : theme.textMuted
                    }`}
                  >
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* MONTH HEATMAP Grid (Image 2 style) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-black uppercase tracking-wider ${theme.textMuted}`}>
              {currentMonthName} Consistency
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground opacity-80">
              Last 4 Weeks
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 p-3 bg-black/5 dark:bg-white/5 rounded-2xl">
            {heatmapDays.map((h, i) => {
              let opacityClass = 'opacity-15 bg-black dark:bg-white';
              if (h.intensity === 1) opacityClass = 'opacity-40';
              if (h.intensity === 2) opacityClass = 'opacity-65';
              if (h.intensity === 3) opacityClass = 'opacity-85';
              if (h.intensity === 4) opacityClass = 'opacity-100';

              return (
                <div
                  key={i}
                  className={`aspect-square rounded-lg transition-transform hover:scale-125 cursor-pointer ${
                    h.intensity === 0 ? 'bg-black/10 dark:bg-white/10' : ''
                  }`}
                  style={
                    h.intensity > 0
                      ? { backgroundColor: theme.waveColor, opacity: 0.25 + h.intensity * 0.18 }
                      : {}
                  }
                  title={`${h.date}: ${h.minutes} minutes`}
                />
              );
            })}
          </div>
        </div>

        {/* Close button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-2xl text-xs font-black tracking-wide ${theme.primary} ${theme.primaryText} hover:scale-102 active:scale-98 transition-all shadow-md`}
          >
            Keep Crushing It
          </button>
        </div>
      </motion.div>
    </div>
  );
};
