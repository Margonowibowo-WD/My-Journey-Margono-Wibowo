import React, { useState, useMemo } from 'react';
import { PieChart as PieIcon, BarChart2, TrendingUp, Clock, CheckCircle2, Award, Sparkles, Filter } from 'lucide-react';
import { Habit, TimeCategory } from '../types';
import { formatDateKey, normalizeHabitColor } from '../utils/initialData';

interface AnalyticsSectionProps {
  habits: Habit[];
  timeCategories: TimeCategory[];
  timeTracking: Record<string, Record<number, string>>;
  currentViewYear: number;
  currentViewMonth: number;
  selectedDate: Date;
}

interface ChartSlice {
  id: string;
  name: string;
  emoji?: string;
  value: number;
  color: string;
  percentage: number;
}

// Math helpers for SVG Pie & Doughnut charts
function polarToCartesian(cx: number, cy: number, r: number, angleDegrees: number) {
  const angleInRadians = ((angleDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians)
  };
}

function describeDonutSlice(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngle: number,
  endAngle: number
) {
  const delta = endAngle - startAngle;
  const isFull = delta >= 359.99;
  const actualEndAngle = isFull ? startAngle + 359.99 : endAngle;

  const p1 = polarToCartesian(cx, cy, rOuter, startAngle);
  const p2 = polarToCartesian(cx, cy, rOuter, actualEndAngle);

  const largeArc = delta > 180 ? 1 : 0;

  if (rInner <= 0) {
    // Pie Slice
    return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y} Z`;
  }

  // Doughnut Slice
  const p3 = polarToCartesian(cx, cy, rInner, actualEndAngle);
  const p4 = polarToCartesian(cx, cy, rInner, startAngle);

  return `M ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x} ${p4.y} Z`;
}

interface SvgChartRendererProps {
  slices: ChartSlice[];
  type: 'doughnut' | 'pie';
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  centerTitle?: string;
  centerSubtitle?: string;
  unit: string;
}

const SvgChartRenderer: React.FC<SvgChartRendererProps> = ({
  slices,
  type,
  hoveredId,
  onHover,
  centerTitle,
  centerSubtitle,
  unit
}) => {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 100;
  const rInner = type === 'doughnut' ? 62 : 0;

  const totalValue = slices.reduce((acc, s) => acc + s.value, 0);

  if (totalValue === 0 || slices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-4">
        <div className="w-28 h-28 rounded-full border-4 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-3xl mb-3 text-slate-400">
          📊
        </div>
        <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Belum Ada Data</p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mt-1">
          Catat aktivitas di tracker untuk melihat visualisasi grafik di sini.
        </p>
      </div>
    );
  }

  // Build slices with start and end angles
  let currentAngle = 0;
  const calculated = slices.map(slice => {
    const sliceAngle = (slice.value / totalValue) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;
    return {
      ...slice,
      startAngle,
      endAngle
    };
  });

  const activeSlice = calculated.find(s => s.id === hoveredId);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible select-none drop-shadow-sm"
      >
        <defs>
          <filter id="chart-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {calculated.map(slice => {
          const isHovered = hoveredId === slice.id;
          const pathD = describeDonutSlice(cx, cy, isHovered ? rOuter + 6 : rOuter, rInner, slice.startAngle, slice.endAngle);

          return (
            <path
              key={slice.id}
              d={pathD}
              fill={slice.color}
              className="cursor-pointer transition-all duration-300"
              style={{
                opacity: hoveredId && !isHovered ? 0.45 : 1,
                transformOrigin: `${cx}px ${cy}px`,
                filter: isHovered ? 'url(#chart-glow)' : undefined
              }}
              onMouseEnter={() => onHover(slice.id)}
              onMouseLeave={() => onHover(null)}
              stroke="#ffffff"
              strokeWidth={calculated.length > 1 ? 2 : 0}
            />
          );
        })}
      </svg>

      {/* Doughnut Center Stats */}
      {type === 'doughnut' && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4"
          style={{ width: size, height: size }}
        >
          {activeSlice ? (
            <div className="animate-pop-check">
              <span className="text-xl block">{activeSlice.emoji || '📌'}</span>
              <p className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[110px] leading-tight">
                {activeSlice.name}
              </p>
              <p className="text-sm font-extrabold text-sky-600 dark:text-sky-400 mt-0.5">
                {activeSlice.value} {unit}
              </p>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                {activeSlice.percentage.toFixed(1)}%
              </p>
            </div>
          ) : (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {centerSubtitle || 'Total'}
              </p>
              <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                {centerTitle || `${totalValue} ${unit}`}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {slices.length} Kategori
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  habits,
  timeCategories,
  timeTracking,
  currentViewYear,
  currentViewMonth,
  selectedDate
}) => {
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const [timeChartType, setTimeChartType] = useState<'doughnut' | 'pie'>('doughnut');
  const [habitChartType, setHabitChartType] = useState<'doughnut' | 'pie'>('pie');
  const [timeFilterMode, setTimeFilterMode] = useState<'month' | 'day'>('month');

  const [hoveredTimeSlice, setHoveredTimeSlice] = useState<string | null>(null);
  const [hoveredHabitSlice, setHoveredHabitSlice] = useState<string | null>(null);

  const daysInMonth = new Date(currentViewYear, currentViewMonth + 1, 0).getDate();
  const selectedDateStr = formatDateKey(selectedDate);

  // 1. Time Tracker Analytics Data Calculation
  const timeSlices = useMemo<ChartSlice[]>(() => {
    const categoryMap: Record<string, TimeCategory> = {};
    timeCategories.forEach(c => {
      categoryMap[c.id] = c;
    });

    const counts: Record<string, number> = {};
    let totalHours = 0;

    if (timeFilterMode === 'month') {
      // Calculate for the current view month
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentViewYear}-${String(currentViewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayData = timeTracking[dateStr] || {};
        for (let h = 0; h < 24; h++) {
          const catId = dayData[h];
          if (catId && categoryMap[catId]) {
            counts[catId] = (counts[catId] || 0) + 1;
            totalHours++;
          }
        }
      }
    } else {
      // Calculate for selected single day
      const dayData = timeTracking[selectedDateStr] || {};
      for (let h = 0; h < 24; h++) {
        const catId = dayData[h];
        if (catId && categoryMap[catId]) {
          counts[catId] = (counts[catId] || 0) + 1;
          totalHours++;
        }
      }
    }

    if (totalHours === 0) return [];

    return Object.entries(counts)
      .map(([catId, count]) => {
        const cat = categoryMap[catId];
        return {
          id: catId,
          name: cat ? cat.name : 'Lainnya',
          emoji: cat?.emoji || '⏱️',
          value: count,
          color: cat?.color || '#3b82f6',
          percentage: (count / totalHours) * 100
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [timeCategories, timeTracking, currentViewYear, currentViewMonth, daysInMonth, timeFilterMode, selectedDateStr]);

  const totalTimeHours = useMemo(() => timeSlices.reduce((acc, s) => acc + s.value, 0), [timeSlices]);
  const topTimeCategory = timeSlices[0] || null;

  // 2. Habit Tracker Analytics Data Calculation
  const habitSlices = useMemo<ChartSlice[]>(() => {
    if (!habits || habits.length === 0) return [];

    let totalCheckmarks = 0;
    const items = habits.map(h => {
      let count = 0;
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentViewYear}-${String(currentViewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (h.completions && h.completions[dateStr]) {
          count++;
        }
      }
      totalCheckmarks += count;
      return {
        id: h.id,
        name: h.name,
        emoji: '✓',
        value: count,
        color: normalizeHabitColor(h.color),
        percentage: 0
      };
    });

    if (totalCheckmarks === 0) return [];

    return items
      .map(item => ({
        ...item,
        percentage: (item.value / totalCheckmarks) * 100
      }))
      .sort((a, b) => b.value - a.value);
  }, [habits, currentViewYear, currentViewMonth, daysInMonth]);

  const totalHabitCompletions = useMemo(() => habitSlices.reduce((acc, s) => acc + s.value, 0), [habitSlices]);
  const possibleCompletions = habits.length * daysInMonth;
  const overallComplianceRate = possibleCompletions > 0 ? (totalHabitCompletions / possibleCompletions) * 100 : 0;
  const topHabit = habitSlices[0] || null;

  return (
    <section className="bg-gradient-to-br from-sky-50/70 via-indigo-50/50 to-purple-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 rounded-3xl p-5 sm:p-7 shadow-sm border-2 border-indigo-200/80 dark:border-indigo-800/60 space-y-6">
      {/* Header Utama Grafik */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-indigo-200/70 dark:border-indigo-900/60">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-11 rounded-full bg-gradient-to-b from-sky-500 to-indigo-600 shrink-0" />
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
            <PieIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-400">
                Analisis Visual & Statistik
              </p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {monthNames[currentViewMonth]} {currentViewYear}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
              Grafik Doughnut & Pie Chart Tracker
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-body mt-0.5">
              Grafik interaktif untuk memonitor efisiensi 24 Jam dan kepatuhan habit Anda secara transparan.
            </p>
          </div>
        </div>

        {/* Quick Highlights Summary Badges */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800/80 shadow-2xs text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            <span>{totalTimeHours} Jam Tercatat</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800/80 shadow-2xs text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{totalHabitCompletions} Ceklis Habit</span>
          </div>
        </div>
      </div>

      {/* Grid 2 Kolom: Time Tracker vs Habit Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KARTU 1: Time Tracker 24 Jam Charts */}
        <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            {/* Header Kartu */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>⏱️ Time Tracker 24 Jam</span>
                </h4>
              </div>

              {/* Controls: Chart Type Toggle & Time Filter */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[11px] font-bold">
                  <button
                    onClick={() => setTimeFilterMode('month')}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      timeFilterMode === 'month'
                        ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                    title="Statistik Sebulan Penuh"
                  >
                    Bulan
                  </button>
                  <button
                    onClick={() => setTimeFilterMode('day')}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      timeFilterMode === 'day'
                        ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                    title="Statistik Tanggal Terpilih"
                  >
                    Hari Ini
                  </button>
                </div>

                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[11px] font-bold">
                  <button
                    onClick={() => setTimeChartType('doughnut')}
                    className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                      timeChartType === 'doughnut'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                    title="Grafik Donat (Doughnut)"
                  >
                    <span>🍩 Donat</span>
                  </button>
                  <button
                    onClick={() => setTimeChartType('pie')}
                    className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                      timeChartType === 'pie'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                    title="Grafik Pai (Pie)"
                  >
                    <span>🥧 Pai</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Statistik Sorotan Singkat */}
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="p-2.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Total Jam Terekam</p>
                <p className="text-base font-black text-sky-700 dark:text-sky-300 mt-0.5">
                  {totalTimeHours} <span className="text-[11px] font-semibold text-slate-500">Jam</span>
                </p>
              </div>
              <div className="p-2.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Aktivitas Terbanyak</p>
                <p className="text-base font-black text-indigo-700 dark:text-indigo-300 mt-0.5 truncate">
                  {topTimeCategory ? `${topTimeCategory.emoji} ${topTimeCategory.name}` : '-'}
                </p>
              </div>
            </div>

            {/* Chart Area */}
            <div className="py-4 flex justify-center">
              <SvgChartRenderer
                slices={timeSlices}
                type={timeChartType}
                hoveredId={hoveredTimeSlice}
                onHover={setHoveredTimeSlice}
                centerTitle={`${totalTimeHours} Jam`}
                centerSubtitle="Total Jam"
                unit="Jam"
              />
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 max-h-56 overflow-y-auto pr-1">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
              <span>Distribusi Kegiatan:</span>
              <span className="text-[10px] font-normal text-slate-400">Arahkan kursor untuk sorot</span>
            </p>
            {timeSlices.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-2">Belum ada jam yang diwarnai.</p>
            ) : (
              timeSlices.map(slice => {
                const isHovered = hoveredTimeSlice === slice.id;
                return (
                  <div
                    key={slice.id}
                    onMouseEnter={() => setHoveredTimeSlice(slice.id)}
                    onMouseLeave={() => setHoveredTimeSlice(null)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer ${
                      isHovered
                        ? 'bg-sky-50 dark:bg-slate-800 ring-2 ring-sky-400 scale-[1.01]'
                        : 'bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className="w-3 h-3 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: slice.color }} />
                      <span className="text-base">{slice.emoji || '⏱️'}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{slice.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{slice.value} Jam</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                        {slice.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* KARTU 2: Habit Tracker Matrix Charts */}
        <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            {/* Header Kartu */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>✅ Habit Tracker Matrix</span>
                </h4>
              </div>

              {/* Controls: Chart Type Toggle */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[11px] font-bold">
                <button
                  onClick={() => setHabitChartType('doughnut')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                    habitChartType === 'doughnut'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                  title="Grafik Donat (Doughnut)"
                >
                  <span>🍩 Donat</span>
                </button>
                <button
                  onClick={() => setHabitChartType('pie')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                    habitChartType === 'pie'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                  title="Grafik Pai (Pie)"
                >
                  <span>🥧 Pai</span>
                </button>
              </div>
            </div>

            {/* Statistik Sorotan Singkat */}
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="p-2.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Total Ceklis Selesai</p>
                <p className="text-base font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
                  {totalHabitCompletions} <span className="text-[11px] font-semibold text-slate-500">Hari</span>
                </p>
              </div>
              <div className="p-2.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Kebiasaan Terajin</p>
                <p className="text-base font-black text-purple-700 dark:text-purple-300 mt-0.5 truncate">
                  {topHabit ? `🏆 ${topHabit.name}` : '-'}
                </p>
              </div>
            </div>

            {/* Chart Area */}
            <div className="py-4 flex justify-center">
              <SvgChartRenderer
                slices={habitSlices}
                type={habitChartType}
                hoveredId={hoveredHabitSlice}
                onHover={setHoveredHabitSlice}
                centerTitle={`${overallComplianceRate.toFixed(0)}%`}
                centerSubtitle="Kepatuhan"
                unit="Hari"
              />
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 max-h-56 overflow-y-auto pr-1">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
              <span>Konsistensi Kebiasaan Baik:</span>
              <span className="text-[10px] font-normal text-slate-400">Target: {daysInMonth} Hari</span>
            </p>
            {habitSlices.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-2">Belum ada kebiasaan yang diceklis.</p>
            ) : (
              habitSlices.map(slice => {
                const isHovered = hoveredHabitSlice === slice.id;
                const habitMonthlyRate = (slice.value / daysInMonth) * 100;
                return (
                  <div
                    key={slice.id}
                    onMouseEnter={() => setHoveredHabitSlice(slice.id)}
                    onMouseLeave={() => setHoveredHabitSlice(null)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer ${
                      isHovered
                        ? 'bg-emerald-50 dark:bg-slate-800 ring-2 ring-emerald-400 scale-[1.01]'
                        : 'bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className="w-3 h-3 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: slice.color }} />
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{slice.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {slice.value}/{daysInMonth} Hari
                      </span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400">
                        {habitMonthlyRate.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
