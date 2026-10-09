import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Calendar, Clock, AlertTriangle, Flame, Sparkles, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DailyTask, ScheduledTask } from '../types';
import { formatDateKey } from '../utils/initialData';

interface TasksSectionProps {
  selectedDate: Date;
  todayDate: Date;
  dailyTasks: DailyTask[];
  scheduledTasks: ScheduledTask[];
  nationalHolidays: Record<string, string>;
  onToggleDailyTask: (id: string) => void;
  onEditDailyTask?: (task: DailyTask) => void;
  onDeleteDailyTask: (id: string) => void;
  onOpenAddDailyTask: () => void;
  onToggleScheduledTask: (id: string) => void;
  onEditScheduledTask: (task: ScheduledTask) => void;
  onDeleteScheduledTask: (id: string) => void;
  onOpenAddScheduledTask: () => void;
  onAdvanceRecurringScheduledTask?: (id: string) => void;
}

export function calculateDaysRemaining(deadlineStr: string): number {
  if (!deadlineStr) return 999;
  const target = new Date(deadlineStr + 'T23:59:59');
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Aturan Sisa Hari Catatan Jangan Sampai Lupa:
// 1 - 5 = Mepet Deadline
// 6 - 10 = Segera
// 11 - 15 = Siap2
// 16> = Masih Lama
export function getDeadlineColorStyle(days: number) {
  if (days <= 0) {
    return {
      label: 'Expired',
      badgeClass: 'bg-red-600 text-white border-red-500 font-extrabold shadow-xs',
      cardBorderClass: 'border-l-4 border-l-red-600',
      isMepet: true
    };
  }
  if (days >= 1 && days <= 5) {
    return {
      label: 'Mepet Deadline',
      badgeClass: 'bg-rose-600 text-white border-rose-500 font-extrabold shadow-xs',
      cardBorderClass: 'border-l-4 border-l-rose-500',
      isMepet: true
    };
  }
  if (days >= 6 && days <= 10) {
    return {
      label: 'Segera',
      badgeClass: 'bg-amber-500 text-white dark:bg-amber-600 border-amber-400 font-extrabold shadow-xs',
      cardBorderClass: 'border-l-4 border-l-amber-500',
      isMepet: false
    };
  }
  if (days >= 11 && days <= 15) {
    return {
      label: 'Siap2',
      badgeClass: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-bold',
      cardBorderClass: 'border-l-4 border-l-emerald-500',
      isMepet: false
    };
  }
  return {
    label: 'Masih Lama',
    badgeClass: 'bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800 font-semibold',
    cardBorderClass: 'border-l-4 border-l-sky-500',
    isMepet: false
  };
}

export const TasksSection: React.FC<TasksSectionProps> = ({
  selectedDate,
  todayDate,
  dailyTasks,
  scheduledTasks,
  nationalHolidays,
  onToggleDailyTask,
  onEditDailyTask,
  onDeleteDailyTask,
  onOpenAddDailyTask,
  onToggleScheduledTask,
  onEditScheduledTask,
  onDeleteScheduledTask,
  onOpenAddScheduledTask,
  onAdvanceRecurringScheduledTask
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'scheduled'>('daily');
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const selectedStr = formatDateKey(selectedDate);
  const isToday = selectedStr === formatDateKey(todayDate);
  const selectedYear = selectedDate.getFullYear();

  // Daily Tasks for selected date (sorted by completion status)
  const myDailyList = dailyTasks.filter(t => t.dateStr === selectedStr);
  const pendingCount = myDailyList.filter(t => !t.completed).length;

  const sortedDaily = [...myDailyList].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return 0;
  });

  // Scheduled tasks sorted
  const sortedScheduled = [...scheduledTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return calculateDaysRemaining(a.deadline) - calculateDaysRemaining(b.deadline);
  });

  // Count tasks that are mepet deadline (1-5 days or expired) and incomplete
  const mepetCount = scheduledTasks.filter(t => !t.completed && calculateDaysRemaining(t.deadline) <= 5).length;

  const repeatBadges: Record<string, { label: string; icon: string; bg: string }> = {
    daily: { label: 'Harian', icon: '🔁', bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
    weekly: { label: 'Mingguan', icon: '📅', bg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
    monthly: { label: 'Bulanan', icon: '🗓️', bg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
    '3months': { label: 'Per 3 Bulan', icon: '🗓️', bg: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800' },
    '6months': { label: 'Per 6 Bulan', icon: '🗓️', bg: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' },
    yearly: { label: 'Tahunan', icon: '🎂', bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' }
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all">
      {/* Header Utama Section (Ringkas & Bersih) */}
      <div className="px-5 sm:px-7 pt-5 sm:pt-6 pb-4">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-8 rounded-full bg-sky-500 shrink-0" />
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                Pekerjaan Saya
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
              {myDailyList.length + scheduledTasks.length} Agenda
            </span>
            {/* Tombol Hide / Show dengan status dan animasi transisi halus */}
            <button
              type="button"
              onClick={() => setIsCollapsed(prev => !prev)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-xs active:scale-95"
              title={isCollapsed ? 'Tampilkan Pekerjaan Saya' : 'Sembunyikan Pekerjaan Saya'}
            >
              {isCollapsed ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>Show</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Hide</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Animated Wrapper untuk Show / Hide */}
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              key="tasks-collapsible-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              {/* 2 TAB NAVIGATION: Catatan Harian vs Catatan Jangan Sampai Lupa */}
              <div className="pt-3 pb-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 gap-1.5 sm:gap-2">
                  {/* TAB 1 */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('daily')}
                    className={`py-2.5 px-3 sm:px-4 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      activeTab === 'daily'
                        ? 'bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-300 shadow-md shadow-cyan-500/10 border border-cyan-300 dark:border-cyan-700'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">📅</span>
                      <span className="truncate font-extrabold">Catatan Harian</span>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5">
                      {pendingCount > 0 ? (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                          {pendingCount} Belum
                        </span>
                      ) : myDailyList.length > 0 ? (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          ✓ Tuntas ({myDailyList.length})
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          0
                        </span>
                      )}
                    </div>
                  </button>

                  {/* TAB 2 */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('scheduled')}
                    className={`py-2.5 px-3 sm:px-4 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      activeTab === 'scheduled'
                        ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-md shadow-indigo-500/10 border border-indigo-300 dark:border-indigo-700'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">⏰</span>
                      <span className="truncate font-extrabold">Catatan Jangan Sampai Lupa</span>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5">
                      {mepetCount > 0 && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-xs flex items-center gap-0.5">
                          🔥 {mepetCount} Mepet
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {scheduledTasks.length} Agenda
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* ISI KONTEN DENGAN TRANSISI HALUS ANTAR TAB */}
              <div className="pt-1 pb-2">
                <AnimatePresence mode="wait">
                  {activeTab === 'daily' ? (
                    <motion.div
                      key="tab-content-daily"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      {/* TAB 1: Catatan Harian (Warna bersih & elegan tanpa prioritas berlebih) */}
                      <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative transition-all shadow-xs">
                        <div>
                          {/* Header Konten: Tanggal & Aksi Tambah */}
                          <div className="flex items-center justify-between gap-3 mb-3.5 pb-3 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className={`w-1.5 h-6 rounded-full ${pendingCount > 0 ? 'bg-rose-500' : 'bg-cyan-500'} shrink-0`} />
                              <div className="flex items-center gap-2 flex-wrap min-w-0">
                                <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100">
                                  📅 {selectedDate.getDate()} {shortMonthNames[selectedDate.getMonth()]} {selectedYear}
                                </span>
                                {isToday && (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-200 border border-cyan-200 dark:border-cyan-800">
                                    Hari Ini
                                  </span>
                                )}
                                {/* SATU-SATUNYA NOTIFIKASI BERKEDIP PADA CATATAN HARIAN (Permintaan User: buat 1 saja) */}
                                {pendingCount > 0 ? (
                                  <span className="text-[10px] sm:text-[11px] font-bold text-rose-700 dark:text-rose-200 bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-700 px-2.5 py-0.5 rounded-full shadow-2xs animate-badge-blink flex items-center gap-1">
                                    <span>⚠️ {pendingCount} Belum Selesai</span>
                                  </span>
                                ) : myDailyList.length > 0 ? (
                                  <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                                    <span>✓ Semua Tuntas</span>
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={onOpenAddDailyTask}
                                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                                title="Tambah Catatan Harian Pribadi"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Tambah Tugas</span>
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2.5">
                            {sortedDaily.length === 0 ? (
                              <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs font-body italic bg-white/50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                                <p className="text-base mb-1">📝</p>
                                Belum ada agenda catatan harian di tanggal {selectedDate.getDate()} {shortMonthNames[selectedDate.getMonth()]} {selectedYear}.
                              </div>
                            ) : (
                              sortedDaily.map(task => (
                                <div
                                  key={task.id}
                                  className={`p-3 rounded-2xl ${
                                    task.completed
                                      ? 'bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 opacity-60 shadow-none'
                                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
                                  } flex items-center justify-between gap-3 transition-all hover:shadow-md`}
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <input
                                      type="checkbox"
                                      checked={task.completed}
                                      onChange={() => onToggleDailyTask(task.id)}
                                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer accent-sky-600"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p
                                        className={`text-xs sm:text-sm font-semibold truncate ${
                                          task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'
                                        }`}
                                      >
                                        {task.title}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    {onEditDailyTask && (
                                      <button
                                        onClick={() => onEditDailyTask(task)}
                                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-sky-600 transition-colors cursor-pointer"
                                        title="Edit Catatan Harian"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => onDeleteDailyTask(task.id)}
                                      className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                      title="Hapus"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="tab-content-scheduled"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      {/* TAB 2: Catatan Jangan Sampai Lupa */}
                      <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative shadow-xs">
                        <div>
                          {/* Header Konten: Info & Aksi Tambah */}
                          <div className="flex items-center justify-between gap-3 mb-3.5 pb-3 border-b border-slate-200 dark:border-slate-800 flex-wrap">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="w-1.5 h-6 rounded-full bg-indigo-500 shrink-0" />
                              <div className="min-w-0 flex items-center gap-2 flex-wrap">
                                <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100">
                                  🎯 Daftar Pengingat & Jatuh Tempo
                                </span>

                                {/* Tombol "!" Info Sisa Hari */}
                                <div className="relative inline-block group">
                                  <button
                                    type="button"
                                    onClick={() => setShowInfoTooltip(!showInfoTooltip)}
                                    className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 font-black text-[11px] flex items-center justify-center hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors shadow-2xs cursor-pointer ring-1 ring-indigo-300 dark:ring-indigo-700"
                                    title="Klik / Arahkan mouse untuk info Indikator Sisa Hari"
                                  >
                                    !
                                  </button>

                                  {/* Popup Tooltip */}
                                  <div
                                    className={`absolute left-0 sm:left-auto sm:right-0 top-full mt-2 z-40 w-64 p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-indigo-200 dark:border-indigo-800 text-xs transition-all pointer-events-auto ${
                                      showInfoTooltip ? 'block' : 'hidden group-hover:block'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800 mb-2">
                                      <span className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 text-xs">
                                        <span>⏱️</span> Indikator Sisa Hari
                                      </span>
                                      <span className="text-[10px] text-slate-400">Batas Waktu</span>
                                    </div>
                                    <div className="space-y-1 text-[11px]">
                                      <div className="flex items-center justify-between p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold">
                                        <span>1 - 5 Hari</span>
                                        <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px]">Mepet Deadline 🔥</span>
                                      </div>
                                      <div className="flex items-center justify-between p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold">
                                        <span>6 - 10 Hari</span>
                                        <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white text-[10px]">Segera ⚡</span>
                                      </div>
                                      <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold">
                                        <span>11 - 15 Hari</span>
                                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 text-[10px]">Siap2 ⏳</span>
                                      </div>
                                      <div className="flex items-center justify-between p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold">
                                        <span>16&gt; Hari</span>
                                        <span className="px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 border border-sky-300 dark:border-sky-700 text-[10px]">Masih Lama 🍃</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] font-semibold text-indigo-800 dark:text-indigo-300 bg-white dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full shadow-2xs">
                                {scheduledTasks.filter(t => t.completed).length}/{scheduledTasks.length} Selesai
                              </span>
                              <button
                                onClick={onOpenAddScheduledTask}
                                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                                title="Tambah Catatan Jangan Sampai Lupa Baru"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Tambah Catatan</span>
                              </button>
                            </div>
                          </div>

              <div className="space-y-2.5">
                {sortedScheduled.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs font-body italic bg-white/50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-base mb-1">⏰</p>
                    Belum ada Catatan Jangan Sampai Lupa yang dijadwalkan.
                  </div>
                ) : (
                  sortedScheduled.map(task => {
                    const days = calculateDaysRemaining(task.deadline);
                    const style = getDeadlineColorStyle(days);
                    const isTaskMepet = style.isMepet && !task.completed;
                    const repeatInfo = task.repeat && repeatBadges[task.repeat];

                    return (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-2xl ${
                          task.completed
                            ? 'bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 opacity-60 shadow-none'
                            : isTaskMepet
                            ? 'task-mepet-deadline-pulse'
                            : `bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${style.cardBorderClass}`
                        } flex flex-col gap-2 transition-all hover:shadow-md`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => onToggleScheduledTask(task.id)}
                              className={`w-4 h-4 mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600 ${
                                isTaskMepet ? 'ring-2 ring-rose-500 ring-offset-1' : ''
                              }`}
                            />
                            <div className="min-w-0 flex-1">
                              <p
                                className={`text-xs font-bold truncate flex items-center gap-1.5 ${
                                  task.completed
                                    ? 'line-through text-slate-400 dark:text-slate-500'
                                    : isTaskMepet
                                    ? 'text-rose-950 dark:text-rose-100 font-extrabold'
                                    : 'text-slate-800 dark:text-slate-100'
                                }`}
                              >
                                {isTaskMepet && !task.completed && (
                                  <span className="text-rose-600 dark:text-rose-400 shrink-0" title="Perhatian: Mepet Deadline!">
                                    🔥
                                  </span>
                                )}
                                <span className="truncate">{task.title}</span>
                              </p>

                              {/* 3 Tampilan Terpisah: 1. Deadline, 2. Sisa Hari (Jelas & Menonjol), 3. Tombol Keterangan (Hover) */}
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                {/* 1. Tampilan Deadline */}
                                <div className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1.5 shrink-0">
                                  <span className="text-slate-400 font-medium">📅 Deadline:</span>
                                  <span className="font-extrabold text-slate-900 dark:text-white">
                                    {task.deadline || 'Tanpa Batas'}
                                  </span>
                                </div>

                                {/* 2. Tampilan Sisa Hari (Nampak Jelas & Menonjol) */}
                                {task.completed ? (
                                  <div className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold border border-slate-200 dark:border-slate-700 shrink-0 flex items-center gap-1">
                                    <span>✓</span>
                                    <span>Selesai</span>
                                  </div>
                                ) : days <= 5 ? (
                                  <div className="px-3 py-1 rounded-xl bg-rose-600 text-white font-black text-xs shadow-md shadow-rose-500/30 flex items-center gap-1.5 border border-rose-500 animate-pulse shrink-0">
                                    <span className="text-sm">🔥</span>
                                    <span>{days > 0 ? `${days} Hari Lagi` : 'Lewat Deadline'}</span>
                                    <span className="text-[10px] font-medium opacity-90">({style.label})</span>
                                  </div>
                                ) : days <= 10 ? (
                                  <div className="px-3 py-1 rounded-xl bg-amber-500 text-white font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 border border-amber-400 shrink-0">
                                    <span className="text-sm">⚡</span>
                                    <span>{days} Hari Lagi</span>
                                    <span className="text-[10px] font-medium opacity-90">({style.label})</span>
                                  </div>
                                ) : days <= 15 ? (
                                  <div className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 border border-emerald-500 shrink-0">
                                    <span className="text-sm">⏳</span>
                                    <span>{days} Hari Lagi</span>
                                    <span className="text-[10px] font-medium opacity-90">({style.label})</span>
                                  </div>
                                ) : (
                                  <div className="px-3 py-1 rounded-xl bg-sky-600 text-white font-black text-xs shadow-md shadow-sky-500/20 flex items-center gap-1.5 border border-sky-500 shrink-0">
                                    <span className="text-sm">🍃</span>
                                    <span>{days} Hari Lagi</span>
                                    <span className="text-[10px] font-medium opacity-90">({style.label})</span>
                                  </div>
                                )}

                                {/* 3. Tombol Keterangan (Saat mouse di atasnya muncul informasi keterangan) */}
                                {task.notes && (
                                  <div className="relative group inline-block shrink-0">
                                    <button
                                      type="button"
                                      className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                                      title="Arahkan mouse atau klik untuk membaca keterangan tambahan"
                                    >
                                      <span>📝</span>
                                      <span>Keterangan</span>
                                    </button>

                                    {/* Popover Tooltip Keterangan saat mouse hover */}
                                    <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 z-40 hidden group-hover:block group-focus:block bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-2xl border-2 border-indigo-300 dark:border-indigo-700 text-xs w-72 max-w-[85vw] space-y-1.5 animate-pop-check pointer-events-auto">
                                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                                        <span className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 text-xs">
                                          <span>📝</span> Keterangan Tambahan
                                        </span>
                                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold font-mono">
                                          Info
                                        </span>
                                      </div>
                                      <p className="text-slate-600 dark:text-slate-300 font-body leading-relaxed whitespace-pre-wrap text-[11px] max-h-48 overflow-y-auto">
                                        {task.notes}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Lencana Pengulangan Rutin (jika ada) */}
                                {repeatInfo && (
                                  <div className={`px-2.5 py-1 rounded-xl border font-bold text-xs flex items-center gap-1 shrink-0 ${repeatInfo.bg}`}>
                                    <span>{repeatInfo.icon}</span>
                                    <span>{repeatInfo.label}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => onEditScheduledTask(task)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                              title="Edit Catatan"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteScheduledTask(task.id)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</motion.div>
)}
</AnimatePresence>
</div>
</section>
  );
};

