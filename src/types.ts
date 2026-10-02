export interface ScheduledTask {
  id: string;
  title: string;
  scheduledDate: string;
  deadline: string;
  completed: boolean;
}

export interface DailyTask {
  id: string;
  dateStr: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  color: 'emerald' | 'indigo' | 'amber' | 'rose' | 'purple' | string;
  completions: Record<string, boolean>;
}

export interface TimeCategory {
  id: string;
  name: string;
  color: string;
  emoji: string;
}

export interface DayReflection {
  impianTerbesar: string;
  kenapaPenting: string;
  bikinSemangat: string;
  versiTerbaik: string;
  emosiDiinginkan: string;
  polaLama: string;
  gratitude: string;
  learning: string;
  perbaikan: string;
}

export interface AppStateData {
  soundEnabled: boolean;
  currentAffirmationIndex: number;
  affirmationImage: string | null;
  myPersonalNotes: string;
  nationalHolidays: Record<number, Record<string, string>>;
  affirmations: string[];
  scheduledTasks: ScheduledTask[];
  dailyTasks: DailyTask[];
  habits: Habit[];
  activeTimeCategoryId: string;
  timeCategories: TimeCategory[];
  timeTracking: Record<string, Record<number, string>>;
  reflections: Record<string, DayReflection>;
}
