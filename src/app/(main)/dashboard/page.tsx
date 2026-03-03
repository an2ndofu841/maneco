import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CharacterCard from '@/components/dashboard/CharacterCard'
import StatsGrid from '@/components/dashboard/StatsGrid'
import ChatWidget from '@/components/chat/ChatWidget'
import Link from 'next/link'
import { TrendingUp, ShoppingBag, Bell, ChevronRight, Settings } from 'lucide-react'
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
    <div className="min-h-screen pb-24 md:pb-12">
      <div className="app-container pt-8 md:pt-12">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">おかえりなさい 👋</p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{profile.nickname}</h1>
          </div>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <Link href="/profile" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左カラム (メインコンテンツ) */}
          <div className="lg:col-span-8 space-y-6">
            {/* キャラクターカード */}
            <CharacterCard user={profile} />
            
            {/* スタッツグリッド */}
            <StatsGrid user={profile} />

            {/* アクションカード */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/earn" className="group">
                <div className="bento-card p-6 rounded-3xl h-full relative overflow-hidden transition-all hover:border-emerald-200">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-60" />
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">お金を増やす</h3>
                    <p className="text-sm text-slate-500 mb-4">アンケートや査定で<br/>賢くお小遣い稼ぎ</p>
                    <div className="flex items-center text-emerald-600 text-sm font-bold">
                      今すぐ始める <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/smart" className="group">
                <div className="bento-card p-6 rounded-3xl h-full relative overflow-hidden transition-all hover:border-blue-200">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-60" />
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">賢く使う</h3>
                    <p className="text-sm text-slate-500 mb-4">旅行プラン作成や<br/>クーポン活用</p>
                    <div className="flex items-center text-blue-600 text-sm font-bold">
                      プランを見る <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* 右カラム (チャット & ヒント) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bento-card p-1 rounded-3xl h-[500px] lg:h-full min-h-[500px] flex flex-col">
              <ChatWidget />
            </div>
            
            <div className="bento-card p-5 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-xl flex-shrink-0">
                💡
              </div>
              <div>
                <p className="text-xs font-bold text-amber-600 mb-1">今日のマネコヒント</p>
                <p className="text-sm text-slate-600 leading-relaxed">{todayTip}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
