import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Wallet,
  Plane,
  ShieldCheck,
  MessageCircle,
  BadgeCheck,
  ChartNoAxesCombined,
} from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen overflow-hidden text-slate-900">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-140px] top-[-90px] h-[440px] w-[440px] rounded-full bg-blue-300/30 blur-[110px]" />
        <div className="absolute right-[-140px] top-[80px] h-[440px] w-[440px] rounded-full bg-cyan-300/30 blur-[110px]" />
        <div className="absolute bottom-[-140px] left-[30%] h-[280px] w-[280px] rounded-full bg-indigo-200/30 blur-[90px]" />
      </div>

      <header className="relative z-10 app-container flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-gold text-xl text-white shadow-lg">🐱</div>
          <div>
            <p className="text-xl font-black leading-none">マネコ</p>
            <p className="text-xs text-slate-500">AI Money Concierge</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            ログイン
          </Link>
          <Link href="/register" className="hidden rounded-xl gradient-gold px-4 py-2 text-sm font-bold text-white shadow-sm md:block">
            無料登録
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        <section className="app-container grid min-h-[88vh] grid-cols-1 items-center gap-12 py-10 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              金欠から資産形成まで、AIが伴走
            </div>
            <h1 className="text-[clamp(2.8rem,7vw,6.3rem)] font-black leading-[0.98] tracking-tight">
              <span className="gradient-gold-text">お金の不安</span>を
              <br />
              <span className="text-slate-900">今日で終わらせる。</span>
            </h1>
            <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-slate-600 md:text-lg">
              AIに一言送るだけで、今のあなたに合った「増やす」「賢く使う」アクションを最短提案。
              面倒な記録・設定なしで、続くお金習慣を作ります。
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl gradient-gold px-8 text-base font-black text-white shadow-lg transition hover:opacity-95 md:h-[58px]"
              >
                無料で始める
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-14 items-center justify-center rounded-2xl border border-slate-300 bg-white px-8 text-base font-semibold text-slate-700 transition hover:bg-slate-50 md:h-[58px]"
              >
                既に登録済みの方
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> クレカ不要</span>
              <span className="inline-flex items-center gap-1.5"><Wallet className="h-4 w-4 text-blue-500" /> 登録30秒</span>
              <span className="inline-flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-cyan-500" /> 毎日アクション提案</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_22px_55px_rgba(15,23,42,0.12)]">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-slate-900">マネコダッシュボード</p>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">Live</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <MockStat title="獲得ポイント" value="18,250 pt" tone="blue" />
                <MockStat title="累計節約額" value="¥64,300" tone="emerald" />
                <MockStat title="今月の行動" value="24 actions" tone="cyan" />
                <MockStat title="達成率" value="78%" tone="indigo" />
              </div>
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">AI提案</p>
                <p className="mt-1.5 text-[15px] font-semibold leading-relaxed text-slate-900">「固定費見直し」で今月 +5,800円改善見込み</p>
                <div className="mt-2.5 flex items-center gap-2 text-sm text-slate-600">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  3分で完了するチェックリストを開始
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 hidden rounded-2xl border border-blue-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-blue-700 shadow-sm md:block">
              今週の改善額 +¥12,400
            </div>
          </div>
        </section>

        <section className="app-container pb-20">
          <div className="mb-6 text-center">
            <p className="text-sm font-semibold text-blue-700">Why Maneco</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">迷わず行動できる設計</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <ValueCard
              icon={<BadgeCheck className="h-5 w-5 text-blue-600" />}
              title="思考停止でも使える"
              desc="AIチャットと2つの行動ボタンだけ。迷わない導線で毎日続く。"
            />
            <ValueCard
              icon={<Plane className="h-5 w-5 text-cyan-600" />}
              title="予算内でちゃんと遊べる"
              desc="旅行・買い物を我慢しない。予算逆算でムリなく楽しむ設計。"
            />
            <ValueCard
              icon={<ChartNoAxesCombined className="h-5 w-5 text-emerald-600" />}
              title="成果が可視化される"
              desc="節約額と獲得額を一目で確認。達成感が積み上がるUI。"
            />
          </div>
        </section>
      </main>
    </div>
  )
}

function ValueCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50">{icon}</div>
      <p className="mt-4 text-lg font-black text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
    </div>
  )
}

function MockStat({
  title,
  value,
  tone,
}: {
  title: string
  value: string
  tone: 'blue' | 'emerald' | 'cyan' | 'indigo'
}) {
  const toneClass =
    tone === 'blue'
      ? 'border-blue-200 bg-blue-50 text-blue-700'
      : tone === 'emerald'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : tone === 'cyan'
      ? 'border-cyan-200 bg-cyan-50 text-cyan-700'
      : 'border-indigo-200 bg-indigo-50 text-indigo-700'

  return (
    <div className={`rounded-2xl border p-3.5 ${toneClass}`}>
      <p className="text-xs opacity-75">{title}</p>
      <p className="mt-1.5 text-[15px] font-black">{value}</p>
    </div>
  )
}
