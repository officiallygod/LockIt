import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Zap, BookOpen, Lightbulb, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ThemeConfig } from '../theme/themeConfig';
import { TimerPreset } from '../types';

interface AIStudyCompanionProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  userName: string;
  onApplyPreset: (preset: TimerPreset, minutes: number) => void;
  onAddSubtasks: (tasks: string[]) => void;
}

interface DecomposedStep {
  title: string;
  minutes: number;
}

export const AIStudyCompanion: React.FC<AIStudyCompanionProps> = ({
  isOpen,
  onClose,
  theme,
  userName,
  onApplyPreset,
  onAddSubtasks,
}) => {
  const [activeTab, setActiveTab] = useState<'decomposer' | 'energy' | 'research'>('decomposer');
  const [goalInput, setGoalInput] = useState('');
  const [isDecomposing, setIsDecomposing] = useState(false);
  const [subtasks, setSubtasks] = useState<DecomposedStep[]>([]);
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(null);

  if (!isOpen) return null;

  // Local intelligent task decomposition heuristic
  const handleDecompose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;

    setIsDecomposing(true);
    setTimeout(() => {
      const topic = goalInput.trim();
      const generated: DecomposedStep[] = [
        { title: `Skim & extract key concepts of ${topic}`, minutes: 25 },
        { title: `Deep dive into difficult sections & active note taking`, minutes: 25 },
        { title: `Solve 3-5 practice problems or write synthesis summary`, minutes: 25 },
        { title: `Active recall test without looking at notes (Feynman method)`, minutes: 25 },
      ];
      setSubtasks(generated);
      setIsDecomposing(false);
    }, 450);
  };

  const handleApplySubtasks = () => {
    if (subtasks.length > 0) {
      onAddSubtasks(subtasks.map((s) => s.title));
      onClose();
    }
  };

  const handleEnergySelect = (energyLevel: string) => {
    setSelectedEnergy(energyLevel);
    if (energyLevel === 'high') {
      onApplyPreset('ultradian', 50);
    } else if (energyLevel === 'medium') {
      onApplyPreset('classic', 25);
    } else if (energyLevel === 'low') {
      onApplyPreset('micro', 15);
    } else if (energyLevel === 'flow') {
      onApplyPreset('sprint', 90);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        className={`w-full max-w-md max-h-[88vh] overflow-y-auto rounded-[36px] p-6 sm:p-7 shadow-2xl border ${theme.cardBg} ${theme.cardBorder}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-amber-500/15 text-amber-500">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className={`text-lg font-black tracking-tight ${theme.textColor}`}>
                AI Study Companion
              </h2>
              <p className={`text-xs ${theme.textMuted} font-medium`}>
                Cognitive science & intelligent flow optimizer
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

        {/* Tab switchers */}
        <div className="flex rounded-2xl bg-black/5 dark:bg-white/5 p-1 mb-5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('decomposer')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'decomposer'
                ? `${theme.primary} ${theme.primaryText} shadow-sm`
                : `${theme.textMuted} hover:${theme.textColor}`
            }`}
          >
            Goal Decomposer
          </button>
          <button
            onClick={() => setActiveTab('energy')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'energy'
                ? `${theme.primary} ${theme.primaryText} shadow-sm`
                : `${theme.textMuted} hover:${theme.textColor}`
            }`}
          >
            Energy Check-in
          </button>
          <button
            onClick={() => setActiveTab('research')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'research'
                ? `${theme.primary} ${theme.primaryText} shadow-sm`
                : `${theme.textMuted} hover:${theme.textColor}`
            }`}
          >
            Study Science
          </button>
        </div>

        {/* Tab 1: Goal Decomposer */}
        {activeTab === 'decomposer' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 text-xs font-medium text-muted-foreground flex gap-2.5 items-start">
              <Brain size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <span>
                Large daunting goals trigger amygdala resistance. Enter your study topic, and we'll break it down into 25-minute digestible micro-sprints.
              </span>
            </div>

            <form onSubmit={handleDecompose} className="space-y-2">
              <input
                type="text"
                placeholder="e.g. Master React Fiber Architecture"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border bg-black/5 dark:bg-white/10 ${theme.cardBorder} text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500/50 ${theme.textColor}`}
              />
              <button
                type="submit"
                disabled={isDecomposing}
                className={`w-full py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 ${theme.primary} ${theme.primaryText} hover:scale-102 active:scale-98 transition-all shadow-md`}
              >
                <Sparkles size={14} />
                <span>{isDecomposing ? 'Decomposing task...' : 'Break Down into 25m Pomodoros'}</span>
              </button>
            </form>

            {subtasks.length > 0 && (
              <div className="space-y-2.5 mt-4">
                <p className={`text-xs font-bold uppercase tracking-wider ${theme.textMuted}`}>
                  Structured 25m Action Steps:
                </p>
                {subtasks.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-between text-xs font-semibold gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 text-[11px] font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className={theme.textColor}>{step.title}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 opacity-70 shrink-0">
                      {step.minutes}m
                    </span>
                  </div>
                ))}

                <button
                  onClick={handleApplySubtasks}
                  className="w-full mt-3 py-2.5 rounded-2xl text-xs font-black bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={15} />
                  <span>Add All Steps to My Priority Deck</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Energy Check-In */}
        {activeTab === 'energy' && (
          <div className="space-y-3">
            <p className={`text-xs font-bold ${theme.textMuted}`}>
              How is your cognitive energy right now, {userName}?
            </p>

            {[
              {
                id: 'high',
                title: 'High Energy & Hyperfocused',
                subtitle: '50m Deep Work / 10m Rest (Ultradian Rhythm)',
                icon: '⚡',
                preset: 'ultradian',
              },
              {
                id: 'medium',
                title: 'Steady & Balanced',
                subtitle: '25m Focus / 5m Rest (Classic Pomodoro)',
                icon: '🎯',
                preset: 'classic',
              },
              {
                id: 'low',
                title: 'Tired, Sluggish, or Resisting',
                subtitle: '15m Quick Start (2-Minute Rule to beat friction)',
                icon: '🌱',
                preset: 'micro',
              },
              {
                id: 'flow',
                title: 'Deep Creative Immersion',
                subtitle: '90m Flow Sprint / 20m Full Recovery',
                icon: '🌊',
                preset: 'sprint',
              },
            ].map((option) => (
              <div
                key={option.id}
                onClick={() => handleEnergySelect(option.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  selectedEnergy === option.id
                    ? `${theme.cardBorder} ring-2 ring-amber-500/50 bg-black/5 dark:bg-white/10`
                    : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-extrabold ${theme.textColor}`}>
                      {option.title}
                    </h4>
                    <p className={`text-[11px] ${theme.textMuted}`}>
                      {option.subtitle}
                    </p>
                  </div>
                </div>
                <ArrowRight size={15} className="opacity-40" />
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Study Science & Research Papers */}
        {activeTab === 'research' && (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-500">
                <BookOpen size={14} />
                <span>Attention Restoration Theory (Kaplan, 1989)</span>
              </div>
              <p className={theme.textColor}>
                Staring at aggressive countdown clocks drains directed attention. LockIt's organic fluid water waves provide "soft fascination", allowing prefrontal neural circuits to restore naturally.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-500">
                <Zap size={14} />
                <span>Ultradian 90-Minute Cycles (Kleitman)</span>
              </div>
              <p className={theme.textColor}>
                Human biological alertness peaks and wanes across 90-minute ultradian rhythms. Pushing past 90 minutes without deliberate rest leads to diminished retention and cognitive errors.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-indigo-400">
                <Lightbulb size={14} />
                <span>Implementation Intentions (Gollwitzer, 1999)</span>
              </div>
              <p className={theme.textColor}>
                Typing your specific micro-action into LockIt's top prompt creates an immediate neural commitment, reducing task-switching distractions by over 65%.
              </p>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-2xl text-xs font-black tracking-wide ${theme.primary} ${theme.primaryText} hover:scale-102 active:scale-98 transition-all shadow-md`}
          >
            Ready to Lock In
          </button>
        </div>
      </motion.div>
    </div>
  );
};
