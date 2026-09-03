import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, ShieldCheck } from 'lucide-react';
import { ThemeConfig } from '../theme/themeConfig';

interface CookieConsentProps {
  isVisible: boolean;
  theme: ThemeConfig;
  onAccept: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ isVisible, theme, onAccept }) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40"
      >
        <div
          className={`rounded-3xl p-5 shadow-2xl border backdrop-blur-xl flex flex-col gap-3 ${theme.cardBg} ${theme.cardBorder}`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-2xl ${theme.accentBg} shrink-0`}>
              <Cookie size={20} style={{ color: theme.waveColor }} />
            </div>
            <div>
              <h4 className={`text-xs sm:text-sm font-extrabold ${theme.textColor} flex items-center gap-1.5`}>
                <span>Private & Offline-First</span>
                <ShieldCheck size={14} className="text-emerald-500" />
              </h4>
              <p className={`text-[11px] ${theme.textMuted} mt-0.5 leading-relaxed`}>
                LockIt uses local storage to save your deep work streaks, priority cards, and relaxing audio settings on your device. Zero tracking, zero ads, 100% private.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={onAccept}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-black tracking-wide ${theme.primary} ${theme.primaryText} hover:scale-102 active:scale-98 transition-all shadow-md`}
            >
              Accept & Lock In
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
