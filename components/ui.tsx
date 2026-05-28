'use client'

import { ReactNode } from 'react'
import { TransactionType, HealthStatus } from '@/types'
import { CATEGORY_ICONS, formatRupiah } from '@/lib/utils'

// ─── TypeToggle ───────────────────────────────────────────────
interface TypeToggleProps {
  value: TransactionType
  onChange: (v: TransactionType) => void
}

export function TypeToggle({ value, onChange }: TypeToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-gray-100 mb-4">
      {(['income', 'expense'] as TransactionType[]).map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`
            flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200
            ${value === t
              ? t === 'income'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'bg-white text-red-500 shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
            }
          `}
        >
          <span>{t === 'income' ? '↑' : '↓'}</span>
          {t === 'income' ? 'Pemasukan' : 'Pengeluaran'}
        </button>
      ))}
    </div>
  )
}

// ─── FormField ────────────────────────────────────────────────
interface FormFieldProps {
  label: string
  children: ReactNode
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </label>
      {children}
    </div>
  )
}

// ─── Input & Select ───────────────────────────────────────────
const inputClass = `
  w-full px-3 py-2.5 rounded-xl text-sm border border-gray-200
  bg-gray-50 text-gray-900 placeholder:text-gray-300
  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
  transition-all duration-200
`

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputClass} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={inputClass}>
      {props.children}
    </select>
  )
}

// ─── SubmitButton ─────────────────────────────────────────────
interface SubmitButtonProps {
  type: TransactionType
  onClick: () => void
}

export function SubmitButton({ type, onClick }: SubmitButtonProps) {
  const isIncome = type === 'income'
  return (
    <button
      onClick={onClick}
      className={`
        w-full mt-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2
        transition-all duration-200 active:scale-[.98] shadow-sm
        ${isIncome
          ? 'bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
          : 'bg-linear-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600'
        }
      `}
    >
      <span>{isIncome ? '↑' : '↓'}</span>
      {isIncome ? 'Tambah Pemasukan' : 'Tambah Pengeluaran'}
    </button>
  )
}

// ─── Card ─────────────────────────────────────────────────────
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl p-4 mb-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100 ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ title, icon, sub }: { title: string; icon: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <span className="text-gray-300">{icon}</span>
        {title}
      </div>
      {sub && <span className="text-[11px] text-gray-400">{sub}</span>}
    </div>
  )
}

// ─── TransactionRow ───────────────────────────────────────────
import { Transaction } from '@/types'
import { formatDate } from '@/lib/utils'

interface TxRowProps {
  tx: Transaction
  onDelete: (id: number) => void
}

export function TransactionRow({ tx, onDelete }: TxRowProps) {
  const icon = CATEGORY_ICONS[tx.category] ?? (tx.type === 'income' ? '↑' : '↓')
  const isIncome = tx.type === 'income'

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${isIncome ? 'bg-blue-50' : 'bg-red-50'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate text-gray-800">
          {tx.description || tx.category}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5">
          <span>{tx.category}</span>
          <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
          <span>{formatDate(tx.date)}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={`text-sm font-semibold ${isIncome ? 'text-blue-600' : 'text-red-500'}`}>
          {isIncome ? '+' : '−'}{formatRupiah(tx.amount)}
        </span>
        <button
          onClick={() => onDelete(tx.id)}
          className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Hapus transaksi"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── MetricCard ───────────────────────────────────────────────
interface MetricCardProps {
  label: string
  value: string
  icon: string
  variant: 'income' | 'expense' | 'balance'
}

export function MetricCard({ label, value, icon, variant }: MetricCardProps) {
  const colors = {
    income: 'text-blue-600',
    expense: 'text-red-500',
    balance: 'text-gray-900',
  }
  return (
    <div className="bg-white rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100">
      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-2">
        <span>{icon}</span> {label}
      </div>
      <div className={`text-base font-semibold ${colors[variant]}`}>{value}</div>
    </div>
  )
}

// ─── AllocRow ─────────────────────────────────────────────────
interface AllocRowProps {
  icon: string
  iconBg: string
  name: string
  target: number
  pct: number
  amount: number
  barColor: string
  status: HealthStatus
}

const statusConfig: Record<HealthStatus, { badge: string; label: string }> = {
  ok: { badge: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'Sehat' },
  warn: { badge: 'bg-amber-50 text-amber-600 border-amber-100', label: 'Perhatian' },
  bad: { badge: 'bg-red-50 text-red-500 border-red-100', label: 'Melebihi' },
}

export function AllocRow({ icon, iconBg, name, target, pct, amount, barColor, status }: AllocRowProps) {
  const { badge, label } = statusConfig[status]
  const width = Math.min(pct, 100)

  return (
    <div className="py-3 border-b border-gray-100 last:border-b-0 last:pb-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ background: iconBg }}>
            {icon}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800">{name}</div>
            <div className="text-[11px] text-gray-400">Target: {target}%</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: barColor }}>{pct}%</span>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${badge}`}>{label}</span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${width}%`, background: barColor }}
        />
      </div>
      <div className="text-[11px] text-gray-400 mt-1">{formatRupiah(amount)}</div>
    </div>
  )
}

// ─── TipBox ───────────────────────────────────────────────────
export function TipBox({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-600 flex items-center gap-2">
      <span className="text-base shrink-0">💡</span>
      {children}
    </div>
  )
}

// ─── EmptyState ───────────────────────────────────────────────
export function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="text-center py-10 text-gray-300">
      <div className="text-3xl mb-2 opacity-60">{icon}</div>
      <div className="text-sm text-gray-400">{message}</div>
    </div>
  )
}
