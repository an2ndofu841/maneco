'use client'

import { User } from '@/types'
import { TrendingUp, PiggyBank, Star, Zap } from 'lucide-react'

interface StatsGridProps {
  user: User
}

export default function StatsGrid({ user }: StatsGridProps) {
  const stats = [
    {
      label: '保有ポイント',
      value: user.total_points.toLocaleString(),
      unit: 'pt',
      icon: Star,
      gradient: 'from-blue-50 to-cyan-50',
      border: 'border-blue-200',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-700',
    },
    {
      label: '累計節約額',
      value: `¥${user.total_savings.toLocaleString()}`,
      unit: '',
      icon: PiggyBank,
      gradient: 'from-emerald-50 to-teal-50',
      border: 'border-emerald-200',
      iconColor: 'text-emerald-600',
      valueColor: 'text-emerald-700',
    },
    {
      label: '総獲得額',
      value: `¥${(user.total_points + user.total_savings).toLocaleString()}`,
      unit: '',
      icon: TrendingUp,
      gradient: 'from-indigo-50 to-blue-50',
      border: 'border-indigo-200',
      iconColor: 'text-indigo-600',
      valueColor: 'text-indigo-700',
    },
    {
      label: 'キャラLv',
      value: `Lv.${user.character_level}`,
      unit: '',
      icon: Zap,
      gradient: 'from-sky-50 to-blue-50',
      border: 'border-sky-200',
      iconColor: 'text-sky-600',
      valueColor: 'text-sky-700',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(({ label, value, icon: Icon, gradient, border, iconColor, valueColor }) => (
        <div
          key={label}
          className={`bg-gradient-to-br ${gradient} rounded-2xl p-4 border ${border}`}
        >
          <Icon className={`w-4 h-4 ${iconColor} mb-2`} />
          <p className="text-slate-500 text-xs mb-0.5">{label}</p>
          <p className={`font-black text-lg ${valueColor} leading-tight`}>{value}</p>
        </div>
      ))}
    </div>
  )
}
