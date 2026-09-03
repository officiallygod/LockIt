import React from 'react';
import { Heart, Keyboard, WifiOff, Sparkles } from 'lucide-react';
import { ThemeConfig } from '../theme/themeConfig';

interface FooterProps {
  theme: ThemeConfig;
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  return (
    <footer className="w-full max-w-4xl mx-auto px-4 py-8 text-center select-none">
      {/* Keyboard Shortcuts Hint */}
      <div className="hidden sm:flex items-center justify-center gap-4 text-[11px] font-semibold text-muted-foreground opacity-60 mb-4">
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">Space</kbd> Start / Pause
        </span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">R</kbd> Reset
        </span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">S</kbd> Skip
        </span>
      </div>

      {/* Author Attribution: Made by Allen Benny */}
      <div className="flex flex-col items-center justify-center gap-1">
        <p className={`text-xs sm:text-sm font-bold tracking-tight ${theme.textColor} flex items-center gap-1.5`}>
          <span>LockIt</span>
          <span className="text-muted-foreground font-normal">—</span>
          <span>Made by</span>
          <span className="font-extrabold text-terracotta underline decoration-terracotta/40 decoration-2 underline-offset-4 hover:decoration-terracotta transition-all cursor-pointer">
            Allen Benny
          </span>
        </p>
        <p className={`text-[11px] ${theme.textMuted} font-medium`}>
          Aesthetic deep work hub • Built for flow & mindful focus
        </p>
      </div>
    </footer>
  );
};
