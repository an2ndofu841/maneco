'use client'

import { User } from '@/types'

interface CharacterCardProps {
  user: User
}

const levelEmojis = ['🐣', '🐱', '😺', '😸', '🎯', '👑', '🏆', '⭐', '💫', '🌟']
const levelTitles = ['たまご', 'こねこ', 'ねこ', 'えがおねこ', 'めじるし', 'おうさま', 'チャンプ', 'スター', 'スーパー', 'レジェンド']

export default function CharacterCard({ user }: CharacterCardProps) {
  const level = Math.min(user.character_level, levelEmojis.length)
  const emoji = levelEmojis[level - 1]
  const title = levelTitles[level - 1]
  const expForNext = level * 100
  const expProgress = Math.min((user.character_exp % expForNext) / expForNext * 100, 100)

  return (
    <div className="relative overflow-hidden rounded-3xl p-5" style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)',
      border: '1px solid #dbeafe',
    }}>
      {/* 背景グロー */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-300/25 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-200/25 rounded-full blur-2xl" />

      <div className="relative flex items-center gap-4">
        {/* キャラアイコン */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl animate-float"
            style={{ background: 'rgba(37, 99, 235, 0.12)', border: '1px solid rgba(37, 99, 235, 0.25)' }}>
            {emoji}
          </div>
          <div className="absolute -bottom-1 -right-1 gradient-gold text-black text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">
            {level}
          </div>
        </div>

        {/* ユーザー情報 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-bold text-slate-900 text-base truncate">{user.nickname}</p>
            <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full flex-shrink-0">
              {title}
            </span>
          </div>

          {/* 経験値バー */}
          <p className="text-slate-500 text-[10px] mb-1">EXP {user.character_exp % expForNext} / {expForNext}</p>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full gradient-gold rounded-full transition-all duration-700"
              style={{ width: `${expProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 目標 */}
      {user.goal_title && (
        <div className="relative mt-4 bg-white rounded-2xl p-3 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-slate-500 text-[10px]">目標</p>
              <p className="text-slate-900 text-sm font-bold">{user.goal_title}</p>
            </div>
            {user.goal_amount && (
              <p className="text-blue-700 font-black text-sm">¥{user.goal_amount.toLocaleString()}</p>
            )}
          </div>
          {user.goal_amount && (
            <>
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                  style={{ width: `${Math.min(user.total_points / user.goal_amount * 100, 100)}%` }}
                />
              </div>
              <p className="text-slate-500 text-[10px] mt-1">
                ¥{user.total_points.toLocaleString()} 達成
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
