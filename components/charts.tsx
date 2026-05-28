'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Filler,
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import { formatShort, formatRupiah } from '@/lib/utils'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, Filler
)

// ─── BarChart ─────────────────────────────────────────────────
interface BarChartProps {
  labels: string[]
  income: number[]
  expense: number[]
}

export function BarChart({ labels, income, expense }: BarChartProps) {
  return (
    <div className="relative w-full h-56">
      <Bar
        role="img"
        aria-label="Bar chart pemasukan dan pengeluaran bulanan"
        data={{
          labels,
          datasets: [
            {
              label: 'Pemasukan',
              data: income,
              backgroundColor: '#3b82f6',
              borderRadius: 6,
              borderSkipped: false,
              barPercentage: 0.55,
            },
            {
              label: 'Pengeluaran',
              data: expense,
              backgroundColor: '#ef4444',
              borderRadius: 6,
              borderSkipped: false,
              barPercentage: 0.55,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: { label: (c) => `${c.dataset.label}: ${formatRupiah(c.raw as number)}` },
            },
          },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#888' } },
            y: {
              grid: { color: 'rgba(128,128,128,.1)' },
              ticks: { callback: (v) => formatShort(v as number), font: { size: 10 }, color: '#888' },
            },
          },
        }}
      />
    </div>
  )
}

// ─── DoughnutChart ────────────────────────────────────────────
interface DoughnutChartProps {
  labels: string[]
  data: number[]
  colors: string[]
}

export function DoughnutChart({ labels, data, colors }: DoughnutChartProps) {
  return (
    <div className="relative w-full h-48">
      <Doughnut
        role="img"
        aria-label="Donut chart pengeluaran per kategori"
        data={{
          labels,
          datasets: [{
            data,
            backgroundColor: colors,
            borderWidth: 0,
            hoverOffset: 4,
          }],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: { label: (c) => `${c.label}: ${formatRupiah(c.raw as number)}` },
            },
          },
        }}
      />
    </div>
  )
}

// ─── LineChart ────────────────────────────────────────────────
interface LineChartProps {
  labels: string[]
  balance: number[]
}

export function LineChart({ labels, balance }: LineChartProps) {
  if (!labels.length) return null
  return (
    <div className="relative w-full h-56">
      <Line
        role="img"
        aria-label="Line chart tren saldo bulanan"
        data={{
          labels,
          datasets: [
            {
              label: 'Saldo',
              data: balance,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59,130,246,.08)',
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: '#3b82f6',
              borderWidth: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: { label: (c) => `Saldo: ${formatRupiah(c.raw as number)}` },
            },
          },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#888' } },
            y: {
              grid: { color: 'rgba(128,128,128,.1)' },
              ticks: { callback: (v) => formatShort(v as number), font: { size: 10 }, color: '#888' },
            },
          },
        }}
      />
    </div>
  )
}
