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
    <div className="bento-card p-6 rounded-3xl relative overflow-hidden group">
      {/* 背景エフェクト */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -mr-20 -mt-20 transition-all group-hover:bg-indigo-200/50" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl -ml-16 -mb-16 transition-all group-hover:bg-blue-200/50" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
        {/* キャラクターアイコン */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-3xl bg-white shadow-lg shadow-indigo-100 flex items-center justify-center text-5xl border border-indigo-50 animate-float">
            {emoji}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-black rounded-full w-8 h-8 flex items-center justify-center shadow-md border-2 border-white">
            {level}
          </div>
        </div>

        {/* ユーザー情報 */}
        <div className="flex-1 w-full text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 justify-center sm:justify-start">
            <h2 className="text-xl font-bold text-slate-900">{user.nickname}</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 w-fit mx-auto sm:mx-0">
              {title}
            </span>
          </div>

          {/* 経験値バー */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>EXP</span>
              <span>{user.character_exp % expForNext} / {expForNext}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${expProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 目標セクション (あれば) */}
      {user.goal_title && (
        <div className="relative mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-0.5">現在の目標</p>
              <p className="text-sm font-bold text-slate-900">{user.goal_title}</p>
            </div>
            {user.goal_amount && (
              <div className="text-right">
                <p className="text-xs text-slate-500 font-medium mb-0.5">目標額</p>
                <p className="text-lg font-black text-indigo-600">¥{user.goal_amount.toLocaleString()}</p>
              </div>
            )}
          </div>
          
          {user.goal_amount && (
            <div className="relative">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(user.total_points / user.goal_amount * 100, 100)}%` }}
                />
              </div>
              <p className="text-right text-xs font-bold text-emerald-600 mt-1.5">
                {Math.round(Math.min(user.total_points / user.goal_amount * 100, 100))}% 達成
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
