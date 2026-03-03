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
      gradient: 'from-amber-500/15 to-orange-500/10',
      border: 'border-amber-500/20',
      iconColor: 'text-amber-400',
      valueColor: 'text-amber-400',
    },
    {
      label: '累計節約額',
      value: `¥${user.total_savings.toLocaleString()}`,
      unit: '',
      icon: PiggyBank,
      gradient: 'from-emerald-500/15 to-teal-500/10',
      border: 'border-emerald-500/20',
      iconColor: 'text-emerald-400',
      valueColor: 'text-emerald-400',
    },
    {
      label: '総獲得額',
      value: `¥${(user.total_points + user.total_savings).toLocaleString()}`,
      unit: '',
      icon: TrendingUp,
      gradient: 'from-blue-500/15 to-indigo-500/10',
      border: 'border-blue-500/20',
      iconColor: 'text-blue-400',
      valueColor: 'text-blue-400',
    },
    {
      label: 'キャラLv',
      value: `Lv.${user.character_level}`,
      unit: '',
      icon: Zap,
      gradient: 'from-violet-500/15 to-purple-500/10',
      border: 'border-violet-500/20',
      iconColor: 'text-violet-400',
      valueColor: 'text-violet-400',
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
          <p className="text-white/40 text-xs mb-0.5">{label}</p>
          <p className={`font-black text-lg ${valueColor} leading-tight`}>{value}</p>
        </div>
      ))}
    </div>
  )
}
