import React from 'react';
import { Star, Shuffle, Plus, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface BannerProps {
  currentAffirmation: string;
  hasAffirmationImage: boolean;
  onShuffle: () => void;
  onOpenImageModal: () => void;
  onOpenImageView: () => void;
  onOpenPersonalNotes: () => void;
  onOpenCustomAffirmation: () => void;
}

export const Banner: React.FC<BannerProps> = ({
  currentAffirmation,
  hasAffirmationImage,
  onShuffle,
  onOpenImageModal,
  onOpenImageView,
  onOpenPersonalNotes,
  onOpenCustomAffirmation
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-white/10">
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-sky-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Afirmasi Harian Pak Margono
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-snug text-white font-sans">
              "{currentAffirmation}"
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-body flex items-center gap-1.5 pt-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              Fokus Pikiran Positif & Komitmen Diri
            </p>
          </div>
        </div>

        {/* Kelompok Tombol Aksi 2x2 (2 Atas, 2 Bawah / 2 Kiri, 2 Kanan) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 shrink-0 self-start lg:self-center w-full sm:w-[360px] md:w-[380px]">
          {/* Baris 1 / Kiri: Catatan Saya */}
          <button
            onClick={onOpenPersonalNotes}
            className="w-full justify-center px-4 py-2.5 rounded-2xl bg-amber-500/25 hover:bg-amber-500/40 active:scale-95 border border-amber-300/40 text-amber-200 hover:text-white text-xs font-bold backdrop-blur-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            title="Buka Catatan Pribadi Saya"
          >
            <span>📝</span>
            <span>Catatan Saya</span>
          </button>

          {/* Baris 1 / Kanan: Buka Gambar (atau Upload Gambar jika belum ada gambar) */}
          {hasAffirmationImage ? (
            <button
              onClick={onOpenImageView}
              className="w-full justify-center px-4 py-2.5 rounded-2xl bg-emerald-500/25 hover:bg-emerald-500/40 active:scale-95 border border-emerald-300/40 text-emerald-200 hover:text-white text-xs font-bold backdrop-blur-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              title="Buka Gambar Afirmasi (Layar Penuh)"
            >
              <ExternalLink className="w-4 h-4 text-emerald-300" />
              <span>Buka Gambar</span>
            </button>
          ) : (
            <button
              onClick={onOpenImageModal}
              className="w-full justify-center px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 border border-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              title="Upload Gambar Afirmasi"
            >
              <ImageIcon className="w-4 h-4 text-sky-300" />
              <span>Upload Gambar</span>
            </button>
          )}

          {/* Baris 2 / Kiri: Kelola Gambar (jika gambar ada) atau Tulis Afirmasi */}
          {hasAffirmationImage ? (
            <button
              onClick={onOpenImageModal}
              className="w-full justify-center px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 border border-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              title="Kelola Gambar Afirmasi"
            >
              <ImageIcon className="w-4 h-4 text-sky-300" />
              <span>Kelola Gambar</span>
            </button>
          ) : (
            <button
              onClick={onOpenCustomAffirmation}
              className="w-full justify-center px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white text-xs font-medium transition-all cursor-pointer shadow-sm flex items-center gap-2"
              title="Tulis Afirmasi Teks Sendiri"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Tulis Afirmasi</span>
            </button>
          )}

          {/* Baris 2 / Kanan: Afirmasi Lain */}
          <div className="flex items-center gap-1.5 w-full">
            <button
              onClick={onShuffle}
              className="flex-1 justify-center px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              title="Ganti Afirmasi Acak"
            >
              <Shuffle className="w-4 h-4 text-sky-300" />
              <span>Afirmasi Lain</span>
            </button>

            {hasAffirmationImage && (
              <button
                onClick={onOpenCustomAffirmation}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white text-xs font-medium transition-all cursor-pointer shadow-sm shrink-0"
                title="Tulis Afirmasi Teks Sendiri"
              >
                <Plus className="w-4 h-4 text-amber-300" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
