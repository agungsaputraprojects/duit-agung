'use client'

import { Transaction } from '@/types'
import {
  MONTH_NAMES, NEEDS_CATEGORIES, WANTS_CATEGORIES,
  SWATCH_COLORS, formatRupiah, getHealthStatus,
} from '@/lib/utils'
import {
  Card, CardHeader, MetricCard,
  AllocRow, TipBox, EmptyState,
} from '@/components/ui'
import { BarChart, LineChart, DoughnutChart } from '@/components/charts'

interface AnalyticsPageProps {
  transactions: Transaction[]
}

export default function AnalyticsPage({ transactions }: AnalyticsPageProps) {
  const totalIn = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalOut = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = totalIn - totalOut
  const base = totalIn || 1

  const needsOut = transactions
    .filter((t) => t.type === 'expense' && NEEDS_CATEGORIES.includes(t.category))
    .reduce((s, t) => s + t.amount, 0)
  const wantsOut = transactions
    .filter((t) => t.type === 'expense' && WANTS_CATEGORIES.includes(t.category))
    .reduce((s, t) => s + t.amount, 0)

  const savePct = Math.round(Math.max(0, balance) / base * 100)
  const needsPct = Math.round(needsOut / base * 100)
  const wantsPct = Math.round(wantsOut / base * 100)

  const months: Record<string, { income: number; expense: number }> = {}
  transactions.forEach((t) => {
    const m = t.date.slice(0, 7)
    if (!months[m]) months[m] = { income: 0, expense: 0 }
    months[m][t.type === 'income' ? 'income' : 'expense'] += t.amount
  })
  const mKeys = Object.keys(months).sort().slice(-6)
  const labels = mKeys.map((m) => {
    const [, mo] = m.split('-')
    return MONTH_NAMES[parseInt(mo)]
  })
  const incomeData = mKeys.map((m) => months[m].income)
  const expenseData = mKeys.map((m) => months[m].expense)
  let run = 0
  const balanceData = mKeys.map((m) => {
    run += months[m].income - months[m].expense
    return run
  })

  const catMap: Record<string, number> = {}
  transactions.filter((t) => t.type === 'expense').forEach((t) => {
    catMap[t.category] = (catMap[t.category] || 0) + t.amount
  })
  const catEntries = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const catTotal = catEntries.reduce((s, e) => s + e[1], 0) || 1

  const overallHealth = savePct >= 20 && needsPct <= 50 && wantsPct <= 30
    ? 'ok' : savePct >= 10 ? 'warn' : 'bad'
  const overallLabel = { ok: 'Sehat ✓', warn: 'Perlu Perhatian', bad: 'Kurang Sehat' }[overallHealth]
  const overallColor = { ok: 'text-emerald-600', warn: 'text-amber-600', bad: 'text-red-500' }[overallHealth]

  if (transactions.length === 0) {
    return (
      <Card>
        <EmptyState icon="📊" message="Tambahkan transaksi untuk melihat analitik" />
      </Card>
    )
  }

  return (
    <div>
      <div className={`rounded-2xl p-4 mb-3.5 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${balance >= 0 ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}`}>
        <div>
          <div className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1">Saldo bersih</div>
          <div className={`text-2xl font-semibold ${balance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {balance < 0 && '−'}{formatRupiah(Math.abs(balance))}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-gray-400 mb-1">Status keuangan</div>
          <div className={`text-sm font-semibold ${overallColor}`}>{overallLabel}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-3.5">
        <MetricCard label="Pemasukan" value={formatRupiah(totalIn)} icon="↑" variant="income" />
        <MetricCard label="Pengeluaran" value={formatRupiah(totalOut)} icon="↓" variant="expense" />
      </div>

      <Card>
        <CardHeader title="Pemasukan vs Pengeluaran" icon="📊" sub="6 bulan terakhir" />
        <div className="flex gap-4 mb-3">
          {[{ color: '#3b82f6', label: 'Pemasukan' }, { color: '#ef4444', label: 'Pengeluaran' }].map((l) => (
            <span key={l.label} className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
        {mKeys.length === 0
          ? <EmptyState icon="📊" message="Belum ada data" />
          : <BarChart labels={labels} income={incomeData} expense={expenseData} />
        }
      </Card>

      <Card>
        <CardHeader title="Tren saldo" icon="📈" sub="Akumulasi bulanan" />
        {mKeys.length === 0
          ? <EmptyState icon="📈" message="Belum ada data" />
          : <LineChart labels={labels} balance={balanceData} />
        }
      </Card>

      <Card>
        <CardHeader title="Alokasi 50/30/20" icon="🎯" sub="Panduan keuangan sehat" />
        <div>
          <AllocRow
            icon="🏠" iconBg="#eff6ff" name="Kebutuhan pokok" target={50}
            pct={needsPct} amount={needsOut} barColor="#3b82f6"
            status={getHealthStatus(needsPct, 50)}
          />
          <AllocRow
            icon="⭐" iconBg="#fffbeb" name="Keinginan" target={30}
            pct={wantsPct} amount={wantsOut} barColor="#f59e0b"
            status={getHealthStatus(wantsPct, 30)}
          />
          <AllocRow
            icon="🐷" iconBg="#ecfdf5" name="Tabungan & investasi" target={20}
            pct={savePct} amount={Math.max(0, balance)} barColor="#10b981"
            status={getHealthStatus(savePct, 20, true)}
          />
        </div>
        <TipBox>
          Target tabungan ideal bulan ini: <strong className="ml-1">{formatRupiah(Math.max(15000000, totalIn * 0.2))}</strong>
        </TipBox>
      </Card>

      {catEntries.length > 0 && (
        <Card>
          <CardHeader title="Pengeluaran per kategori" icon="🗂️" />
          <DoughnutChart
            labels={catEntries.map(([cat]) => cat)}
            data={catEntries.map(([, amt]) => amt)}
            colors={catEntries.map((_, i) => SWATCH_COLORS[i % SWATCH_COLORS.length])}
          />
          <div className="grid grid-cols-2 gap-2 mt-4">
            {catEntries.map(([cat, amt], i) => (
              <div key={cat} className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50">
                <div className="w-1.5 h-8 rounded-full shrink-0" style={{ background: SWATCH_COLORS[i % SWATCH_COLORS.length] }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate text-gray-700">{cat}</div>
                  <div className="text-[11px] text-gray-400">{formatRupiah(amt)}</div>
                </div>
                <div className="text-xs font-semibold text-gray-500">
                  {Math.round(amt / catTotal * 100)}%
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
