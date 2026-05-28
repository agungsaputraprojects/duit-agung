export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: number
  type: TransactionType
  description: string
  category: string
  amount: number
  date: string
}

export type HealthStatus = 'ok' | 'warn' | 'bad'
