import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, Clock, Sparkles } from 'lucide-react';
import { ThemeConfig } from '../theme/themeConfig';
import { Task, Project, TaskPriority } from '../types';

interface PriorityDeckProps {
  theme: ThemeConfig;
  tasks: Task[];
  projects: Project[];
  activePriority: TaskPriority;
  onSelectPriority: (p: TaskPriority) => void;
  onSelectTask: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'completedPomodoros' | 'isCompleted' | 'createdAt'>) => void;
}

export const PriorityDeck: React.FC<PriorityDeckProps> = ({
  theme,
  tasks,
  projects,
  activePriority,
  onSelectPriority,
  onSelectTask,
  onToggleComplete,
  onDeleteTask,
  onAddTask,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>(activePriority);
  const [newEst, setNewEst] = useState(3);
  const [newProjectId, setNewProjectId] = useState(projects[0]?.id || 'proj-1');

  // Filter tasks by active priority
  const currentTasks = tasks.filter((t) => t.priority === activePriority);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      priority: newPriority,
      estPomodoros: newEst,
      projectId: newProjectId,
    });

    setNewTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${theme.textColor}`}>
            Choose priorities
          </h2>
          <p className={`text-xs ${theme.textMuted} font-medium`}>
            Rank your tasks to lock in without distraction
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${theme.primary} ${theme.primaryText} hover:scale-105 active:scale-95 transition-all shadow-sm`}
        >
          <Plus size={14} />
          <span>New Task</span>
        </button>
      </div>

      {/* Cards Carousel / Stack */}
      <div className="relative min-h-[220px] mb-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {currentTasks.length === 0 ? (
            <motion.div
              key="empty-priority"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`w-full rounded-3xl p-6 text-center border border-dashed flex flex-col items-center justify-center gap-3 ${theme.cardBorder} bg-black/5 dark:bg-white/5`}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 text-2xl">
                ✨
              </div>
              <div>
                <p className={`text-sm font-bold ${theme.textColor}`}>
                  No tasks for Priority {activePriority}
                </p>
                <p className={`text-xs ${theme.textMuted} mt-0.5`}>
                  Add a high-impact goal to conquer this session
                </p>
              </div>
              <button
                onClick={() => {
                  setNewPriority(activePriority);
                  setIsModalOpen(true);
                }}
                className={`text-xs font-bold px-4 py-2 rounded-full ${theme.primary} ${theme.primaryText} hover:scale-105 active:scale-95 transition-all`}
              >
                + Add Priority {activePriority}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`priority-${activePriority}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="space-y-3"
            >
              {currentTasks.map((task) => {
                const project = projects.find((p) => p.id === task.projectId);

                return (
                  <motion.div
                    key={task.id}
                    layout
                    className={`group relative rounded-3xl p-5 border transition-all duration-300 shadow-md flex items-center justify-between gap-4 ${
                      task.isCompleted ? 'opacity-60 bg-black/5' : theme.cardBg
                    } ${theme.cardBorder}`}
                  >
                    {/* Task Content */}
                    <div
                      onClick={() => onSelectTask(task)}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: project ? `${project.color}20` : '#E07A5F20',
                            color: project ? project.color : '#E07A5F',
                          }}
                        >
                          {project ? `${project.badge} ${project.name}` : 'Priority Focus'}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground opacity-70">
                          <Clock size={11} />
                          <span>
                            {task.completedPomodoros}/{task.estPomodoros} pomos
                          </span>
                        </span>
                      </div>

                      <h3
                        className={`text-base font-extrabold tracking-tight transition-all ${
                          task.isCompleted ? 'line-through opacity-70' : theme.textColor
                        }`}
                      >
                        {task.title}
                      </h3>
                    </div>

                    {/* Check & Delete buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onToggleComplete(task.id)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                          task.isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-black/15 dark:border-white/15 hover:border-emerald-500 text-transparent hover:text-emerald-500'
                        }`}
                        title={task.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                      >
                        <Check size={16} className={task.isCompleted ? 'stroke-[3]' : ''} />
                      </button>

                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:text-rose-500 transition-all"
                        title="Delete task"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Priority Selector Pills: 1, 2, 3, Add (Exact match to Mockup 3, 4, 5) */}
      <div className="flex items-center justify-center gap-3">
        {[1, 2, 3].map((pNum) => {
          const isSelected = activePriority === pNum;
          return (
            <button
              key={pNum}
              onClick={() => onSelectPriority(pNum as TaskPriority)}
              className={`w-12 h-12 rounded-full font-black text-sm transition-all duration-300 flex items-center justify-center shadow-sm ${
                isSelected
                  ? `${theme.primary} ${theme.primaryText} scale-110 ring-4 ring-black/5`
                  : 'bg-black/5 dark:bg-white/10 text-muted-foreground hover:scale-105'
              }`}
            >
              {pNum}
            </button>
          );
        })}

        {/* Add button pill */}
        <button
          onClick={() => setIsModalOpen(true)}
          className={`h-12 px-5 rounded-full font-bold text-xs tracking-wide transition-all duration-300 flex items-center gap-1.5 shadow-sm ${theme.pillBg} ${theme.pillText} hover:scale-105 active:scale-95`}
        >
          <Plus size={14} />
          <span>Add</span>
        </button>
      </div>

      {/* New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`w-full max-w-sm rounded-[32px] p-6 shadow-2xl border ${theme.cardBg} ${theme.cardBorder}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-black ${theme.textColor}`}>Create High-Impact Task</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1 ${theme.textMuted}`}>
                  Task Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read Research Paper Section 3"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-2xl border bg-black/5 dark:bg-white/10 ${theme.cardBorder} outline-none focus:ring-2 focus:ring-terracotta text-sm ${theme.textColor}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${theme.textMuted}`}>
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(Number(e.target.value) as TaskPriority)}
                    className={`w-full px-3 py-2.5 rounded-2xl border bg-black/5 dark:bg-white/10 ${theme.cardBorder} outline-none text-xs font-bold ${theme.textColor}`}
                  >
                    <option value={1}>Priority 1 (Critical)</option>
                    <option value={2}>Priority 2 (Important)</option>
                    <option value={3}>Priority 3 (Secondary)</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${theme.textMuted}`}>
                    Est. Sessions
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={newEst}
                    onChange={(e) => setNewEst(Number(e.target.value))}
                    className={`w-full px-3 py-2.5 rounded-2xl border bg-black/5 dark:bg-white/10 ${theme.cardBorder} outline-none text-xs font-bold ${theme.textColor}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1 ${theme.textMuted}`}>
                  Category / Project
                </label>
                <select
                  value={newProjectId}
                  onChange={(e) => setNewProjectId(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-2xl border bg-black/5 dark:bg-white/10 ${theme.cardBorder} outline-none text-xs font-bold ${theme.textColor}`}
                >
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.badge} {proj.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl text-xs font-bold bg-black/5 dark:bg-white/10 hover:opacity-80 transition-all text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 rounded-2xl text-xs font-extrabold ${theme.primary} ${theme.primaryText} hover:scale-105 active:scale-95 transition-all shadow-md`}
                >
                  Create Task
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
