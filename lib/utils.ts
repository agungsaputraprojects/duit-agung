import { HealthStatus } from '@/types'

export const INCOME_CATEGORIES = ['Gaji', 'Freelance', 'Investasi', 'Bisnis', 'Bonus', 'Lainnya']

export const EXPENSE_CATEGORIES = [
  'Makan & Minum',
  'Jajan',
  'Transportasi',
  'Belanja',
  'Tagihan',
  'Kesehatan',
  'Hiburan',
  'Tabungan',
  'Investasi',
  'Lainnya',
]

export const CATEGORY_ICONS: Record<string, string> = {
  Gaji: '🏦',
  Freelance: '💻',
  Investasi: '📈',
  Bisnis: '💼',
  Bonus: '🎁',
  'Makan & Minum': '🍜',
  Jajan: '🍦',
  Transportasi: '🚗',
  Belanja: '🛍️',
  Tagihan: '📄',
  Kesehatan: '🏥',
  Hiburan: '🎬',
  Tabungan: '🐷',
  Lainnya: '📌',
}

export const SWATCH_COLORS = [
  '#1a56db',
  '#c0392b',
  '#e67e22',
  '#16a085',
  '#8e44ad',
  '#2c3e50',
  '#27ae60',
]

export const MONTH_NAMES = [
  '', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des',
]

export const NEEDS_CATEGORIES = ['Makan & Minum', 'Transportasi', 'Tagihan', 'Kesehatan']
export const WANTS_CATEGORIES = ['Jajan', 'Hiburan', 'Belanja', 'Lainnya']

export function formatRupiah(n: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(n)
}

export function formatShort(n: number): string {
  if (n >= 1e9) return 'Rp' + (n / 1e9).toFixed(1) + 'M'
  if (n >= 1e6) return 'Rp' + (n / 1e6).toFixed(1) + 'jt'
  if (n >= 1e3) return 'Rp' + (n / 1e3).toFixed(0) + 'rb'
  return 'Rp' + Math.round(n)
}

export function formatDate(d: string): string {
  const p = d.split('-')
  return `${p[2]}/${p[1]}/${p[0].slice(2)}`
}

export function getHealthStatus(pct: number, target: number, isMin = false): HealthStatus {
  if (isMin) {
    if (pct >= target) return 'ok'
    if (pct >= target / 2) return 'warn'
    return 'bad'
  }
  if (pct <= target) return 'ok'
  if (pct <= target * 1.2) return 'warn'
  return 'bad'
}

export const SAMPLE_TRANSACTIONS = [
  { id: 1, type: 'income' as const, description: 'Gaji Mei', category: 'Gaji', amount: 8000000, date: '2026-05-01' },
  { id: 2, type: 'expense' as const, description: 'Makan harian', category: 'Makan & Minum', amount: 1200000, date: '2026-05-10' },
  { id: 3, type: 'expense' as const, description: 'Grab & Gojek', category: 'Transportasi', amount: 400000, date: '2026-05-12' },
  { id: 4, type: 'expense' as const, description: 'Netflix & Spotify', category: 'Hiburan', amount: 200000, date: '2026-05-15' },
  { id: 5, type: 'income' as const, description: 'Freelance project', category: 'Freelance', amount: 2000000, date: '2026-05-18' },
  { id: 6, type: 'expense' as const, description: 'Listrik & internet', category: 'Tagihan', amount: 600000, date: '2026-05-20' },
  { id: 7, type: 'expense' as const, description: 'Belanja bulanan', category: 'Belanja', amount: 800000, date: '2026-05-22' },
]
