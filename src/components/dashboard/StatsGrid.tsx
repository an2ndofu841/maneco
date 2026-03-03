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
      value: `${user.total_points.toLocaleString()}pt`,
      icon: Star,
      color: 'bg-amber-50 text-amber-500',
      borderColor: 'border-amber-200',
    },
    {
      label: '累計節約額',
      value: `¥${user.total_savings.toLocaleString()}`,
      icon: PiggyBank,
      color: 'bg-green-50 text-green-500',
      borderColor: 'border-green-200',
    },
    {
      label: '総獲得額',
      value: `¥${(user.total_points + user.total_savings).toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-blue-50 text-blue-500',
      borderColor: 'border-blue-200',
    },
    {
      label: 'キャラLv',
      value: `Lv.${user.character_level}`,
      icon: Zap,
      color: 'bg-purple-50 text-purple-500',
      borderColor: 'border-purple-200',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(({ label, value, icon: Icon, color, borderColor }) => (
        <div
          key={label}
          className={`bg-white rounded-2xl p-4 border ${borderColor} shadow-sm`}
        >
          <div className={`inline-flex p-2 rounded-xl ${color} mb-2`}>
            <Icon className="w-4 h-4" />
          </div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="font-bold text-gray-800 text-lg">{value}</p>
        </div>
      ))}
    </div>
  )
}
