import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Zap, Target, Clock, Play, Pause, RotateCcw, Maximize2, Minimize2, Palette } from 'lucide-react';
import { DailyTask, ScheduledTask } from '../types';
import { formatDateKey } from '../utils/initialData';

export type FocusThemeKey = 'red' | 'blue' | 'emerald' | 'purple' | 'amber';

export const FOCUS_THEMES: Record<FocusThemeKey, {
  id: FocusThemeKey;
  name: string;
  emoji: string;
  dotColor: string;
  ringColor: string;
  cardBg: string;
  cardBorder: string;
  accentBar: string;
  badgeBg: string;
  badgePulse: string;
  timerText: string;
  progressBar: string;
  progressTrack: string;
  playBtn: string;
  playShadow: string;
  presetActive: string;
  presetInactive: string;
  stepperInput: string;
  screenPulseClass: string;
  screenRadialBg: string;
  screenRingBorder: string;
  screenRingGlow: string;
  screenPlayBtn: string;
}> = {
  red: {
    id: 'red',
    name: 'Merah Delima',
    emoji: '🍅',
    dotColor: 'bg-rose-500',
    ringColor: 'ring-rose-400',
    cardBg: 'bg-gradient-to-br from-rose-100/90 via-pink-50/80 to-red-50/60 dark:from-rose-950/60 dark:via-slate-900 dark:to-rose-950/40',
    cardBorder: 'border-rose-300/90 dark:border-rose-800/80',
    accentBar: 'bg-rose-500',
    badgeBg: 'bg-rose-600',
    badgePulse: 'bg-rose-500',
    timerText: 'text-rose-700 dark:text-rose-300',
    progressBar: 'from-rose-500 to-pink-500',
    progressTrack: 'border-rose-100 dark:border-slate-700',
    playBtn: 'bg-rose-600 hover:bg-rose-700',
    playShadow: 'shadow-rose-500/20',
    presetActive: 'bg-rose-600 text-white shadow-xs',
    presetInactive: 'bg-rose-100/90 dark:bg-slate-800 text-rose-800 dark:text-rose-300 hover:bg-rose-200',
    stepperInput: 'border-rose-300 dark:border-rose-700',
    screenPulseClass: 'animate-red-pulse-screen',
    screenRadialBg: 'from-rose-900/60 via-red-950/85 to-black',
    screenRingBorder: 'border-rose-500/70 shadow-[0_0_80px_rgba(244,63,94,0.85)]',
    screenRingGlow: 'bg-rose-600/25',
    screenPlayBtn: 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/40'
  },
  blue: {
    id: 'blue',
    name: 'Biru Samudra',
    emoji: '🌊',
    dotColor: 'bg-sky-500',
    ringColor: 'ring-sky-400',
    cardBg: 'bg-gradient-to-br from-sky-100/90 via-blue-50/80 to-indigo-50/60 dark:from-sky-950/60 dark:via-slate-900 dark:to-blue-950/40',
    cardBorder: 'border-sky-300/90 dark:border-sky-800/80',
    accentBar: 'bg-sky-500',
    badgeBg: 'bg-sky-600',
    badgePulse: 'bg-sky-500',
    timerText: 'text-sky-700 dark:text-sky-300',
    progressBar: 'from-sky-500 to-blue-600',
    progressTrack: 'border-sky-100 dark:border-slate-700',
    playBtn: 'bg-sky-600 hover:bg-sky-700',
    playShadow: 'shadow-sky-500/20',
    presetActive: 'bg-sky-600 text-white shadow-xs',
    presetInactive: 'bg-sky-100/90 dark:bg-slate-800 text-sky-800 dark:text-sky-300 hover:bg-sky-200',
    stepperInput: 'border-sky-300 dark:border-sky-700',
    screenPulseClass: 'animate-blue-pulse-screen',
    screenRadialBg: 'from-sky-900/60 via-blue-950/85 to-black',
    screenRingBorder: 'border-sky-500/70 shadow-[0_0_80px_rgba(14,165,233,0.85)]',
    screenRingGlow: 'bg-sky-600/25',
    screenPlayBtn: 'bg-sky-600 hover:bg-sky-700 shadow-sky-500/40'
  },
  emerald: {
    id: 'emerald',
    name: 'Hijau Zamrud',
    emoji: '🍃',
    dotColor: 'bg-emerald-500',
    ringColor: 'ring-emerald-400',
    cardBg: 'bg-gradient-to-br from-emerald-100/90 via-teal-50/80 to-emerald-50/60 dark:from-emerald-950/60 dark:via-slate-900 dark:to-teal-950/40',
    cardBorder: 'border-emerald-300/90 dark:border-emerald-800/80',
    accentBar: 'bg-emerald-500',
    badgeBg: 'bg-emerald-600',
    badgePulse: 'bg-emerald-500',
    timerText: 'text-emerald-700 dark:text-emerald-300',
    progressBar: 'from-emerald-500 to-teal-500',
    progressTrack: 'border-emerald-100 dark:border-slate-700',
    playBtn: 'bg-emerald-600 hover:bg-emerald-700',
    playShadow: 'shadow-emerald-500/20',
    presetActive: 'bg-emerald-600 text-white shadow-xs',
    presetInactive: 'bg-emerald-100/90 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200',
    stepperInput: 'border-emerald-300 dark:border-emerald-700',
    screenPulseClass: 'animate-emerald-pulse-screen',
    screenRadialBg: 'from-emerald-900/60 via-teal-950/85 to-black',
    screenRingBorder: 'border-emerald-500/70 shadow-[0_0_80px_rgba(16,185,129,0.85)]',
    screenRingGlow: 'bg-emerald-600/25',
    screenPlayBtn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/40'
  },
  purple: {
    id: 'purple',
    name: 'Ungu Royal',
    emoji: '🔮',
    dotColor: 'bg-purple-500',
    ringColor: 'ring-purple-400',
    cardBg: 'bg-gradient-to-br from-purple-100/90 via-fuchsia-50/80 to-violet-50/60 dark:from-purple-950/60 dark:via-slate-900 dark:to-violet-950/40',
    cardBorder: 'border-purple-300/90 dark:border-purple-800/80',
    accentBar: 'bg-purple-500',
    badgeBg: 'bg-purple-600',
    badgePulse: 'bg-purple-500',
    timerText: 'text-purple-700 dark:text-purple-300',
    progressBar: 'from-purple-500 to-violet-600',
    progressTrack: 'border-purple-100 dark:border-slate-700',
    playBtn: 'bg-purple-600 hover:bg-purple-700',
    playShadow: 'shadow-purple-500/20',
    presetActive: 'bg-purple-600 text-white shadow-xs',
    presetInactive: 'bg-purple-100/90 dark:bg-slate-800 text-purple-800 dark:text-purple-300 hover:bg-purple-200',
    stepperInput: 'border-purple-300 dark:border-purple-700',
    screenPulseClass: 'animate-purple-pulse-screen',
    screenRadialBg: 'from-purple-900/60 via-violet-950/85 to-black',
    screenRingBorder: 'border-purple-500/70 shadow-[0_0_80px_rgba(168,85,247,0.85)]',
    screenRingGlow: 'bg-purple-600/25',
    screenPlayBtn: 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/40'
  },
  amber: {
    id: 'amber',
    name: 'Oranye Emas',
    emoji: '⚡',
    dotColor: 'bg-amber-500',
    ringColor: 'ring-amber-400',
    cardBg: 'bg-gradient-to-br from-amber-100/90 via-orange-50/80 to-yellow-50/60 dark:from-amber-950/60 dark:via-slate-900 dark:to-orange-950/40',
    cardBorder: 'border-amber-300/90 dark:border-amber-800/80',
    accentBar: 'bg-amber-500',
    badgeBg: 'bg-amber-600',
    badgePulse: 'bg-amber-500',
    timerText: 'text-amber-700 dark:text-amber-300',
    progressBar: 'from-amber-500 to-orange-500',
    progressTrack: 'border-amber-100 dark:border-slate-700',
    playBtn: 'bg-amber-600 hover:bg-amber-700',
    playShadow: 'shadow-amber-500/20',
    presetActive: 'bg-amber-600 text-white shadow-xs',
    presetInactive: 'bg-amber-100/90 dark:bg-slate-800 text-amber-800 dark:text-amber-300 hover:bg-amber-200',
    stepperInput: 'border-amber-300 dark:border-amber-700',
    screenPulseClass: 'animate-amber-pulse-screen',
    screenRadialBg: 'from-amber-900/60 via-orange-950/85 to-black',
    screenRingBorder: 'border-amber-500/70 shadow-[0_0_80px_rgba(245,158,11,0.85)]',
    screenRingGlow: 'bg-amber-600/25',
    screenPlayBtn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/40'
  }
};

