import React from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { TimeCategory } from '../types';
import { formatDateKey } from '../utils/initialData';

interface TimeTrackerProps {
  currentViewYear: number;
  currentViewMonth: number;
  selectedDate: Date;
  todayDate: Date;
  timeCategories: TimeCategory[];
  activeCategoryId: string;
  timeTracking: Record<string, Record<number, string>>;
  onSelectCategory: (id: string) => void;
  onDeleteCategory: (id: string) => void;
  onTogglePixel: (dateStr: string, hour: number) => void;
  onResetMonth: () => void;
  onOpenAddCategoryModal: () => void;
  onSelectDate: (year: number, month: number, day: number) => void;
}

export const TimeTracker: React.FC<TimeTrackerProps> = ({
  currentViewYear,
  currentViewMonth,
  selectedDate,
  todayDate,
  timeCategories,
  activeCategoryId,
  timeTracking,
  onSelectCategory,
  onDeleteCategory,
  onTogglePixel,
  onResetMonth,
  onOpenAddCategoryModal,
  onSelectDate
}) => {
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const daysInMonth = new Date(currentViewYear, currentViewMonth + 1, 0).getDate();
  const todayStr = formatDateKey(todayDate);
  const selectedStr = formatDateKey(selectedDate);

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
    <section className="bg-gradient-to-br from-purple-100/90 via-violet-50/80 to-indigo-50/70 dark:from-purple-950/60 dark:via-slate-900 dark:to-violet-950/40 rounded-3xl p-5 sm:p-7 shadow-sm border-2 border-purple-300 dark:border-purple-700/80 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-purple-200/80 dark:border-purple-900/60">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-11 rounded-full bg-violet-500 shrink-0" />
          <div className="w-11 h-11 rounded-2xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Clock className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-purple-800 dark:text-purple-300">
              Manajemen Waktu
            </p>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight flex items-center gap-2 flex-wrap">
              <span>Time Tracker 24 Jam Pixel</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-violet-950/80 text-violet-800 dark:text-violet-300 border border-violet-300 dark:border-violet-800 shadow-2xs">
                {monthNames[currentViewMonth]} {currentViewYear}
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-body mt-0.5">
              Pixel Matrix 24 Jam (ke samping) × {daysInMonth} Hari (ke bawah). Pilih indikator warna, lalu klik kotak jam untuk merekam aktivitas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onOpenAddCategoryModal}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20 active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Indikator Kustom
          </button>
          <button
            onClick={onResetMonth}
            title="Kosongkan Catatan Jam Bulan Ini"
            className="p-2 rounded-xl border border-purple-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer bg-white/80 dark:bg-slate-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Kuas Warna Aktif */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span>🎨</span> Kuas Warna Aktif (Klik untuk memilih indikator mewarnai pixel):
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-body">
            Klik kotak pixel jam untuk mewarnai atau mengosongkan
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {timeCategories.map(cat => {
            const isSelected = cat.id === activeCategoryId;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`group relative px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white dark:bg-slate-800 shadow-xs ${
                  isSelected ? 'scale-105 shadow-md' : 'border border-slate-200 dark:border-slate-700'
                }`}
                style={
                  isSelected
                    ? {
                        border: `2px solid ${cat.color}`,
                        boxShadow: `0 0 12px ${cat.color}77`
                      }
                    : undefined
                }
              >
                <span className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: cat.color }} />
                <span>{cat.emoji || '⏱️'}</span>
                <span className="text-slate-800 dark:text-slate-100">{cat.name}</span>
                {isSelected && (
                  <span className="text-[10px] px-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-extrabold">
                    Kuas Aktif
                  </span>
                )}
                {timeCategories.length > 1 && (
                  <span
                    onClick={e => {
                      e.stopPropagation();
                      onDeleteCategory(cat.id);
                    }}
                    title="Hapus Indikator Ini"
                    className="ml-1 text-slate-300 hover:text-rose-500 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    &times;
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Matrix 24 Jam × Days of Month */}
      <div className="overflow-x-auto rounded-2xl border border-violet-200/50 dark:border-slate-800 bg-white/80 dark:bg-slate-900/90 shadow-sm">
        <div className="min-w-[820px] p-4 select-none">
          {/* Header Row (Hours 00 - 23) */}
          <div
            className="grid gap-1 items-center pb-2 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 text-center"
            style={{
              gridTemplateColumns: '90px repeat(24, minmax(22px, 1fr)) 55px'
            }}
          >
            <div className="text-left pl-1">Tanggal</div>
            {Array.from({ length: 24 }).map((_, h) => {
              const hourStr = String(h).padStart(2, '0');
              return (
                <div key={`header-hour-${h}`} title={`Pukul ${hourStr}:00`}>
                  {hourStr}
                </div>
              );
            })}
            <div className="text-right pr-1">Total</div>
          </div>

          {/* Matrix Rows */}
          <div className="space-y-1.5 mt-2.5">
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const dateStr = `${currentViewYear}-${String(currentViewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isCurrentDay = dateStr === todayStr;
              const isSelectedDay = dateStr === selectedStr;
              const dayData = timeTracking[dateStr] || {};

              let rowFilledHours = 0;

              let rowDayClass = 'font-bold text-slate-700 dark:text-slate-300';
              if (isCurrentDay) {
                rowDayClass = 'font-extrabold text-sky-600 dark:text-sky-400 bg-sky-500/15 dark:bg-sky-500/25 rounded-md px-1 ring-2 ring-sky-500/80';
              } else if (isSelectedDay) {
                rowDayClass = 'font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/15 dark:bg-indigo-500/25 rounded-md px-1 ring-2 ring-indigo-500/80';
              }

              return (
                <div
                  key={`time-row-${day}`}
                  className="grid gap-1 items-center hover:bg-slate-50/60 dark:hover:bg-slate-800/40 rounded-lg transition-colors py-0.5"
                  style={{
                    gridTemplateColumns: '90px repeat(24, minmax(22px, 1fr)) 55px'
                  }}
                >
                  <div
                    className={`text-xs ${rowDayClass} truncate pl-1 flex items-center gap-1 cursor-pointer`}
                    onClick={() => onSelectDate(currentViewYear, currentViewMonth, day)}
                    title="Klik untuk fokus ke tanggal ini"
                  >
                    <span>{day} {shortMonthNames[currentViewMonth]}</span>
                    {isCurrentDay && <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />}
                  </div>

                  {Array.from({ length: 24 }).map((_, h) => {
                    const catId = dayData[h];
                    const cat = categoryMap[catId];
                    const hourLabel = String(h).padStart(2, '0') + ':00';

                    let pixelHighlightBorder = '';
                    if (isCurrentDay) pixelHighlightBorder = 'ring-1 ring-sky-500/60';
                    else if (isSelectedDay) pixelHighlightBorder = 'ring-1 ring-indigo-500/60';

                    if (cat) {
                      rowFilledHours++;
                      return (
                        <div
                          key={`pixel-${day}-${h}`}
                          onClick={() => onTogglePixel(dateStr, h)}
                          title={`${day} ${shortMonthNames[currentViewMonth]} • ${hourLabel} : ${cat.name}`}
                          className={`h-5 sm:h-6 w-full rounded-md cursor-pointer transition-transform hover:scale-110 active:scale-95 shadow-xs flex items-center justify-center text-[9px] ${pixelHighlightBorder}`}
                          style={{ backgroundColor: cat.color }}
                        />
                      );
                    }

                    return (
                      <div
                        key={`pixel-${day}-${h}`}
                        onClick={() => onTogglePixel(dateStr, h)}
                        title={`${day} ${shortMonthNames[currentViewMonth]} • ${hourLabel} : Kosong (Klik untuk isi)`}
                        className={`h-5 sm:h-6 w-full rounded-md cursor-pointer transition-all bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 border border-slate-200/50 dark:border-slate-700/50 hover:border-indigo-400 ${pixelHighlightBorder}`}
                      />
                    );
                  })}

                  <div className="text-[10px] font-semibold text-right pr-1 text-slate-500 dark:text-slate-400">
                    {rowFilledHours > 0 ? (
                      <span className="px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                        {rowFilledHours}h
                      </span>
                    ) : (
                      '-'
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary Stacked Bar & Breakdown */}
      <div className="bg-gradient-to-br from-violet-50/70 via-indigo-50/40 to-slate-50/60 dark:from-violet-950/30 dark:via-slate-900 dark:to-slate-950 rounded-2xl p-4 border border-violet-200/70 dark:border-violet-800/60 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span>📊</span> Total Akumulasi Alokasi Waktu Bulan Ini:
          </span>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300">
            {totalFilledHours} Jam Terekam
          </span>
        </div>

        <div className="w-full h-3 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 flex border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
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

        <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-body text-slate-600 dark:text-slate-300">
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
    </section>
  );
};
