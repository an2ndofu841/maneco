import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Sparkles, TrendingUp, Wallet, Plane, ShieldCheck } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen overflow-hidden bg-[#0f0f14] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-10 top-[-10%] h-[460px] w-[460px] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute -right-24 top-[12%] h-[520px] w-[520px] rounded-full bg-orange-500/8 blur-[120px]" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 pb-4 pt-8 md:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-gold text-xl">🐱</div>
          <div>
            <p className="text-lg font-black leading-tight">マネコ</p>
            <p className="text-[11px] text-white/35">AI Money Concierge</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:text-white">
            ログイン
          </Link>
          <Link href="/register" className="hidden rounded-full gradient-gold px-4 py-2 text-sm font-bold text-black md:block">
            無料登録
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-6 pb-14 md:grid-cols-2 md:gap-10 md:px-10">
        <section className="pt-4 md:pt-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            金欠から資産形成まで、AIが伴走
          </div>
          <h1 className="text-4xl font-black leading-[1.1] md:text-6xl">
            <span className="gradient-gold-text">お金の不安</span>を
            <br />
            <span>今日で終わらせる。</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
            「今どうする？」に特化したマネーコンシェルジュ。入力が苦手でも、
            AIに一言送るだけで節約・稼ぐ・使うを最短ルートで提案します。
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-2xl gradient-gold px-6 py-3.5 text-sm font-black text-black shadow-lg transition hover:opacity-90"
            >
              無料で始める
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-6 py-3.5 text-sm font-medium text-white/80 transition hover:bg-white/5"
            >
              既に登録済みの方
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-4 text-xs text-white/45">
            <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> クレカ不要</span>
            <span className="inline-flex items-center gap-1"><Wallet className="h-3.5 w-3.5 text-amber-400" /> 登録30秒</span>
            <span className="inline-flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5 text-violet-400" /> 毎日アクション提案</span>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 md:pt-6">
          <div className="col-span-2 rounded-3xl border border-white/10 bg-[#1a1a24] p-5">
            <p className="text-xs text-white/40">最短導線</p>
            <p className="mt-1 text-lg font-black">AIに丸投げ / ボタンで即行動</p>
            <p className="mt-2 text-sm text-white/50">難しい設定なし。起動直後に迷わない設計で継続しやすい。</p>
          </div>
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/8 p-5">
            <p className="text-2xl">💸</p>
            <p className="mt-2 text-sm font-bold">スキマ時間で稼ぐ</p>
            <p className="mt-1 text-xs text-white/55">アンケート、リサーチ案件</p>
          </div>
          <div className="rounded-3xl border border-violet-500/20 bg-violet-500/8 p-5">
            <p className="text-2xl">✈️</p>
            <p className="mt-2 text-sm font-bold">予算逆算トラベル</p>
            <p className="mt-1 text-xs text-white/55">AI旅行プランナー</p>
          </div>
          <div className="rounded-3xl border border-blue-500/20 bg-blue-500/8 p-5">
            <p className="text-2xl">🎟️</p>
            <p className="mt-2 text-sm font-bold">クーポン最適化</p>
            <p className="mt-1 text-xs text-white/55">属性に合わせて自動提案</p>
          </div>
          <div className="rounded-3xl border border-amber-500/20 bg-amber-500/8 p-5">
            <p className="text-2xl">📈</p>
            <p className="mt-2 text-sm font-bold">成長が見える化</p>
            <p className="mt-1 text-xs text-white/55">節約額・獲得額を可視化</p>
          </div>
          <div className="col-span-2 rounded-3xl border border-white/10 bg-[#1a1a24] p-5">
            <p className="text-xs text-white/40">こんな悩みに</p>
            <p className="mt-1 text-base font-bold">「月末だけ苦しい」「旅行を諦めたくない」「投資を始めたい」</p>
            <p className="mt-2 text-sm text-white/55">AIが今日できるアクションを3つに絞って提示します。</p>
          </div>
        </section>
      </main>
    </div>
  )
}
