'use client'

import { useState } from 'react'
import { useTransactions } from '@/lib/useTransactions'
import InputPage from '@/components/InputPage'
import AnalyticsPage from '@/components/AnalyticsPage'

type Page = 'input' | 'analytics'

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']

export default function Home() {
  const [page, setPage] = useState<Page>('input')
  const { transactions, addTransaction, deleteTransaction } = useTransactions()

  const now = new Date()
  const monthLabel = `${MONTH_NAMES[now.getMonth() + 1]} ${now.getFullYear()}`

  return (
    <div className="max-w-xl mx-auto min-h-screen flex flex-col bg-[#f5f5f7]">
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 px-5 py-3.5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm shadow-sm">
            👛
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 leading-none mb-0.5">Duit Agung</div>
            <div className="text-[11px] text-gray-400 leading-none">Pencatat keuangan</div>
          </div>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
          {monthLabel}
        </span>
      </header>

      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 flex px-5 gap-1">
        {([
          { key: 'input', label: 'Input', icon: '✏️' },
          { key: 'analytics', label: 'Analitik', icon: '📊' },
        ] as { key: Page; label: string; icon: string }[]).map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            className={`
              flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200
              ${page === key
                ? 'text-blue-600 border-blue-500'
                : 'text-gray-400 border-transparent hover:text-gray-600'
              }
            `}
          >
            <span className="text-xs">{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      <main className="flex-1 p-4">
        {page === 'input'
          ? <InputPage transactions={transactions} onAdd={addTransaction} onDelete={deleteTransaction} />
          : <AnalyticsPage transactions={transactions} />
        }
      </main>
    </div>
  )
}
