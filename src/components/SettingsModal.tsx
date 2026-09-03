import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Palette, Clock, Sliders, Volume2, X, Heart, Sparkles } from 'lucide-react';
import { THEMES, ThemeConfig } from '../theme/themeConfig';
import { ThemeId, UserSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        className={`w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[36px] p-6 sm:p-7 shadow-2xl border ${theme.cardBg} ${theme.cardBorder}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-2xl ${theme.accentBg}`}>
              <SettingsIcon size={20} style={{ color: theme.waveColor }} />
            </div>
            <div>
              <h2 className={`text-lg font-black tracking-tight ${theme.textColor}`}>
                Preferences & Style
              </h2>
              <p className={`text-xs ${theme.textMuted} font-medium`}>
                Tailor your personal focus environment
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

        <div className="space-y-5">
          {/* User Name */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme.textMuted}`}>
              Your Name
            </label>
            <input
              type="text"
              value={settings.userName}
              onChange={(e) => onUpdateSettings({ userName: e.target.value })}
              placeholder="e.g. Allen"
              className={`w-full px-4 py-2.5 rounded-2xl border bg-black/5 dark:bg-white/10 ${theme.cardBorder} text-sm font-semibold outline-none ${theme.textColor}`}
            />
          </div>

          {/* Theme Selector */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme.textMuted}`}>
              Visual Theme (Inspired by Mockups)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(Object.keys(THEMES) as ThemeId[]).map((themeKey) => {
                const t = THEMES[themeKey];
                const isSelected = settings.theme === themeKey;

                return (
                  <button
                    key={themeKey}
                    onClick={() => onUpdateSettings({ theme: themeKey })}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? `${theme.cardBorder} ring-2 ring-terracotta bg-black/5 dark:bg-white/10 shadow-sm`
                        : 'border-transparent bg-black/5 dark:bg-white/5 hover:opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: t.preview }}
                      />
                      <span className={`text-xs font-extrabold ${theme.textColor}`}>
                        {t.name.split(' (')[0]}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground opacity-70">
                      {themeKey === 'terracotta' && 'Warm clay minimalism'}
                      {themeKey === 'pastel' && 'Cheerful library cards'}
                      {themeKey === 'violet' && 'Organic liquid violet'}
                      {themeKey === 'midnight' && 'Deep OLED black'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timer Intervals */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme.textMuted}`}>
              Timer Durations (Minutes)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground block mb-1">Focus</span>
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={settings.focusMinutes}
                  onChange={(e) => onUpdateSettings({ focusMinutes: Math.max(1, Number(e.target.value)) })}
                  className={`w-full px-3 py-2 rounded-xl border bg-black/5 dark:bg-white/10 ${theme.cardBorder} text-xs font-bold outline-none ${theme.textColor}`}
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground block mb-1">Short Break</span>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={settings.shortBreakMinutes}
                  onChange={(e) => onUpdateSettings({ shortBreakMinutes: Math.max(1, Number(e.target.value)) })}
                  className={`w-full px-3 py-2 rounded-xl border bg-black/5 dark:bg-white/10 ${theme.cardBorder} text-xs font-bold outline-none ${theme.textColor}`}
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground block mb-1">Long Break</span>
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={settings.longBreakMinutes}
                  onChange={(e) => onUpdateSettings({ longBreakMinutes: Math.max(1, Number(e.target.value)) })}
                  className={`w-full px-3 py-2 rounded-xl border bg-black/5 dark:bg-white/10 ${theme.cardBorder} text-xs font-bold outline-none ${theme.textColor}`}
                />
              </div>
            </div>
          </div>

          {/* Experience Toggles */}
          <div className="space-y-3 pt-2 border-t border-black/5 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-xs font-bold block ${theme.textColor}`}>Midnight Dark Mode</span>
                <span className="text-[11px] text-muted-foreground">OLED black background & glowing accents</span>
              </div>
              <input
                type="checkbox"
                checked={settings.isDarkMode}
                onChange={(e) => onUpdateSettings({ isDarkMode: e.target.checked })}
                className="w-5 h-5 rounded-md accent-[#C86246] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className={`text-xs font-bold block ${theme.textColor}`}>Zen Mode Default</span>
                <span className="text-[11px] text-muted-foreground">Hide ticking seconds for anxiety-free flow</span>
              </div>
              <input
                type="checkbox"
                checked={settings.zenMode}
                onChange={(e) => onUpdateSettings({ zenMode: e.target.checked })}
                className="w-5 h-5 rounded-md accent-[#C86246] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className={`text-xs font-bold block ${theme.textColor}`}>Auto-Start Breaks</span>
                <span className="text-[11px] text-muted-foreground">Seamlessly transition into recovery</span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoStartBreaks}
                onChange={(e) => onUpdateSettings({ autoStartBreaks: e.target.checked })}
                className="w-5 h-5 rounded-md accent-[#C86246] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className={`text-xs font-bold block ${theme.textColor}`}>Haptic Acoustic Feedback</span>
                <span className="text-[11px] text-muted-foreground">Subtle click chimes on button interactions</span>
              </div>
              <input
                type="checkbox"
                checked={settings.hapticsEnabled}
                onChange={(e) => onUpdateSettings({ hapticsEnabled: e.target.checked })}
                className="w-5 h-5 rounded-md accent-[#C86246] cursor-pointer"
              />
            </div>
          </div>

          {/* Author Attribution Card */}
          <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-foreground mb-1">
              <span>LockIt</span>
              <span className="text-terracotta">♥</span>
              <span>Made with love by Allen Benny</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Designed for deep thinkers, scholars, and builders worldwide. 100% offline & private.
            </p>
          </div>
        </div>

        {/* Save button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-2xl text-xs font-black tracking-wide ${theme.primary} ${theme.primaryText} hover:scale-102 active:scale-98 transition-all shadow-md`}
          >
            Save & Return
          </button>
        </div>
      </motion.div>
    </div>
  );
};