interface CalendarSectionProps {
  currentViewYear: number;
  currentViewMonth: number;
  selectedDate: Date;
  todayDate: Date;
  dailyTasks: DailyTask[];
  scheduledTasks: ScheduledTask[];
  nationalHolidays: Record<string, string>;
  onSelectDate: (year: number, month: number, day: number) => void;
  onNavigateMonth: (step: number) => void;
  onGoToToday: () => void;
  onOpenJournalTab: () => void;
  onCompleteFocusSession?: () => void;
  onPlayClickSound?: () => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  currentViewYear,
  currentViewMonth,
  selectedDate,
  todayDate,
  dailyTasks,
  scheduledTasks,
  nationalHolidays,
  onSelectDate,
  onNavigateMonth,
  onGoToToday,
  onOpenJournalTab,
  onCompleteFocusSession,
  onPlayClickSound
}) => {
  const [focusMinutes, setFocusMinutes] = useState<number>(25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isFullScreenFocus, setIsFullScreenFocus] = useState<boolean>(false);
  const [focusTheme, setFocusTheme] = useState<FocusThemeKey>(() => {
    try {
      const saved = localStorage.getItem('margono_focus_timer_theme') as FocusThemeKey;
      if (saved && FOCUS_THEMES[saved]) return saved;
    } catch {
      // ignore
    }
    return 'red';
  });

  const handleSelectTheme = (themeKey: FocusThemeKey) => {
    if (onPlayClickSound) onPlayClickSound();
    setFocusTheme(themeKey);
    try {
      localStorage.setItem('margono_focus_timer_theme', themeKey);
    } catch {
      // ignore
    }
  };

  const currentTheme = FOCUS_THEMES[focusTheme] || FOCUS_THEMES.red;

  // Sync timer when minutes changed and not running
  const handleSetMinutes = (newMinutes: number) => {
    const clamped = Math.max(1, Math.min(180, newMinutes));
    setFocusMinutes(clamped);
    if (!isTimerRunning) {
      setSecondsRemaining(clamped * 60);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsFullScreenFocus(false);
            if (onCompleteFocusSession) {
              onCompleteFocusSession();
            }
            return focusMinutes * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, focusMinutes, onCompleteFocusSession]);

  const startAndExpandTimer = () => {
    if (onPlayClickSound) onPlayClickSound();
    setIsTimerRunning(true);
    setIsFullScreenFocus(true);
  };

  const toggleTimer = () => {
    if (onPlayClickSound) onPlayClickSound();
    const nextRunning = !isTimerRunning;
    setIsTimerRunning(nextRunning);
    if (nextRunning) {
      setIsFullScreenFocus(true);
    }
  };

  const openFullScreen = () => {
    if (onPlayClickSound) onPlayClickSound();
    setIsFullScreenFocus(true);
  };

  const resetTimer = () => {
    if (onPlayClickSound) onPlayClickSound();
    setIsTimerRunning(false);
    setSecondsRemaining(focusMinutes * 60);
  };

  const timerM = Math.floor(secondsRemaining / 60);
  const timerS = secondsRemaining % 60;
  const timerFormatted = `${String(timerM).padStart(2, '0')}:${String(timerS).padStart(2, '0')}`;
  const totalSeconds = focusMinutes * 60;
  const progressPct = totalSeconds > 0 ? Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100) : 0;
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const dayNamesFull = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const todayStr = formatDateKey(todayDate);
  const selectedStr = formatDateKey(selectedDate);
  const isSelectedToday = selectedStr === todayStr;

  // Calendar cells calculation
  const firstDay = new Date(currentViewYear, currentViewMonth, 1).getDay();
  const daysInMonth = new Date(currentViewYear, currentViewMonth + 1, 0).getDate();
  const prevMonthDays = new Date(currentViewYear, currentViewMonth, 0).getDate();

  // Daily progress
  const selectedDailyTasks = dailyTasks.filter(t => t.dateStr === selectedStr);
  const totalDaily = selectedDailyTasks.length;
  const completedDaily = selectedDailyTasks.filter(t => t.completed).length;
  const dailyPct = totalDaily === 0 ? 0 : Math.round((completedDaily / totalDaily) * 100);

  // Monthly progress
  let monthTotal = 0;
  let monthCompleted = 0;
  dailyTasks.forEach(t => {
    const parts = t.dateStr.split('-');
    if (parseInt(parts[0], 10) === currentViewYear && parseInt(parts[1], 10) - 1 === currentViewMonth) {
      monthTotal++;
      if (t.completed) monthCompleted++;
    }
  });
  scheduledTasks.forEach(s => {
    monthTotal++;
    if (s.completed) monthCompleted++;
  });
  const monthlyPct = monthTotal === 0 ? 0 : Math.round((monthCompleted / monthTotal) * 100);
  const daysLeftInMonth = Math.max(0, daysInMonth - todayDate.getDate());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Kalender Bulanan */}
      <section className="lg:col-span-8 bg-gradient-to-br from-sky-100/90 via-blue-50/80 to-sky-50/60 dark:from-sky-950/60 dark:via-slate-900 dark:to-blue-950/40 rounded-3xl p-5 sm:p-7 shadow-sm border-2 border-sky-300/80 dark:border-sky-800/80 flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-sky-200/80 dark:border-sky-900/60">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-11 rounded-full bg-sky-500 shrink-0" />
            <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
                Agenda & Kalender
              </p>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                Kalender Bulanan <span className="text-sky-600 dark:text-sky-400">({monthNames[currentViewMonth]} {currentViewYear})</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-body mt-0.5">
                Pilih tanggal untuk melihat rincian tugas spesifik
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => onNavigateMonth(-1)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all active:scale-95 border border-slate-200 dark:border-slate-700 cursor-pointer"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onGoToToday}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-all active:scale-95 border border-sky-200 dark:border-sky-800 cursor-pointer"
            >
              Hari Ini
            </button>
            <button
              onClick={() => onNavigateMonth(1)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all active:scale-95 border border-slate-200 dark:border-slate-700 cursor-pointer"
              title="Bulan Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hari Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center py-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
          <span className="text-rose-600 dark:text-rose-400">Min</span>
          <span className="text-emerald-600 dark:text-emerald-400">Sen</span>
          <span className="text-emerald-600 dark:text-emerald-400">Sel</span>
          <span className="text-emerald-600 dark:text-emerald-400">Rab</span>
          <span className="text-emerald-600 dark:text-emerald-400">Kam</span>
          <span className="text-emerald-600 dark:text-emerald-400">Jum</span>
          <span className="text-blue-600 dark:text-blue-400">Sab</span>
        </div>

        {/* Grid Kalender */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 min-h-[310px]">
          {/* Previous month empty dates */}
          {Array.from({ length: firstDay }).map((_, idx) => {
            const dayNum = prevMonthDays - firstDay + 1 + idx;
            return (
              <div
                key={`prev-${dayNum}`}
                className="min-h-[64px] sm:min-h-[74px] p-1 sm:p-2 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/60 dark:border-slate-800/40 text-slate-300 dark:text-slate-700 text-xs select-none"
              >
                <span>{dayNum}</span>
              </div>
            );
          })}

          {/* Current month days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const cellDate = new Date(currentViewYear, currentViewMonth, day);
            const cellDateStr = formatDateKey(cellDate);
            const isToday = cellDateStr === todayStr;
            const isSelected = cellDateStr === selectedStr;
            const dayOfWeek = cellDate.getDay();

            const holidayName = nationalHolidays[cellDateStr];
            const isNationalHoliday = !!holidayName;

            const myDailyList = dailyTasks.filter(t => t.dateStr === cellDateStr);
            const pendingMyDaily = myDailyList.filter(t => !t.completed).length;
            const hasPendingTasks = pendingMyDaily > 0;

            let glowClass = '';
            if (isToday) {
              if (dayOfWeek === 0 || isNationalHoliday) glowClass = ' glow-sunday';
              else if (dayOfWeek === 6) glowClass = ' glow-saturday';
              else glowClass = ' glow-weekday';
            }

            let cellClasses = 'min-h-[64px] sm:min-h-[74px] p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ';
            if (hasPendingTasks && !isSelected) {
              cellClasses += ' bg-white dark:bg-slate-900 pending-tasks-glow ';
            } else if (isSelected) {
              cellClasses += ' bg-sky-600 text-white border-sky-600 shadow-md font-bold ';
            } else if (isToday) {
              cellClasses += ' bg-white dark:bg-slate-900 border-2 font-bold' + glowClass;
            } else {
              cellClasses += ' bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-600 ';
            }

            let dayColorClass = '';
            if (isSelected) {
              dayColorClass = 'text-white';
            } else if (hasPendingTasks) {
              dayColorClass = 'text-rose-600 dark:text-rose-400 font-extrabold';
            } else if (dayOfWeek === 0 || isNationalHoliday) {
              dayColorClass = 'text-rose-600 dark:text-rose-400 font-extrabold';
            } else if (dayOfWeek === 6) {
              dayColorClass = 'text-blue-600 dark:text-blue-400 font-extrabold';
            } else {
              dayColorClass = 'text-emerald-600 dark:text-emerald-400 font-semibold';
            }

            return (
              <div
                key={`curr-${day}`}
                className={cellClasses}
                onClick={() => onSelectDate(currentViewYear, currentViewMonth, day)}
                title={holidayName ? `Libur: ${holidayName}` : undefined}
              >
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className={dayColorClass}>{day}</span>
                  {isToday && !isSelected && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-sky-500 text-white shadow-xs">
                      Hari Ini
                    </span>
                  )}
                </div>

                <div className="mt-1">
                  {isNationalHoliday && !isSelected && (
                    <p className="text-[9px] font-semibold text-rose-500 truncate" title={holidayName}>
                      {holidayName}
                    </p>
                  )}

                  {myDailyList.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap justify-end mt-1">
                      {pendingMyDaily === 0 ? (
                        <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-extrabold shadow-xs">
                          ✓ Selesai
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black shadow-xs animate-badge-blink"
                          title={`${pendingMyDaily} Tugas belum tuntas`}
                        >
                          <span>⚠️</span>
                          <span>{pendingMyDaily} Belum</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sidebar Kartu Ringkasan */}
      <section className="lg:col-span-4 space-y-3 sm:space-y-3.5">
        <div className="flex items-center gap-2.5 pb-2.5 border-b-2 border-slate-100 dark:border-slate-800">
          <span className="w-1.5 h-7 rounded-full bg-amber-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400">
              Ringkasan Hari Ini
            </p>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight">
              Statistik & Progres
            </h3>
          </div>
        </div>

        {/* Tanggal Terpilih */}
        <div className="bg-gradient-to-br from-sky-600 to-indigo-700 rounded-2xl p-4 text-white shadow-sm relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] uppercase font-semibold text-sky-200 tracking-wider">Tanggal Terpilih</p>
              <h4 className="text-lg sm:text-xl font-black mt-0.5">
                {dayNamesFull[selectedDate.getDay()]}, {selectedDate.getDate()} {shortMonthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </h4>
              <p className="text-[11px] text-sky-100/90 mt-0.5 font-body">
                {isSelectedToday ? 'Hari ini • Fokus pada agenda prioritas' : 'Melihat agenda tanggal terpilih'}
              </p>
            </div>
            <div
              className="text-2xl p-1.5 bg-white/15 backdrop-blur-md rounded-xl cursor-pointer hover:scale-110 transition-transform"
              onClick={onOpenJournalTab}
              title="Buka Catatan & Refleksi"
            >
              🌟
            </div>
          </div>
        </div>

        {/* Progres Harian */}
        <div className="bg-gradient-to-br from-emerald-100/90 via-teal-50/80 to-emerald-50/60 dark:from-emerald-950/60 dark:via-slate-900 dark:to-teal-950/40 rounded-2xl p-3.5 shadow-sm border-2 border-emerald-300/80 dark:border-emerald-800/80 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-emerald-500 shrink-0" />
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">Progres Harian</h4>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 font-body">
                  {completedDaily} dari {totalDaily} tugas beres
                </p>
              </div>
            </div>
            <span className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-300 font-sans">
              {dailyPct}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-white/80 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-emerald-200 dark:border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${dailyPct}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 font-body">
            <span>{completedDaily}/{totalDaily} Tugas Saya</span>
            <span className="w-1 h-1 rounded-full bg-emerald-400 dark:bg-slate-700" />
            <span className="font-semibold text-emerald-700 dark:text-emerald-300">
              {dailyPct === 100 && totalDaily > 0 ? 'Luar biasa! 100%' : 'Terus maju!'}
            </span>
          </div>
        </div>

        {/* Progres Bulanan */}
        <div className="bg-gradient-to-br from-blue-100/90 via-indigo-50/80 to-sky-50/60 dark:from-blue-950/60 dark:via-slate-900 dark:to-indigo-950/40 rounded-2xl p-3.5 shadow-sm border-2 border-blue-300/80 dark:border-blue-800/80 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-blue-500 shrink-0" />
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <Target className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">Progres Bulanan</h4>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 font-body">Pencapaian bulan ini</p>
              </div>
            </div>
            <span className="text-base sm:text-lg font-black text-blue-700 dark:text-blue-300 font-sans">
              {monthlyPct}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-white/80 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-blue-200 dark:border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${monthlyPct}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 font-body">
            <span>{monthCompleted} tugas selesai</span>
            <span className="font-semibold text-blue-700 dark:text-blue-300">{daysLeftInMonth} hari tersisa</span>
          </div>
        </div>

        {/* Fokus Timer Interaktif Samping Tanggal - Pilihan Tema Warna */}
        <div className={`bg-gradient-to-br ${currentTheme.cardBg} border-2 ${currentTheme.cardBorder} rounded-2xl p-3.5 shadow-sm space-y-2.5 transition-all`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-6 rounded-full ${currentTheme.accentBar} shrink-0`} />
              <div className={`w-6 h-6 rounded-lg ${currentTheme.badgeBg} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                <Clock className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                Fokus Timer Margono
              </h4>
            </div>

            <div className="flex items-center gap-2">
              {/* Color dots picker */}
              <div className="flex items-center gap-1 bg-white/70 dark:bg-slate-900/70 px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-2xs">
                {(Object.keys(FOCUS_THEMES) as FocusThemeKey[]).map(key => {
                  const item = FOCUS_THEMES[key];
                  const isSelected = focusTheme === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectTheme(key)}
                      title={`Pilih Tema ${item.name}`}
                      className={`w-3 h-3 rounded-full ${item.dotColor} transition-all cursor-pointer ${
                        isSelected ? `ring-2 ring-offset-1 ${item.ringColor} scale-125` : 'opacity-55 hover:opacity-100 hover:scale-110'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5">
                {isTimerRunning ? (
                  <button
                    onClick={openFullScreen}
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black ${currentTheme.badgePulse} text-white animate-pulse shadow-xs cursor-pointer flex items-center gap-1`}
                    title="Klik untuk buka Layar Penuh Berdenyut"
                  >
                    <span>🔥 Berjalan</span>
                    <Maximize2 className="w-2.5 h-2.5" />
                  </button>
                ) : (
                  <button
                    onClick={openFullScreen}
                    className="p-1 rounded-md text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Perbesar ke Layar Penuh"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Baris Timer Digital & Tombol Aksi */}
          <div className="flex items-center justify-between gap-2.5 bg-white/85 dark:bg-slate-900/85 rounded-xl p-2 sm:p-2.5 border border-slate-200/80 dark:border-slate-800">
            <div
              className="min-w-0 cursor-pointer group"
              onClick={openFullScreen}
              title="Klik untuk membuka animasi layar penuh"
            >
              <div className={`text-2xl sm:text-3xl font-black font-sans ${currentTheme.timerText} tracking-tight leading-none group-hover:scale-105 transition-transform origin-left`}>
                {timerFormatted}
              </div>
              <div className="w-24 sm:w-28 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1.5 border border-slate-200/60 dark:border-slate-700">
                <div
                  className={`h-full bg-gradient-to-r ${currentTheme.progressBar} rounded-full transition-all duration-300 shadow-xs`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={isTimerRunning ? toggleTimer : startAndExpandTimer}
                className={`px-3 py-1.5 rounded-xl font-bold text-[11px] shadow-sm active:scale-95 transition-all flex items-center gap-1 cursor-pointer text-white ${
                  isTimerRunning
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : `${currentTheme.playBtn} ${currentTheme.playShadow}`
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>Jeda</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>Mulai</span>
                  </>
                )}
              </button>
              <button
                onClick={resetTimer}
                title="Reset Timer"
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Baris Preset Menit & Input Kustom */}
          <div className="flex items-center justify-between gap-1 text-[10px]">
            <div className="flex items-center gap-1">
              {[15, 25, 45, 60].map(val => (
                <button
                  key={val}
                  type="button"
                  disabled={isTimerRunning}
                  onClick={() => handleSetMinutes(val)}
                  className={`px-1.5 py-0.5 font-bold rounded-md transition-all cursor-pointer disabled:opacity-40 ${
                    focusMinutes === val
                      ? currentTheme.presetActive
                      : currentTheme.presetInactive
                  }`}
                >
                  {val}m
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleSetMinutes(focusMinutes - 5)}
                disabled={isTimerRunning || focusMinutes <= 5}
                className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center disabled:opacity-40 cursor-pointer text-xs"
                title="Kurangi 5 Menit"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={180}
                value={focusMinutes}
                disabled={isTimerRunning}
                onChange={e => handleSetMinutes(parseInt(e.target.value) || 1)}
                className={`w-9 p-0.5 text-center font-black rounded border ${currentTheme.stepperInput} bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-[10px] focus:outline-none`}
              />
              <span className="text-[9px] text-slate-500 font-bold">m</span>
              <button
                type="button"
                onClick={() => handleSetMinutes(focusMinutes + 5)}
                disabled={isTimerRunning || focusMinutes >= 180}
                className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center disabled:opacity-40 cursor-pointer text-xs"
                title="Tambah 5 Menit"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pop-up / Animasi Layar Penuh Fokus Berdenyut Tema Dinamis */}
      {isFullScreenFocus && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden animate-pop-check ${currentTheme.screenPulseClass} text-white`}>
          {/* Latar Belakang Aura Radial Berdenyut */}
          <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${currentTheme.screenRadialBg} pointer-events-none`} />
          
          <div
            className={`absolute w-[450px] h-[450px] sm:w-[700px] sm:h-[700px] rounded-full ${currentTheme.screenRingGlow} blur-3xl pointer-events-none animate-focus-ring`}
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          />

          {/* Baris Atas Layar Penuh */}
          <div className="relative z-10 w-full max-w-4xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl ${currentTheme.badgeBg} border border-white/20 text-white flex items-center justify-center font-bold text-lg shadow-lg`}>
                {currentTheme.emoji}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-2">
                  <span>SESI FOKUS MARGONO</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${currentTheme.badgePulse} text-white animate-pulse shadow-sm`}>
                    {isTimerRunning ? '🔥 AKTIF BERJALAN' : '⏸️ DIJEDA'}
                  </span>
                </h3>
                <p className="text-xs text-slate-200/90 font-body">
                  Tema {currentTheme.name} • Bebas Distraksi & Dedikasi Penuh
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Color switcher on fullscreen */}
              <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full border border-white/20 backdrop-blur-md">
                <Palette className="w-3.5 h-3.5 text-white/70 mr-1" />
                {(Object.keys(FOCUS_THEMES) as FocusThemeKey[]).map(key => {
                  const item = FOCUS_THEMES[key];
                  const isSelected = focusTheme === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectTheme(key)}
                      title={`Ganti Warna: ${item.name}`}
                      className={`w-4 h-4 rounded-full ${item.dotColor} transition-all cursor-pointer ${
                        isSelected ? `ring-2 ring-offset-2 ring-white scale-125` : 'opacity-50 hover:opacity-100 hover:scale-110'
                      }`}
                    />
                  );
                })}
              </div>

              <button
                onClick={() => setIsFullScreenFocus(false)}
                className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer backdrop-blur-md shadow-md"
                title="Kecilkan ke samping tanggal"
              >
                <Minimize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Kecilkan Layar</span>
              </button>
            </div>
          </div>

          {/* Bagian Tengah: Jam & Angka Hitung Mundur Raksasa Berdenyut */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center max-w-2xl px-4 py-6">
            {/* Lingkaran Jam Berdenyut */}
            <div className={`relative flex items-center justify-center p-8 sm:p-12 md:p-16 rounded-full border-4 ${currentTheme.screenRingBorder} animate-focus-ring backdrop-blur-sm bg-black/40`}>
              {/* Angka Hitung Mundur Raksasa */}
              <div className="text-7xl sm:text-9xl md:text-[10rem] font-black font-sans tracking-tight text-white animate-focus-glow leading-none select-none drop-shadow-[0_0_60px_rgba(255,255,255,0.8)]">
                {timerFormatted}
              </div>
            </div>

            {/* Bilah Progres & Statistik Sesi */}
            <div className="w-full max-w-md mt-7 space-y-2">
              <div className="w-full h-3.5 bg-black/50 rounded-full overflow-hidden p-0.5 border border-white/20 shadow-inner">
                <div
                  className={`h-full bg-gradient-to-r ${currentTheme.progressBar} rounded-full transition-all duration-700 shadow-md`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-white/90">
                <span>Durasi: {focusMinutes} Menit</span>
                <span className="text-amber-300">Progres: {progressPct}% Selesai</span>
              </div>
            </div>

            <p className="mt-5 text-xs sm:text-sm text-white/90 font-medium font-body max-w-lg">
              {isTimerRunning
                ? '🔥 Ritme fokus aktif! Pertahankan konsentrasi tanpa menyentuh distraksi.'
                : '⏸️ Timer sedang dijeda. Klik lanjutkan saat siap kembali fokus.'}
            </p>
          </div>

          {/* Baris Tombol Kontrol Bawah */}
          <div className="relative z-10 w-full max-w-md flex items-center justify-center gap-3">
            <button
              onClick={toggleTimer}
              className={`flex-1 py-3.5 px-6 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isTimerRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/30'
                  : `${currentTheme.screenPlayBtn}`
              }`}
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Jeda Fokus</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Lanjutkan Fokus</span>
                </>
              )}
            </button>

            <button
              onClick={resetTimer}
              title="Reset Timer"
              className="py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all active:scale-95 cursor-pointer backdrop-blur-md flex items-center gap-1.5 shadow-md"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
