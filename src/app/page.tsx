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
  Zap,
  PieChart,
  CreditCard
} from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ナビゲーション */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 border-b border-white/20">
        <div className="app-container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-lg shadow-md">
              🐱
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">maneco</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              ログイン
            </Link>
            <Link
              href="/register"
              className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
            >
              無料で始める
            </Link>
          </div>
        </div>
      </nav>

      {/* ヒーローセクション */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="app-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-medium mb-8 animate-fade-in-up">
              <Sparkles className="w-3 h-3" />
              <span>AIがお金の悩みを0秒で解決</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
              お金の不安を、<br className="hidden md:block" />
              <span className="text-gradient-primary">シンプルに整える。</span>
            </h1>
            
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              「今月ピンチ」「旅行に行きたい」... その悩み、AIに話すだけ。<br className="hidden md:block" />
              面倒な家計簿は不要。あなたに最適なアクションを即座に提案します。
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="btn-primary h-12 px-8 rounded-full flex items-center gap-2 font-semibold text-base w-full sm:w-auto justify-center"
              >
                今すぐ始める
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="h-12 px-8 rounded-full flex items-center gap-2 font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center"
              >
                ログイン
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>完全無料</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>登録30秒</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 背景装飾 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      </section>

      {/* Bento Grid セクション */}
      <section className="py-20 bg-white/50 border-t border-slate-100">
        <div className="app-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              必要な機能だけを、<br />
              美しくパッケージ。
            </h2>
            <p className="text-slate-600">
              複雑な機能はいりません。直感的に使える3つのコア機能。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* カード 1: AIチャット (大) */}
            <div className="bento-card md:col-span-2 p-8 rounded-3xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">AIコンシェルジュ</h3>
                <p className="text-slate-600 max-w-md">
                  「来月の旅行予算を作りたい」「今すぐ3000円節約したい」<br />
                  どんな悩みもチャットで相談。具体的なアクションプランを提示します。
                </p>
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <MessageCircle className="w-64 h-64" />
              </div>
            </div>

            {/* カード 2: 稼ぐ (小) */}
            <div className="bento-card p-8 rounded-3xl relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">スキマで稼ぐ</h3>
              <p className="text-slate-600 text-sm">
                アンケートや不用品査定で、<br />
                賢くお小遣い稼ぎ。
              </p>
            </div>

            {/* カード 3: 使う (小) */}
            <div className="bento-card p-8 rounded-3xl relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mb-6">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">賢く使う</h3>
              <p className="text-slate-600 text-sm">
                予算逆算型の旅行プランナーや<br />
                最適化されたクーポン。
              </p>
            </div>

            {/* カード 4: 可視化 (大) */}
            <div className="bento-card md:col-span-2 p-8 rounded-3xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6">
                  <PieChart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">成長が見える化</h3>
                <p className="text-slate-600 max-w-md">
                  節約した額、稼いだ額を自動で集計。<br />
                  キャラクターの成長と共に、あなたの資産形成スキルも向上します。
                </p>
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <TrendingUp className="w-64 h-64" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA セクション */}
      <section className="py-24">
        <div className="app-container">
          <div className="bg-slate-900 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                お金の不安を、<br />
                今日で終わりにしませんか？
              </h2>
              <p className="text-slate-400 mb-10 text-lg">
                クレジットカード登録不要。30秒でアカウント作成。<br />
                まずはAIに「こんにちは」と話しかけてみてください。
              </p>
              <Link
                href="/register"
                className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-white text-slate-900 font-bold text-base hover:bg-indigo-50 transition-colors"
              >
                無料でアカウント作成
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            
            {/* 装飾 */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-50%] left-[-20%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[100px]" />
              <div className="absolute bottom-[-50%] right-[-20%] w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[100px]" />
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="app-container flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white text-xs">
              🐱
            </div>
            <span className="font-bold text-slate-900">maneco</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 maneco. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
