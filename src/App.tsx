import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AppStateData, ScheduledTask, DailyTask, DayReflection } from './types';
import { getInitialAppState, formatDateKey, getOffsetDateString } from './utils/initialData';
import { playClickSound, playCelebrationSound, playFanfareSound, initAudioContext } from './utils/audio';
import { triggerConfetti, triggerSuperConfetti } from './utils/confetti';
import { fetchNationalHolidays } from './utils/holidays';
import { Header } from './components/Header';
import { Banner } from './components/Banner';
import { CalendarSection } from './components/CalendarSection';
import { TasksSection } from './components/TasksSection';
import { HabitTracker } from './components/HabitTracker';
import { TimeTracker } from './components/TimeTracker';
import { JournalSection } from './components/JournalSection';
import {
  PersonalNotesModal,
  ScheduledTaskModal,
  DailyTaskModal,
  HabitModal,
  TimeCategoryModal,
  AffirmationImageModal,
  LightboxModal,
  RewardModal,
  CustomAffirmationModal,
  BackupModal
} from './components/Modals';

export const DEFAULT_GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxFYZhYHkqkajwjE2AVBiX5PihnaETsksBWPxIXblBA7hG1SG8kb45eBjz7Bx6CVQly/exec";

// Mendeteksi waktu istirahat Pak Margono (18:00 - 06:00) vs waktu produktif kerja (06:00 - 18:00)
export function isMargonoRestTime(): boolean {
  const currentHour = new Date().getHours();
  return currentHour >= 18 || currentHour < 6;
}

