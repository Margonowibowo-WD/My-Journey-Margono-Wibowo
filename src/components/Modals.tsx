import React, { useState, useEffect } from 'react';
import { X, Sparkles, Trophy, Copy, Check, FileText, Cloud, CloudUpload, CloudDownload, RefreshCw, Code } from 'lucide-react';
import { ScheduledTask, DailyTask } from '../types';

// 1. Personal Notes Modal (Besar, Lega, dan Nyaman Dibaca)
export const PersonalNotesModal: React.FC<{
  isOpen: boolean;
  notes: string;
  onClose: () => void;
  onSave: (notes: string) => void;
}> = ({ isOpen, notes, onClose, onSave }) => {
  const [content, setContent] = useState(notes);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setContent(notes);
    setCopied(false);
  }, [notes, isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onSave(content);
    }
  };

  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-pop-check">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-amber-300/40 dark:border-amber-600/30">
        {/* Header Modal */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl shadow-xs">
              📝
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Catatan Pribadi & Ide Strategis</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  Pak Margono
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-body mt-0.5">
                Ruang luas untuk mencatat gagasan spontan, poin penting, rencana kerja, dan afirmasi pribadi.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Isi Textarea Ukuran Besar */}
        <div className="flex-1 my-4 flex flex-col min-h-0">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full flex-1 min-h-[380px] sm:min-h-[440px] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-sans leading-relaxed focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 focus:outline-none text-sm sm:text-base resize-y shadow-inner"
            placeholder="Tuliskan ide brilian, target masa depan, atau catatan kilat Anda di sini... (Tekan Ctrl + Enter untuk simpan cepat)"
            autoFocus
          />
        </div>

        {/* Footer Modal: Statistik & Tombol Aksi */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              {charCount} karakter • {wordCount} kata
            </span>
            <button
              onClick={handleCopy}
              disabled={!content.trim()}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
              title="Salin seluruh isi catatan ke clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <span className="hidden md:inline text-[11px] text-slate-400 italic">
              Shortcut: Ctrl + Enter untuk simpan
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={() => onSave(content)}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/25 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Catatan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Add / Edit Scheduled Task Modal
export const ScheduledTaskModal: React.FC<{
  isOpen: boolean;
  taskToEdit: ScheduledTask | null;
  defaultDate: string;
  defaultDeadline: string;
  onClose: () => void;
  onSave: (task: { id?: string; title: string; scheduledDate: string; deadline: string }) => void;
}> = ({ isOpen, taskToEdit, defaultDate, defaultDeadline, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setScheduledDate(taskToEdit.scheduledDate || defaultDate);
      setDeadline(taskToEdit.deadline || defaultDeadline);
    } else {
      setTitle('');
      setScheduledDate(defaultDate);
      setDeadline(defaultDeadline);
    }
  }, [taskToEdit, defaultDate, defaultDeadline, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-check">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {taskToEdit ? 'Edit Catatan Terjadwal Pribadi' : 'Tambah Catatan Terjadwal Pribadi'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Tugas Terjadwal:</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Contoh: Audit Finansial, Perpanjang Polis, Riset YouTube..."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tanggal Mulai:</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tenggat Waktu (Deadline):</label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            Batal
          </button>
          <button
            onClick={() => {
              if (title.trim()) {
                onSave({ id: taskToEdit?.id, title: title.trim(), scheduledDate, deadline });
              }
            }}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer"
          >
            Simpan Tugas
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Add / Edit Daily Task Modal
export const DailyTaskModal: React.FC<{
  isOpen: boolean;
  defaultDate: string;
  taskToEdit?: DailyTask | null;
  onClose: () => void;
  onSave: (title: string, dateStr: string, priority: 'high' | 'medium' | 'low', id?: string) => void;
}> = ({ isOpen, defaultDate, taskToEdit, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [dateStr, setDateStr] = useState(defaultDate);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDateStr(taskToEdit.dateStr || defaultDate);
      setPriority(taskToEdit.priority || 'medium');
    } else {
      setTitle('');
      setDateStr(defaultDate);
      setPriority('medium');
    }
  }, [defaultDate, taskToEdit, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-check">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {taskToEdit ? 'Edit Catatan Harian Pribadi' : 'Tambah Catatan Harian Pribadi'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Agenda Harian:</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              placeholder="Tuliskan agenda pribadi hari ini..."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tanggal Pelaksanaan:</label>
              <input
                type="date"
                value={dateStr}
                onChange={e => setDateStr(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Prioritas:</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="high">Tinggi (Mendesak)</option>
                <option value="medium">Sedang</option>
                <option value="low">Rendah / Santai</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            Batal
          </button>
          <button
            onClick={() => {
              if (title.trim()) {
                onSave(title.trim(), dateStr, priority, taskToEdit?.id);
              }
            }}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-500/20 active:scale-95 cursor-pointer"
          >
            {taskToEdit ? 'Perbarui Agenda' : 'Simpan Agenda'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. Add Habit Modal
export const HabitModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, color: string) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('emerald');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-check">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Tambah Kebiasaan Baru</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Kebiasaan Baik:</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="Contoh: Membaca Buku 20 Halaman, Berjalan Santai..."
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pilihan Warna Kotak:</label>
            <select
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="emerald">Hijau Zamrud (Emerald)</option>
              <option value="indigo">Biru Indigo</option>
              <option value="amber">Kuning Emas (Amber)</option>
              <option value="rose">Merah Mawar (Rose)</option>
              <option value="purple">Ungu (Purple)</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            Batal
          </button>
          <button
            onClick={() => {
              if (name.trim()) onSave(name.trim(), color);
            }}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            Simpan Kebiasaan
          </button>
        </div>
      </div>
    </div>
  );
};

// 5. Add Custom Time Category Modal
export const TimeCategoryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, emoji: string, color: string) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('⏱️');
  const [color, setColor] = useState('#3b82f6');

  if (!isOpen) return null;

  const presets = ['#6366f1', '#0284c7', '#10b981', '#f59e0b', '#e11d48', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-check">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎨</span> Buat Indikator Waktu Kustom
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Kegiatan:</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Contoh: Belajar Coding, Rapat Vendor, Istirahat Siang..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Emoji / Ikon:</label>
              <input
                type="text"
                value={emoji}
                maxLength={4}
                onChange={e => setEmoji(e.target.value)}
                className="w-full p-2.5 text-center text-base rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pilih Warna:</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 p-1 bg-white dark:bg-slate-800"
                />
                <span className="text-slate-500 font-mono text-[11px]">{color}</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Preset Warna:</label>
            <div className="flex items-center gap-2 flex-wrap">
              {presets.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-6 h-6 rounded-lg ring-1 ring-white/50 cursor-pointer shadow-xs transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            Batal
          </button>
          <button
            onClick={() => {
              if (name.trim()) onSave(name.trim(), emoji, color);
            }}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer"
          >
            Simpan Indikator
          </button>
        </div>
      </div>
    </div>
  );
};

// 6. Focus Timer Modal
export const FocusTimerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}> = ({ isOpen, onClose, onComplete }) => {
  const [minutes, setMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setSecondsRemaining(minutes * 60);
    setIsRunning(false);
  }, [minutes, isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete();
            return minutes * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, minutes, onComplete]);

  if (!isOpen) return null;

  const m = Math.floor(secondsRemaining / 60);
  const s = secondsRemaining % 60;
  const timeFormatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-check">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🍅</span> Sesi Fokus Margono
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="py-2">
          <div className="text-5xl font-black font-sans text-slate-900 dark:text-white tracking-tight">
            {timeFormatted}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-body mt-2">
            {isRunning ? '🔥 Sedang berjalan... Tetap fokus penuh!' : 'Siap untuk fokus tanpa gangguan'}
          </p>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-left">
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
            Atur Waktu Kustom (Menit):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={180}
              value={minutes}
              onChange={e => setMinutes(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 p-2 text-center text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            <span className="text-xs text-slate-500 font-body">Menit</span>
          </div>
          <div className="flex items-center justify-between gap-1 pt-1">
            {[15, 25, 45, 60].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => setMinutes(val)}
                className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg cursor-pointer ${
                  minutes === val
                    ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {val}m
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-2.5 rounded-2xl text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer ${
              isRunning ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
            }`}
          >
            {isRunning ? 'Jeda Timer' : 'Mulai Fokus'}
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setSecondsRemaining(minutes * 60);
            }}
            className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-all cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

// 7. Affirmation Image Upload Modal
export const AffirmationImageModal: React.FC<{
  isOpen: boolean;
  currentImage: string | null;
  onClose: () => void;
  onSaveImage: (base64: string) => void;
  onRemoveImage: () => void;
}> = ({ isOpen, currentImage, onClose, onSaveImage, onRemoveImage }) => {
  const [preview, setPreview] = useState<string | null>(currentImage);

  useEffect(() => {
    setPreview(currentImage);
  }, [currentImage, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        setPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-check">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🖼️</span> Kelola Gambar Afirmasi
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3 text-xs">
          <p className="text-slate-500 dark:text-slate-400 font-body">
            Unggah gambar afirmasi pribadi Anda. Teks afirmasi akan tetap ada, dan gambar dapat dilihat dalam popup layar penuh.
          </p>
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Pilih Berkas Gambar:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 dark:file:bg-emerald-950/80 file:text-emerald-700 dark:file:text-emerald-300 hover:file:bg-emerald-100 cursor-pointer"
            />
          </div>
          {preview && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2">Pratinjau Gambar:</p>
              <img src={preview} alt="Pratinjau" className="max-h-48 mx-auto object-contain rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm" />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          {currentImage ? (
            <button type="button" onClick={onRemoveImage} className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold cursor-pointer">
              Hapus Gambar
            </button>
          ) : <span />}
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
              Batal
            </button>
            <button
              onClick={() => {
                if (preview) onSaveImage(preview);
              }}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              Simpan Gambar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 8. Fullscreen Lightbox View Modal
export const LightboxModal: React.FC<{
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onOpenManage: () => void;
}> = ({ isOpen, imageSrc, onClose, onOpenManage }) => {
  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 image-lightbox-modal">
      <div className="relative bg-slate-900 border border-white/20 rounded-3xl overflow-hidden max-w-[94vw] max-h-[92vh] w-full h-full flex flex-col shadow-2xl animate-pop-check">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">Gambar Afirmasi Margono Wibowo</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onOpenManage} className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer">
              Ganti Gambar
            </button>
            <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer" title="Tutup">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/40">
          <img src={imageSrc} alt="Afirmasi Fullscreen" className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl" />
        </div>
      </div>
    </div>
  );
};

// 9. Reward Gift Modal ("MAHKOTA JUARA HARIAN PAK MARGONO")
export const RewardModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onFireFanfare: () => void;
}> = ({ isOpen, onClose, onFireFanfare }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-pop-check">
      <div className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-white to-amber-100/90 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/70 rounded-3xl p-6 sm:p-9 max-w-lg w-full shadow-2xl border-2 border-amber-400 dark:border-amber-400/90 text-center space-y-6 animate-golden-beacon">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[radial-gradient(circle,_rgba(251,191,36,0.35)_0%,_rgba(245,158,11,0.15)_45%,_transparent_70%)] rounded-full blur-2xl pointer-events-none animate-sunburst" />
        <div className="relative z-10 mx-auto w-36 h-36 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 via-amber-300 to-orange-500 opacity-40 blur-2xl animate-pulse" />
          <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-500 flex items-center justify-center shadow-2xl ring-4 ring-amber-200 dark:ring-amber-300 animate-trophy-bounce">
            <Trophy className="w-16 h-16 text-slate-950 drop-shadow-xl" />
          </div>
          <span className="absolute -top-3 -right-3 text-3xl animate-bounce">✨</span>
          <span className="absolute -top-1 -left-3 text-2xl animate-pulse">⭐</span>
          <span className="absolute -bottom-2 -left-2 text-3xl animate-bounce">🌟</span>
          <span className="absolute -bottom-2 -right-2 text-2xl animate-pulse">👑</span>
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-slate-950 text-xs font-black uppercase tracking-widest shadow-lg border border-yellow-200">
            <span>👑</span> MAHKOTA JUARA HARIAN PAK MARGONO <span>👑</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            LUAR BIASA! SEMUA TARGET HARI INI TUNTAS 100%!
          </h3>

          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-amber-300 dark:border-amber-600/70 shadow-md">
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-amber-100 italic font-body leading-relaxed">
              "Setiap langkah kecil yang konsisten hari ini membuka pintu ketenangan dan rezeki besar esok hari."
            </p>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 font-body">
            Dedikasi & konsistensi Anda hari ini adalah mahakarya sejati seorang pemenang.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onFireFanfare}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-yellow-200"
          >
            <span>🎆</span> Ledakkan Kembang Api & Fanfare Lagi!
          </button>
          <button
            onClick={onClose}
            className="py-3.5 px-6 rounded-2xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Terima Hadiah
          </button>
        </div>
      </div>
    </div>
  );
};

// 10. Custom Affirmation Modal
export const CustomAffirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [text, setText] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-check">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> Tambah Afirmasi Positif Baru
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3 text-xs">
          <label className="block font-bold text-slate-700 dark:text-slate-300">Kalimat Afirmasi:</label>
          <textarea
            rows={3}
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            placeholder="Tuliskan kalimat inspiratif Anda..."
          />
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            Batal
          </button>
          <button
            onClick={() => {
              if (text.trim()) {
                onSave(text.trim());
                setText('');
              }
            }}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-500/20 active:scale-95 cursor-pointer"
          >
            Simpan Afirmasi
          </button>
        </div>
      </div>
    </div>
  );
};

// 11. Backup / Restore & Cloud Sync Modal
export const BackupModal: React.FC<{
  isOpen: boolean;
  sheetUrl: string;
  cloudStatus: 'synced' | 'syncing' | 'error' | 'offline';
  onUpdateSheetUrl: (url: string) => void;
  onResetToDefaultUrl: () => void;
  onSyncNow: () => void;
  onClose: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}> = ({
  isOpen,
  sheetUrl,
  cloudStatus,
  onUpdateSheetUrl,
  onResetToDefaultUrl,
  onSyncNow,
  onClose,
  onExport,
  onImport
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentUrl, setCurrentUrl] = useState(sheetUrl);
  const [copiedScript, setCopiedScript] = useState(false);
  const [showScriptGuide, setShowScriptGuide] = useState(false);

  useEffect(() => {
    setCurrentUrl(sheetUrl);
  }, [sheetUrl, isOpen]);

  if (!isOpen) return null;

  const scriptCode = `// ========================================================
// DATABASE GOOGLE SHEET - MY JOURNEY PAK MARGONO WIBOWO
// ========================================================

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("AppDatabase");
    if (!sheet) {
      sheet = ss.insertSheet("AppDatabase");
      sheet.getRange("A1:B1").setValues([["Data_JSON", "Terakhir_Diperbarui"]]);
      sheet.getRange("A1:B1").setFontWeight("bold");
      return ContentService.createTextOutput(JSON.stringify({ status: "success", data: null })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var val = sheet.getRange("A2").getValue();
    if (!val) {
      return ContentService.createTextOutput(JSON.stringify({ status: "success", data: null })).setMimeType(ContentService.MimeType.JSON);
    }

    var str = String(val).trim();
    if (str.indexOf("data=") === 0) {
      str = decodeURIComponent(str.substring(5).replace(/\\+/g, " "));
    }

    var parsedData = null;
    try {
      parsedData = JSON.parse(str);
    } catch(err) {
      parsedData = str;
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      updatedAt: sheet.getRange("B2").getValue(),
      data: parsedData
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var rawData = "";
    
    if (e && e.parameter && e.parameter.data) {
      rawData = e.parameter.data;
    } else if (e && e.postData && e.postData.contents) {
      var body = e.postData.contents;
      if (body.indexOf("data=") === 0) {
        rawData = decodeURIComponent(body.substring(5).replace(/\\+/g, " "));
      } else {
        try {
          var p = JSON.parse(body);
          rawData = p.data ? (typeof p.data === 'string' ? p.data : JSON.stringify(p.data)) : body;
        } catch(err) {
          rawData = body;
        }
      }
    }

    if (!rawData || String(rawData).trim() === "") {
      return ContentService.createTextOutput(JSON.stringify({ status: "empty" })).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("AppDatabase");
    if (!sheet) {
      sheet = ss.insertSheet("AppDatabase");
      sheet.getRange("A1:B1").setValues([["Data_JSON", "Terakhir_Diperbarui"]]);
      sheet.getRange("A1:B1").setFontWeight("bold");
    }

    sheet.getRange("A2").setValue(rawData);
    sheet.getRange("B2").setValue(new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }));

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data berhasil disimpan"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-pop-check">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 overflow-y-auto">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-lg">
              ☁️
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Sinkronisasi Cloud & Cadangan Data
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tersinkron otomatis 24/7 di HP & Laptop via Google Sheet
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs font-body text-slate-600 dark:text-slate-300">
          {/* Status & Banner Otomatis */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-sky-50 to-indigo-50 dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/50 rounded-2xl border border-emerald-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-sky-500" />
                Status Sinkronisasi Otomatis:
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                cloudStatus === 'synced'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : cloudStatus === 'syncing'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  cloudStatus === 'synced' ? 'bg-emerald-500' : cloudStatus === 'syncing' ? 'bg-amber-500' : 'bg-rose-500'
                }`} />
                {cloudStatus === 'synced' ? 'Aktif & Tersinkron' : cloudStatus === 'syncing' ? 'Menyinkronkan...' : 'Offline / Periksa URL'}
              </span>
            </div>

            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40 leading-relaxed font-semibold">
              ✨ <strong>100% Otomatis:</strong> Setiap centang tugas, habit, catatan waktu, atau refleksi yang Anda ubah di HP maupun Laptop langsung tersimpan ke Google Sheet secara real-time. Anda tidak perlu menarik data manual lagi!
            </p>

            {/* Input URL Google Sheet */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  URL Google Apps Script Web App (/exec):
                </label>
                <button
                  type="button"
                  onClick={onResetToDefaultUrl}
                  className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold hover:underline cursor-pointer"
                >
                  Gunakan URL Bawaan Margono
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={currentUrl}
                  onChange={e => setCurrentUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => onUpdateSheetUrl(currentUrl.trim())}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs shrink-0 cursor-pointer shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan & Tautkan</span>
                </button>
              </div>
            </div>

            {/* Tombol Sinkron Cepat */}
            <div className="pt-1">
              <button
                type="button"
                onClick={onSyncNow}
                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <CloudDownload className="w-3.5 h-3.5 text-sky-500" />
                <span>Tes & Segarkan Sinkronisasi Sekarang</span>
              </button>
            </div>
          </div>

          {/* Panduan Kode Script */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-amber-500" />
                Script Backend Google Sheet (Jika Ingin Bikin Sheet Baru):
              </span>
              <button
                type="button"
                onClick={() => setShowScriptGuide(!showScriptGuide)}
                className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold hover:underline cursor-pointer"
              >
                {showScriptGuide ? 'Sembunyikan' : 'Lihat Script'}
              </button>
            </div>
            
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Jika di masa depan Anda ingin mengganti spreadsheet baru, cukup salin kode ini dan pasang di menu <em>Ekstensi &rarr; Apps Script</em> pada Google Sheet baru Anda.
            </p>

            <button
              type="button"
              onClick={handleCopyScript}
              className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              {copiedScript ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
              <span>{copiedScript ? 'Kode Script Tersalin ke Clipboard!' : 'Salin Kode Apps Script Siap Pakai'}</span>
            </button>

            {showScriptGuide && (
              <pre className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[10px] overflow-x-auto max-h-40 border border-slate-700">
                {scriptCode}
              </pre>
            )}
          </div>

          {/* Cadangan Berkas Offline (.json) */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
            <p className="font-bold text-slate-800 dark:text-slate-100">
              Cadangan Berkas Lokal Manual (.json):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onExport}
                className="w-full py-2 rounded-xl bg-slate-800 dark:bg-sky-600 hover:bg-slate-900 dark:hover:bg-sky-700 text-white font-bold text-xs transition-all cursor-pointer text-center"
              >
                Unduh Cadangan (.json)
              </button>
              <div className="space-y-1">
                <input
                  type="file"
                  accept=".json"
                  onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                  className="block w-full text-[10px] text-slate-500 dark:text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-sky-100 dark:file:bg-sky-950 file:text-sky-700 dark:file:text-sky-300 cursor-pointer"
                />
                {selectedFile && (
                  <button
                    type="button"
                    onClick={() => onImport(selectedFile)}
                    className="w-full py-1.5 rounded-xl border border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 font-bold text-[11px] transition-all cursor-pointer"
                  >
                    Terapkan File Ini
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
