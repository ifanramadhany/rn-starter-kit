import type { DashboardActivityPoint, SurveyQuestion } from '../types';

export function createCurrentMonthActivity(
  referenceDate = new Date(),
  highlightedDay: number | null = referenceDate.getDate(),
): DashboardActivityPoint[] {
  const year = referenceDate.getFullYear();
  const monthIndex = referenceDate.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, index) => {
    const dayNumber = index + 1;

    return {
      label: String(dayNumber).padStart(2, '0'),
      completions: 0,
      highlighted: highlightedDay !== null && dayNumber === highlightedDay,
    };
  });
}

export const initialSurveyQuestions: SurveyQuestion[] = [
  {
    id: 'Q-3001',
    title: 'Bagaimana penilaian Anda terhadap sambutan petugas saat Anda datang hari ini?',
    helperText: 'Pertanyaan ini membantu menilai kualitas penerimaan awal pasien.',
    type: 'single',
    status: 'active',
    order: 1,
    updatedAt: 'Bawaan aplikasi',
    options: [
      { id: 'Q-3001-1', label: 'Sangat baik', responseCount: 0 },
      { id: 'Q-3001-2', label: 'Baik', responseCount: 0 },
      { id: 'Q-3001-3', label: 'Cukup', responseCount: 0 },
      { id: 'Q-3001-4', label: 'Kurang baik', responseCount: 0 },
    ],
  },
  {
    id: 'Q-3002',
    title:
      'Bagaimana penilaian Anda terhadap keramahan dan kesigapan staf selama proses pelayanan?',
    helperText: 'Pertanyaan ini digunakan untuk menilai sikap dan respons staf kepada pasien.',
    type: 'single',
    status: 'active',
    order: 2,
    updatedAt: 'Bawaan aplikasi',
    options: [
      { id: 'Q-3002-1', label: 'Sangat baik', responseCount: 0 },
      { id: 'Q-3002-2', label: 'Baik', responseCount: 0 },
      { id: 'Q-3002-3', label: 'Cukup', responseCount: 0 },
      { id: 'Q-3002-4', label: 'Kurang baik', responseCount: 0 },
    ],
  },
  {
    id: 'Q-3003',
    title:
      'Bagaimana penilaian Anda terhadap kebersihan dan kenyamanan area tunggu atau area pelayanan?',
    helperText: 'Pertanyaan ini membantu menilai kenyamanan lingkungan pelayanan bagi pasien.',
    type: 'single',
    status: 'active',
    order: 3,
    updatedAt: 'Bawaan aplikasi',
    options: [
      { id: 'Q-3003-1', label: 'Sangat baik', responseCount: 0 },
      { id: 'Q-3003-2', label: 'Baik', responseCount: 0 },
      { id: 'Q-3003-3', label: 'Cukup', responseCount: 0 },
      { id: 'Q-3003-4', label: 'Kurang baik', responseCount: 0 },
    ],
  },
  {
    id: 'Q-3004',
    title: 'Bagaimana penilaian Anda terhadap waktu tunggu sebelum bertemu dokter?',
    helperText: 'Pertanyaan ini digunakan untuk mengevaluasi ketepatan waktu pelayanan.',
    type: 'single',
    status: 'active',
    order: 4,
    updatedAt: 'Bawaan aplikasi',
    options: [
      { id: 'Q-3004-1', label: 'Sangat baik', responseCount: 0 },
      { id: 'Q-3004-2', label: 'Baik', responseCount: 0 },
      { id: 'Q-3004-3', label: 'Cukup', responseCount: 0 },
      { id: 'Q-3004-4', label: 'Kurang baik', responseCount: 0 },
    ],
  },
  {
    id: 'Q-3005',
    title: 'Dokter mendengarkan keluhan saya dengan saksama selama konsultasi.',
    helperText: 'Pertanyaan ini menilai perhatian dokter terhadap keluhan pasien.',
    type: 'single',
    status: 'active',
    order: 5,
    updatedAt: 'Bawaan aplikasi',
    options: [
      { id: 'Q-3005-1', label: 'Sangat setuju', responseCount: 0 },
      { id: 'Q-3005-2', label: 'Setuju', responseCount: 0 },
      { id: 'Q-3005-3', label: 'Cukup setuju', responseCount: 0 },
      { id: 'Q-3005-4', label: 'Tidak setuju', responseCount: 0 },
    ],
  },
  {
    id: 'Q-3006',
    title: 'Dokter menjelaskan kondisi atau diagnosis saya dengan jelas.',
    helperText: 'Pertanyaan ini digunakan untuk menilai kejelasan penjelasan dokter.',
    type: 'single',
    status: 'active',
    order: 6,
    updatedAt: 'Bawaan aplikasi',
    options: [
      { id: 'Q-3006-1', label: 'Sangat setuju', responseCount: 0 },
      { id: 'Q-3006-2', label: 'Setuju', responseCount: 0 },
      { id: 'Q-3006-3', label: 'Cukup setuju', responseCount: 0 },
      { id: 'Q-3006-4', label: 'Tidak setuju', responseCount: 0 },
    ],
  },
  {
    id: 'Q-3007',
    title: 'Dokter memberikan kesempatan kepada saya untuk bertanya dan menjawab dengan baik.',
    helperText: 'Pertanyaan ini menilai komunikasi dua arah saat konsultasi berlangsung.',
    type: 'single',
    status: 'active',
    order: 7,
    updatedAt: 'Bawaan aplikasi',
    options: [
      { id: 'Q-3007-1', label: 'Sangat setuju', responseCount: 0 },
      { id: 'Q-3007-2', label: 'Setuju', responseCount: 0 },
      { id: 'Q-3007-3', label: 'Cukup setuju', responseCount: 0 },
      { id: 'Q-3007-4', label: 'Tidak setuju', responseCount: 0 },
    ],
  },
  {
    id: 'Q-3008',
    title: 'Penjelasan mengenai obat, tindakan, atau rencana perawatan mudah saya pahami.',
    helperText: 'Pertanyaan ini menilai kejelasan arahan lanjutan setelah konsultasi.',
    type: 'single',
    status: 'active',
    order: 8,
    updatedAt: 'Bawaan aplikasi',
    options: [
      { id: 'Q-3008-1', label: 'Sangat setuju', responseCount: 0 },
      { id: 'Q-3008-2', label: 'Setuju', responseCount: 0 },
      { id: 'Q-3008-3', label: 'Cukup setuju', responseCount: 0 },
      { id: 'Q-3008-4', label: 'Tidak setuju', responseCount: 0 },
    ],
  },
  {
    id: 'Q-3009',
    title: 'Menurut Anda, bagian pelayanan mana yang paling perlu ditingkatkan?',
    helperText: 'Anda dapat memilih lebih dari satu area yang perlu menjadi perhatian.',
    type: 'multiple',
    status: 'active',
    order: 9,
    updatedAt: 'Bawaan aplikasi',
    options: [
      { id: 'Q-3009-1', label: 'Waktu tunggu pelayanan', responseCount: 0 },
      { id: 'Q-3009-2', label: 'Keramahan dan bantuan staf', responseCount: 0 },
      { id: 'Q-3009-3', label: 'Kebersihan dan kenyamanan fasilitas', responseCount: 0 },
      { id: 'Q-3009-4', label: 'Kejelasan penjelasan dokter', responseCount: 0 },
      { id: 'Q-3009-5', label: 'Alur administrasi atau pendaftaran', responseCount: 0 },
    ],
  },
  {
    id: 'Q-3010',
    title: 'Secara keseluruhan, saya puas terhadap pelayanan setelah konsultasi dokter hari ini.',
    helperText: 'Pertanyaan ini digunakan untuk melihat tingkat kepuasan pasien secara umum.',
    type: 'single',
    status: 'active',
    order: 10,
    updatedAt: 'Bawaan aplikasi',
    options: [
      { id: 'Q-3010-1', label: 'Sangat puas', responseCount: 0 },
      { id: 'Q-3010-2', label: 'Puas', responseCount: 0 },
      { id: 'Q-3010-3', label: 'Cukup puas', responseCount: 0 },
      { id: 'Q-3010-4', label: 'Kurang puas', responseCount: 0 },
      { id: 'Q-3010-5', label: 'Tidak puas', responseCount: 0 },
    ],
  },
];
