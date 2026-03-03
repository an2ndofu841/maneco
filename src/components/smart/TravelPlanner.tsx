'use client'

import { useState } from 'react'
import { Loader2, MapPin, DollarSign, Calendar, Sparkles, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { TravelPlan } from '@/types'

const POPULAR_DESTINATIONS = ['東京', '京都', '大阪', '沖縄', '北海道', '福岡', '箱根', '鎌倉', 'ソウル', '台湾']

export default function TravelPlanner() {
  const [destination, setDestination] = useState('')
  const [budget, setBudget] = useState('')
  const [days, setDays] = useState('2')
  const [preferences, setPreferences] = useState('')
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<TravelPlan | null>(null)
  const [expandedDay, setExpandedDay] = useState<number | null>(1)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!destination || !budget) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, budget: parseInt(budget), days: parseInt(days), preferences }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setPlan(data.plan)
      setExpandedDay(1)
    } catch {
      setError('プランの生成に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  if (plan) {
    return (
      <div className="space-y-6">
        {/* サマリー */}
        <div className="bento-card p-6 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-none shadow-xl">
          <p className="text-indigo-200 text-xs font-bold mb-1">AIが作成した旅行プラン</p>
          <h2 className="text-3xl font-black mb-2">📍 {plan.destination}</h2>
          <p className="text-indigo-100 text-sm font-medium">{days}泊{parseInt(days) + 1}日 · 予算¥{parseInt(budget).toLocaleString()}</p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <p className="text-indigo-200 text-xs font-bold mb-1">推定総費用</p>
              <p className="text-white font-black text-xl">¥{plan.total_estimated_cost?.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <p className="text-indigo-200 text-xs font-bold mb-1">節約の余裕</p>
              <p className="text-emerald-400 font-black text-xl">
                ¥{(parseInt(budget) - (plan.total_estimated_cost ?? 0)).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* 日程 */}
        <div className="space-y-3">
          {plan.itinerary?.map((day) => (
            <div key={day.day} className="bento-card rounded-3xl overflow-hidden transition-all hover:border-indigo-200">
              <button
                onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                className="w-full flex items-center gap-4 p-5 text-left"
              >
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">
                  {day.day}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm">{day.day}日目</p>
                  <p className="text-slate-500 text-xs font-medium">{day.accommodation?.name} ¥{day.accommodation?.cost?.toLocaleString()}</p>
                </div>
                {expandedDay === day.day
                  ? <ChevronUp className="w-5 h-5 text-slate-400" />
                  : <ChevronDown className="w-5 h-5 text-slate-400" />
                }
              </button>

              {expandedDay === day.day && (
                <div className="px-5 pb-5 space-y-4 border-t border-slate-100">
                  <div className="pt-4 space-y-4">
                    {day.activities?.map((activity, i) => (
                      <div key={i} className="flex gap-4">
                        <p className="text-slate-400 text-xs font-bold w-12 flex-shrink-0 pt-1">{activity.time}</p>
                        <div className="flex-1 border-l-2 border-indigo-100 pl-4 py-1">
                          <p className="text-slate-900 text-sm font-bold mb-1">{activity.activity}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-indigo-600 text-xs font-bold bg-indigo-50 px-2 py-0.5 rounded-md">¥{activity.cost?.toLocaleString()}</span>
                            <span className="text-slate-500 text-xs">{activity.tip}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 節約ヒント */}
        <div className="bento-card p-5 rounded-3xl bg-amber-50 border-amber-100">
          <p className="text-amber-600 text-sm font-bold mb-3 flex items-center gap-2">
            <span className="text-lg">💡</span> 節約のヒント
          </p>
          <ul className="space-y-2">
            {plan.saving_tips?.map((tip, i) => (
              <li key={i} className="text-slate-700 text-xs font-medium flex items-start gap-2 leading-relaxed">
                <span className="text-amber-500 mt-0.5 flex-shrink-0 font-bold">✓</span>{tip}
              </li>
            ))}
          </ul>
        </div>

        {/* 予約サイト */}
        <div className="space-y-3">
          {plan.recommended_booking_sites?.map((site, i) => (
            <a key={i} href={site.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl p-4 bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{site.name}</p>
                <p className="text-slate-500 text-xs mt-0.5">{site.discount_info}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
            </a>
          ))}
        </div>

        <button onClick={() => setPlan(null)}
          className="w-full py-4 rounded-2xl text-slate-500 text-sm font-bold hover:bg-slate-100 transition-all">
          ← 条件を変えて再生成
        </button>
      </div>
    )
  }

  return (
    <div className="bento-card p-6 md:p-8 rounded-[2.5rem] space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4 text-indigo-600">
          ✈️
        </div>
        <h2 className="font-black text-slate-900 text-xl mb-2">予算内AIトラベルプランナー</h2>
        <p className="text-slate-500 text-sm">条件を入れるだけで<br/>あなただけの最適プランを自動生成</p>
      </div>

      <div className="space-y-6">
        {/* 目的地 */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3">
            <MapPin className="w-4 h-4 text-indigo-500" />行き先
          </label>
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-3">
            {POPULAR_DESTINATIONS.map((dest) => (
              <button key={dest} onClick={() => setDestination(dest)}
                className={`flex-shrink-0 text-xs px-4 py-2 rounded-full font-bold transition-all border ${
                  destination === dest
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}>
                {dest}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="または直接入力..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* 予算 */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3">
            <DollarSign className="w-4 h-4 text-indigo-500" />予算（全込み）
          </label>
          <div className="relative mb-3">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">¥</span>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="30000"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-5 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['10000', '30000', '50000', '100000'].map((amount) => (
              <button key={amount} onClick={() => setBudget(amount)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  budget === amount
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                }`}>
                ¥{parseInt(amount) / 10000}万
              </button>
            ))}
          </div>
        </div>

        {/* 日数 */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3">
            <Calendar className="w-4 h-4 text-indigo-500" />日数
          </label>
          <div className="flex gap-2">
            {['1', '2', '3', '4', '5'].map((d) => (
              <button key={d} onClick={() => setDays(d)}
                className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
                  days === d
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                }`}>
                {d}泊{parseInt(d) + 1}日
              </button>
            ))}
          </div>
        </div>

        {/* こだわり */}
        <div>
          <label className="text-xs font-bold text-slate-500 mb-3 block">こだわり（任意）</label>
          <input
            type="text"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="例：グルメ重視、温泉に入りたい..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-xl text-center border border-red-100">
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={!destination || !budget || loading}
          className="w-full btn-primary py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" />AIがプラン作成中...</>
          ) : (
            <><Sparkles className="w-5 h-5" />AIで旅行プランを作成</>
          )}
        </button>
      </div>
    </div>
  )
}
