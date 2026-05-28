'use client'

import { useState, useCallback, useEffect } from 'react'
import { Transaction, TransactionType } from '@/types'

const STORAGE_KEY = 'dompetku-transactions'

function loadTransactions(): Transaction[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveTransactions(txs: Transaction[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(txs))
  } catch { /* quota exceeded — silently ignore */ }
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setTransactions(loadTransactions())
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) saveTransactions(transactions)
  }, [transactions, loaded])

  const addTransaction = useCallback(
    (data: { type: TransactionType; description: string; category: string; amount: number; date: string }) => {
      setTransactions((prev) => [
        ...prev,
        { ...data, id: Date.now() },
      ])
    },
    []
  )

  const deleteTransaction = useCallback((id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { transactions, addTransaction, deleteTransaction }
}
