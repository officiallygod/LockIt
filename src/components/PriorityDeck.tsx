import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  Check, 
  ListFilter, 
  X,
  Sparkles
} from 'lucide-react';
import { Task, Project, TaskPriority } from '../types';

interface PriorityDeckProps {
  userName: string;
  tasks: Task[];
  projects: Project[];
  activePriority: TaskPriority;
  onSelectPriority: (p: TaskPriority) => void;
  onStartTask: (task: Task) => void;
  onAddTask: (task: Omit<Task, 'id' | 'completedPomodoros' | 'isCompleted' | 'createdAt'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
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
  onUpdateTask,
  onDeleteTask,
  onOpenSettings,
}) => {
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  // Form states for Add / Edit
  const [modalTitle, setModalTitle] = useState('');
  const [modalPriority, setModalPriority] = useState<TaskPriority>(activePriority);
  const [modalEst, setModalEst] = useState(3);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Card Pagination State within the active priority
  const [cardIndex, setCardIndex] = useState(0);

  // Filter tasks belonging to current active priority
  const priorityTasks = tasks.filter((t) => t.priority === activePriority);

  // Reset pagination index when priority tab changes
  useEffect(() => {
    setCardIndex(0);
  }, [activePriority]);

  // Adjust cardIndex if tasks are deleted
  useEffect(() => {
    if (cardIndex >= priorityTasks.length && priorityTasks.length > 0) {
      setCardIndex(priorityTasks.length - 1);
    }
  }, [priorityTasks.length, cardIndex]);

  // Active task to display
  const currentTask: Task = priorityTasks[cardIndex] || {
    id: `template-${activePriority}`,
    title: activePriority === 1 ? 'Project research' : activePriority === 2 ? 'Deep Reading & Synthesis' : 'Organize notes & review',
    priority: activePriority,
    projectId: 'proj-1',
    estPomodoros: 3,
    completedPomodoros: 0,
    isCompleted: false,
    createdAt: new Date().toISOString(),
  };

  const isTemplateTask = !priorityTasks[cardIndex];

  // Card color based on active priority
  const cardColor = activePriority === 1 ? 'bg-[#FF5335]' : activePriority === 2 ? 'bg-[#503699]' : 'bg-[#E56345]';

  // Pagination navigation
  const handlePrevCard = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (priorityTasks.length <= 1) return;
    setCardIndex((prev) => (prev > 0 ? prev - 1 : priorityTasks.length - 1));
  };

  const handleNextCard = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (priorityTasks.length <= 1) return;
    setCardIndex((prev) => (prev < priorityTasks.length - 1 ? prev + 1 : 0));
  };

  // Open Add Modal
  const openAddModal = () => {
    setModalTitle('');
    setModalPriority(activePriority);
    setModalEst(3);
    setIsAddModalOpen(true);
  };

  // Open Edit Modal for current active task
  const openEditModal = (task: Task, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingTaskId(task.id);
    setModalTitle(task.title);
    setModalPriority(task.priority);
    setModalEst(task.estPomodoros);
    setIsEditModalOpen(true);
  };

  // Handle Add Submit
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) return;

    onAddTask({
      title: modalTitle.trim(),
      priority: modalPriority,
      estPomodoros: modalEst,
      projectId: 'proj-1',
    });

    onSelectPriority(modalPriority);
    setIsAddModalOpen(false);
  };

  // Handle Edit Submit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTaskId || !modalTitle.trim()) return;

    const existing = tasks.find((t) => t.id === editingTaskId);
    if (existing) {
      onUpdateTask({
        ...existing,
        title: modalTitle.trim(),
        priority: modalPriority,
        estPomodoros: modalEst,
      });
    }

    setIsEditModalOpen(false);
    setEditingTaskId(null);
  };

  // Handle Delete current task
  const handleDeleteCurrent = (taskId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isTemplateTask) return;
    onDeleteTask(taskId);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between max-w-4xl mx-auto px-6 sm:px-12 py-6 sm:py-10 select-none">
      {/* Top Bar: Tomato Logo + App Name + Actions (Screenshot 2 & 3) */}
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

        {/* Right side: Manage all cards button + Avatar */}
        <div className="flex items-center gap-2.5">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsManageModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[#251E35] dark:text-white text-xs font-bold transition-all"
            title="Manage all tasks & cards"
          >
            <ListFilter size={14} />
            <span className="hidden sm:inline">All Tasks ({tasks.length})</span>
          </motion.button>

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
      </div>

      {/* Main Title & Card Count Header */}
      <div className="my-5 sm:my-7 text-center sm:text-left flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#251E35] dark:text-white tracking-tight">
            Choose priorities
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
            Select a high-impact goal or swipe through your cards
          </p>
        </div>

        {/* Card Counter Badge if multiple cards exist */}
        {priorityTasks.length > 1 && (
          <div className="flex items-center justify-center gap-2 self-center sm:self-auto px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-xs font-bold text-[#251E35] dark:text-white">
            <span>Card {cardIndex + 1} of {priorityTasks.length}</span>
          </div>
        )}
      </div>

      {/* 3D Stacked Priority Card Container with Pagination Controls */}
      <div className="relative w-full flex-1 flex items-center justify-center py-4 sm:py-8">
        {/* Previous Card Arrow (if multiple cards exist) */}
        {priorityTasks.length > 1 && (
          <motion.button
            whileHover={{ scale: 1.15, x: -3 }}
            whileTap={{ scale: 0.85 }}
            onClick={handlePrevCard}
            className="absolute left-2 sm:left-6 md:left-12 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/80 dark:bg-[#2A2242]/80 backdrop-blur-md shadow-xl border border-black/5 dark:border-white/10 flex items-center justify-center text-[#251E35] dark:text-white cursor-pointer"
            title="Previous card"
          >
            <ChevronLeft size={22} />
          </motion.button>
        )}

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
            key={`card-${activePriority}-${currentTask.id}-${cardIndex}`}
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={`relative w-72 sm:w-88 md:w-[380px] h-90 sm:h-[480px] md:h-[520px] rounded-[46px] md:rounded-[54px] ${cardColor} text-white shadow-2xl p-7 sm:p-9 flex flex-col justify-between z-10 transition-colors duration-500 overflow-hidden group`}
          >
            {/* Subtle inner card light reflection */}
            <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            {/* Top Row: Pagination dots + Edit/Delete Actions */}
            <div className="relative z-10 flex items-center justify-between">
              {/* Pagination Dots (if multiple cards) */}
              <div className="flex items-center gap-1.5">
                {priorityTasks.length > 1 ? (
                  priorityTasks.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCardIndex(idx);
                      }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        cardIndex === idx ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      title={`Go to card ${idx + 1}`}
                    />
                  ))
                ) : (
                  <span className="text-[11px] font-bold uppercase tracking-widest text-white/70">
                    Priority {activePriority}
                  </span>
                )}
              </div>

              {/* Action Buttons: Edit and Delete */}
              {!isTemplateTask && (
                <div className="flex items-center gap-1.5">
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => openEditModal(currentTask, e)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md flex items-center justify-center text-white transition-all cursor-pointer shadow-sm"
                    title="Edit task name or pomodoros"
                  >
                    <Edit3 size={14} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => handleDeleteCurrent(currentTask.id, e)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-rose-500/80 backdrop-blur-md flex items-center justify-center text-white transition-all cursor-pointer shadow-sm"
                    title="Delete this card"
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </div>
              )}
            </div>

            {/* Central Round Glass Play Button */}
            <div className="flex flex-col items-center justify-center my-auto">
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={() => onStartTask(currentTask)}
                className="w-20 h-20 sm:w-26 sm:h-26 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl transition-all cursor-pointer"
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
                {currentTask.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/85 font-medium">
                Deadline: 31 Dec, 2026 • {currentTask.estPomodoros} Pomodoros
              </p>
            </div>

            {/* Bottom Row: "Priority" label & priority number */}
            <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/20 text-xs sm:text-sm font-semibold">
              <span className="text-white/80 uppercase tracking-wider font-bold">Priority</span>
              <span className="text-white font-black text-base sm:text-lg">{activePriority}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Next Card Arrow (if multiple cards exist) */}
        {priorityTasks.length > 1 && (
          <motion.button
            whileHover={{ scale: 1.15, x: 3 }}
            whileTap={{ scale: 0.85 }}
            onClick={handleNextCard}
            className="absolute right-2 sm:right-6 md:right-12 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/80 dark:bg-[#2A2242]/80 backdrop-blur-md shadow-xl border border-black/5 dark:border-white/10 flex items-center justify-center text-[#251E35] dark:text-white cursor-pointer"
            title="Next card"
          >
            <ChevronRight size={22} />
          </motion.button>
        )}
      </div>

      {/* Bottom Priority Selector Row (Screenshot 1 & 3): 1, 2, 3, Add */}
      <div className="flex items-center justify-center gap-3.5 sm:gap-5 pt-4 pb-2">
        {/* Priority 1 */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          onClick={() => onSelectPriority(1)}
          className={`w-13 h-13 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-black text-sm sm:text-base transition-all duration-300 shadow-md cursor-pointer ${
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
          className={`w-13 h-13 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-black text-sm sm:text-base transition-all duration-300 shadow-md cursor-pointer ${
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
          className={`w-13 h-13 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-black text-sm sm:text-base transition-all duration-300 shadow-md cursor-pointer ${
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
          onClick={openAddModal}
          className="h-13 sm:h-16 px-6 sm:px-8 rounded-full bg-[#18181B] dark:bg-white dark:text-[#18181B] text-white flex items-center gap-2 font-black text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:opacity-90 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Add</span>
        </motion.button>
      </div>

      {/* --- ADD PRIORITY TASK MODAL (HIGH CONTRAST, NO BUGGY DROPDOWNS) --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            className="w-full max-w-md rounded-[36px] p-7 sm:p-8 shadow-2xl bg-white dark:bg-[#1E1733] border border-black/10 dark:border-white/15"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-black text-[#251E35] dark:text-white">Add Priority Task</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              {/* Task Name Input */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Task Name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Project research"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-black/15 dark:border-white/20 bg-black/5 dark:bg-[#28213E] text-base font-bold outline-none text-[#251E35] dark:text-white placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-[#FF5335]"
                />
              </div>

              {/* Priority Custom Pill Selector (Solves the unreadable select issue!) */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                  Select Priority (Visible & Clear)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 1 as TaskPriority, label: 'Priority 1', color: 'bg-[#FF5335]', border: 'border-[#FF5335]' },
                    { id: 2 as TaskPriority, label: 'Priority 2', color: 'bg-[#503699]', border: 'border-[#503699]' },
                    { id: 3 as TaskPriority, label: 'Priority 3', color: 'bg-[#E56345]', border: 'border-[#E56345]' },
                  ].map((p) => {
                    const isSelected = modalPriority === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setModalPriority(p.id)}
                        className={`py-3 px-2 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? `${p.color} text-white shadow-md ring-2 ring-white/40 scale-102`
                            : 'bg-black/5 dark:bg-[#28213E] text-[#251E35] dark:text-white/80 hover:bg-black/10'
                        }`}
                      >
                        {isSelected && <Check size={13} className="stroke-[3]" />}
                        <span>{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Estimated Pomodoro Count */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Estimated Sessions (25m Pomos)
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setModalEst(num)}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                        modalEst === num
                          ? 'bg-[#FF5335] text-white shadow-sm'
                          : 'bg-black/5 dark:bg-[#28213E] text-[#251E35] dark:text-white/80'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3.5 rounded-2xl text-xs font-bold bg-black/5 dark:bg-[#28213E] text-muted-foreground hover:opacity-80 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-2xl text-xs font-black bg-[#FF5335] text-white shadow-xl hover:opacity-90 transition-all cursor-pointer"
                >
                  Add Card
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* --- EDIT TASK MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            className="w-full max-w-md rounded-[36px] p-7 sm:p-8 shadow-2xl bg-white dark:bg-[#1E1733] border border-black/10 dark:border-white/15"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-black text-[#251E35] dark:text-white">Edit Task Name & Details</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5">
              {/* Task Title */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Task Name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-black/15 dark:border-white/20 bg-black/5 dark:bg-[#28213E] text-base font-bold outline-none text-[#251E35] dark:text-white focus:ring-2 focus:ring-[#FF5335]"
                />
              </div>

              {/* Priority Selector */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 1 as TaskPriority, label: 'Priority 1', color: 'bg-[#FF5335]' },
                    { id: 2 as TaskPriority, label: 'Priority 2', color: 'bg-[#503699]' },
                    { id: 3 as TaskPriority, label: 'Priority 3', color: 'bg-[#E56345]' },
                  ].map((p) => {
                    const isSelected = modalPriority === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setModalPriority(p.id)}
                        className={`py-3 px-2 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? `${p.color} text-white shadow-md ring-2 ring-white/40 scale-102`
                            : 'bg-black/5 dark:bg-[#28213E] text-[#251E35] dark:text-white/80'
                        }`}
                      >
                        {isSelected && <Check size={13} className="stroke-[3]" />}
                        <span>{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Estimated Pomodoro Count */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Estimated Sessions
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setModalEst(num)}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                        modalEst === num
                          ? 'bg-[#FF5335] text-white shadow-sm'
                          : 'bg-black/5 dark:bg-[#28213E] text-[#251E35] dark:text-white/80'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save / Delete */}
              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (editingTaskId) {
                      onDeleteTask(editingTaskId);
                      setIsEditModalOpen(false);
                    }
                  }}
                  className="py-3.5 px-4 rounded-2xl text-xs font-bold bg-rose-500/15 text-rose-600 hover:bg-rose-500/25 cursor-pointer"
                >
                  Delete
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-2xl text-xs font-black bg-[#FF5335] text-white shadow-xl hover:opacity-90 transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* --- MANAGE ALL TASKS DRAWER / MODAL --- */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            className="w-full max-w-lg max-h-[85vh] rounded-[36px] p-7 sm:p-8 shadow-2xl bg-white dark:bg-[#1E1733] border border-black/10 dark:border-white/15 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-black text-[#251E35] dark:text-white">All Priority Tasks</h3>
                <p className="text-xs text-muted-foreground font-medium">Edit titles or delete old tasks</p>
              </div>
              <button
                onClick={() => setIsManageModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tasks List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 my-3 pr-1">
              {tasks.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-xs font-bold">
                  No tasks added yet. Tap "+ Add" to create your first card.
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-2xl bg-black/5 dark:bg-[#28213E] border border-black/5 dark:border-white/5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span
                        className={`w-6 h-6 rounded-full text-white text-[11px] font-black flex items-center justify-center shrink-0 ${
                          task.priority === 1 ? 'bg-[#FF5335]' : task.priority === 2 ? 'bg-[#503699]' : 'bg-[#E56345]'
                        }`}
                      >
                        {task.priority}
                      </span>
                      <div className="truncate">
                        <h4 className="text-sm font-bold text-[#251E35] dark:text-white truncate">
                          {task.title}
                        </h4>
                        <p className="text-[11px] text-muted-foreground font-medium">
                          {task.completedPomodoros} of {task.estPomodoros} pomos completed
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setIsManageModalOpen(false);
                          openEditModal(task);
                        }}
                        className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Edit task name"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-2 rounded-full hover:bg-rose-500/20 text-muted-foreground hover:text-rose-500 cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex justify-between items-center">
              <button
                onClick={() => {
                  setIsManageModalOpen(false);
                  openAddModal();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#FF5335] text-white text-xs font-black shadow-md cursor-pointer"
              >
                + Add New Card
              </button>
              <button
                onClick={() => setIsManageModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-bold text-[#251E35] dark:text-white cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
