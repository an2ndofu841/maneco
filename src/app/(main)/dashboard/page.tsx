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
    <div className="min-h-screen bg-transparent">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute right-[-10%] top-[-10%] h-[320px] w-[320px] rounded-full bg-blue-300/25 blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 md:px-0">
        <div className="flex items-center justify-between px-1 pb-4 pt-8 md:pt-10">
          <div>
            <p className="text-xs text-slate-500">おかえり 👋</p>
            <h1 className="text-2xl font-black text-slate-900 md:text-3xl">{profile.nickname}</h1>
          </div>
          <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Bell className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
          <section className="space-y-4">
            <CharacterCard user={profile} />
            <StatsGrid user={profile} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link href="/earn" className="group">
                <div
                  className="relative h-full overflow-hidden rounded-3xl p-5"
                  style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '1px solid #a7f3d0' }}
                >
                  <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-300/40 blur-2xl" />
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-300 bg-white/70">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <p className="mb-1 text-base font-black leading-tight text-slate-900">お金を<br />増やす</p>
                  <p className="text-xs text-emerald-700">アンケートで稼ぐ</p>
                  <ChevronRight className="absolute bottom-4 right-4 h-3 w-3 text-emerald-700/60" />
                </div>
              </Link>

              <Link href="/smart" className="group">
                <div
                  className="relative h-full overflow-hidden rounded-3xl p-5"
                  style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '1px solid #bfdbfe' }}
                >
                  <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-blue-300/40 blur-2xl" />
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-300 bg-white/70">
                    <ShoppingBag className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="mb-1 text-base font-black leading-tight text-slate-900">賢く<br />使う</p>
                  <p className="text-xs text-blue-700">クーポン・旅行</p>
                  <ChevronRight className="absolute bottom-4 right-4 h-3 w-3 text-blue-700/60" />
                </div>
              </Link>
            </div>
          </section>

          <aside className="space-y-4">
            <ChatWidget />
            <div className="rounded-3xl border border-blue-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-base">
                  💡
                </div>
                <div>
                  <p className="mb-1 text-xs font-bold text-blue-700">今日のマネコヒント</p>
                  <p className="text-xs leading-relaxed text-slate-600">{todayTip}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}
