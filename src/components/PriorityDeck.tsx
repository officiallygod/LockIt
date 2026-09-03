import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Check, Clock, Sparkles } from 'lucide-react';
import { Task, Project, TaskPriority } from '../types';

interface PriorityDeckProps {
  userName: string;
  tasks: Task[];
  projects: Project[];
  activePriority: TaskPriority;
  onSelectPriority: (p: TaskPriority) => void;
  onStartTask: (task: Task) => void;
  onAddTask: (task: Omit<Task, 'id' | 'completedPomodoros' | 'isCompleted' | 'createdAt'>) => void;
  onOpenSettings: () => void;
}

export const PriorityDeck: React.FC<PriorityDeckProps> = ({
  userName,
  tasks,
  projects,
  activePriority,
  onSelectPriority,
  onStartTask,
  onAddTask,
  onOpenSettings,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>(activePriority);
  const [newEst, setNewEst] = useState(3);
  const [newDeadline, setNewDeadline] = useState('Today');

  // Active task for this priority or fallback default
  const activeTask = tasks.find((t) => t.priority === activePriority && !t.isCompleted) ||
    tasks.find((t) => t.priority === activePriority) || {
      id: `default-${activePriority}`,
      title: activePriority === 1 ? 'Project research' : activePriority === 2 ? 'Deep Reading & Synthesis' : 'Organize notes & review',
      priority: activePriority,
      projectId: 'proj-1',
      estPomodoros: 3,
      completedPomodoros: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

  // Card themes based on active priority (Screenshot 2 & 3 style)
  const cardColor = activePriority === 1 ? 'bg-[#FF5335]' : activePriority === 2 ? 'bg-[#503699]' : 'bg-[#E56345]';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      priority: newPriority,
      estPomodoros: newEst,
      projectId: 'proj-1',
    });

    setNewTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-full h-full bg-white dark:bg-[#1A1429] flex flex-col justify-between p-6 sm:p-7 transition-colors duration-500">
      {/* Top Bar: Tomato Logo + App Name + Avatar (Screenshot 2 & 3) */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          {/* Cute Tomato Logo */}
          <div className="relative w-6 h-6 flex items-center justify-center">
            <span className="w-5 h-5 rounded-full bg-[#FF5335] inline-block shadow-sm" />
            <span className="absolute -top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
          </div>
          <span className="text-sm font-extrabold text-[#272138] dark:text-white tracking-tight font-sans">
            pomodoro<span className="text-[#FF5335]">.</span>
          </span>
        </div>

        {/* User Profile Avatar */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onOpenSettings}
          className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white dark:border-white/20 shadow-md flex items-center justify-center bg-[#FCEEE9] text-xs font-black text-[#FF5335]"
          title="Profile & Settings"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&auto=format&q=80"
            alt={userName}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback initial
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span className="absolute inset-0 flex items-center justify-center">
            {userName.charAt(0)}
          </span>
        </motion.button>
      </div>

      {/* Main Title */}
      <div className="my-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#251E35] dark:text-white tracking-tight">
          Choose priorities
        </h1>
      </div>

      {/* 3D Stacked Priority Card Container (Screenshot 1 & 3) */}
      <div className="relative w-full flex-1 flex items-center justify-center py-4">
        {/* Layer 3: Backmost shadow card */}
        <div
          className="absolute w-60 sm:w-68 h-76 sm:h-84 rounded-[38px] bg-[#E8E1F8] dark:bg-[#2C2147] opacity-60 transform -rotate-6 -translate-x-3 translate-y-2 pointer-events-none transition-all duration-500"
        />

        {/* Layer 2: Middle shadow card */}
        <div
          className="absolute w-62 sm:w-70 h-78 sm:h-86 rounded-[38px] bg-[#DCD1F5] dark:bg-[#382B59] opacity-80 transform rotate-3 translate-x-2 -translate-y-1 pointer-events-none transition-all duration-500"
        />

        {/* Layer 1: Main Front Active Priority Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`card-${activePriority}-${activeTask.id}`}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={`relative w-64 sm:w-72 h-80 sm:h-90 rounded-[40px] ${cardColor} text-white shadow-2xl p-6 flex flex-col justify-between z-10 transition-colors duration-500 overflow-hidden cursor-pointer`}
          >
            {/* Subtle inner card light reflection */}
            <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            {/* Top spacing */}
            <div className="h-4" />

            {/* Central Round Glass Play Button (Screenshot 3) */}
            <div className="flex flex-col items-center justify-center my-auto">
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={() => onStartTask(activeTask)}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg transition-all"
                title="Start Focus Session"
              >
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white/30 flex items-center justify-center shadow-inner">
                  <Play size={24} className="text-white fill-white ml-1" />
                </div>
              </motion.button>
            </div>

            {/* Task Info (Screenshot 3: "Project research", "Deadline: ...") */}
            <div className="relative z-10 space-y-1">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white line-clamp-1">
                {activeTask.title}
              </h3>
              <p className="text-xs text-white/80 font-medium">
                Deadline: 31 Dec, 2026 • {activeTask.estPomodoros} Pomodoros
              </p>
            </div>

            {/* Bottom Row: "Priority" label & priority number */}
            <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/20 text-xs font-semibold">
              <span className="text-white/80">Priority</span>
              <span className="text-white font-bold text-sm">{activePriority}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Priority Selector Row (Screenshot 1 & 3): 1, 2, 3, Add */}
      <div className="flex items-center justify-center gap-3 pt-3 pb-2">
        {/* Priority 1 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelectPriority(1)}
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-sm ${
            activePriority === 1
              ? 'bg-white border-2 border-dashed border-[#503699] text-[#503699] ring-4 ring-[#503699]/10'
              : 'bg-[#FF5335] text-white'
          }`}
        >
          1
        </motion.button>

        {/* Priority 2 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelectPriority(2)}
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-sm ${
            activePriority === 2
              ? 'bg-white border-2 border-dashed border-[#503699] text-[#503699] ring-4 ring-[#503699]/10'
              : 'bg-[#FF6E4A] text-white'
          }`}
        >
          2
        </motion.button>

        {/* Priority 3 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelectPriority(3)}
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-sm ${
            activePriority === 3
              ? 'bg-white border-2 border-dashed border-[#503699] text-[#503699] ring-4 ring-[#503699]/10'
              : 'bg-[#F9B7A6] text-white'
          }`}
        >
          3
        </motion.button>

        {/* Add Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsModalOpen(true)}
          className="h-12 px-5 rounded-full bg-[#18181B] dark:bg-white dark:text-[#18181B] text-white flex items-center gap-1.5 font-bold text-xs tracking-wider shadow-md hover:opacity-90 transition-all"
        >
          <span>Add</span>
        </motion.button>
      </div>

      {/* New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            className="w-full max-w-sm rounded-[36px] p-7 shadow-2xl bg-white dark:bg-[#1E1733] border border-black/5 dark:border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-[#251E35] dark:text-white">Add Priority Task</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                  Task Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Project research"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 text-sm font-bold outline-none text-[#251E35] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(Number(e.target.value) as TaskPriority)}
                    className="w-full px-3 py-2.5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 text-xs font-bold outline-none text-[#251E35] dark:text-white"
                  >
                    <option value={1}>Priority 1 (Coral)</option>
                    <option value={2}>Priority 2 (Violet)</option>
                    <option value={3}>Priority 3 (Peach)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                    Sessions (Pomos)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={newEst}
                    onChange={(e) => setNewEst(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 text-xs font-bold outline-none text-[#251E35] dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl text-xs font-bold bg-black/5 dark:bg-white/10 text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl text-xs font-black bg-[#FF5335] text-white shadow-md hover:opacity-90 transition-all"
                >
                  Add Card
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
