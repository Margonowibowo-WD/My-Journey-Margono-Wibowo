import React, { useState } from 'react';
import { Save, Sparkles, HardDrive } from 'lucide-react';
import { DayReflection } from '../types';
import { formatDateKey } from '../utils/initialData';

interface JournalSectionProps {
  selectedDate: Date;
  reflections: Record<string, DayReflection>;
  affirmations: string[];
  onSaveReflection: (dateStr: string, data: DayReflection) => void;
  onOpenCustomAffirmation: () => void;
  onOpenBackupModal: () => void;
}

export const JournalSection: React.FC<JournalSectionProps> = ({
  selectedDate,
  reflections,
  affirmations,
  onSaveReflection,
  onOpenCustomAffirmation,
  onOpenBackupModal
}) => {
  const [activeTab, setActiveTab] = useState<'journal' | 'vision'>('journal');
  const selectedStr = formatDateKey(selectedDate);
  const currentReflection = reflections[selectedStr] || {
    impianTerbesar: '',
    kenapaPenting: '',
    bikinSemangat: '',
    versiTerbaik: '',
    emosiDiinginkan: '',
    polaLama: '',
    gratitude: '',
    learning: '',
    perbaikan: ''
  };

  const [formData, setFormData] = useState<DayReflection>(currentReflection);

  // Sync state when selected date or reflections change
  React.useEffect(() => {
    setFormData(
      reflections[selectedStr] || {
        impianTerbesar: '',
        kenapaPenting: '',
        bikinSemangat: '',
        versiTerbaik: '',
        emosiDiinginkan: '',
        polaLama: '',
        gratitude: '',
        learning: '',
        perbaikan: ''
      }
    );
  }, [selectedStr, reflections]);

  const handleChange = (field: keyof DayReflection, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSaveReflection(selectedStr, formData);
  };

  const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const dateFormattedText = `${selectedDate.getDate()} ${shortMonthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

  return (
    <section className="bg-gradient-to-br from-rose-50/30 via-white to-amber-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/15 rounded-3xl shadow-sm border border-rose-100/70 dark:border-slate-800 overflow-hidden">
      <div className="px-5 sm:px-7 pt-5 sm:pt-6">
        <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-100 dark:border-slate-800">
          <span className="w-1.5 h-11 rounded-full bg-rose-500 shrink-0" />
          <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 text-xl">
            🗓️
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-rose-600 dark:text-rose-400">
              Refleksi & Afirmasi
            </p>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
              Jurnal Pribadi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-body mt-0.5">
              Catatan refleksi mendalam dan bank afirmasi positif Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200/80 dark:border-slate-800 overflow-x-auto bg-slate-50/70 dark:bg-slate-950/60 p-2 gap-1 sm:gap-2">
        <button
          onClick={() => setActiveTab('journal')}
          className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'journal'
              ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <span className="text-base">✨</span>
          Catatan Harian & Refleksi Diri
        </button>

        <button
          onClick={() => setActiveTab('vision')}
          className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'vision'
              ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          Bank Afirmasi & Rekomendasi
        </button>
      </div>

      {/* Tab 1: Catatan Harian & Refleksi Diri */}
      {activeTab === 'journal' && (
        <div className="p-5 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-11 rounded-full bg-rose-500 shrink-0" />
              <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 text-xl">
                🌟
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-rose-600 dark:text-rose-400">
                  Jurnal & Refleksi Diri
                </p>
                <h3 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  Catatan & Refleksi Diri Margono Wibowo
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-body mt-0.5">
                  Refleksi mendalam untuk tanggal{' '}
                  <span className="font-bold text-rose-600 dark:text-rose-400">{dateFormattedText}</span>. Rasakan setiap pertanyaan dan temukan kejernihan dalam jiwa.
                </p>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-sky-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Save className="w-4 h-4" />
              Simpan Refleksi Lengkap
            </button>
          </div>

          {/* PILAR 1: MIMPI */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-amber-100/90 via-orange-50/80 to-amber-50/60 dark:from-amber-950/60 dark:via-orange-950/30 dark:to-slate-900 border-2 border-amber-300 dark:border-amber-700/80 space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
                👑
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Pilar Visi Tertinggi
                </span>
                <h4 className="text-base sm:text-xl font-extrabold text-amber-950 dark:text-amber-100">
                  MIMPI & TUJUAN BESAR
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200">
                  1. Apa Impian Terbesarmu Saat Ini?
                </label>
                <textarea
                  rows={4}
                  value={formData.impianTerbesar}
                  onChange={e => handleChange('impianTerbesar', e.target.value)}
                  className="w-full rounded-2xl border border-amber-300/80 dark:border-amber-800/80 p-3.5 text-sm sm:text-base text-slate-800 dark:text-slate-100 font-body bg-white/95 dark:bg-slate-800/90 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all shadow-2xs"
                  placeholder="Tuliskan visi terbesar yang ingin dicapai..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200">
                  2. Kenapa Impian Ini Penting?
                </label>
                <textarea
                  rows={4}
                  value={formData.kenapaPenting}
                  onChange={e => handleChange('kenapaPenting', e.target.value)}
                  className="w-full rounded-2xl border border-amber-300/80 dark:border-amber-800/80 p-3.5 text-sm sm:text-base text-slate-800 dark:text-slate-100 font-body bg-white/95 dark:bg-slate-800/90 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all shadow-2xs"
                  placeholder="Alasan mendalam di balik impian tersebut..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200">
                  3. Apa Hal Yang Membuatmu Semangat Mengejar Impian Itu?
                </label>
                <textarea
                  rows={4}
                  value={formData.bikinSemangat}
                  onChange={e => handleChange('bikinSemangat', e.target.value)}
                  className="w-full rounded-2xl border border-amber-300/80 dark:border-amber-800/80 p-3.5 text-sm sm:text-base text-slate-800 dark:text-slate-100 font-body bg-white/95 dark:bg-slate-800/90 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all shadow-2xs"
                  placeholder="Bahan bakar semangat yang menyalakan tekadmu..."
                />
              </div>
            </div>
          </div>

          {/* PILAR 2 & 3: PAGI & MALAM */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* REFLEKSI PAGI */}
            <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-blue-100/90 via-sky-50/80 to-indigo-50/60 dark:from-blue-950/60 dark:via-sky-950/30 dark:to-slate-900 border-2 border-blue-300 dark:border-blue-700/80 space-y-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-md shrink-0">
                  ☀️
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-800 dark:text-blue-300">
                    Intensi Pagi Hari
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-blue-950 dark:text-blue-100">
                    REFLEKSI PAGI
                  </h4>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-blue-950 dark:text-blue-200">
                    Siapa Versi Terbaik Hari Ini yang Akan Kita Tunjukkan?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.versiTerbaik}
                    onChange={e => handleChange('versiTerbaik', e.target.value)}
                    className="w-full rounded-2xl border border-blue-300/80 dark:border-blue-800 p-3.5 text-sm text-slate-800 dark:text-slate-100 font-body bg-white/95 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                    placeholder="Identitas & sikap pemenang hari ini..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-blue-950 dark:text-blue-200">
                    Emosi Apa yang Ingin Aku Rasakan Hari Ini?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.emosiDiinginkan}
                    onChange={e => handleChange('emosiDiinginkan', e.target.value)}
                    className="w-full rounded-2xl border border-blue-300/80 dark:border-blue-800 p-3.5 text-sm text-slate-800 dark:text-slate-100 font-body bg-white/95 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                    placeholder="Ketenangan, antusiasme, rasa percaya diri..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-blue-950 dark:text-blue-200">
                    Pola Lama Apa yang Tidak Aku Izinkan Masuk Hari Ini?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.polaLama}
                    onChange={e => handleChange('polaLama', e.target.value)}
                    className="w-full rounded-2xl border border-blue-300/80 dark:border-blue-800 p-3.5 text-sm text-slate-800 dark:text-slate-100 font-body bg-white/95 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                    placeholder="Menunda-nunda, ragu-ragu, distraksi yang tidak perlu..."
                  />
                </div>
              </div>
            </div>

            {/* REFLEKSI MALAM */}
            <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-purple-100/90 via-fuchsia-50/70 to-purple-50/60 dark:from-purple-950/60 dark:via-purple-950/30 dark:to-slate-900 border-2 border-purple-300 dark:border-purple-700/80 space-y-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-xl shadow-md shrink-0">
                  🌙
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-purple-800 dark:text-purple-300">
                    Evaluasi & Damai Jiwa
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-purple-950 dark:text-purple-100">
                    REFLEKSI MALAM
                  </h4>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-purple-950 dark:text-purple-200">
                    Hal yang Paling Disyukuri:
                  </label>
                  <textarea
                    rows={3}
                    value={formData.gratitude}
                    onChange={e => handleChange('gratitude', e.target.value)}
                    className="w-full rounded-2xl border border-purple-300/80 dark:border-purple-800 p-3.5 text-sm text-slate-800 dark:text-slate-100 font-body bg-white/95 dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-2xs"
                    placeholder="Rahmat, kesehatan, kelancaran bisnis, kehangatan keluarga..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-purple-950 dark:text-purple-200">
                    Pelajaran Apa yang Didapat:
                  </label>
                  <textarea
                    rows={3}
                    value={formData.learning}
                    onChange={e => handleChange('learning', e.target.value)}
                    className="w-full rounded-2xl border border-purple-300/80 dark:border-purple-800 p-3.5 text-sm text-slate-800 dark:text-slate-100 font-body bg-white/95 dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-2xs"
                    placeholder="Wawasan baru dan hikmah dari pengalaman hari ini..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-purple-950 dark:text-purple-200">
                    Hal yang Perlu Diperbaiki:
                  </label>
                  <textarea
                    rows={3}
                    value={formData.perbaikan}
                    onChange={e => handleChange('perbaikan', e.target.value)}
                    className="w-full rounded-2xl border border-purple-300/80 dark:border-purple-800 p-3.5 text-sm text-slate-800 dark:text-slate-100 font-body bg-white/95 dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-2xs"
                    placeholder="Langkah perbaikan agar esok hari jauh lebih berkualitas..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-400 dark:text-slate-500 font-body italic flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Seluruh refleksi otomatis tersimpan per tanggal terpilih.
            </div>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20 active:scale-95 cursor-pointer"
            >
              Simpan Refleksi
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Bank Afirmasi */}
      {activeTab === 'vision' && (
        <div className="p-5 sm:p-7 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-100 dark:border-slate-800">
            <span className="w-1.5 h-11 rounded-full bg-amber-500 shrink-0" />
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 text-xl">
              ✨
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400">
                Afirmasi & Alat Pendukung
              </p>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                Bank Afirmasi & Fitur Pendukung
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-body mt-0.5">
                Dirancang khusus untuk memicu ketenangan dan semangat Margono Wibowo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-5 rounded-3xl border-2 border-amber-300 dark:border-amber-800/80 bg-gradient-to-br from-amber-100/90 via-yellow-50/80 to-orange-50/60 dark:from-amber-950/60 dark:via-slate-900 dark:to-amber-950/40 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg font-bold shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Koleksi Afirmasi</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-body">
                Kumpulan kalimat peneguh mental dan keyakinan diri.
              </p>
              <button
                onClick={onOpenCustomAffirmation}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Tambah Afirmasi
              </button>
            </div>

            <div className="p-5 rounded-3xl border-2 border-indigo-300 dark:border-indigo-800/80 bg-gradient-to-br from-indigo-100/90 via-blue-50/80 to-sky-50/60 dark:from-indigo-950/60 dark:via-slate-900 dark:to-indigo-950/40 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-xs">
                <HardDrive className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Cadangan & Pemulihan</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-body">
                Simpan dan pulihkan seluruh data jurnal ke berkas .json.
              </p>
              <button
                onClick={onOpenBackupModal}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Buka Cadangan
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-100/80 via-orange-50/80 to-yellow-50/60 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 rounded-3xl p-5 border-2 border-amber-300 dark:border-amber-800/80 space-y-3 shadow-sm">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Afirmasi Favorit Margono Wibowo:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-body text-slate-700 dark:text-slate-300">
              {affirmations.map((aff, index) => (
                <div
                  key={`aff-${index}`}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 flex items-start gap-2.5 shadow-2xs"
                >
                  <span className="text-amber-500 font-bold shrink-0 mt-0.5">✦</span>
                  <span className="text-slate-700 dark:text-slate-300">"{aff}"</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
