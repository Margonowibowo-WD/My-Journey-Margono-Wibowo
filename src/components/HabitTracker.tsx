import React from 'react';
import { Plus, Edit2, Trash2, Check } from 'lucide-react';
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
  const daysInMonth = new Date(currentViewYear, currentViewMonth + 1, 0).getDate();
  const todayStr = formatDateKey(todayDate);
  const selectedStr = formatDateKey(selectedDate);

  return (
    <section className="bg-gradient-to-br from-emerald-100/90 via-teal-50/80 to-emerald-50/70 dark:from-emerald-950/60 dark:via-slate-900 dark:to-teal-950/40 rounded-3xl p-5 sm:p-7 shadow-sm border-2 border-emerald-300 dark:border-emerald-700/80 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-emerald-200/80 dark:border-emerald-900/60">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-11 rounded-full bg-emerald-500 shrink-0" />
          <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-800 dark:text-emerald-300">
              Pelacak Kebiasaan
            </p>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
              Habit Tracker Matrix
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-body mt-0.5">
              Klik kotak kecil tanggal untuk menyalakan atau mematikan status kebiasaan baik harian.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddHabitModal}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambah Kebiasaan Baru
        </button>
      </div>

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
            {habits.map(habit => {
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
                    {/* Titik kecil warna habit agar Pak Margono tahu warna apa yang digunakan */}
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
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
