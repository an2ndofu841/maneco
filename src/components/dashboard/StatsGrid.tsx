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
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
    },
    {
      label: '累計節約額',
      value: `¥${user.total_savings.toLocaleString()}`,
      unit: '',
      icon: PiggyBank,
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
    },
    {
      label: '総獲得額',
      value: `¥${(user.total_points + user.total_savings).toLocaleString()}`,
      unit: '',
      icon: TrendingUp,
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
    },
    {
      label: 'キャラLv',
      value: `Lv.${user.character_level}`,
      unit: '',
      icon: Zap,
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, bg, text, border }) => (
        <div
          key={label}
          className={`bento-card p-4 rounded-2xl flex flex-col items-center justify-center text-center group hover:scale-[1.02] transition-transform duration-300`}
        >
          <div className={`w-10 h-10 rounded-xl ${bg} ${text} ${border} border flex items-center justify-center mb-3 group-hover:rotate-12 transition-transform`}>
            <Icon className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
          <p className="text-lg font-black text-slate-900 tracking-tight">{value}</p>
        </div>
      ))}
    </div>
  )
}
