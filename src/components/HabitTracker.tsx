import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, Eye, EyeOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Habit } from '../types';
import { formatDateKey } from '../utils/initialData';

interface HabitTrackerProps {
  habits: Habit[];
  currentViewYear: number;
  currentViewMonth: number;
  selectedDate: Date;
  todayDate: Date;
  onToggleHabitDay: (habitId: string, dateStr: string) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  onOpenAddHabitModal: () => void;
}

export const normalizeHabitColor = (color: string): string => {
  const legacyMap: Record<string, string> = {
    emerald: '#10b981',
    indigo: '#6366f1',
    amber: '#f59e0b',
    rose: '#e11d48',
    purple: '#8b5cf6'
  };
  return legacyMap[color] || color || '#10b981';
};

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export const HabitTracker: React.FC<HabitTrackerProps> = ({
  habits,
  currentViewYear,
  currentViewMonth,
  selectedDate,
  todayDate,
  onToggleHabitDay,
  onEditHabit,
  onDeleteHabit,
  onOpenAddHabitModal
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const daysInMonth = new Date(currentViewYear, currentViewMonth + 1, 0).getDate();
  const todayStr = formatDateKey(todayDate);
  const selectedStr = formatDateKey(selectedDate);

  return (
    <section className="bg-gradient-to-br from-emerald-100/90 via-teal-50/80 to-emerald-50/70 dark:from-emerald-950/60 dark:via-slate-900 dark:to-teal-950/40 rounded-3xl p-5 sm:p-7 shadow-sm border-2 border-emerald-300 dark:border-emerald-700/80 space-y-4">
      {/* Header Utama Section */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b-2 border-emerald-200/80 dark:border-emerald-900/60">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-1.5 h-10 rounded-full bg-emerald-500 shrink-0" />
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-800 dark:text-emerald-300">
              Pelacak Kebiasaan
            </p>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight truncate">
              Habit Tracker Matrix <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-sm">({monthNames[currentViewMonth]} {currentViewYear})</span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100/90 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700 shrink-0">
            {habits.length} Kebiasaan
          </span>

          {/* Tombol Show / Hide dengan animasi transisi halus */}
          <button
            type="button"
            onClick={() => setIsCollapsed(prev => !prev)}
            className="px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-emerald-200 dark:border-slate-700 cursor-pointer shadow-xs active:scale-95"
            title={isCollapsed ? 'Tampilkan Habit Tracker Matrix' : 'Sembunyikan Habit Tracker Matrix'}
          >
            {isCollapsed ? (
              <>
                <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
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

      {/* Konten Collapsible dengan Animasi Memanjakan Mata */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            key="habit-matrix-collapsible"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden space-y-4 pt-1"
          >
            {/* Baris Tombol Tambah Kebiasaan */}
            <div className="flex justify-end">
              <button
                onClick={onOpenAddHabitModal}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Tambah Kebiasaan Baru
              </button>
            </div>

            {/* MATRIX TABLE */}
            <div className="overflow-x-auto rounded-2xl border border-emerald-300/80 dark:border-emerald-800/80 bg-white/95 dark:bg-slate-900/95 shadow-xs">
              <div className="min-w-[780px] p-4">
                {/* Header Row */}
                <div
                  className="grid gap-1 items-center pb-2 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500"
                  style={{
                    gridTemplateColumns: `190px repeat(${daysInMonth}, minmax(22px, 1fr)) 64px`
                  }}
                >
                  <div>Kebiasaan Margono</div>
                  {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const day = idx + 1;
                    const cellDate = new Date(currentViewYear, currentViewMonth, day);
                    const cellDateStr = formatDateKey(cellDate);
                    const isCurrentDay = cellDateStr === todayStr;
                    const isSelectedDayCol = cellDateStr === selectedStr;

                    let colHighlightClass = '';
                    if (isCurrentDay) {
                      colHighlightClass = 'bg-sky-500/15 dark:bg-sky-500/25 ring-2 ring-sky-500/80 rounded-md font-extrabold text-sky-600 dark:text-sky-400';
                    } else if (isSelectedDayCol) {
                      colHighlightClass = 'bg-indigo-500/15 dark:bg-indigo-500/25 ring-2 ring-indigo-500/80 rounded-md font-bold text-indigo-600 dark:text-indigo-400';
                    }

                    return (
                      <div key={`header-day-${day}`} className={`text-center py-1 ${colHighlightClass}`}>
                        {day}
                      </div>
                    );
                  })}
                  <div className="text-center">Aksi</div>
                </div>

                {/* Habit Rows */}
                <div className="space-y-2 mt-3">
                  {habits.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs font-medium">
                      Belum ada kebiasaan yang ditambahkan. Klik tombol "Tambah Kebiasaan Baru" di atas.
                    </div>
                  ) : (
                    habits.map(habit => {
                      const hexColor = normalizeHabitColor(habit.color);
                      return (
                        <div
                          key={habit.id}
                          className="grid gap-1 items-center"
                          style={{
                            gridTemplateColumns: `190px repeat(${daysInMonth}, minmax(22px, 1fr)) 64px`
                          }}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span
                              className="w-3 h-3 rounded-full shrink-0 shadow-xs ring-1 ring-slate-300 dark:ring-slate-700"
                              style={{ backgroundColor: hexColor }}
                              title={`Indikator Warna: ${habit.color}`}
                            />
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title={habit.name}>
                              {habit.name}
                            </span>
                          </div>

                          {Array.from({ length: daysInMonth }).map((_, idx) => {
                            const day = idx + 1;
                            const dateStr = `${currentViewYear}-${String(currentViewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const isDone = !!(habit.completions && habit.completions[dateStr]);

                            const isCurrentDay = dateStr === todayStr;
                            const isSelectedDayCol = dateStr === selectedStr;

                            let cellHighlightBorder = '';
                            if (isCurrentDay) {
                              cellHighlightBorder = 'ring-2 ring-sky-500 ring-offset-1 z-10';
                            } else if (isSelectedDayCol) {
                              cellHighlightBorder = 'ring-2 ring-indigo-500 ring-offset-1 z-10';
                            }

                            return (
                              <div
                                key={`habit-${habit.id}-day-${day}`}
                                onClick={() => onToggleHabitDay(habit.id, dateStr)}
                                className={`h-6 w-full rounded cursor-pointer transition-all flex items-center justify-center text-[9px] font-black select-none ${cellHighlightBorder} ${
                                  isDone
                                    ? 'text-white shadow-xs hover:opacity-90'
                                    : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                                style={isDone ? { backgroundColor: hexColor } : undefined}
                              >
                                {isDone ? '✓' : ''}
                              </div>
                            );
                          })}

                          <div className="flex items-center justify-center gap-0.5">
                            <button
                              onClick={() => onEditHabit(habit)}
                              className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                              title="Edit Kebiasaan"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteHabit(habit.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                              title="Hapus Kebiasaan"
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
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
