import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CharacterCard from '@/components/dashboard/CharacterCard'
import StatsGrid from '@/components/dashboard/StatsGrid'
import ChatWidget from '@/components/chat/ChatWidget'
import Link from 'next/link'
import { TrendingUp, ShoppingBag, Bell, ChevronRight } from 'lucide-react'
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

  const tips = [
    'コンビニコーヒーを週5日買うと月約2,000円。マイボトルに変えると年間24,000円の節約！',
    'ふるさと納税を活用すると実質2,000円で豪華な返礼品がもらえます。',
    'サブスク整理で平均月3,000円の削減事例が多数。使っていないものを確認しよう。',
  ]
  const todayTip = tips[new Date().getDate() % tips.length]

  return (
    <div className="min-h-screen bg-[#0f0f14]">
      {/* 背景グロー */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-amber-500/8 rounded-full blur-[80px]" />
      </div>

      {/* ヘッダー */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-14 pb-5">
        <div>
          <p className="text-white/40 text-xs">おかえり 👋</p>
          <h1 className="text-white font-black text-xl">{profile.nickname}</h1>
        </div>
        <button className="relative w-10 h-10 glass rounded-2xl flex items-center justify-center">
          <Bell className="w-4 h-4 text-white/50" />
        </button>
      </div>

      <div className="relative z-10 px-4 space-y-4">
        {/* キャラクターカード */}
        <CharacterCard user={profile} />

        {/* 統計グリッド */}
        <StatsGrid user={profile} />

        {/* アクションボタン */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/earn" className="group">
            <div className="relative overflow-hidden rounded-3xl p-5 h-full"
              style={{ background: 'linear-gradient(135deg, #0d2318 0%, #0f2e1e 100%)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
              <div className="w-10 h-10 bg-emerald-500/15 rounded-2xl flex items-center justify-center mb-3 border border-emerald-500/20">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-white font-black text-base leading-tight mb-1">お金を<br />増やす</p>
              <p className="text-emerald-400/60 text-xs">アンケートで稼ぐ</p>
              <ChevronRight className="w-3 h-3 text-emerald-400/40 absolute bottom-4 right-4" />
            </div>
          </Link>

          <Link href="/smart" className="group">
            <div className="relative overflow-hidden rounded-3xl p-5 h-full"
              style={{ background: 'linear-gradient(135deg, #150d2a 0%, #1c1035 100%)', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl" />
              <div className="w-10 h-10 bg-violet-500/15 rounded-2xl flex items-center justify-center mb-3 border border-violet-500/20">
                <ShoppingBag className="w-5 h-5 text-violet-400" />
              </div>
              <p className="text-white font-black text-base leading-tight mb-1">賢く<br />使う</p>
              <p className="text-violet-400/60 text-xs">クーポン・旅行</p>
              <ChevronRight className="w-3 h-3 text-violet-400/40 absolute bottom-4 right-4" />
            </div>
          </Link>
        </div>

        {/* AIチャット */}
        <ChatWidget />

        {/* 今日のヒント */}
        <div className="rounded-3xl p-4 border border-blue-500/15"
          style={{ background: 'linear-gradient(135deg, #0d1628 0%, #0f1c35 100%)' }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/15 rounded-xl flex items-center justify-center text-base border border-blue-500/20 flex-shrink-0">
              💡
            </div>
            <div>
              <p className="text-blue-400 text-xs font-bold mb-1">今日のマネコヒント</p>
              <p className="text-white/60 text-xs leading-relaxed">{todayTip}</p>
            </div>
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}
