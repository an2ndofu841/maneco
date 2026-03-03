'use client'

import { User } from '@/types'

interface CharacterCardProps {
  user: User
}

const levelEmojis = ['🐣', '🐱', '😺', '😸', '🎯', '👑', '🏆', '⭐', '💫', '🌟']
const levelTitles = ['たまご', 'こねこ', 'ねこ', 'えがおねこ', 'めじるしねこ', 'おうさまねこ', 'チャンピオン', 'スター', 'スーパースター', 'レジェンド']

export default function CharacterCard({ user }: CharacterCardProps) {
  const level = Math.min(user.character_level, levelEmojis.length)
  const emoji = levelEmojis[level - 1]
  const title = levelTitles[level - 1]
  const expForNext = level * 100
  const expProgress = Math.min((user.character_exp % expForNext) / expForNext * 100, 100)

  return (
    <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-4 text-white shadow-lg">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-sm">
            {emoji}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white text-amber-500 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow">
            {level}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg">{user.nickname}</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{title}</span>
          </div>

          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>経験値</span>
              <span>{user.character_exp % expForNext} / {expForNext}</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${expProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {user.goal_title && (
        <div className="mt-3 bg-white/15 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80">目標</p>
              <p className="font-bold text-sm">{user.goal_title}</p>
            </div>
            {user.goal_amount && (
              <div className="text-right">
                <p className="text-xs opacity-80">目標額</p>
                <p className="font-bold">¥{user.goal_amount.toLocaleString()}</p>
              </div>
            )}
          </div>
          {user.goal_amount && (
            <div className="mt-2">
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-300 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(user.total_points / user.goal_amount * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs mt-1 opacity-80">
                ¥{user.total_points.toLocaleString()} / ¥{user.goal_amount.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
