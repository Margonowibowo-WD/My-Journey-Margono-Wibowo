export const officialHolidays2026: Record<string, string> = {
  "2026-01-01": "Tahun Baru Masehi",
  "2026-01-16": "Isra Mi'raj Nabi Muhammad SAW",
  "2026-02-16": "Cuti Bersama Imlek",
  "2026-02-17": "Tahun Baru Imlek",
  "2026-03-18": "Cuti Bersama Nyepi",
  "2026-03-19": "Hari Suci Nyepi",
  "2026-03-20": "Cuti Bersama Idulfitri",
  "2026-03-21": "Hari Raya Idul Fitri",
  "2026-03-22": "Hari Raya Idul Fitri",
  "2026-03-23": "Cuti Bersama Idulfitri",
  "2026-03-24": "Cuti Bersama Idulfitri",
  "2026-04-03": "Wafat Isa Al Masih",
  "2026-05-01": "Hari Buruh Internasional",
  "2026-05-14": "Kenaikan Isa Al Masih",
  "2026-05-15": "Cuti Bersama Kenaikan Isa Al Masih",
  "2026-05-27": "Hari Raya Idul Adha",
  "2026-05-28": "Cuti Bersama Idul Adha",
  "2026-05-31": "Hari Raya Waisak",
  "2026-06-01": "Hari Lahir Pancasila",
  "2026-06-16": "Tahun Baru Islam",
  "2026-08-17": "Hari Kemerdekaan RI",
  "2026-08-25": "Maulid Nabi Muhammad SAW",
  "2026-12-24": "Cuti Bersama Natal",
  "2026-12-25": "Hari Raya Natal"
};

export async function fetchNationalHolidays(year: number): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  if (year === 2026) {
    Object.assign(result, officialHolidays2026);
  }
  try {
    const response = await fetch(`https://api-harilibur.vercel.app/api?year=${year}`);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        data.forEach((item: { holiday_date?: string; holiday_name?: string }) => {
          if (item.holiday_date) {
            result[item.holiday_date] = item.holiday_name || 'Libur Nasional / Cuti Bersama';
          }
        });
      }
    }
  } catch {
    // If offline or CORS, fall back to predefined
  }
  return result;
}
