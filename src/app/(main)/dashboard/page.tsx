import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CharacterCard from '@/components/dashboard/CharacterCard'
import StatsGrid from '@/components/dashboard/StatsGrid'
import ChatWidget from '@/components/chat/ChatWidget'
import Link from 'next/link'
import { TrendingUp, ShoppingBag, Bell } from 'lucide-react'
import { User } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) redirect('/login')

  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  const profile: User = userProfile ?? {
    id: authUser.id,
    email: authUser.email ?? '',
    nickname: authUser.email?.split('@')[0] ?? 'マネコユーザー',
    total_points: 0,
    total_savings: 0,
    character_level: 1,
    character_exp: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐱</span>
            <h1 className="text-xl font-bold text-gray-800">マネコ</h1>
          </div>
          <button className="relative p-2 text-gray-500 hover:text-gray-700">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* キャラクターカード */}
        <CharacterCard user={profile} />

        {/* 統計グリッド */}
        <StatsGrid user={profile} />

        {/* AIチャット */}
        <ChatWidget />

        {/* アクションボタン */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/earn" className="group">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-5 text-white shadow-md hover:shadow-lg transition-all group-hover:-translate-y-0.5">
              <TrendingUp className="w-7 h-7 mb-2" />
              <p className="font-bold text-lg">お金を</p>
              <p className="font-bold text-lg">増やす</p>
              <p className="text-xs mt-1 opacity-80">アンケート・案件で稼ぐ</p>
            </div>
          </Link>

          <Link href="/smart" className="group">
            <div className="bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl p-5 text-white shadow-md hover:shadow-lg transition-all group-hover:-translate-y-0.5">
              <ShoppingBag className="w-7 h-7 mb-2" />
              <p className="font-bold text-lg">賢く</p>
              <p className="font-bold text-lg">使う</p>
              <p className="text-xs mt-1 opacity-80">クーポン・旅行プランナー</p>
            </div>
          </Link>
        </div>

        {/* 今日のヒント */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-bold text-gray-800 text-sm">今日のマネコヒント</p>
              <p className="text-gray-600 text-xs mt-1">
                コンビニコーヒーを週5日買うと月約2,000円。自分でコーヒーを淹れると年間約20,000円の節約に！
                その分を積立NISAに回すと10年後に大きな差が生まれます☕
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
