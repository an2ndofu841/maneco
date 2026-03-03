import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Sparkles, TrendingUp, Wallet, Plane, ShieldCheck } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen overflow-hidden text-slate-900">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-120px] top-[-80px] h-[360px] w-[360px] rounded-full bg-blue-300/30 blur-[90px]" />
        <div className="absolute right-[-120px] top-[120px] h-[360px] w-[360px] rounded-full bg-cyan-300/30 blur-[90px]" />
      </div>

      <header className="relative z-10 app-container flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-gold text-xl">🐱</div>
          <div>
            <p className="text-lg font-black">マネコ</p>
            <p className="text-xs text-slate-500">AI Money Concierge</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            ログイン
          </Link>
          <Link href="/register" className="hidden rounded-xl gradient-gold px-4 py-2 text-sm font-bold text-white md:block">
            無料登録
          </Link>
        </div>
      </header>

      <main className="relative z-10 app-container grid grid-cols-1 gap-8 pb-16 pt-4 lg:grid-cols-2 lg:items-center">
        <section>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700">
            <Sparkles className="h-3.5 w-3.5" />
            金欠から資産形成まで、AIが伴走
          </div>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            <span className="gradient-gold-text">お金の不安</span>を
            <br />
            <span className="text-slate-900">今日で終わらせる。</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
            AIに話すだけで、今のあなたに合った「増やす」「賢く使う」アクションを
            最短で提案。面倒な記録や設定なしで、続くお金習慣を作ります。
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-2xl gradient-gold px-6 py-3.5 text-sm font-black text-white glow-gold-sm">
              無料で始める
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700">
              既に登録済みの方
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> クレカ不要</span>
            <span className="inline-flex items-center gap-1"><Wallet className="h-3.5 w-3.5 text-blue-500" /> 登録30秒</span>
            <span className="inline-flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5 text-cyan-500" /> 毎日アクション提案</span>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="col-span-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs text-slate-500">最短導線</p>
            <p className="mt-1 text-xl font-black text-slate-900">AIに丸投げ / ボタンで即行動</p>
            <p className="mt-2 text-sm text-slate-600">起動直後に迷わない、金融初心者でも使えるUI設計。</p>
          </div>
          <FeatureCard emoji="💸" title="スキマ時間で稼ぐ" desc="アンケート・リサーチ案件" border="border-emerald-200" />
          <FeatureCard emoji="✈️" title="予算逆算トラベル" desc="AI旅行プランナー" border="border-blue-200" />
          <FeatureCard emoji="🎟️" title="クーポン最適化" desc="属性に合わせて提案" border="border-cyan-200" />
          <FeatureCard emoji="📈" title="成長の見える化" desc="節約額・獲得額を表示" border="border-indigo-200" />
        </section>
      </main>
    </div>
  )
}

function FeatureCard({
  emoji,
  title,
  desc,
  border,
}: {
  emoji: string
  title: string
  desc: string
  border: string
}) {
  return (
    <div className={`rounded-3xl border bg-white p-5 shadow-sm ${border}`}>
      <p className="text-2xl">{emoji}</p>
      <p className="mt-2 text-sm font-bold text-slate-900">{title}</p>
      <p className="mt-1 text-xs text-slate-600">{desc}</p>
    </div>
  )
}
