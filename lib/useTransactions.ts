'use client'

import { useState, useCallback, useEffect } from 'react'
import { Transaction, TransactionType } from '@/types'
import { supabase } from '@/lib/supabase'

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: true })
      if (data) setTransactions(data as Transaction[])
      setLoading(false)
    }
    fetchAll()

    const channel = supabase
      .channel('transactions-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => { fetchAll() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const addTransaction = useCallback(
    async (data: { type: TransactionType; description: string; category: string; amount: number; date: string }) => {
      const newTx = { ...data, id: Date.now() }
      setTransactions((prev) => [...prev, newTx])
      await supabase.from('transactions').insert(newTx)
    },
    []
  )

  const deleteTransaction = useCallback(async (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
    await supabase.from('transactions').delete().eq('id', id)
  }, [])

  return { transactions, addTransaction, deleteTransaction, loading }
}
