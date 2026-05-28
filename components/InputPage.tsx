'use client'

import { useState } from 'react'
import { TransactionType, Transaction } from '@/types'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/utils'
import {
  TypeToggle, FormField, Input, Select,
  SubmitButton, Card, CardHeader,
  TransactionRow, EmptyState,
} from '@/components/ui'

interface InputPageProps {
  transactions: Transaction[]
  onAdd: (data: { type: TransactionType; description: string; category: string; amount: number; date: string }) => void
  onDelete: (id: number) => void
}

const today = () => new Date().toISOString().slice(0, 10)

export default function InputPage({ transactions, onAdd, onDelete }: InputPageProps) {
  const [type, setType] = useState<TransactionType>('expense')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(today)

  const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleTypeChange = (t: TransactionType) => {
    setType(t)
    setCategory('')
  }

  const rawAmount = Number(amount.replace(/\./g, '')) || 0

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '')
    if (!digits) { setAmount(''); return }
    setAmount(Number(digits).toLocaleString('id-ID'))
  }

  const handleSubmit = () => {
    if (!rawAmount || !category) return
    onAdd({ type, description, category, amount: rawAmount, date })
    setDescription('')
    setCategory('')
    setAmount('')
    setDate(today())
  }

  const PER_PAGE = 5
  const [txPage, setTxPage] = useState(1)

  const all = [...transactions].reverse()
  const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE))
  const paginated = all.slice((txPage - 1) * PER_PAGE, txPage * PER_PAGE)

  const safePage = Math.min(txPage, totalPages)
  if (safePage !== txPage) setTxPage(safePage)

  return (
    <div>
      <Card>
        <TypeToggle value={type} onChange={handleTypeChange} />
        <div className="grid grid-cols-2 gap-2.5 mb-2.5">
          <FormField label="Deskripsi">
            <Input
              placeholder={type === 'income' ? 'Misal: Gaji Mei' : 'Misal: Makan siang'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>
          <FormField label="Kategori">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Pilih kategori</option>
              {cats.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-2.5 mb-2.5">
          <FormField label="Jumlah (Rp)">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={amount}
              onChange={handleAmountChange}
            />
          </FormField>
          <FormField label="Tanggal">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormField>
        </div>
        <SubmitButton type={type} onClick={handleSubmit} />
      </Card>

      <Card>
        <CardHeader title="Transaksi terbaru" icon="📋" sub={`${all.length} data`} />
        {all.length === 0
          ? <EmptyState icon="📭" message="Belum ada transaksi" />
          : (
            <>
              <div className="flex flex-col gap-2">
                {paginated.map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} onDelete={onDelete} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setTxPage((p) => Math.max(1, p - 1))}
                    disabled={txPage <= 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setTxPage(p)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                        p === txPage
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setTxPage((p) => Math.min(totalPages, p + 1))}
                    disabled={txPage >= totalPages}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )
        }
      </Card>
    </div>
  )
}
