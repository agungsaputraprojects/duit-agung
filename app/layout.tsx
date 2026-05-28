import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Duit Agung – Pencatat Keuangan',
  description: 'Catat pemasukan dan pengeluaran, analisis keuangan 50/30/20',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
