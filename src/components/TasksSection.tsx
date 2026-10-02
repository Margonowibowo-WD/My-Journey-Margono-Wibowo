import React from 'react';
import { Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
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
}

export function calculateDaysRemaining(deadlineStr: string): number {
  if (!deadlineStr) return 999;
  const target = new Date(deadlineStr + 'T23:59:59');
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getDeadlineColorStyle(days: number) {
  if (days <= 0) {
    return {
      label: 'Expired',
      badgeClass: 'bg-red-600 text-white border-red-500 font-extrabold shadow-xs',
      cardBorderClass: 'border-l-4 border-l-red-600',
      isMepet: true
    };
  }
  if (days <= 5) {
    return {
      label: 'Mepet Deadline',
      badgeClass: 'bg-rose-600 text-white border-rose-500 font-extrabold shadow-xs',
      cardBorderClass: 'border-l-4 border-l-rose-500',
      isMepet: true
    };
  }
  if (days <= 10) {
    return {
      label: 'Segera',
      badgeClass: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800 font-semibold',
      cardBorderClass: 'border-l-4 border-l-amber-500',
      isMepet: false
    };
  }
  if (days <= 15) {
    return {
      label: 'Siap',
      badgeClass: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-semibold',
      cardBorderClass: 'border-l-4 border-l-emerald-500',
      isMepet: false
    };
  }
  return {
    label: 'Masih Lama',
    badgeClass: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800 font-semibold',
    cardBorderClass: 'border-l-4 border-l-blue-500',
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
  onOpenAddScheduledTask
}) => {
  const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const selectedStr = formatDateKey(selectedDate);
  const isToday = selectedStr === formatDateKey(todayDate);
  const selectedYear = selectedDate.getFullYear();

  // Daily Tasks for selected date
  const myDailyList = dailyTasks.filter(t => t.dateStr === selectedStr);
  const pendingCount = myDailyList.filter(t => !t.completed).length;

  const priorityWeight = { high: 1, medium: 2, low: 3 };
  const sortedDaily = [...myDailyList].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return (priorityWeight[a.priority] || 2) - (priorityWeight[b.priority] || 2);
  });

  // Scheduled tasks sorted
  const sortedScheduled = [...scheduledTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return calculateDaysRemaining(a.deadline) - calculateDaysRemaining(b.deadline);
  });

  // Determine glow color for daily tasks container
  const containerGlow = pendingCount > 0 ? 'container-pending-glow border-rose-500 dark:border-rose-600 shadow-rose-500/30' : '';

  return (
    <section className="bg-gradient-to-br from-slate-50/90 via-sky-50/20 to-white dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/15 rounded-3xl shadow-sm border border-sky-100/70 dark:border-slate-800 overflow-hidden">
      <div className="px-5 sm:px-7 pt-5 sm:pt-6">
        <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-100 dark:border-slate-800">
          <span className="w-1.5 h-11 rounded-full bg-sky-500 shrink-0" />
          <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 text-xl">
            📋
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
              Tugas & Agenda Pribadi
            </p>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                Pekerjaan Saya
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                {myDailyList.length + scheduledTasks.length} Agenda
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-body mt-0.5">
              Kelola catatan harian dan catatan terjadwal Anda di sini.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Catatan Harian Section */}
        <div className={`bg-gradient-to-br from-cyan-100/90 via-sky-50/80 to-blue-50/70 dark:from-cyan-950/60 dark:via-slate-900 dark:to-sky-950/40 border-2 ${pendingCount > 0 ? 'border-rose-400 dark:border-rose-600' : 'border-cyan-300 dark:border-cyan-700/80'} rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative transition-all shadow-sm ${containerGlow}`}>
          <div>
            <div className="flex items-center justify-between gap-3 mb-3.5 pb-3 border-b-2 border-cyan-200/80 dark:border-cyan-900/60">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-1.5 h-9 rounded-full ${pendingCount > 0 ? 'bg-rose-500' : 'bg-cyan-500'} shrink-0`} />
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-400">
                    Agenda Harian
                  </p>
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate">
                    Catatan Harian <span className="font-normal text-slate-600 dark:text-slate-400">({selectedDate.getDate()} {shortMonthNames[selectedDate.getMonth()]} {selectedYear}{isToday ? ' - Hari Ini' : ''})</span>
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {pendingCount > 0 ? (
                  <span className="text-[11px] font-bold text-rose-700 dark:text-rose-200 bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-700 px-2.5 py-0.5 rounded-full shadow-2xs animate-badge-blink flex items-center gap-1">
                    <span>⚠️</span>
                    <span>{pendingCount} Belum Selesai</span>
                  </span>
                ) : myDailyList.length > 0 ? (
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                    <span>✓</span>
                    <span>Tuntas ({myDailyList.length})</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-500 bg-white/90 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    0/0
                  </span>
                )}
                <button
                  onClick={onOpenAddDailyTask}
                  className="w-7 h-7 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-sm flex items-center justify-center cursor-pointer transition-all active:scale-95"
                  title="Tambah Catatan Harian Pribadi"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {sortedDaily.length === 0 ? (
                <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs font-body italic">
                  Belum ada agenda pribadi di tanggal ini.
                </div>
              ) : (
                sortedDaily.map(task => {
                  const pColors = {
                    high: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900',
                    medium: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900',
                    low: 'text-slate-600 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  };
                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded-2xl ${
                        task.completed
                          ? 'bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 opacity-60 shadow-none'
                          : 'bg-white dark:bg-slate-900 border border-l-4 border-l-rose-500 border-rose-200 dark:border-rose-900/60 shadow-xs'
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
                            className={`text-xs font-bold truncate ${
                              task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-1.5 flex-wrap mt-1">
                            <span
                              className={`inline-block text-[10px] px-1.5 py-0.5 rounded font-semibold border ${
                                task.completed
                                  ? 'text-slate-400 dark:text-slate-500 bg-slate-100/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60'
                                  : pColors[task.priority] || pColors.medium
                              }`}
                            >
                              Prioritas {task.priority === 'high' ? 'Tinggi' : task.priority === 'low' ? 'Rendah' : 'Sedang'}
                            </span>
                            {!task.completed ? (
                              <span className="inline-block text-[10px] px-1.5 py-0.5 rounded font-bold border bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 animate-pulse">
                                Belum Selesai
                              </span>
                            ) : (
                              <span className="inline-block text-[10px] px-1.5 py-0.5 rounded font-medium border text-slate-400 dark:text-slate-500 bg-slate-100/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60">
                                ✓ Selesai
                              </span>
                            )}
                          </div>
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
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Catatan Terjadwal Section */}
        <div className="bg-gradient-to-br from-indigo-100/90 via-purple-50/80 to-indigo-50/70 dark:from-indigo-950/60 dark:via-slate-900 dark:to-purple-950/40 border-2 border-indigo-300 dark:border-indigo-700/80 rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative shadow-sm">
          <div>
            <div className="flex items-center justify-between gap-3 mb-3.5 pb-3 border-b-2 border-indigo-200/80 dark:border-indigo-900/60">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-1.5 h-9 rounded-full bg-indigo-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-400">
                    Agenda Terjadwal
                  </p>
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate">
                    Catatan Terjadwal Pribadi
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-semibold text-indigo-800 dark:text-indigo-300 bg-white/90 dark:bg-indigo-950/70 border border-indigo-300 dark:border-indigo-800 px-2 py-0.5 rounded-full shadow-2xs">
                  {scheduledTasks.filter(t => t.completed).length}/{scheduledTasks.length}
                </span>
                <button
                  onClick={onOpenAddScheduledTask}
                  className="w-7 h-7 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center justify-center cursor-pointer transition-all active:scale-95"
                  title="Tambah Catatan Terjadwal Baru"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {sortedScheduled.length === 0 ? (
                <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs font-body italic">
                  Belum ada catatan terjadwal pribadi.
                </div>
              ) : (
                sortedScheduled.map(task => {
                  const days = calculateDaysRemaining(task.deadline);
                  const style = getDeadlineColorStyle(days);
                  const isTaskMepet = style.isMepet && !task.completed;

                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded-2xl ${
                        task.completed
                          ? 'bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 opacity-60 shadow-none'
                          : isTaskMepet
                          ? 'task-mepet-deadline-pulse'
                          : `bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${style.cardBorderClass}`
                      } flex items-center justify-between gap-3 transition-all hover:shadow-md`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => onToggleScheduledTask(task.id)}
                          className={`w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600 ${
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
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px]">
                            <span className="text-slate-400 dark:text-slate-500">Mulai: {task.scheduledDate || '-'}</span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span
                              className={`px-2 py-0.5 rounded-md border ${
                                task.completed
                                  ? 'text-slate-400 dark:text-slate-500 bg-slate-100/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 font-medium'
                                  : `${style.badgeClass} font-bold`
                              }`}
                            >
                              {task.completed
                                ? (task.deadline ? `Deadline: ${task.deadline} (Selesai)` : 'Tanpa Deadline')
                                : (task.deadline ? `Deadline: ${task.deadline} (${style.label})` : 'Tanpa Deadline')}
                            </span>
                            {task.completed && (
                              <span className="px-1.5 py-0.5 rounded font-medium border text-slate-400 dark:text-slate-500 bg-slate-100/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60">
                                ✓ Selesai
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onEditScheduledTask(task)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                          title="Edit"
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
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
