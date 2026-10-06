import { AppStateData } from '../types';

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getOffsetDateString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return formatDateKey(d);
}

export function getInitialAppState(): AppStateData {
  const today = new Date();
  const todayStr = formatDateKey(today);

  const habits = [
    { id: 'hb-1', name: 'Bangun Pagi & Meditasi', color: 'emerald', completions: {} as Record<string, boolean> },
    { id: 'hb-2', name: 'Olahraga / Jalan 30 Menit', color: 'indigo', completions: {} as Record<string, boolean> },
    { id: 'hb-3', name: 'Membaca Buku / Jurnal', color: 'amber', completions: {} as Record<string, boolean> },
    { id: 'hb-4', name: 'Review Prioritas Harian', color: 'rose', completions: {} as Record<string, boolean> }
  ];

  const daysCount = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  for (let day = 1; day <= Math.min(today.getDate(), daysCount); day++) {
    const dStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    habits[0].completions[dStr] = day % 4 !== 0;
    habits[1].completions[dStr] = day % 2 === 0;
    habits[2].completions[dStr] = true;
    habits[3].completions[dStr] = day % 3 !== 0;
  }

  const timeCategories = [
    { id: 'tc-1', name: 'Tidur & Istirahat', color: '#6366f1', emoji: '😴' },
    { id: 'tc-2', name: 'Bekerja & Bisnis', color: '#0284c7', emoji: '💼' },
    { id: 'tc-3', name: 'Kreator & YouTube', color: '#e11d48', emoji: '🎬' },
    { id: 'tc-4', name: 'Olahraga & Sehat', color: '#10b981', emoji: '🏃' },
    { id: 'tc-5', name: 'Ibadah & Refleksi', color: '#f59e0b', emoji: '🧘' },
    { id: 'tc-6', name: 'Keluarga & Santai', color: '#8b5cf6', emoji: '☕' }
  ];

  const defaultDayHours: Record<number, string> = {
    0: 'tc-1', 1: 'tc-1', 2: 'tc-1', 3: 'tc-1', 4: 'tc-1',
    5: 'tc-5', 6: 'tc-4', 7: 'tc-6',
    8: 'tc-2', 9: 'tc-2', 10: 'tc-2', 11: 'tc-2',
    12: 'tc-6', 13: 'tc-2', 14: 'tc-2', 15: 'tc-2',
    16: 'tc-3', 17: 'tc-3', 18: 'tc-5', 19: 'tc-6',
    20: 'tc-6', 21: 'tc-3', 22: 'tc-1', 23: 'tc-1'
  };

  return {
    soundEnabled: true,
    currentAffirmationIndex: 0,
    affirmationImage: null,
    myPersonalNotes: "Fokus menjaga kesehatan, kedisiplinan jadwal harian, dan menghasilkan karya terbaik setiap hari.",
    nationalHolidays: {},
    affirmations: [
      "Setiap langkah kecil yang konsisten hari ini adalah pondasi kesuksesan besar di masa depan.",
      "Fokus pada proses terbaik, hasil luar biasa akan mengikuti secara alami.",
      "Disiplin hari ini adalah kebebasan dan ketenangan di esok hari.",
      "Ketenangan pikiran melahirkan keputusan bisnis yang tajam dan bijaksana.",
      "Bersyukur atas setiap pencapaian, bersemangat menyambut tantangan berikutnya."
    ],
    scheduledTasks: [
      { id: 'st-1', title: 'Penyusunan Rencana Bisnis & Konten YouTube', scheduledDate: getOffsetDateString(0), deadline: getOffsetDateString(4), completed: false },
      { id: 'st-2', title: 'Audit Finansial & Pajak Tahunan', scheduledDate: getOffsetDateString(1), deadline: getOffsetDateString(8), completed: false },
      { id: 'st-3', title: 'Perpanjangan Lisensi Operasional', scheduledDate: getOffsetDateString(0), deadline: getOffsetDateString(20), completed: false }
    ],
    dailyTasks: [
      { id: 'dt-1', dateStr: todayStr, title: 'Koordinasi Tim & Review Naskah Video', priority: 'high', completed: false },
      { id: 'dt-2', dateStr: todayStr, title: 'Membaca Riset Industri & Analisis Metrik', priority: 'medium', completed: false },
      { id: 'dt-3', dateStr: todayStr, title: 'Jalan Santai 30 Menit Sore', priority: 'low', completed: true }
    ],
    habits,
    activeTimeCategoryId: 'tc-1',
    timeCategories,
    timeTracking: {
      [todayStr]: defaultDayHours
    },
    reflections: {
      [todayStr]: {
        impianTerbesar: "Membangun ekosistem bisnis dan channel YouTube yang menginspirasi ratusan ribu orang serta membawa keberkahan hidup.",
        kenapaPenting: "Memberikan kebebasan waktu, membahagiakan keluarga, dan menebarkan manfaat luas bagi sesama.",
        bikinSemangat: "Melihat progres nyata setiap hari dan mengetahui setiap usaha kecil membawa dampak luar biasa.",
        versiTerbaik: "Margono Wibowo yang bijaksana, fokus penuh pada solusi, dan penuh ketenangan.",
        emosiDiinginkan: "Ketenangan batin, rasa syukur mendalam, dan antusiasme tinggi.",
        polaLama: "Terlalu memikirkan hal-hal di luar kendali diri atau menunda evaluasi penting.",
        gratitude: "Kesehatan tubuh, kehangatan keluarga, dan kesempatan bertumbuh hari ini.",
        learning: "Disiplin pada jadwal kecil ternyata melahirkan ketenangan mental yang sangat besar.",
        perbaikan: "Tidur tepat waktu di malam hari dan membatasi scrolling gadget yang tidak perlu."
      }
    }
  };
}

export function normalizeHabitColor(color: string): string {
  const legacyMap: Record<string, string> = {
    emerald: '#10b981',
    indigo: '#6366f1',
    amber: '#f59e0b',
    rose: '#e11d48',
    purple: '#8b5cf6'
  };
  return legacyMap[color] || color || '#10b981';
}

export function advanceDeadlineDate(
  currentDeadline: string,
  repeat: 'daily' | 'weekly' | 'monthly' | '3months' | '6months' | 'yearly'
): string {
  if (!currentDeadline) return '';
  const parts = currentDeadline.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);

    if (repeat === 'daily') d.setDate(d.getDate() + 1);
    else if (repeat === 'weekly') d.setDate(d.getDate() + 7);
    else if (repeat === 'monthly') d.setMonth(d.getMonth() + 1);
    else if (repeat === '3months') d.setMonth(d.getMonth() + 3);
    else if (repeat === '6months') d.setMonth(d.getMonth() + 6);
    else if (repeat === 'yearly') d.setFullYear(d.getFullYear() + 1);

    const ny = d.getFullYear();
    const nm = String(d.getMonth() + 1).padStart(2, '0');
    const nd = String(d.getDate()).padStart(2, '0');
    return `${ny}-${nm}-${nd}`;
  }
  return currentDeadline;
}

