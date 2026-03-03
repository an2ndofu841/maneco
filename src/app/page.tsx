import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* ヒーロー */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-500/10" />
        <div className="relative px-6 pt-20 pb-12 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl shadow-xl mb-6">
            <span className="text-5xl">🐱</span>
          </div>
          <h1 className="text-4xl font-black text-gray-800 mb-2">マネコ</h1>
          <p className="text-gray-500 text-sm mb-6">招き猫AIコンシェルジュ</p>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8 text-left">
            <p className="text-gray-700 font-bold text-lg leading-relaxed mb-4">
              金欠から資産形成まで。<br />
              お金の「どうしよう？」を<br />
              <span className="text-amber-500">0秒で解決</span>するAIコンシェルジュ
            </p>
            <div className="space-y-2">
              {[
                '💰 スキマ時間にサクッと稼ぐ',
                '🎯 AIが予算内の旅行プランを作成',
                '🛍️ パーソナライズされたクーポン',
                '🎮 キャラ育成でモチベUP！',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/register"
              className="block w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all"
            >
              無料で始める →
            </Link>
            <Link
              href="/login"
              className="block w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-bold text-base hover:bg-gray-50 transition-all"
            >
              ログイン
            </Link>
          </div>
        </div>
      </div>

      {/* 機能紹介 */}
      <div className="px-6 py-8 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-6">マネコでできること</h2>

        {[
          {
            emoji: '🤖',
            title: 'AIコンシェルジュ',
            desc: '「今月ピンチ」と話しかけるだけ。AIが状況を理解して最適なアクションを提案します。',
            color: 'from-amber-50 to-orange-50 border-amber-200',
          },
          {
            emoji: '💸',
            title: 'スキマ時間で稼ぐ',
            desc: 'アンケートや口コミ案件に答えてポイントGET。不用品をAI査定して今日売ろう！',
            color: 'from-emerald-50 to-teal-50 border-emerald-200',
          },
          {
            emoji: '✈️',
            title: 'AIトラベルプランナー',
            desc: '予算・日数を入れるだけで最適な旅行プランを自動生成。節約ヒント付き！',
            color: 'from-violet-50 to-purple-50 border-violet-200',
          },
          {
            emoji: '🎮',
            title: 'キャラ育成ゲーム',
            desc: '節約・稼働するたびにキャラが成長。毎日開くモチベーションをゲーム感覚で。',
            color: 'from-blue-50 to-indigo-50 border-blue-200',
          },
        ].map(({ emoji, title, desc, color }) => (
          <div key={title} className={`bg-gradient-to-br ${color} rounded-2xl p-4 border`}>
            <div className="flex items-start gap-3">
              <span className="text-3xl">{emoji}</span>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 pb-12">
        <Link
          href="/register"
          className="block w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-4 rounded-2xl font-black text-lg shadow-lg text-center"
        >
          今すぐ無料登録 🐱
        </Link>
        <p className="text-center text-xs text-gray-400 mt-3">クレジットカード不要・登録30秒</p>
      </div>
    </div>
  )
}
