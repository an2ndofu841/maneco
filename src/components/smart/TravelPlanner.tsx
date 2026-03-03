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
      <div className="space-y-4">
        {/* サマリー */}
        <div className="rounded-3xl p-5 border border-violet-500/20"
          style={{ background: 'linear-gradient(135deg, #150d2a 0%, #1c1035 100%)' }}>
          <p className="text-violet-400/60 text-xs mb-1">AIが作成した旅行プラン</p>
          <h2 className="text-white font-black text-2xl mb-1">📍 {plan.destination}</h2>
          <p className="text-white/40 text-sm">{days}泊{parseInt(days) + 1}日 · 予算¥{parseInt(budget).toLocaleString()}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="bg-white/5 rounded-2xl p-3 border border-white/8">
              <p className="text-white/30 text-[10px]">推定総費用</p>
              <p className="text-white font-black text-lg">¥{plan.total_estimated_cost?.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/8">
              <p className="text-white/30 text-[10px]">節約の余裕</p>
              <p className="text-amber-400 font-black text-lg">
                ¥{(parseInt(budget) - (plan.total_estimated_cost ?? 0)).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* 日程 */}
        <div className="space-y-2">
          {plan.itinerary?.map((day) => (
            <div key={day.day} className="rounded-3xl overflow-hidden border border-white/8" style={{ background: '#1a1a24' }}>
              <button
                onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                className="w-full flex items-center gap-3 p-4"
              >
                <div className="w-8 h-8 gradient-gold rounded-full flex items-center justify-center text-black font-black text-sm flex-shrink-0">
                  {day.day}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-white text-sm">{day.day}日目</p>
                  <p className="text-white/30 text-xs">{day.accommodation?.name} ¥{day.accommodation?.cost?.toLocaleString()}</p>
                </div>
                {expandedDay === day.day
                  ? <ChevronUp className="w-4 h-4 text-white/25" />
                  : <ChevronDown className="w-4 h-4 text-white/25" />
                }
              </button>

              {expandedDay === day.day && (
                <div className="px-4 pb-4 space-y-3 border-t border-white/5">
                  <div className="pt-3 space-y-3">
                    {day.activities?.map((activity, i) => (
                      <div key={i} className="flex gap-3">
                        <p className="text-white/25 text-xs w-12 flex-shrink-0 pt-0.5">{activity.time}</p>
                        <div className="flex-1 border-l border-violet-500/20 pl-3">
                          <p className="text-white text-sm font-medium">{activity.activity}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-violet-400 text-xs font-bold">¥{activity.cost?.toLocaleString()}</span>
                            <span className="text-white/30 text-xs">{activity.tip}</span>
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
        <div className="rounded-3xl p-4 border border-amber-500/15"
          style={{ background: 'linear-gradient(135deg, #1a1005 0%, #1e1408 100%)' }}>
          <p className="text-amber-400 text-xs font-bold mb-2">💡 節約ヒント</p>
          <ul className="space-y-1.5">
            {plan.saving_tips?.map((tip, i) => (
              <li key={i} className="text-white/50 text-xs flex items-start gap-2">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">✓</span>{tip}
              </li>
            ))}
          </ul>
        </div>

        {/* 予約サイト */}
        <div className="space-y-2">
          {plan.recommended_booking_sites?.map((site, i) => (
            <a key={i} href={site.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl p-3.5 border border-white/8 hover:border-white/15 transition-all"
              style={{ background: '#1a1a24' }}>
              <div className="flex-1">
                <p className="font-bold text-white text-sm">{site.name}</p>
                <p className="text-violet-400 text-xs">{site.discount_info}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-white/25" />
            </a>
          ))}
        </div>

        <button onClick={() => setPlan(null)}
          className="w-full border border-white/10 py-3 rounded-2xl text-white/40 text-sm font-medium hover:bg-white/5 transition-all">
          ← 条件を変えて再生成
        </button>

        <div className="h-4" />
      </div>
    )
  }

  return (
    <div className="rounded-3xl p-5 border border-white/8 space-y-5" style={{ background: '#1a1a24' }}>
      <div className="text-center">
        <div className="text-3xl mb-2">✈️</div>
        <h2 className="font-black text-white text-lg">予算内AIトラベルプランナー</h2>
        <p className="text-white/35 text-xs mt-1">条件を入れるだけで最適プランを自動生成</p>
      </div>

      {/* 目的地 */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-medium text-white/50 mb-2">
          <MapPin className="w-3.5 h-3.5 text-violet-400" />行き先
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-2">
          {POPULAR_DESTINATIONS.map((dest) => (
            <button key={dest} onClick={() => setDestination(dest)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all ${
                destination === dest
                  ? 'bg-violet-500/20 text-violet-400 border-violet-500/40'
                  : 'text-white/30 border-white/10 hover:border-white/20'
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
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/40 transition-all"
        />
      </div>

      {/* 予算 */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-medium text-white/50 mb-2">
          <DollarSign className="w-3.5 h-3.5 text-violet-400" />予算（全込み）
        </label>
        <div className="relative mb-2">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">¥</span>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="30000"
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-7 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/40 transition-all"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {['10000', '30000', '50000', '100000'].map((amount) => (
            <button key={amount} onClick={() => setBudget(amount)}
              className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                budget === amount
                  ? 'bg-violet-500/15 text-violet-400 border-violet-500/30'
                  : 'text-white/25 border-white/8 hover:border-white/15'
              }`}>
              ¥{parseInt(amount) / 10000}万
            </button>
          ))}
        </div>
      </div>

      {/* 日数 */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-medium text-white/50 mb-2">
          <Calendar className="w-3.5 h-3.5 text-violet-400" />日数
        </label>
        <div className="flex gap-2">
          {['1', '2', '3', '4', '5'].map((d) => (
            <button key={d} onClick={() => setDays(d)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                days === d
                  ? 'gradient-gold text-black border-transparent'
                  : 'text-white/30 border-white/10 hover:border-white/20'
              }`}>
              {d}泊{parseInt(d) + 1}日
            </button>
          ))}
        </div>
      </div>

      {/* こだわり */}
      <div>
        <label className="text-xs font-medium text-white/50 mb-2 block">こだわり（任意）</label>
        <input
          type="text"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder="例：グルメ重視、温泉に入りたい..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/40 transition-all"
        />
      </div>

      {error && <p className="text-red-400 text-xs text-center">{error}</p>}

      <button
        onClick={handleGenerate}
        disabled={!destination || !budget || loading}
        className="w-full gradient-gold text-black font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-30 hover:opacity-90 transition-all glow-gold-sm"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" />AIがプラン作成中...</>
        ) : (
          <><Sparkles className="w-4 h-4" />AIで旅行プランを作成</>
        )}
      </button>
    </div>
  )
}
