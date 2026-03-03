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
        body: JSON.stringify({
          destination,
          budget: parseInt(budget.replace(/,/g, '')),
          days: parseInt(days),
          preferences,
        }),
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

  return (
    <div className="space-y-4">
      {!plan ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
          <div className="text-center">
            <p className="text-2xl mb-1">✈️</p>
            <h2 className="font-bold text-gray-800">予算内AIトラベルプランナー</h2>
            <p className="text-gray-500 text-xs mt-1">予算と行き先を入力するだけで最適なプランを作成！</p>
          </div>

          {/* 目的地 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1 text-violet-500" />
              行き先
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-2">
              {POPULAR_DESTINATIONS.map((dest) => (
                <button
                  key={dest}
                  onClick={() => setDestination(dest)}
                  className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    destination === dest
                      ? 'bg-violet-500 text-white border-violet-500'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-violet-300'
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="または直接入力（例：金沢、バンコク...）"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          {/* 予算 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <DollarSign className="inline w-4 h-4 mr-1 text-violet-500" />
              予算（交通費・宿泊・食事込み）
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="30000"
                className="w-full border border-gray-200 rounded-xl pl-7 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {['10000', '30000', '50000', '100000'].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBudget(amount)}
                  className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${
                    budget === amount
                      ? 'bg-violet-100 text-violet-700 border-violet-300'
                      : 'text-gray-500 border-gray-200 hover:border-violet-300'
                  }`}
                >
                  ¥{parseInt(amount).toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* 日数 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline w-4 h-4 mr-1 text-violet-500" />
              日数
            </label>
            <div className="flex gap-2">
              {['1', '2', '3', '4', '5'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    days === d
                      ? 'bg-violet-500 text-white border-violet-500'
                      : 'text-gray-500 border-gray-200 hover:border-violet-300'
                  }`}
                >
                  {d}泊{parseInt(d) + 1}日
                </button>
              ))}
            </div>
          </div>

          {/* こだわり */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">こだわり（任意）</label>
            <input
              type="text"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="例：グルメ重視、温泉に入りたい、インスタ映え..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={!destination || !budget || loading}
            className="w-full bg-gradient-to-r from-violet-400 to-purple-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-40 hover:shadow-md transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                AIがプラン作成中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                AIで旅行プランを作成
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* プランサマリー */}
          <div className="bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl p-4 text-white">
            <h2 className="font-bold text-xl mb-1">📍 {plan.destination}</h2>
            <div className="flex items-center gap-4 text-sm">
              <span>{days}泊{parseInt(days) + 1}日</span>
              <span>予算: ¥{budget ? parseInt(budget).toLocaleString() : '—'}</span>
            </div>
            <div className="mt-3 bg-white/20 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">推定総費用</p>
                <p className="font-bold text-2xl">¥{plan.total_estimated_cost?.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">節約の余裕</p>
                <p className="font-bold text-lg text-yellow-300">
                  ¥{(parseInt(budget) - (plan.total_estimated_cost ?? 0)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* 日程 */}
          <div className="space-y-3">
            {plan.itinerary?.map((day) => (
              <div key={day.day} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                  className="w-full flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                      <span className="text-violet-600 font-bold text-sm">{day.day}</span>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-800 text-sm">{day.day}日目</p>
                      <p className="text-gray-400 text-xs">宿泊: {day.accommodation?.name} ¥{day.accommodation?.cost?.toLocaleString()}</p>
                    </div>
                  </div>
                  {expandedDay === day.day ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {expandedDay === day.day && (
                  <div className="px-4 pb-4">
                    <div className="space-y-3">
                      {day.activities?.map((activity, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="text-right w-12 flex-shrink-0">
                            <span className="text-xs text-gray-400">{activity.time}</span>
                          </div>
                          <div className="flex-1 border-l-2 border-violet-100 pl-3">
                            <p className="text-sm font-medium text-gray-800">{activity.activity}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-violet-500 font-medium">¥{activity.cost?.toLocaleString()}</span>
                              <span className="text-xs text-gray-400">{activity.tip}</span>
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
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <h3 className="font-bold text-gray-800 text-sm mb-2">💡 節約ヒント</h3>
            <ul className="space-y-1.5">
              {plan.saving_tips?.map((tip, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5 flex-shrink-0">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* 予約サイト */}
          <div>
            <h3 className="font-bold text-gray-800 text-sm mb-2">🏨 おすすめ予約サイト</h3>
            <div className="space-y-2">
              {plan.recommended_booking_sites?.map((site, i) => (
                <a
                  key={i}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md transition-all"
                >
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm">{site.name}</p>
                    <p className="text-violet-500 text-xs">{site.discount_info}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>

          <button
            onClick={() => setPlan(null)}
            className="w-full border border-gray-200 py-3 rounded-xl text-gray-600 font-medium text-sm hover:bg-gray-50"
          >
            ← 条件を変えて再生成
          </button>
        </div>
      )}
    </div>
  )
}