export default function App() {
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>(() => {
    const saved = localStorage.getItem('myjourney_google_sheet_url');
    // Jika belum ada atau masih URL lama, otomatis gunakan URL baru Pak Margono
    if (!saved || saved.includes('AKfycbzULMF2OiGe_xMXW_VpUL1anZs4B9Te9Shcjz3vVW_u1w7y3I_tQN6Cp1qi9O56nEau')) {
      localStorage.setItem('myjourney_google_sheet_url', DEFAULT_GOOGLE_SHEET_URL);
      return DEFAULT_GOOGLE_SHEET_URL;
    }
    return saved;
  });

  const [appState, setAppState] = useState<AppStateData>(() => {
    const initial = getInitialAppState();
    const local = localStorage.getItem('myjourney_margono_db');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed && typeof parsed === 'object') {
          return {
            ...initial,
            ...parsed,
            scheduledTasks: Array.isArray(parsed.scheduledTasks) ? parsed.scheduledTasks : initial.scheduledTasks,
            dailyTasks: Array.isArray(parsed.dailyTasks) ? parsed.dailyTasks : initial.dailyTasks,
            habits: Array.isArray(parsed.habits) ? parsed.habits : initial.habits,
            timeCategories: Array.isArray(parsed.timeCategories) ? parsed.timeCategories : initial.timeCategories,
            affirmations: Array.isArray(parsed.affirmations) ? parsed.affirmations : initial.affirmations,
            timeTracking: parsed.timeTracking && typeof parsed.timeTracking === 'object' ? parsed.timeTracking : initial.timeTracking,
            reflections: parsed.reflections && typeof parsed.reflections === 'object' ? parsed.reflections : initial.reflections,
          };
        }
      } catch {
        return initial;
      }
    }
    return initial;
  });

  const [themeMode, setThemeMode] = useState<'auto' | 'light' | 'dark'>(() => {
    const savedMode = localStorage.getItem('myjourney_theme_mode') as 'auto' | 'light' | 'dark' | null;
    if (savedMode === 'auto' || savedMode === 'light' || savedMode === 'dark') {
      return savedMode;
    }
    return 'auto'; // Mode otomatis sesuai waktu istirahat secara bawaan
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('myjourney_theme_mode') as 'auto' | 'light' | 'dark' | null;
    if (savedMode === 'dark') return true;
    if (savedMode === 'light') return false;
    return isMargonoRestTime();
  });

  const [cloudStatus, setCloudStatus] = useState<'syncing' | 'synced' | 'offline' | 'error'>('synced');
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'warning' | 'info' }>>([]);

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const [currentViewMonth, setCurrentViewMonth] = useState<number>(today.getMonth());
  const [currentViewYear, setCurrentViewYear] = useState<number>(today.getFullYear());

  // Canvas ref for confetti
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Modals state
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isScheduledModalOpen, setIsScheduledModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<ScheduledTask | null>(null);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [dailyTaskToEdit, setDailyTaskToEdit] = useState<DailyTask | null>(null);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isImageViewOpen, setIsImageViewOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isCustomAffirmationOpen, setIsCustomAffirmationOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Logika mendeteksi waktu lokal dan peralihan tema otomatis sesuai jam istirahat Pak Margono
  useEffect(() => {
    const evaluateAutoTheme = () => {
      if (themeMode === 'auto') {
        const isRest = isMargonoRestTime();
        setDarkMode(isRest);
      } else if (themeMode === 'dark') {
        setDarkMode(true);
      } else if (themeMode === 'light') {
        setDarkMode(false);
      }
    };

    evaluateAutoTheme();
    // Memeriksa setiap 20 detik agar saat jam lokal berganti ke 18:00 atau 06:00, tema langsung beralih mulus
    const interval = setInterval(evaluateAutoTheme, 20000);
    return () => clearInterval(interval);
  }, [themeMode]);

  // Sinkronisasi kelas dark pada dokumen HTML dan Body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('myjourney_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Load cloud data or holidays on mount
  useEffect(() => {
    const loadHolidays = async () => {
      const hols = await fetchNationalHolidays(currentViewYear);
      setAppState(prev => ({
        ...prev,
        nationalHolidays: {
          ...prev.nationalHolidays,
          [currentViewYear]: hols
        }
      }));
    };
    loadHolidays();
  }, [currentViewYear]);

  // Referensi untuk mencegah tabrakan saat pengguna sedang aktif mengedit
  const isEditingRecentlyRef = useRef<number>(0);
  const isFetchingCloudRef = useRef<boolean>(false);

  // Sinkronisasi otomatis dari Cloud (Google Sheet)
  const fetchCloudData = useCallback(async (isSilent = true) => {
    if (!googleSheetUrl || isFetchingCloudRef.current) return;
    // Jangan overwrite jika pengguna baru saja mengetik/mengubah data kurang dari 3.5 detik lalu
    if (Date.now() - isEditingRecentlyRef.current < 3500) return;

    isFetchingCloudRef.current = true;
    try {
      if (!isSilent) setCloudStatus('syncing');
      const res = await fetch(`${googleSheetUrl}?action=read&t=${Date.now()}`);
      if (!res.ok) throw new Error('Fetch status error');
      const json = await res.json();
      if (json && json.status === 'success' && json.data) {
        const cloudData = typeof json.data === 'string' ? JSON.parse(json.data) : json.data;
        if (cloudData && typeof cloudData === 'object') {
          // Cek kembali jika ada perubahan lokal saat request sedang berjalan
          if (Date.now() - isEditingRecentlyRef.current < 3500) {
            isFetchingCloudRef.current = false;
            return;
          }

          setAppState(prev => {
            const initial = getInitialAppState();
            const merged: AppStateData = {
              ...initial,
              ...prev,
              ...cloudData,
              scheduledTasks: Array.isArray(cloudData.scheduledTasks) ? cloudData.scheduledTasks : (Array.isArray(prev.scheduledTasks) ? prev.scheduledTasks : initial.scheduledTasks),
              dailyTasks: Array.isArray(cloudData.dailyTasks) ? cloudData.dailyTasks : (Array.isArray(prev.dailyTasks) ? prev.dailyTasks : initial.dailyTasks),
              habits: Array.isArray(cloudData.habits) ? cloudData.habits : (Array.isArray(prev.habits) ? prev.habits : initial.habits),
              timeCategories: Array.isArray(cloudData.timeCategories) ? cloudData.timeCategories : (Array.isArray(prev.timeCategories) ? prev.timeCategories : initial.timeCategories),
              affirmations: Array.isArray(cloudData.affirmations) ? cloudData.affirmations : (Array.isArray(prev.affirmations) ? prev.affirmations : initial.affirmations),
            };
            localStorage.setItem('myjourney_margono_db', JSON.stringify(merged));
            return merged;
          });
          setCloudStatus('synced');
          if (!isSilent) {
            showToast('☁️ Data otomatis tersinkron dari Cloud!', 'success');
          }
        }
      } else {
        setCloudStatus('synced');
      }
    } catch {
      // Tetap gunakan data lokal saat offline tanpa mengganggu pengalaman pengguna
      setCloudStatus('synced');
    } finally {
      isFetchingCloudRef.current = false;
    }
  }, [googleSheetUrl]);

  // 1. Tarik data terbaru saat aplikasi dibuka
  useEffect(() => {
    fetchCloudData(true);
  }, [fetchCloudData]);

  // 2. Tarik data otomatis saat pengguna membuka/berpindah tab di HP atau Laptop
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchCloudData(true);
      }
    };
    const handleFocus = () => {
      fetchCloudData(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Polling latar belakang berkala setiap 15 detik agar HP & Laptop selalu sama persis
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchCloudData(true);
      }
    }, 15000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [fetchCloudData]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    const id = 'toast-' + Date.now() + Math.random();
    setToasts(prev => [{ id, message, type }, ...prev]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  // Sync state to LocalStorage and Google Sheets
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const saveState = (newState: AppStateData) => {
    setAppState(newState);
    isEditingRecentlyRef.current = Date.now();
    localStorage.setItem('myjourney_margono_db', JSON.stringify(newState));

    if (!googleSheetUrl) {
      setCloudStatus('offline');
      return;
    }

    setCloudStatus('syncing');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const payload = new URLSearchParams({ data: JSON.stringify(newState) });
        await fetch(googleSheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: payload
        });
        setCloudStatus('synced');
      } catch {
        setCloudStatus('error');
      }
    }, 500);
  };

  // User interactions: beralih tema (Otomatis Jadwal Istirahat -> Manual Terang -> Manual Gelap)
  const handleCycleThemeMode = () => {
    playClickSound(appState.soundEnabled);
    if (themeMode === 'auto') {
      setThemeMode('light');
      setDarkMode(false);
      localStorage.setItem('myjourney_theme_mode', 'light');
      showToast('Mode Terang Manual Aktif', 'info');
    } else if (themeMode === 'light') {
      setThemeMode('dark');
      setDarkMode(true);
      localStorage.setItem('myjourney_theme_mode', 'dark');
      showToast('Mode Gelap Manual Aktif', 'info');
    } else {
      setThemeMode('auto');
      const isRest = isMargonoRestTime();
      setDarkMode(isRest);
      localStorage.setItem('myjourney_theme_mode', 'auto');
      showToast(
        isRest
          ? 'Mode Otomatis Aktif: Saat ini Waktu Istirahat Pak Margono (Tema Gelap).'
          : 'Mode Otomatis Aktif: Saat ini Waktu Produktif Siang (Tema Terang).',
        'info'
      );
    }
  };

  const handleToggleSound = () => {
    const nextVal = !appState.soundEnabled;
    const nextState = { ...appState, soundEnabled: nextVal };
    saveState(nextState);
    if (nextVal) {
      initAudioContext();
      playClickSound(true);
      showToast('Efek suara diaktifkan', 'info');
    } else {
      showToast('Efek suara dinonaktifkan', 'info');
    }
  };

  const handleShuffleAffirmation = () => {
    playClickSound(appState.soundEnabled);
    const nextIndex = (appState.currentAffirmationIndex + 1) % appState.affirmations.length;
    saveState({ ...appState, currentAffirmationIndex: nextIndex });
  };

  const handleSelectDate = (year: number, month: number, day: number) => {
    playClickSound(appState.soundEnabled);
    setSelectedDate(new Date(year, month, day));
  };

  const handleNavigateMonth = (step: number) => {
    playClickSound(appState.soundEnabled);
    let newM = currentViewMonth + step;
    let newY = currentViewYear;
    if (newM < 0) {
      newM = 11;
      newY--;
    } else if (newM > 11) {
      newM = 0;
      newY++;
    }
    setCurrentViewMonth(newM);
    setCurrentViewYear(newY);
  };

  const handleGoToToday = () => {
    playClickSound(appState.soundEnabled);
    setCurrentViewMonth(today.getMonth());
    setCurrentViewYear(today.getFullYear());
    setSelectedDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  };

  // Check date completion for daily tasks
  const checkDailyCompletion = (dateStr: string, updatedTasks: typeof appState.dailyTasks) => {
    const tasksOfDate = updatedTasks.filter(t => t.dateStr === dateStr);
    if (tasksOfDate.length > 0 && tasksOfDate.every(t => t.completed)) {
      setTimeout(() => {
        triggerSuperConfetti(canvasRef.current);
        playFanfareSound(appState.soundEnabled);
        setIsRewardModalOpen(true);
      }, 350);
    }
  };

  // Daily Tasks actions
  const handleToggleDailyTask = (id: string) => {
    let completedNow = false;
    let targetDate = '';
    const updated = appState.dailyTasks.map(t => {
      if (t.id === id) {
        completedNow = !t.completed;
        targetDate = t.dateStr;
        return { ...t, completed: completedNow };
      }
      return t;
    });

    if (completedNow) {
      triggerConfetti(canvasRef.current);
      playCelebrationSound(appState.soundEnabled);
      showToast('Agenda harian selesai!', 'success');
      checkDailyCompletion(targetDate, updated);
    } else {
      playClickSound(appState.soundEnabled);
    }

    saveState({ ...appState, dailyTasks: updated });
  };

  const handleDeleteDailyTask = (id: string) => {
    playClickSound(appState.soundEnabled);
    const updated = appState.dailyTasks.filter(t => t.id !== id);
    saveState({ ...appState, dailyTasks: updated });
    showToast('Agenda harian dihapus.', 'info');
  };

  const handleSaveDailyTask = (
    title: string,
    dateStr: string,
    priority: 'high' | 'medium' | 'low',
    id?: string
  ) => {
    if (id) {
      const updated = appState.dailyTasks.map(t =>
        t.id === id ? { ...t, title, dateStr, priority } : t
      );
      saveState({ ...appState, dailyTasks: updated });
      playClickSound(appState.soundEnabled);
      showToast('Agenda harian berhasil diperbarui!', 'success');
    } else {
      playCelebrationSound(appState.soundEnabled);
      const newTask = {
        id: 'dt-' + Date.now(),
        dateStr,
        title,
        priority,
        completed: false
      };
      saveState({ ...appState, dailyTasks: [...appState.dailyTasks, newTask] });
      showToast('Agenda harian baru berhasil ditambahkan!', 'success');
    }
    setIsDailyModalOpen(false);
    setDailyTaskToEdit(null);
  };

  // Scheduled Tasks actions
  const handleToggleScheduledTask = (id: string) => {
    let completedNow = false;
    const updated = appState.scheduledTasks.map(t => {
      if (t.id === id) {
        completedNow = !t.completed;
        return { ...t, completed: completedNow };
      }
      return t;
    });

    if (completedNow) {
      triggerConfetti(canvasRef.current);
      playCelebrationSound(appState.soundEnabled);
      showToast('Catatan terjadwal selesai!', 'success');
    } else {
      playClickSound(appState.soundEnabled);
    }

    saveState({ ...appState, scheduledTasks: updated });
  };

  const handleSaveScheduledTask = (data: { id?: string; title: string; scheduledDate: string; deadline: string }) => {
    if (data.id) {
      const updated = appState.scheduledTasks.map(t => (t.id === data.id ? { ...t, ...data } : t));
      saveState({ ...appState, scheduledTasks: updated });
      showToast('Catatan terjadwal berhasil diperbarui!', 'success');
    } else {
      const newTask = {
        id: 'st-' + Date.now(),
        title: data.title,
        scheduledDate: data.scheduledDate,
        deadline: data.deadline,
        completed: false
      };
      saveState({ ...appState, scheduledTasks: [...appState.scheduledTasks, newTask] });
      playCelebrationSound(appState.soundEnabled);
      showToast('Catatan terjadwal baru ditambahkan!', 'success');
    }
    setIsScheduledModalOpen(false);
    setTaskToEdit(null);
  };

  const handleDeleteScheduledTask = (id: string) => {
    playClickSound(appState.soundEnabled);
    const updated = appState.scheduledTasks.filter(t => t.id !== id);
    saveState({ ...appState, scheduledTasks: updated });
    showToast('Catatan terjadwal dihapus.', 'info');
  };

  // Habits actions
  const handleToggleHabitDay = (habitId: string, dateStr: string) => {
    const updated = appState.habits.map(h => {
      if (h.id === habitId) {
        const isDone = !h.completions[dateStr];
        if (isDone) playCelebrationSound(appState.soundEnabled);
        else playClickSound(appState.soundEnabled);
        return {
          ...h,
          completions: { ...h.completions, [dateStr]: isDone }
        };
      }
      return h;
    });
    saveState({ ...appState, habits: updated });
  };

  const handleDeleteHabit = (habitId: string) => {
    if (appState.habits.length <= 1) {
      showToast('Minimal harus ada 1 kebiasaan dalam tracker.', 'warning');
      return;
    }
    playClickSound(appState.soundEnabled);
    const updated = appState.habits.filter(h => h.id !== habitId);
    saveState({ ...appState, habits: updated });
    showToast('Kebiasaan berhasil dihapus.', 'info');
  };

  const handleSaveHabit = (name: string, color: string) => {
    playCelebrationSound(appState.soundEnabled);
    const newHabit = {
      id: 'hb-' + Date.now(),
      name,
      color,
      completions: {}
    };
    saveState({ ...appState, habits: [...appState.habits, newHabit] });
    setIsHabitModalOpen(false);
    showToast('Kebiasaan baru berhasil ditambahkan!', 'success');
  };

  // Time Tracker actions
  const handleTogglePixel = (dateStr: string, hour: number) => {
    const currentDayData = appState.timeTracking[dateStr] || {};
    const currentCat = currentDayData[hour];
    const newDayData = { ...currentDayData };

    if (currentCat === appState.activeTimeCategoryId) {
      delete newDayData[hour];
      playClickSound(appState.soundEnabled);
    } else {
      newDayData[hour] = appState.activeTimeCategoryId;
      playCelebrationSound(appState.soundEnabled);
    }

    saveState({
      ...appState,
      timeTracking: {
        ...appState.timeTracking,
        [dateStr]: newDayData
      }
    });
  };

  const handleResetMonthTime = () => {
    const daysInMonth = new Date(currentViewYear, currentViewMonth + 1, 0).getDate();
    const newTracking = { ...appState.timeTracking };
    let cleared = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentViewYear}-${String(currentViewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (newTracking[dateStr]) {
        delete newTracking[dateStr];
        cleared++;
      }
    }
    if (cleared > 0) {
      playClickSound(appState.soundEnabled);
      saveState({ ...appState, timeTracking: newTracking });
      showToast('Catatan jam bulan ini dikosongkan.', 'info');
    } else {
      showToast('Belum ada catatan jam di bulan ini.', 'info');
    }
  };

  const handleSaveCustomTimeCategory = (name: string, emoji: string, color: string) => {
    const newId = 'tc-' + Date.now();
    const newCategory = { id: newId, name, emoji, color };
    saveState({
      ...appState,
      timeCategories: [...appState.timeCategories, newCategory],
      activeTimeCategoryId: newId
    });
    setIsCategoryModalOpen(false);
    playCelebrationSound(appState.soundEnabled);
    showToast(`Indikator "${name}" berhasil ditambahkan!`, 'success');
  };

  const handleDeleteTimeCategory = (id: string) => {
    if (appState.timeCategories.length <= 1) {
      showToast('Minimal harus ada 1 indikator waktu.', 'warning');
      return;
    }
    const updated = appState.timeCategories.filter(c => c.id !== id);
    const nextActive = appState.activeTimeCategoryId === id ? updated[0].id : appState.activeTimeCategoryId;
    saveState({ ...appState, timeCategories: updated, activeTimeCategoryId: nextActive });
    playClickSound(appState.soundEnabled);
    showToast('Indikator waktu telah dihapus.', 'info');
  };

  // Reflection actions
  const handleSaveReflection = (dateStr: string, reflection: DayReflection) => {
    playCelebrationSound(appState.soundEnabled);
    saveState({
      ...appState,
      reflections: {
        ...appState.reflections,
        [dateStr]: reflection
      }
    });
    showToast('Refleksi diri berhasil disimpan!', 'success');
  };

  // Personal Notes actions
  const handleSavePersonalNotes = (notes: string) => {
    playCelebrationSound(appState.soundEnabled);
    saveState({ ...appState, myPersonalNotes: notes });
    setIsNotesOpen(false);
    showToast('Catatan Saya berhasil disimpan!', 'success');
  };

  // Affirmation Image actions
  const handleSaveAffirmationImage = (base64: string) => {
    playCelebrationSound(appState.soundEnabled);
    saveState({ ...appState, affirmationImage: base64 });
    setIsImageModalOpen(false);
    showToast('🖼️ Gambar afirmasi berhasil disimpan!', 'success');
    setTimeout(() => setIsImageViewOpen(true), 250);
  };

  const handleRemoveAffirmationImage = () => {
    playClickSound(appState.soundEnabled);
    saveState({ ...appState, affirmationImage: null });
    setIsImageModalOpen(false);
    setIsImageViewOpen(false);
    showToast('Gambar afirmasi telah dihapus.', 'info');
  };

  // Custom Affirmation
  const handleSaveCustomAffirmation = (text: string) => {
    playCelebrationSound(appState.soundEnabled);
    saveState({
      ...appState,
      affirmations: [text, ...appState.affirmations],
      currentAffirmationIndex: 0
    });
    setIsCustomAffirmationOpen(false);
    showToast('Afirmasi baru berhasil disimpan!', 'success');
  };

  // Export / Import
  const handleExportData = () => {
    playClickSound(appState.soundEnabled);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(appState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `MyJourney_MargonoWibowo_${formatDateKey(today)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('File cadangan data berhasil diunduh!', 'success');
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (imported.scheduledTasks || imported.dailyTasks) {
          saveState({ ...getInitialAppState(), ...imported });
          setIsBackupOpen(false);
          showToast('Data berhasil dipulihkan secara menyeluruh!', 'success');
          triggerConfetti(canvasRef.current);
        } else {
          showToast('Format data JSON tidak sesuai.', 'warning');
        }
      } catch {
        showToast('Gagal membaca file JSON.', 'warning');
      }
    };
    reader.readAsText(file);
  };

  const handleUpdateSheetUrl = async (newUrl: string) => {
    const cleanUrl = newUrl.trim();
    if (!cleanUrl) {
      showToast('URL Google Apps Script tidak boleh kosong.', 'warning');
      return;
    }
    setGoogleSheetUrl(cleanUrl);
    localStorage.setItem('myjourney_google_sheet_url', cleanUrl);
    setCloudStatus('syncing');
    showToast('Menyimpan URL & menautkan data ke Google Sheet...', 'info');

    try {
      // Kirim data aplikasi saat ini ke sheet baru agar langsung terisi
      const payload = new URLSearchParams({ data: JSON.stringify(appState) });
      await fetch(cleanUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload
      });

      setTimeout(() => {
        fetchCloudData(true);
      }, 500);

      setCloudStatus('synced');
      showToast('✅ Berhasil tertaut ke Google Sheet baru!', 'success');
      triggerConfetti(canvasRef.current);
    } catch {
      setCloudStatus('error');
      showToast('Gagal menautkan. Pastikan izin Web App diatur "Anyone".', 'warning');
    }
  };

  const handleResetToDefaultSheetUrl = async () => {
    setGoogleSheetUrl(DEFAULT_GOOGLE_SHEET_URL);
    localStorage.setItem('myjourney_google_sheet_url', DEFAULT_GOOGLE_SHEET_URL);
    setCloudStatus('syncing');
    showToast('Mengembalikan ke Google Sheet Bawaan Margono...', 'info');

    try {
      const payload = new URLSearchParams({ data: JSON.stringify(appState) });
      await fetch(DEFAULT_GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload
      });
      setTimeout(() => {
        fetchCloudData(true);
      }, 500);
      setCloudStatus('synced');
      showToast('✅ Menggunakan Google Sheet Bawaan Margono!', 'success');
    } catch {
      setCloudStatus('synced');
    }
  };

  const handleManualSyncNow = () => {
    fetchCloudData(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 selection:bg-sky-500 selection:text-white" onClick={() => initAudioContext()}>
      {/* Celebration Canvas */}
      <canvas ref={canvasRef} id="celebrationCanvas" className="fixed inset-0 pointer-events-none z-50 w-screen h-screen" />

      {/* Toast Notifications */}
      <div className="fixed top-5 right-5 z-50 flex flex-col items-end gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {toasts.map(toast => {
          const typeClasses = {
            success: 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-xl border border-emerald-300',
            warning: 'bg-amber-600 dark:bg-amber-500 text-white shadow-xl border border-amber-300',
            info: 'bg-slate-900 dark:bg-slate-800 text-white shadow-xl border border-slate-700'
          };
          return (
            <div
              key={toast.id}
              className={`p-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 pointer-events-auto transition-all animate-pop-check ${typeClasses[toast.type]}`}
            >
              <span>🎯</span>
              <span>{toast.message}</span>
            </div>
          );
        })}
      </div>

      {/* Header */}
      <Header
        themeMode={themeMode}
        darkMode={darkMode}
        onCycleThemeMode={handleCycleThemeMode}
        soundEnabled={appState.soundEnabled}
        onToggleSound={handleToggleSound}
        cloudStatus={cloudStatus}
        onOpenBackupModal={() => setIsBackupOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7">
        {/* Affirmation Banner */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Banner
            currentAffirmation={appState.affirmations[appState.currentAffirmationIndex] || appState.affirmations[0]}
            hasAffirmationImage={!!appState.affirmationImage}
            onShuffle={handleShuffleAffirmation}
            onOpenImageModal={() => setIsImageModalOpen(true)}
            onOpenImageView={() => setIsImageViewOpen(true)}
            onOpenPersonalNotes={() => setIsNotesOpen(true)}
            onOpenCustomAffirmation={() => setIsCustomAffirmationOpen(true)}
          />
        </motion.div>

        {/* Calendar Section + Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <CalendarSection
            currentViewYear={currentViewYear}
            currentViewMonth={currentViewMonth}
            selectedDate={selectedDate}
            todayDate={today}
            dailyTasks={appState.dailyTasks}
            scheduledTasks={appState.scheduledTasks}
            nationalHolidays={appState.nationalHolidays[currentViewYear] || {}}
            onSelectDate={handleSelectDate}
            onNavigateMonth={handleNavigateMonth}
            onGoToToday={handleGoToToday}
            onOpenJournalTab={() => {
              const el = document.getElementById('journal-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onCompleteFocusSession={() => {
              triggerSuperConfetti(canvasRef.current);
              playFanfareSound(appState.soundEnabled);
              showToast('🎉 Luar biasa! Sesi fokus produktif Margono telah selesai.', 'success');
            }}
            onPlayClickSound={() => playClickSound(appState.soundEnabled)}
          />
        </motion.div>

        {/* Tasks Section (Pekerjaan Saya) */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <TasksSection
            selectedDate={selectedDate}
            todayDate={today}
            dailyTasks={appState.dailyTasks}
            scheduledTasks={appState.scheduledTasks}
            nationalHolidays={appState.nationalHolidays[currentViewYear] || {}}
            onToggleDailyTask={handleToggleDailyTask}
            onEditDailyTask={task => {
              setDailyTaskToEdit(task);
              setIsDailyModalOpen(true);
            }}
            onDeleteDailyTask={handleDeleteDailyTask}
            onOpenAddDailyTask={() => {
              setDailyTaskToEdit(null);
              setIsDailyModalOpen(true);
            }}
            onToggleScheduledTask={handleToggleScheduledTask}
            onEditScheduledTask={task => {
              setTaskToEdit(task);
              setIsScheduledModalOpen(true);
            }}
            onDeleteScheduledTask={handleDeleteScheduledTask}
            onOpenAddScheduledTask={() => {
              setTaskToEdit(null);
              setIsScheduledModalOpen(true);
            }}
          />
        </motion.div>

        {/* Habit Tracker Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <HabitTracker
            habits={appState.habits}
            currentViewYear={currentViewYear}
            currentViewMonth={currentViewMonth}
            selectedDate={selectedDate}
            todayDate={today}
            onToggleHabitDay={handleToggleHabitDay}
            onDeleteHabit={handleDeleteHabit}
            onOpenAddHabitModal={() => setIsHabitModalOpen(true)}
          />
        </motion.div>

        {/* Time Tracker 24 Jam Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <TimeTracker
            currentViewYear={currentViewYear}
            currentViewMonth={currentViewMonth}
            selectedDate={selectedDate}
            todayDate={today}
            timeCategories={appState.timeCategories}
            activeCategoryId={appState.activeTimeCategoryId}
            timeTracking={appState.timeTracking}
            onSelectCategory={id => saveState({ ...appState, activeTimeCategoryId: id })}
            onDeleteCategory={handleDeleteTimeCategory}
            onTogglePixel={handleTogglePixel}
            onResetMonth={handleResetMonthTime}
            onOpenAddCategoryModal={() => setIsCategoryModalOpen(true)}
            onSelectDate={handleSelectDate}
          />
        </motion.div>

        {/* Jurnal Pribadi & Bank Afirmasi */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div id="journal-section">
            <JournalSection
              selectedDate={selectedDate}
              reflections={appState.reflections}
              affirmations={appState.affirmations}
              onSaveReflection={handleSaveReflection}
              onOpenCustomAffirmation={() => setIsCustomAffirmationOpen(true)}
              onOpenBackupModal={() => setIsBackupOpen(true)}
            />
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-body">
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <strong>My Journey Margono Wibowo</strong> &copy; 2026. Jurnal Pribadi, Habit & Time Tracker.
          </p>
          <div className="flex items-center gap-4">
            <span>Fokus, Konsisten & Tepat Waktu</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
            >
              Kembali ke Atas &uarr;
            </button>
          </div>
        </div>
      </footer>

      {/* All Modals */}
      <PersonalNotesModal
        isOpen={isNotesOpen}
        notes={appState.myPersonalNotes}
        onClose={() => setIsNotesOpen(false)}
        onSave={handleSavePersonalNotes}
      />

      <ScheduledTaskModal
        isOpen={isScheduledModalOpen}
        taskToEdit={taskToEdit}
        defaultDate={formatDateKey(selectedDate)}
        defaultDeadline={getOffsetDateString(7)}
        onClose={() => {
          setIsScheduledModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveScheduledTask}
      />

      <DailyTaskModal
        isOpen={isDailyModalOpen}
        defaultDate={formatDateKey(selectedDate)}
        taskToEdit={dailyTaskToEdit}
        onClose={() => {
          setIsDailyModalOpen(false);
          setDailyTaskToEdit(null);
        }}
        onSave={handleSaveDailyTask}
      />

      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        onSave={handleSaveHabit}
      />

      <TimeCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCustomTimeCategory}
      />

      <AffirmationImageModal
        isOpen={isImageModalOpen}
        currentImage={appState.affirmationImage}
        onClose={() => setIsImageModalOpen(false)}
        onSaveImage={handleSaveAffirmationImage}
        onRemoveImage={handleRemoveAffirmationImage}
      />

      <LightboxModal
        isOpen={isImageViewOpen}
        imageSrc={appState.affirmationImage}
        onClose={() => setIsImageViewOpen(false)}
        onOpenManage={() => {
          setIsImageViewOpen(false);
          setIsImageModalOpen(true);
        }}
      />

      <RewardModal
        isOpen={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
        onFireFanfare={() => {
          triggerSuperConfetti(canvasRef.current);
          playFanfareSound(appState.soundEnabled);
        }}
      />

      <CustomAffirmationModal
        isOpen={isCustomAffirmationOpen}
        onClose={() => setIsCustomAffirmationOpen(false)}
        onSave={handleSaveCustomAffirmation}
      />

      <BackupModal
        isOpen={isBackupOpen}
        sheetUrl={googleSheetUrl}
        cloudStatus={cloudStatus}
        onUpdateSheetUrl={handleUpdateSheetUrl}
        onResetToDefaultUrl={handleResetToDefaultSheetUrl}
        onSyncNow={handleManualSyncNow}
        onClose={() => setIsBackupOpen(false)}
        onExport={handleExportData}
        onImport={handleImportData}
      />
    </div>
  );
}
