import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Clock, Eye, EyeOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { TimeCategory, TimeTrackingData } from '../types';

interface TimeTrackerProps {
  currentViewYear: number;
  currentViewMonth: number;
  selectedDate: Date;
  todayDate: Date;
  timeCategories: TimeCategory[];
  activeCategoryId: string;
  timeTracking: TimeTrackingData;
  onSelectCategory: (id: string) => void;
  onEditCategory: (cat: TimeCategory) => void;
  onDeleteCategory: (id: string) => void;
  onTogglePixel: (dateStr: string, hour: number) => void;
  onResetMonth: () => void;
  onOpenAddCategoryModal: () => void;
  onSelectDate: (year: number, month: number, day: number) => void;
}

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export const TimeTracker: React.FC<TimeTrackerProps> = ({
  currentViewYear,
  currentViewMonth,
  selectedDate,
  todayDate,
  timeCategories,
  activeCategoryId,
  timeTracking,
  onSelectCategory,
  onEditCategory,
  onDeleteCategory,
  onTogglePixel,
  onResetMonth,
  onOpenAddCategoryModal,
  onSelectDate
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const daysInMonth = new Date(currentViewYear, currentViewMonth + 1, 0).getDate();

  // Map category id to full object
  const categoryMap: Record<string, TimeCategory> = {};
  timeCategories.forEach(c => {
    categoryMap[c.id] = c;
  });

  // Calculate statistics for the current view month
  const counts: Record<string, number> = {};
  let totalFilledHours = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentViewYear}-${String(currentViewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayData = timeTracking[dateStr] || {};
    for (let h = 0; h < 24; h++) {
      const catId = dayData[h];
      if (catId) {
        counts[catId] = (counts[catId] || 0) + 1;
        totalFilledHours++;
      }
    }
  }

  return (
    <section className="bg-gradient-to-br from-purple-100/90 via-violet-50/80 to-indigo-50/70 dark:from-purple-950/60 dark:via-slate-900 dark:to-violet-950/40 rounded-3xl p-5 sm:p-7 shadow-sm border-2 border-purple-300 dark:border-purple-700/80 space-y-4">
      {/* Header Utama Section */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b-2 border-purple-200/80 dark:border-purple-900/60">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-1.5 h-10 rounded-full bg-violet-500 shrink-0" />
          <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-purple-800 dark:text-purple-300">
              Manajemen Waktu
            </p>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight flex items-center gap-2 flex-wrap">
              <span>Time Tracker 24 Jam Pixel</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/90 dark:bg-violet-950/80 text-violet-800 dark:text-violet-300 border border-violet-300 dark:border-violet-800 shadow-2xs">
                {monthNames[currentViewMonth]} {currentViewYear}
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100/90 dark:bg-purple-950/90 text-purple-800 dark:text-purple-300 border border-purple-300/80 dark:border-purple-700 shrink-0">
            {totalFilledHours} Jam Tercatat
          </span>

          {/* Tombol Show / Hide dengan animasi transisi halus */}
          <button
            type="button"
            onClick={() => setIsCollapsed(prev => !prev)}
            className="px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-purple-200 dark:border-slate-700 cursor-pointer shadow-xs active:scale-95"
            title={isCollapsed ? 'Tampilkan Time Tracker 24 Jam Pixel' : 'Sembunyikan Time Tracker 24 Jam Pixel'}
          >
            {isCollapsed ? (
              <>
                <Eye className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
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
            key="time-tracker-collapsible"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden space-y-5 pt-1"
          >
            {/* Action Bar: Tambah Indikator & Reset */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              {/* Kuas Warna Aktif */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span>🎨</span> Kuas Warna Aktif:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {timeCategories.map(cat => {
                    const isSelected = cat.id === activeCategoryId;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.id)}
                        className={`group relative px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white dark:bg-slate-800 shadow-xs ${
                          isSelected ? 'scale-105 shadow-md' : 'border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                        style={
                          isSelected
                            ? {
                                border: `2px solid ${cat.color}`,
                                boxShadow: `0 0 12px ${cat.color}66`
                              }
                            : undefined
                        }
                      >
                        <span className="w-3 h-3 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: cat.color }} />
                        <span>{cat.emoji || '⏱️'}</span>
                        <span className="text-slate-800 dark:text-slate-100">{cat.name}</span>
                        {isSelected && (
                          <span className="text-[10px] px-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-extrabold">
                            Aktif
                          </span>
                        )}
                        <div className="flex items-center gap-0.5 ml-1">
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              onEditCategory(cat);
                            }}
                            title={`Edit Indikator ${cat.name}`}
                            className="p-1 rounded text-slate-400 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-950/60 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          {timeCategories.length > 1 && (
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                onDeleteCategory(cat.id);
                              }}
                              title={`Hapus Indikator ${cat.name}`}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={onOpenAddCategoryModal}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Indikator Kustom
                </button>
                <button
                  onClick={onResetMonth}
                  title="Kosongkan Catatan Jam Bulan Ini"
                  className="p-1.5 rounded-xl border border-purple-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer bg-white/80 dark:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pixel Matrix Table */}
            <div className="overflow-x-auto rounded-2xl border border-purple-200 dark:border-purple-800/80 bg-white dark:bg-slate-900 shadow-xs">
              <div className="min-w-[760px] p-4">
                {/* Header Row: Jam 00 - 23 */}
                <div className="grid grid-cols-[80px_repeat(24,_1fr)] gap-1 items-center pb-2 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 text-center">
                  <div className="text-left font-bold pl-1">Hari \ Jam</div>
                  {Array.from({ length: 24 }).map((_, h) => (
                    <div key={`th-hour-${h}`} className="truncate" title={`Pukul ${String(h).padStart(2, '0')}:00`}>
                      {String(h).padStart(2, '0')}
                    </div>
                  ))}
                </div>

                {/* Day Rows */}
                <div className="space-y-1 mt-2">
                  {Array.from({ length: daysInMonth }).map((_, dIdx) => {
                    const day = dIdx + 1;
                    const dateStr = `${currentViewYear}-${String(currentViewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayTracking = timeTracking[dateStr] || {};

                    const isCurrentDay =
                      todayDate.getDate() === day &&
                      todayDate.getMonth() === currentViewMonth &&
                      todayDate.getFullYear() === currentViewYear;

                    const isSelectedDay =
                      selectedDate.getDate() === day &&
                      selectedDate.getMonth() === currentViewMonth &&
                      selectedDate.getFullYear() === currentViewYear;

                    let rowStyle = 'hover:bg-purple-50/50 dark:hover:bg-slate-800/50 rounded-lg py-0.5 transition-colors';
                    if (isSelectedDay) {
                      rowStyle = 'bg-sky-50 dark:bg-sky-950/40 rounded-lg py-0.5 ring-1 ring-sky-300 dark:ring-sky-800';
                    }

                    return (
                      <div
                        key={`row-day-${day}`}
                        className={`grid grid-cols-[80px_repeat(24,_1fr)] gap-1 items-center ${rowStyle}`}
                      >
                        {/* Day Label */}
                        <div
                          onClick={() => onSelectDate(currentViewYear, currentViewMonth, day)}
                          className="text-xs font-semibold px-2 cursor-pointer flex items-center justify-between"
                        >
                          <span
                            className={
                              isCurrentDay
                                ? 'font-black text-sky-600 dark:text-sky-400 flex items-center gap-1'
                                : 'text-slate-700 dark:text-slate-300'
                            }
                          >
                            Tgl {day}
                          </span>
                          {isCurrentDay && (
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
                          )}
                        </div>

                        {/* 24 Hours Pixels */}
                        {Array.from({ length: 24 }).map((_, h) => {
                          const catId = dayTracking[h];
                          const cat = catId ? categoryMap[catId] : null;

                          return (
                            <button
                              key={`pixel-${day}-${h}`}
                              type="button"
                              onClick={() => onTogglePixel(dateStr, h)}
                              title={
                                cat
                                  ? `Tgl ${day}, Pukul ${String(h).padStart(2, '0')}:00 - ${cat.name}`
                                  : `Tgl ${day}, Pukul ${String(h).padStart(2, '0')}:00 (Kosong)`
                              }
                              className="h-5 rounded-xs transition-all duration-150 cursor-pointer active:scale-90 flex items-center justify-center border border-black/5 dark:border-white/5"
                              style={{
                                backgroundColor: cat ? cat.color : undefined,
                                opacity: cat ? 1 : 0.8
                              }}
                            >
                              {!cat && (
                                <span className="w-full h-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/70 dark:hover:bg-slate-700 rounded-xs block" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Visualisasi Alokasi Waktu Bulan Ini */}
            <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-4 border border-purple-200 dark:border-purple-800/80 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-100">
                <span>Alokasi Waktu Bulan Ini</span>
                <span className="text-purple-600 dark:text-purple-400 font-extrabold">{totalFilledHours} Jam Total</span>
              </div>

              {/* Progress bar multi-warna stacked */}
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                {timeCategories.map(cat => {
                  const count = counts[cat.id] || 0;
                  if (count > 0 && totalFilledHours > 0) {
                    const pct = (count / totalFilledHours) * 100;
                    return (
                      <div
                        key={`stacked-${cat.id}`}
                        style={{ width: `${pct}%`, backgroundColor: cat.color }}
                        title={`${cat.name}: ${count} Jam (${Math.round(pct)}%)`}
                        className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
                      />
                    );
                  }
                  return null;
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-body text-slate-600 dark:text-slate-300">
                {totalFilledHours === 0 ? (
                  <span className="italic text-slate-400 text-xs">
                    Belum ada alokasi pixel waktu yang diwarnai di bulan ini.
                  </span>
                ) : (
                  timeCategories.map(cat => {
                    const count = counts[cat.id] || 0;
                    if (count === 0) return null;
                    return (
                      <div
                        key={`badge-cat-${cat.id}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
                      >
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                        <span>{cat.emoji || '⏱️'} {cat.name}:</span>
                        <span className="font-extrabold text-slate-900 dark:text-white">{count} Jam</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
