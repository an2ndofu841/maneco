import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#0f0f14] text-white overflow-hidden">
      {/* 背景装飾 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600/8 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-amber-400/5 rounded-full blur-[80px]" />
      </div>

      {/* ヘッダー */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-xl shadow-lg">
            🐱
          </div>
          <span className="font-black text-lg tracking-tight">マネコ</span>
        </div>
        <Link
          href="/login"
          className="text-sm text-white/60 hover:text-white transition-colors border border-white/10 px-4 py-1.5 rounded-full hover:border-white/20"
        >
          ログイン
        </Link>
      </header>

      {/* ヒーローセクション */}
      <section className="relative z-10 px-6 pt-12 pb-16 text-center">
        {/* キャラアイコン */}
        <div className="relative inline-block mb-8">
          <div className="w-28 h-28 bg-gradient-to-br from-amber-400 via-orange-400 to-orange-600 rounded-[2rem] flex items-center justify-center text-6xl shadow-2xl animate-float mx-auto glow-gold">
            🐱
          </div>
          <div className="absolute -top-2 -right-2 bg-emerald-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
            AI
          </div>
        </div>

        {/* キャッチコピー */}
        <h1 className="text-4xl font-black leading-tight mb-4">
          <span className="gradient-gold-text">お金の不安</span>を<br />
          <span className="text-white">0秒で解決</span>
        </h1>
        <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-xs mx-auto">
          金欠から資産形成まで。AIが今すぐできる<br />アクションを提案するコンシェルジュアプリ
        </p>

        {/* CTAボタン */}
        <div className="space-y-3 max-w-sm mx-auto">
          <Link
            href="/register"
            className="block w-full gradient-gold text-black font-black text-base py-4 rounded-2xl shadow-lg glow-gold-sm hover:opacity-90 transition-all active:scale-[0.98]"
          >
            無料で始める →
          </Link>
          <Link
            href="/login"
            className="block w-full glass text-white/80 font-medium text-sm py-3.5 rounded-2xl hover:bg-white/10 transition-all"
          >
            すでにアカウントをお持ちの方
          </Link>
        </div>

        <p className="text-white/25 text-xs mt-4">登録30秒・クレジットカード不要</p>
      </section>

      {/* 機能カード */}
      <section className="relative z-10 px-4 pb-8">
        <p className="text-center text-white/40 text-xs font-medium tracking-widest mb-6 uppercase">Features</p>

        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-4">
          {/* AIコンシェルジュ */}
          <div className="glass rounded-2xl p-4 col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-xl">🤖</div>
              <div>
                <p className="font-bold text-sm">AIコンシェルジュ</p>
                <p className="text-white/40 text-xs">24時間相談し放題</p>
              </div>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">
              「今月ピンチ」と話しかけるだけ。GPT-4がお金の状況を分析し、今日できるアクションを提案します。
            </p>
          </div>

          {/* 稼ぐ */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
            <div className="text-2xl mb-2">💸</div>
            <p className="font-bold text-sm mb-1">スキマ時間<br />で稼ぐ</p>
            <p className="text-white/40 text-xs">アンケートで即ポイント</p>
          </div>

          {/* 旅行 */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
            <div className="text-2xl mb-2">✈️</div>
            <p className="font-bold text-sm mb-1">AI旅行<br />プランナー</p>
            <p className="text-white/40 text-xs">予算内で最適プラン</p>
          </div>

          {/* クーポン */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
            <div className="text-2xl mb-2">🎫</div>
            <p className="font-bold text-sm mb-1">パーソナル<br />クーポン</p>
            <p className="text-white/40 text-xs">あなた向けに最適化</p>
          </div>

          {/* キャラ育成 */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20">
            <div className="text-2xl mb-2">🎮</div>
            <p className="font-bold text-sm mb-1">キャラ育成<br />ゲーム</p>
            <p className="text-white/40 text-xs">節約するたび成長</p>
          </div>
        </div>

        {/* 社会的証明っぽいUI */}
        <div className="max-w-sm mx-auto glass rounded-2xl p-4 flex items-center gap-4">
          <div className="flex -space-x-2">
            {['🐱','😺','😸','🐈'].map((e, i) => (
              <div key={i} className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-2 border-[#0f0f14] flex items-center justify-center text-sm">
                {e}
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-bold">毎日コツコツ節約中 🎉</p>
            <p className="text-white/40 text-[10px]">マネコユーザー急増中</p>
          </div>
        </div>
      </section>

      {/* 最終CTA */}
      <section className="relative z-10 px-6 py-10">
        <div className="max-w-sm mx-auto text-center">
          <p className="gradient-gold-text font-black text-2xl mb-2">今日から始めよう</p>
          <p className="text-white/40 text-xs mb-6">招き猫が、あなたのお金を守ります 🐱</p>
          <Link
            href="/register"
            className="block w-full gradient-gold text-black font-black text-base py-4 rounded-2xl shadow-xl glow-gold hover:opacity-90 transition-all active:scale-[0.98]"
          >
            🐱 マネコを始める（無料）
          </Link>
        </div>
      </section>
    </div>
  )
}
