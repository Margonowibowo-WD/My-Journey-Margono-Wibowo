import React from 'react';
import { Sun, Moon, Volume2, VolumeX, HardDrive } from 'lucide-react';

interface HeaderProps {
  themeMode: 'auto' | 'light' | 'dark';
  darkMode: boolean;
  onCycleThemeMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  cloudStatus: 'syncing' | 'synced' | 'offline' | 'error';
  onOpenBackupModal: () => void;
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
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800/80 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md ring-2 ring-white dark:ring-slate-800">
            MW
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                My Journey
              </h1>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 rounded-full border border-sky-200/60 dark:border-sky-800/60">
                Margono Wibowo
              </span>
            </div>
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
