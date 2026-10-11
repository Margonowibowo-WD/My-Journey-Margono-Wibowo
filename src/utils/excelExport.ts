import * as XLSX from 'xlsx';
import { AppStateData } from '../types';

export function exportAppStateToExcel(appState: AppStateData, fileName?: string) {
  const wb = XLSX.utils.book_new();

  // 1. Sheet Ringkasan & Catatan Pribadi
  const summaryData = [
    ['RINGKASAN APLIKASI MY JOURNEY - MARGONO WIBOWO', ''],
    ['Tanggal Ekspor', new Date().toLocaleString('id-ID')],
    ['Total Tugas Terjadwal', appState.scheduledTasks.length],
    ['Tugas Terjadwal Selesai', appState.scheduledTasks.filter(t => t.completed).length],
    ['Total Catatan Harian', appState.dailyTasks.length],
    ['Catatan Harian Selesai', appState.dailyTasks.filter(t => t.completed).length],
    ['Total Kebiasaan (Habits)', appState.habits.length],
    ['Kategori Waktu (Time Tracker)', appState.timeCategories.length],
    ['Status Gambar Afirmasi', appState.affirmationImage ? 'Tersimpan (Tersedia)' : 'Belum Ada'],
    ['', ''],
    ['CATATAN PRIBADI PAK MARGONO WIBOWO', ''],
    ['Isi Catatan:', appState.myPersonalNotes || '-'],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary['!cols'] = [{ wch: 38 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan & Profil');

  // 2. Sheet Tugas Terjadwal (Jangan Sampai Lupa)
  const scheduledRows = appState.scheduledTasks.map((t, idx) => ({
    'No': idx + 1,
    'ID': t.id,
    'Judul Tugas / Catatan': t.title,
    'Tanggal Mulai / Terjadwal': t.scheduledDate || '-',
    'Tenggat Waktu (Deadline)': t.deadline,
    'Status': t.completed ? 'Selesai' : 'Belum Selesai',
    'Pengulangan': t.repeat || 'none',
    'Catatan Tambahan': t.notes || '-'
  }));
  const wsScheduled = XLSX.utils.json_to_sheet(scheduledRows.length > 0 ? scheduledRows : [{
    'No': 1,
    'ID': '-',
    'Judul Tugas / Catatan': '(Tidak ada data)',
    'Tanggal Mulai / Terjadwal': '-',
    'Tenggat Waktu (Deadline)': '-',
    'Status': '-',
    'Pengulangan': '-',
    'Catatan Tambahan': '-'
  }]);
  wsScheduled['!cols'] = [
    { wch: 6 },
    { wch: 15 },
    { wch: 45 },
    { wch: 18 },
    { wch: 18 },
    { wch: 15 },
    { wch: 14 },
    { wch: 30 }
  ];
  XLSX.utils.book_append_sheet(wb, wsScheduled, 'Tugas Terjadwal');

  // 3. Sheet Tugas Harian
  const dailyRows = appState.dailyTasks.map((t, idx) => ({
    'No': idx + 1,
    'ID': t.id,
    'Tanggal': t.dateStr,
    'Judul Tugas': t.title,
    'Prioritas': t.priority.toUpperCase(),
    'Status': t.completed ? 'Selesai' : 'Belum Selesai'
  }));
  const wsDaily = XLSX.utils.json_to_sheet(dailyRows.length > 0 ? dailyRows : [{
    'No': 1,
    'ID': '-',
    'Tanggal': '-',
    'Judul Tugas': '(Tidak ada data)',
    'Prioritas': '-',
    'Status': '-'
  }]);
  wsDaily['!cols'] = [
    { wch: 6 },
    { wch: 15 },
    { wch: 14 },
    { wch: 45 },
    { wch: 12 },
    { wch: 16 }
  ];
  XLSX.utils.book_append_sheet(wb, wsDaily, 'Catatan Harian');

  // 4. Sheet Kebiasaan (Habits)
  const habitRows: Array<Record<string, unknown>> = [];
  appState.habits.forEach((h, idx) => {
    const datesCompleted = Object.entries(h.completions)
      .filter(([, done]) => done)
      .map(([date]) => date);
    habitRows.push({
      'No': idx + 1,
      'ID': h.id,
      'Nama Kebiasaan': h.name,
      'Tema Warna': h.color,
      'Jumlah Hari Diselesaikan': datesCompleted.length,
      'Daftar Tanggal Selesai': datesCompleted.join(', ') || '-'
    });
  });
  const wsHabits = XLSX.utils.json_to_sheet(habitRows.length > 0 ? habitRows : [{
    'No': 1,
    'ID': '-',
    'Nama Kebiasaan': '(Tidak ada data)',
    'Tema Warna': '-',
    'Jumlah Hari Diselesaikan': 0,
    'Daftar Tanggal Selesai': '-'
  }]);
  wsHabits['!cols'] = [
    { wch: 6 },
    { wch: 15 },
    { wch: 30 },
    { wch: 14 },
    { wch: 24 },
    { wch: 50 }
  ];
  XLSX.utils.book_append_sheet(wb, wsHabits, 'Habit Tracker');

  // 5. Sheet Time Tracker
  const categoryMap = new Map(appState.timeCategories.map(c => [c.id, `${c.emoji} ${c.name}`]));
  const timeRows: Array<Record<string, unknown>> = [];
  let tRowNo = 1;
  const sortedDates = Object.keys(appState.timeTracking || {}).sort();
  for (const dateStr of sortedDates) {
    const hoursData = appState.timeTracking[dateStr];
    if (hoursData) {
      for (let h = 0; h < 24; h++) {
        const catId = hoursData[h];
        if (catId) {
          const catName = categoryMap.get(catId) || catId;
          timeRows.push({
            'No': tRowNo++,
            'Tanggal': dateStr,
            'Jam': `${String(h).padStart(2, '0')}:00 - ${String(h + 1).padStart(2, '0')}:00`,
            'Aktivitas / Kategori': catName
          });
        }
      }
    }
  }
  const wsTime = XLSX.utils.json_to_sheet(timeRows.length > 0 ? timeRows : [{
    'No': 1,
    'Tanggal': '-',
    'Jam': '-',
    'Aktivitas / Kategori': '(Tidak ada data pelacakan waktu)'
  }]);
  wsTime['!cols'] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 18 },
    { wch: 35 }
  ];
  XLSX.utils.book_append_sheet(wb, wsTime, 'Time Tracker');

  // 6. Sheet Jurnal & Refleksi Harian
  const reflectionRows: Array<Record<string, unknown>> = [];
  let rRowNo = 1;
  const refDates = Object.keys(appState.reflections || {}).sort();
  for (const dateStr of refDates) {
    const ref = appState.reflections[dateStr];
    if (ref) {
      reflectionRows.push({
        'No': rRowNo++,
        'Tanggal': dateStr,
        'Impian Terbesar': ref.impianTerbesar || '-',
        'Kenapa Penting': ref.kenapaPenting || '-',
        'Bikin Semangat': ref.bikinSemangat || '-',
        'Versi Terbaik': ref.versiTerbaik || '-',
        'Emosi Diinginkan': ref.emosiDiinginkan || '-',
        'Pola Lama': ref.polaLama || '-',
        'Rasa Syukur (Gratitude)': ref.gratitude || '-',
        'Pelajaran Hari Ini': ref.learning || '-',
        'Rencana Perbaikan': ref.perbaikan || '-'
      });
    }
  }
  const wsReflections = XLSX.utils.json_to_sheet(reflectionRows.length > 0 ? reflectionRows : [{
    'No': 1,
    'Tanggal': '-',
    'Impian Terbesar': '-',
    'Kenapa Penting': '-',
    'Bikin Semangat': '-',
    'Versi Terbaik': '-',
    'Emosi Diinginkan': '-',
    'Pola Lama': '-',
    'Rasa Syukur (Gratitude)': '-',
    'Pelajaran Hari Ini': '-',
    'Rencana Perbaikan': '-'
  }]);
  wsReflections['!cols'] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 35 },
    { wch: 35 },
    { wch: 35 }
  ];
  XLSX.utils.book_append_sheet(wb, wsReflections, 'Jurnal & Refleksi');

  // 7. Sheet Afirmasi & Raw Backup Data
  const rawMetaRows = [
    ['Kunci Konfigurasi', 'Nilai / Keterangan'],
    ['Suara Efek (Sound Enabled)', appState.soundEnabled ? 'Aktif' : 'Nonaktif'],
    ['Indeks Afirmasi Terpilih', appState.currentAffirmationIndex],
    ['Daftar Afirmasi', appState.affirmations.join(' | ')],
    ['Data Cadangan Penuh (JSON)', JSON.stringify(appState)]
  ];
  const wsRaw = XLSX.utils.aoa_to_sheet(rawMetaRows);
  wsRaw['!cols'] = [{ wch: 30 }, { wch: 80 }];
  XLSX.utils.book_append_sheet(wb, wsRaw, 'Data Cadangan Sistem');

  // Download berkas Excel
  const targetName = fileName || `MyJourney_MargonoWibowo_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, targetName);
}

export function importAppStateFromExcel(file: File): Promise<AppStateData | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Cari sheet cadangan sistem
        const rawSheet = workbook.Sheets['Data Cadangan Sistem'];
        if (rawSheet) {
          const rawAoa = XLSX.utils.sheet_to_json<string[]>(rawSheet, { header: 1 });
          for (const row of rawAoa) {
            if (row && row[0] === 'Data Cadangan Penuh (JSON)' && row[1]) {
              const parsed = JSON.parse(row[1]);
              return resolve(parsed as AppStateData);
            }
          }
        }
        resolve(null);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = err => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
