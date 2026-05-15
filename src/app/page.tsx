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
  Camera,
  Ticket,
  Brain,
  Target,
  CheckCircle2,
  Clock,
  HeartHandshake,
  MapPin,
  Star,
  Utensils,
  ShoppingBag,
  Smartphone,
  TrendingDown,
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
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
        <div className="app-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-medium mb-8 animate-fade-in-up">
              <Sparkles className="w-3 h-3" />
              <span>AIマネーコンシェルジュ</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
              お金の悩みは、<br className="hidden md:block" />
              <span className="text-gradient-primary">話すだけで片付く。</span>
            </h1>

            <p className="text-lg text-slate-600 mb-4 max-w-2xl mx-auto leading-relaxed">
              <span className="font-semibold text-slate-900">使う・貯める・稼ぐ</span> をAIがまるごとサポート。<br className="hidden md:block" />
              家計簿いらず、面倒な入力ゼロ。チャットで相談するだけで、今日からできる行動プランが届きます。
            </p>

            <p className="text-sm text-slate-500 mb-10">
              「来月ピンチ…」「旅行の予算組みたい」「あと3,000円稼ぎたい」── そんな悩みも、3秒で解決。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="btn-primary h-12 px-8 rounded-full flex items-center gap-2 font-semibold text-base w-full sm:w-auto justify-center"
              >
                無料でAIに相談してみる
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="h-12 px-8 rounded-full flex items-center gap-2 font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center"
              >
                ログイン
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>完全無料</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>登録30秒</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                <span>クレカ登録不要</span>
              </div>
            </div>
          </div>
        </div>

        {/* 背景装飾 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      </section>

      {/* 共感セクション: 3つの悩み・ひとつの答え */}
      <section className="py-20 border-t border-slate-100">
        <div className="app-container">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-indigo-600 mb-3 tracking-wide">WHY MANECO</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              そのお金の悩み、<br className="md:hidden" />
              バラバラに解決していませんか？
            </h2>
            <p className="text-slate-600">
              家計簿アプリ、ポイ活アプリ、節約サイト… アプリを行ったり来たりするのは、もう終わり。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {/* 悩み1 */}
            <div className="bg-white/60 rounded-2xl p-6 border border-slate-200/60">
              <div className="text-3xl mb-3">😩</div>
              <h3 className="font-bold text-slate-900 mb-2">家計簿が続かない</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                毎日の入力が面倒で、3日でやめちゃう。結局、何にいくら使ったかわからない。
              </p>
            </div>
            {/* 悩み2 */}
            <div className="bg-white/60 rounded-2xl p-6 border border-slate-200/60">
              <div className="text-3xl mb-3">🤔</div>
              <h3 className="font-bold text-slate-900 mb-2">何から始めればいい？</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                節約・投資・ポイ活… 情報が多すぎて、自分に合うやり方がわからない。
              </p>
            </div>
            {/* 悩み3 */}
            <div className="bg-white/60 rounded-2xl p-6 border border-slate-200/60">
              <div className="text-3xl mb-3">💸</div>
              <h3 className="font-bold text-slate-900 mb-2">急な出費でピンチ</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                給料日まであと10日、財布が寂しい。誰かに具体的なアドバイスが欲しい。
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 mb-4">
              <Sparkles className="w-4 h-4" />
              <span>マネコなら、ぜんぶチャット1つで</span>
            </div>
            <p className="text-slate-700 text-lg leading-relaxed">
              AIがあなたの状況に合わせて、<span className="font-semibold text-slate-900">節約・収入アップ・賢い使い方</span>を提案。<br className="hidden md:block" />
              すぐ実行できる選択肢まで用意するので、悩む時間がゼロになります。
            </p>
          </div>
        </div>
      </section>

      {/* How it works: 3ステップ */}
      <section className="py-20 bg-white/50 border-t border-slate-100">
        <div className="app-container">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-indigo-600 mb-3 tracking-wide">HOW IT WORKS</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              3ステップで、お金が整う。
            </h2>
            <p className="text-slate-600">
              アプリを開いて、相談して、選ぶだけ。たったこれだけ。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="relative bento-card p-8 rounded-3xl">
              <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold tracking-wider">
                STEP 1
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-5 mt-2">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-lg">話しかける</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                「あと5,000円欲しい」「節約したい」など、あなたの言葉でそのまま入力。
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative bento-card p-8 rounded-3xl">
              <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold tracking-wider">
                STEP 2
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-5 mt-2">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-lg">AIが提案</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                あなた専用のアクションプランをAIが瞬時に作成。複数の選択肢から選べます。
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative bento-card p-8 rounded-3xl">
              <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold tracking-wider">
                STEP 3
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-5 mt-2">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-lg">その場で実行</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                提案された案件・クーポン・プランをワンタップで実行。成果は自動で記録されます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight: AI旅行プランナー */}
      <section className="py-20 border-t border-slate-100">
        <div className="app-container">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold mb-4">
              <Plane className="w-3 h-3" />
              <span>SPOTLIGHT 01</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              「予算◯万円で旅したい」が<br className="md:hidden" />ひとことで叶う。
            </h2>
            <p className="text-slate-600 leading-relaxed">
              出発地・目的地・予算・日数を入れるだけ。AIがリアルタイムの相場感で<br className="hidden md:block" />
              現実的な旅行プランを瞬時に組み立てます。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
            {/* 左: 機能の特長 */}
            <div className="space-y-5 order-2 lg:order-1">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">予算ピッタリで、ちゃんと収まる</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    交通費・宿泊・食事・観光まで全部込みで予算内に。「実は予算オーバーでした」がありません。
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">妥協点と「課金UP」も提示</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    「ここを我慢すればOK」「+3,000円でタクシー利用」など、自分で調整できる選択肢付き。
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">具体的な店名・施設名つき</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    「カフェ」ではなく「カフェ◯◯」と、すぐ予約できる粒度の旅程が日別で出ます。
                  </p>
                </div>
              </div>
            </div>

            {/* 右: モックUI */}
            <div className="bento-card rounded-3xl p-6 order-1 lg:order-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-rose-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-bold text-slate-500 tracking-wider">YOUR REQUEST</div>
                  <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    予算内 ✓
                  </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <span className="font-bold">東京 → 沖縄</span> ／ 予算 <span className="font-bold">¥50,000</span> ／ 2泊3日
                  </p>
                </div>

                <div className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl p-5 text-white mb-4">
                  <div className="text-[10px] font-bold opacity-80 tracking-wider mb-1">AI PLAN</div>
                  <h4 className="font-bold text-lg mb-3">南国リフレッシュ満喫プラン</h4>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-black">¥48,500</p>
                      <p className="text-xs opacity-80">合計（予算内）</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current opacity-60" />
                      </div>
                      <p className="text-[10px] opacity-80">総合スコア 4.5</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs px-3 py-2.5 rounded-xl bg-white border border-slate-100">
                    <span className="flex items-center gap-2 text-slate-700">
                      <Plane className="w-3 h-3 text-rose-500" />
                      <span className="font-medium">LCC往復（成田⇄那覇）</span>
                    </span>
                    <span className="font-bold text-slate-900">¥18,000</span>
                  </div>
                  <div className="flex items-center justify-between text-xs px-3 py-2.5 rounded-xl bg-white border border-slate-100">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span className="w-3 h-3 rounded bg-amber-400 inline-block" />
                      <span className="font-medium">宿泊×2泊（ゲストハウス）</span>
                    </span>
                    <span className="font-bold text-slate-900">¥16,000</span>
                  </div>
                  <div className="flex items-center justify-between text-xs px-3 py-2.5 rounded-xl bg-white border border-slate-100">
                    <span className="flex items-center gap-2 text-slate-700">
                      <Utensils className="w-3 h-3 text-orange-500" />
                      <span className="font-medium">食事・観光・移動</span>
                    </span>
                    <span className="font-bold text-slate-900">¥14,500</span>
                  </div>
                </div>

                <div className="mt-3 px-3 py-2 rounded-xl bg-amber-50 border border-amber-100 text-[11px] text-amber-700 leading-relaxed">
                  💡 <span className="font-bold">+3,000円</span>で空港からタクシー利用にアップグレード可能
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight: パーソナルクーポン */}
      <section className="py-20 bg-white/50 border-t border-slate-100">
        <div className="app-container">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-xs font-semibold mb-4">
              <Ticket className="w-3 h-3" />
              <span>SPOTLIGHT 02</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              使えるクーポンだけ、<br className="md:hidden" />
              欲しいタイミングで。
            </h2>
            <p className="text-slate-600 leading-relaxed">
              「ご飯」「日用品」「レジャー」── 利用シーンとあなたの居場所から、<br className="hidden md:block" />
              本当に使えるクーポンだけを厳選表示します。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
            {/* 左: モックUI */}
            <div className="bento-card rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-violet-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-60" />
              <div className="relative z-10">
                {/* シーンフィルタ */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-[10px] font-bold text-slate-500 tracking-wider">FILTER</div>
                  <div className="flex-1" />
                </div>
                <div className="flex gap-2 mb-5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-500/30">
                    <Utensils className="w-3 h-3" />
                    ご飯
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-slate-500 text-xs font-bold border border-slate-200">
                    <ShoppingBag className="w-3 h-3" />
                    日用品
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-slate-500 text-xs font-bold border border-slate-200">
                    <Plane className="w-3 h-3" />
                    レジャー
                  </div>
                </div>

                {/* 位置情報チップ */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold mb-4">
                  <MapPin className="w-3 h-3" />
                  <span>新宿区から500m以内</span>
                </div>

                {/* クーポンサンプル */}
                <div className="space-y-2">
                  <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-4 relative overflow-hidden">
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-black">
                      10% OFF
                    </div>
                    <p className="text-xs font-bold text-orange-700 mb-0.5">カフェ・ド・マネコ</p>
                    <p className="text-sm font-bold text-slate-900 mb-1">全品10%OFFクーポン</p>
                    <p className="text-[10px] text-slate-500">📍 新宿区 ・ ランチタイム限定</p>
                  </div>

                  <div className="rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 to-rose-50 p-4 relative overflow-hidden">
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-black">
                      ¥500 OFF
                    </div>
                    <p className="text-xs font-bold text-pink-700 mb-0.5">UberEats</p>
                    <p className="text-sm font-bold text-slate-900 mb-1">3,000円以上で500円OFF</p>
                    <p className="text-[10px] text-slate-500">📍 配達エリア対応</p>
                  </div>

                  <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-violet-50 p-4 relative overflow-hidden opacity-90">
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-purple-500 text-white text-[10px] font-black">
                      初月無料
                    </div>
                    <p className="text-xs font-bold text-purple-700 mb-0.5">IIJmio</p>
                    <p className="text-sm font-bold text-slate-900 mb-1">格安SIM 初月基本料無料</p>
                    <p className="text-[10px] text-slate-500">📱 スマホ代を月2,000円節約</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 右: 機能の特長 */}
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">位置情報ベースで「今すぐ使える」</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    今いる場所の近くで使えるクーポンだけを表示。スクロールしても使えないクーポンばかり…がありません。
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">利用シーンで一発フィルタ</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    「ご飯」「日用品」「レジャー」のタブをタップするだけ。今この瞬間に必要なクーポンだけが残ります。
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">固定費の削減提案も</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    通信費・保険・サブスクの乗り換え案件まで網羅。月々の支出を恒久的に下げるチャンスを逃しません。
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">✈️ 旅行</span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100">🍽️ グルメ</span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-100">🛍️ ショッピング</span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">💰 節税</span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">📱 通信</span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">📈 投資</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid セクション: 機能紹介 */}
      <section className="py-20 border-t border-slate-100">
        <div className="app-container">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-indigo-600 mb-3 tracking-wide">ALL FEATURES</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              あなたの財布の、最強の味方。
            </h2>
            <p className="text-slate-600">
              「使う・貯める・稼ぐ」のすべてを、ひとつのアプリで。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* カード 1: AIチャット (大) */}
            <div className="bento-card md:col-span-2 p-8 rounded-3xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">AIマネーコンシェルジュ</h3>
                <p className="text-slate-600 max-w-md leading-relaxed">
                  プロのファイナンシャルプランナーのような相談相手が、24時間あなたの隣に。<br />
                  予算配分、節約のコツ、副業のヒントまで、なんでも気軽に聞けます。
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>平均応答3秒。深夜の悩み相談にも。</span>
                </div>
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <MessageCircle className="w-64 h-64" />
              </div>
            </div>

            {/* カード 2: 不用品査定 */}
            <div className="bento-card p-8 rounded-3xl relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">AIカメラ査定</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                家にある不用品を撮るだけで、AIが瞬時に買取額を試算。
              </p>
            </div>

            {/* カード 3: アンケート案件 */}
            <div className="bento-card p-8 rounded-3xl relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mb-6">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">スキマ案件</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                通勤中の5分でできる、企業のアンケート・リサーチ案件。
              </p>
            </div>

            {/* カード 4: 旅行プランナー */}
            <div className="bento-card p-8 rounded-3xl relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mb-6">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">予算逆算プランナー</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                「5万円で2泊3日」など予算からAIが旅行プランを作成。
              </p>
            </div>

            {/* カード 5: クーポン */}
            <div className="bento-card p-8 rounded-3xl relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600 mb-6">
                <Ticket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">パーソナル特典</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                あなたの行動履歴に合わせた、本当に使えるクーポンだけを厳選。
              </p>
            </div>

            {/* カード 6: 成長可視化 (大) */}
            <div className="bento-card md:col-span-3 p-8 rounded-3xl relative overflow-hidden group">
              <div className="relative z-10 max-w-xl">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6">
                  <PieChart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">続けられる、成長の可視化</h3>
                <p className="text-slate-600 leading-relaxed">
                  節約した額・稼いだ額が自動で集計され、相棒キャラクターと一緒に成長。<br />
                  数字とゲーム感で、お金の習慣が自然と続きます。
                </p>
              </div>
              <div className="absolute right-[-30px] bottom-[-30px] opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <TrendingUp className="w-72 h-72" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* リアルな相談例 */}
      <section className="py-20 bg-white/50 border-t border-slate-100">
        <div className="app-container">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-indigo-600 mb-3 tracking-wide">EXAMPLE</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              こんな相談ができます。
            </h2>
            <p className="text-slate-600">
              ふだん友達に話すような感覚で、AIに頼ってみてください。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* 相談例 1 */}
            <div className="bento-card rounded-3xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
                  🙋
                </div>
                <div className="flex-1 bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <p className="text-sm text-slate-800 leading-relaxed">
                    給料日まであと8日。財布に2,000円しかない…どうしよう。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 ml-6">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-lg flex-shrink-0 shadow-md">
                  🐱
                </div>
                <div className="flex-1 bg-indigo-50 rounded-2xl rounded-tl-sm px-4 py-3 border border-indigo-100">
                  <p className="text-sm text-slate-800 leading-relaxed mb-2">
                    一緒に乗り切りましょう！今すぐ試せる3つのアクションを提案します:
                  </p>
                  <ul className="text-xs text-slate-700 space-y-1">
                    <li>① 5分のアンケート案件 (+500pt)</li>
                    <li>② 棚の不用品をAI査定 (推定 +3,000円)</li>
                    <li>③ 自炊レシピ&近所の特売情報</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 相談例 2 */}
            <div className="bento-card rounded-3xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
                  🧳
                </div>
                <div className="flex-1 bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <p className="text-sm text-slate-800 leading-relaxed">
                    秋に5万円で温泉旅行に行きたい。3ヶ月で貯めるには？
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 ml-6">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-lg flex-shrink-0 shadow-md">
                  🐱
                </div>
                <div className="flex-1 bg-indigo-50 rounded-2xl rounded-tl-sm px-4 py-3 border border-indigo-100">
                  <p className="text-sm text-slate-800 leading-relaxed mb-2">
                    月17,000円ペースでOK。あなた向けプランを用意しました:
                  </p>
                  <ul className="text-xs text-slate-700 space-y-1">
                    <li>① サブスク見直しで -3,200円/月</li>
                    <li>② 週3案件で +8,000円/月</li>
                    <li>③ 5万円以内のおすすめ温泉プラン3選</li>
                  </ul>
                </div>
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium mb-6">
                <HeartHandshake className="w-3 h-3" />
                <span>お金の不安に、ひとりで悩まない</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                今日から、AIがあなたの<br />
                お金のパートナーに。
              </h2>
              <p className="text-slate-400 mb-10 text-lg leading-relaxed">
                登録は30秒、クレジットカードは不要。<br className="hidden md:block" />
                まずはAIに「こんにちは」と話しかけてみてください。
              </p>
              <Link
                href="/register"
                className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-white text-slate-900 font-bold text-base hover:bg-indigo-50 transition-colors"
              >
                無料でアカウント作成
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <p className="text-slate-500 text-xs mt-6">
                ※ 完全無料 / 解約はいつでもワンタップ
              </p>
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
