import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus } from 'lucide-react';
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
    <div className="w-full h-full flex flex-col justify-between max-w-4xl mx-auto px-6 sm:px-12 py-6 sm:py-10 select-none">
      {/* Top Bar: Tomato Logo + App Name + Avatar (Screenshot 2 & 3) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Cute Tomato Logo */}
          <div className="relative w-7 h-7 flex items-center justify-center">
            <span className="w-6 h-6 rounded-full bg-[#FF5335] inline-block shadow-sm" />
            <span className="absolute -top-0.5 right-1 w-2 h-2 rounded-full bg-[#4ADE80]" />
          </div>
          <span className="text-base sm:text-lg font-extrabold text-[#272138] dark:text-white tracking-tight font-sans">
            pomodoro<span className="text-[#FF5335]">.</span>
          </span>
        </div>

        {/* User Profile Avatar */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onOpenSettings}
          className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-white dark:border-white/20 shadow-md flex items-center justify-center bg-[#FCEEE9] text-xs font-black text-[#FF5335]"
          title="Profile & Settings"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&auto=format&q=80"
            alt={userName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span className="absolute inset-0 flex items-center justify-center font-bold">
            {userName.charAt(0)}
          </span>
        </motion.button>
      </div>

      {/* Main Title with generous editorial breathing room */}
      <div className="my-6 sm:my-8 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#251E35] dark:text-white tracking-tight">
          Choose priorities
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
          Select a high-impact goal and dive into deep flow
        </p>
      </div>

      {/* 3D Stacked Priority Card Container with Spacious Dimensions */}
      <div className="relative w-full flex-1 flex items-center justify-center py-6 sm:py-10">
        {/* Layer 3: Backmost shadow card */}
        <div
          className="absolute w-64 sm:w-80 md:w-[350px] h-84 sm:h-[450px] md:h-[490px] rounded-[44px] md:rounded-[52px] bg-[#E8E1F8] dark:bg-[#2C2147] opacity-60 transform -rotate-6 -translate-x-5 translate-y-3 pointer-events-none transition-all duration-500"
        />

        {/* Layer 2: Middle shadow card */}
        <div
          className="absolute w-68 sm:w-84 md:w-[365px] h-86 sm:h-[465px] md:h-[505px] rounded-[44px] md:rounded-[52px] bg-[#DCD1F5] dark:bg-[#382B59] opacity-80 transform rotate-3 translate-x-4 -translate-y-2 pointer-events-none transition-all duration-500"
        />

        {/* Layer 1: Main Front Active Priority Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`card-${activePriority}-${activeTask.id}`}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={`relative w-72 sm:w-88 md:w-[380px] h-90 sm:h-[480px] md:h-[520px] rounded-[46px] md:rounded-[54px] ${cardColor} text-white shadow-2xl p-7 sm:p-9 flex flex-col justify-between z-10 transition-colors duration-500 overflow-hidden cursor-pointer`}
          >
            {/* Subtle inner card light reflection */}
            <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            {/* Top spacing */}
            <div className="h-4" />

            {/* Central Round Glass Play Button */}
            <div className="flex flex-col items-center justify-center my-auto">
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={() => onStartTask(activeTask)}
                className="w-20 h-20 sm:w-26 sm:h-26 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl transition-all"
                title="Start Focus Session"
              >
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-white/30 flex items-center justify-center shadow-inner">
                  <Play size={28} className="text-white fill-white ml-1 sm:w-8 sm:h-8" />
                </div>
              </motion.button>
            </div>

            {/* Task Info (Screenshot 3: "Project research", "Deadline: ...") */}
            <div className="relative z-10 space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white line-clamp-1">
                {activeTask.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 font-medium">
                Deadline: 31 Dec, 2026 • {activeTask.estPomodoros} Pomodoros
              </p>
            </div>

            {/* Bottom Row: "Priority" label & priority number */}
            <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/20 text-xs sm:text-sm font-semibold">
              <span className="text-white/80 uppercase tracking-wider font-bold">Priority</span>
              <span className="text-white font-black text-base sm:text-lg">{activePriority}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Priority Selector Row with Generous Touch Targets */}
      <div className="flex items-center justify-center gap-3.5 sm:gap-5 pt-4 pb-2">
        {/* Priority 1 */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          onClick={() => onSelectPriority(1)}
          className={`w-13 h-13 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-black text-sm sm:text-base transition-all duration-300 shadow-md ${
            activePriority === 1
              ? 'bg-white border-2 border-dashed border-[#503699] text-[#503699] ring-4 ring-[#503699]/15'
              : 'bg-[#FF5335] text-white'
          }`}
        >
          1
        </motion.button>

        {/* Priority 2 */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          onClick={() => onSelectPriority(2)}
          className={`w-13 h-13 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-black text-sm sm:text-base transition-all duration-300 shadow-md ${
            activePriority === 2
              ? 'bg-white border-2 border-dashed border-[#503699] text-[#503699] ring-4 ring-[#503699]/15'
              : 'bg-[#FF6E4A] text-white'
          }`}
        >
          2
        </motion.button>

        {/* Priority 3 */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          onClick={() => onSelectPriority(3)}
          className={`w-13 h-13 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-black text-sm sm:text-base transition-all duration-300 shadow-md ${
            activePriority === 3
              ? 'bg-white border-2 border-dashed border-[#503699] text-[#503699] ring-4 ring-[#503699]/15'
              : 'bg-[#F9B7A6] text-white'
          }`}
        >
          3
        </motion.button>

        {/* Add Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          className="h-13 sm:h-16 px-6 sm:px-8 rounded-full bg-[#18181B] dark:bg-white dark:text-[#18181B] text-white flex items-center gap-2 font-black text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:opacity-90 transition-all"
        >
          <Plus size={16} />
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
            className="w-full max-w-md rounded-[36px] p-8 shadow-2xl bg-white dark:bg-[#1E1733] border border-black/5 dark:border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-[#251E35] dark:text-white">Add Priority Task</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Task Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Project research"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 text-base font-bold outline-none text-[#251E35] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(Number(e.target.value) as TaskPriority)}
                    className="w-full px-3 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 text-xs font-bold outline-none text-[#251E35] dark:text-white"
                  >
                    <option value={1}>Priority 1 (Coral)</option>
                    <option value={2}>Priority 2 (Violet)</option>
                    <option value={3}>Priority 3 (Peach)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Sessions (Pomos)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={newEst}
                    onChange={(e) => setNewEst(Number(e.target.value))}
                    className="w-full px-3 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 text-xs font-bold outline-none text-[#251E35] dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl text-xs font-bold bg-black/5 dark:bg-white/10 text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl text-xs font-black bg-[#FF5335] text-white shadow-lg hover:opacity-90 transition-all"
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
