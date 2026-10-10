import React, { useState, useEffect } from 'react';
import { Sun, Moon, Volume2, VolumeX, HardDrive, Clock } from 'lucide-react';

interface HeaderProps {
  themeMode: 'auto' | 'light' | 'dark';
  darkMode: boolean;
  onCycleThemeMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  cloudStatus: 'syncing' | 'synced' | 'offline' | 'error';
  onOpenBackupModal: () => void;
}

// Hook Penghitung Mundur (Countdown Timer) Waktu Produktif Pak Margono hingga 22:00
function useProductiveCountdown() {
  const [timeLeft, setTimeLeft] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
    isPast22: boolean;
  }>({ hours: '00', minutes: '00', seconds: '00', isPast22: false });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(22, 0, 0, 0);

      const diff = target.getTime() - now.getTime();
      if (diff > 0) {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({
          hours: String(h).padStart(2, '0'),
          minutes: String(m).padStart(2, '0'),
          seconds: String(s).padStart(2, '0'),
          isPast22: false
        });
      } else {
        setTimeLeft({
          hours: '00',
          minutes: '00',
          seconds: '00',
          isPast22: true
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

export const Header: React.FC<HeaderProps> = ({
  themeMode,
  darkMode,
  onCycleThemeMode,
  soundEnabled,
  onToggleSound,
  cloudStatus,
  onOpenBackupModal
}) => {
  const countdown = useProductiveCountdown();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800/80 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-18 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-base sm:text-lg shadow-md ring-2 ring-white dark:ring-slate-800 shrink-0">
            MW
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                My Journey
              </h1>
              <span className="px-2.5 py-0.5 text-[11px] sm:text-xs font-bold bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 rounded-full border border-sky-300 dark:border-sky-700 shadow-2xs">
                Margono wibowo
              </span>
            </div>
          </div>
        </div>

        {/* Countdown Timer Sisa Waktu Produktif (hingga 22:00) - Tampilan Jelas & Bold */}
        <div
          className={`px-3.5 sm:px-4 py-2 rounded-2xl border-2 flex items-center gap-2.5 shadow-md transition-all ${
            countdown.isPast22
              ? 'bg-slate-900 border-indigo-500/80 text-indigo-300 ring-2 ring-indigo-500/30'
              : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white border-amber-200/90 shadow-amber-500/25 ring-2 ring-amber-400/40'
          }`}
          title="Sisa waktu produktif harian Margono wibowo hingga pukul 22:00 setiap harinya"
        >
          <div className={`p-1.5 rounded-xl ${countdown.isPast22 ? 'bg-indigo-950/80 text-indigo-300' : 'bg-black/25 text-white'} flex items-center justify-center shrink-0`}>
            <Clock className={`w-4 h-4 ${countdown.isPast22 ? '' : 'animate-pulse'}`} />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 leading-none">
            <span className={`text-[11px] sm:text-xs uppercase tracking-wider font-extrabold ${countdown.isPast22 ? 'text-indigo-300' : 'text-amber-100 drop-shadow-xs'}`}>
              {countdown.isPast22 ? '🌙 Waktu Istirahat' : '⏳ Sisa Waktu Produktif:'}
            </span>
            {countdown.isPast22 ? (
              <span className="font-black text-xs sm:text-sm text-white font-mono mt-0.5 sm:mt-0">
                Selesai (22:00)
              </span>
            ) : (
              <span className="font-black font-mono tracking-widest text-sm sm:text-base text-white drop-shadow-sm mt-0.5 sm:mt-0">
                {countdown.hours} : {countdown.minutes} : {countdown.seconds}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloud Status Badge */}
          <div className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-xs font-semibold shadow-xs">
            {cloudStatus === 'syncing' && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}
            {cloudStatus === 'synced' && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
            {cloudStatus === 'offline' && <span className="w-2 h-2 rounded-full bg-slate-400" />}
            {cloudStatus === 'error' && <span className="w-2 h-2 rounded-full bg-rose-500" />}
            <span className="hidden sm:inline">
              {cloudStatus === 'syncing' && 'Menyimpan...'}
              {cloudStatus === 'synced' && 'Tersinkron Cloud'}
              {cloudStatus === 'offline' && 'Mode Lokal'}
              {cloudStatus === 'error' && 'Gagal Sinkron'}
            </span>
          </div>

          {/* Theme Toggle with Auto Schedule Support */}
          <button
            onClick={onCycleThemeMode}
            type="button"
            title="Klik untuk beralih mode: Otomatis (Jadwal Istirahat) -> Manual Terang -> Manual Gelap"
            className={`px-3 py-2 rounded-xl border shadow-sm transition-all flex items-center gap-2 text-xs font-semibold active:scale-95 cursor-pointer ${
              themeMode === 'auto'
                ? 'border-indigo-300 dark:border-indigo-700/80 bg-indigo-50/90 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-200 shadow-indigo-500/10'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400'
            }`}
          >
            {themeMode === 'auto' ? (
              <div className="flex items-center gap-1.5">
                {darkMode ? (
                  <Moon className="w-4 h-4 text-indigo-500 animate-pulse" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500 animate-pulse" />
                )}
                <span className="hidden sm:inline">
                  {darkMode ? 'Auto: Istirahat (Gelap)' : 'Auto: Produktif (Terang)'}
                </span>
                <span className="sm:hidden text-[10px] font-bold">Auto</span>
              </div>
            ) : darkMode ? (
              <div className="flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Manual Gelap</span>
                <span className="sm:hidden text-[10px]">Gelap</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">Manual Terang</span>
                <span className="sm:hidden text-[10px]">Terang</span>
              </div>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Bunyi Efek Suara Aktif' : 'Efek Suara Dimatikan'}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 shadow-sm transition-all flex items-center gap-1.5 text-xs font-medium active:scale-95 cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Backup Button */}
          <button
            onClick={onOpenBackupModal}
            title="Cadangkan Data"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 cursor-pointer"
          >
            <HardDrive className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
