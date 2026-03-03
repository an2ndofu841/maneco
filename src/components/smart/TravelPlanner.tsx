'use client'

import { useState } from 'react'
import { Loader2, MapPin, DollarSign, Calendar, Sparkles, ChevronDown, ChevronUp, ExternalLink, ArrowRight, Plane, Train, Bus, AlertTriangle, Star } from 'lucide-react'

// 型定義を拡張
interface TravelPlan {
  plan_title: string
  departure: string
  destination: string
  budget: number
  total_estimated_cost: number
  transportation: {
    type: string
    cost: number
    details: string
    booking_url: string
  }
  scores: {
    comfort: number
    excitement: number
    cost_performance: number
    overall: number
  }
  compromise_points: { title: string; description: string }[]
  itinerary: {
    day: number
    activities: { time: string; activity: string; cost: number; tip: string }[]
    accommodation: { name: string; cost: number; booking_url: string }
  }[]
  saving_tips: string[]
}

const POPULAR_DEPARTURES = ['東京', '大阪', '名古屋', '福岡', '札幌']
const POPULAR_DESTINATIONS = ['京都', '沖縄', '北海道', '箱根', '台湾', 'ソウル', 'バンコク']

export default function TravelPlanner() {
  const [step, setStep] = useState(1)
  const [departure, setDeparture] = useState('東京')
  const [destination, setDestination] = useState('')
  const [budget, setBudget] = useState('')
  const [days, setDays] = useState('2')
  const [preferences, setPreferences] = useState('')
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<TravelPlan | null>(null)
  const [expandedDay, setExpandedDay] = useState<number | null>(1)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!departure || !destination || !budget) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departure, destination, budget: parseInt(budget), days: parseInt(days), preferences }),
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

  const renderScore = (label: string, score: number, color: string) => (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs font-bold text-slate-600">
        <span>{label}</span>
        <span>{score}/5</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
    </div>
  )

  if (plan) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* サマリー */}
        <div className="bento-card p-6 rounded-[2rem] bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-none shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">AI提案プラン</span>
              <span className="text-indigo-200 text-xs font-bold">{days}泊{parseInt(days) + 1}日</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-1 leading-tight">{plan.plan_title}</h2>
            <p className="text-indigo-200 text-sm font-medium mb-6 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {plan.departure} → {plan.destination}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <p className="text-indigo-200 text-[10px] font-bold mb-1">推定総費用</p>
                <p className="text-white font-black text-xl">¥{plan.total_estimated_cost?.toLocaleString()}</p>
                <p className="text-white/40 text-[10px]">予算: ¥{parseInt(budget).toLocaleString()}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <p className="text-indigo-200 text-[10px] font-bold mb-1">総合スコア</p>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="text-white font-black text-xl">{plan.scores.overall}</span>
                  <span className="text-white/40 text-xs">/5</span>
                </div>
              </div>
            </div>

            {/* スコア詳細 */}
            <div className="bg-black/20 rounded-2xl p-4 space-y-3">
              {renderScore('快適さ', plan.scores.comfort, 'bg-emerald-400')}
              {renderScore('ワクワク度', plan.scores.excitement, 'bg-amber-400')}
              {renderScore('コスパ', plan.scores.cost_performance, 'bg-blue-400')}
            </div>
          </div>
        </div>

        {/* 妥協ポイント警告 */}
        {plan.compromise_points && plan.compromise_points.length > 0 && (
          <div className="bento-card p-5 rounded-3xl bg-amber-50 border-amber-200 border-l-4 border-l-amber-500">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-800 text-sm mb-2">予算オーバー回避のための「妥協ポイント」</h3>
                <ul className="space-y-2">
                  {plan.compromise_points.map((point, i) => (
                    <li key={i} className="text-amber-700 text-xs font-medium bg-white/50 p-2 rounded-lg">
                      <span className="font-bold block mb-0.5">⚠️ {point.title}</span>
                      {point.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 移動手段 */}
        <div className="bento-card p-5 rounded-3xl border-l-4 border-l-indigo-500">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                {plan.transportation.type.includes('飛行機') || plan.transportation.type.includes('LCC') ? <Plane className="w-4 h-4" /> :
                 plan.transportation.type.includes('バス') ? <Bus className="w-4 h-4" /> : <Train className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">往復移動手段</p>
                <p className="font-bold text-slate-900 text-sm">{plan.transportation.type}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-indigo-600 font-black text-lg">¥{plan.transportation.cost.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-slate-600 text-xs mb-3 bg-slate-50 p-2 rounded-lg">{plan.transportation.details}</p>
          <a
            href={plan.transportation.booking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
          >
            チケットを検索・予約 <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* 日程詳細 */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-sm ml-1">詳細スケジュール</h3>
          {plan.itinerary?.map((day) => (
            <div key={day.day} className="bento-card rounded-3xl overflow-hidden transition-all hover:border-indigo-200">
              <button
                onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                className="w-full flex items-center gap-4 p-5 text-left"
              >
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 shadow-sm border border-indigo-100">
                  {day.day}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm">{day.day}日目</p>
                  <p className="text-slate-500 text-xs font-medium truncate">{day.accommodation?.name}</p>
                </div>
                {expandedDay === day.day
                  ? <ChevronUp className="w-5 h-5 text-slate-400" />
                  : <ChevronDown className="w-5 h-5 text-slate-400" />
                }
              </button>

              {expandedDay === day.day && (
                <div className="px-5 pb-5 space-y-4 border-t border-slate-100 bg-slate-50/30">
                  <div className="pt-4 space-y-4">
                    {day.activities?.map((activity, i) => (
                      <div key={i} className="flex gap-4 relative">
                        <div className="absolute left-[19px] top-8 bottom-[-20px] w-0.5 bg-slate-200 last:hidden" />
                        <div className="w-10 flex-shrink-0 flex flex-col items-center">
                          <p className="text-slate-400 text-[10px] font-bold mb-1">{activity.time}</p>
                          <div className="w-2 h-2 rounded-full bg-indigo-300 ring-4 ring-white" />
                        </div>
                        <div className="flex-1 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                          <p className="text-slate-900 text-sm font-bold mb-1">{activity.activity}</p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-indigo-600 text-[10px] font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">¥{activity.cost?.toLocaleString()}</span>
                            <span className="text-slate-500 text-[10px] flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-400" /> {activity.tip}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* 宿泊情報 */}
                    <div className="mt-4 bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-[10px] font-bold text-indigo-400 mb-0.5">宿泊先</p>
                          <p className="text-indigo-900 text-sm font-bold">{day.accommodation.name}</p>
                        </div>
                        <p className="text-indigo-600 font-bold text-sm">¥{day.accommodation.cost.toLocaleString()}</p>
                      </div>
                      <a
                        href={day.accommodation.booking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center w-full py-2 bg-white text-indigo-600 rounded-lg text-xs font-bold border border-indigo-200 hover:bg-indigo-50 transition-colors"
                      >
                        宿泊先を検索・予約
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button onClick={() => setPlan(null)}
          className="w-full py-4 rounded-2xl text-slate-500 text-sm font-bold hover:bg-slate-100 transition-all border border-slate-200 border-dashed">
          ← 条件を変えて再生成
        </button>
      </div>
    )
  }

  return (
    <div className="bento-card p-6 md:p-8 rounded-[2.5rem] min-h-[500px] flex flex-col relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4 text-white shadow-lg shadow-indigo-200 animate-float">
            ✈️
          </div>
          <h2 className="font-black text-slate-900 text-xl mb-1">AIトラベルプランナー</h2>
          <p className="text-slate-500 text-xs font-medium">予算内で最高の旅をデザインします</p>
        </div>

        {/* ステップインジケーター */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-200'}`} />
          ))}
        </div>

        <div className="flex-1">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 text-center">どこから、どこへ行きますか？</h3>
              
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3">
                  <MapPin className="w-4 h-4 text-indigo-500" />出発地
                </label>
                <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-2">
                  {POPULAR_DEPARTURES.map((dep) => (
                    <button key={dep} onClick={() => setDeparture(dep)}
                      className={`flex-shrink-0 text-xs px-4 py-2 rounded-full font-bold transition-all border ${
                        departure === dep
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}>
                      {dep}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  placeholder="出発地を入力..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3">
                  <MapPin className="w-4 h-4 text-emerald-500" />目的地
                </label>
                <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-2">
                  {POPULAR_DESTINATIONS.map((dest) => (
                    <button key={dest} onClick={() => setDestination(dest)}
                      className={`flex-shrink-0 text-xs px-4 py-2 rounded-full font-bold transition-all border ${
                        destination === dest
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
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
                  placeholder="目的地を入力..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!departure || !destination}
                className="w-full btn-primary py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                次へ進む <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 text-center">予算と日程は？</h3>
              
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3">
                  <DollarSign className="w-4 h-4 text-amber-500" />予算（交通費込み）
                </label>
                <div className="relative mb-3">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">¥</span>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="30000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-5 py-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {['10000', '30000', '50000', '100000'].map((amount) => (
                    <button key={amount} onClick={() => setBudget(amount)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        budget === amount
                          ? 'bg-amber-50 text-amber-600 border-amber-200'
                          : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                      }`}>
                      ¥{parseInt(amount) / 10000}万
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3">
                  <Calendar className="w-4 h-4 text-blue-500" />日数
                </label>
                <div className="flex gap-2">
                  {['1', '2', '3', '4', '5'].map((d) => (
                    <button key={d} onClick={() => setDays(d)}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
                        days === d
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                      }`}>
                      {d}泊
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 rounded-2xl text-slate-500 font-bold text-sm bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  戻る
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!budget}
                  className="flex-[2] btn-primary py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  次へ進む <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 text-center">最後に、こだわりはありますか？</h3>
              
              <div>
                <label className="text-xs font-bold text-slate-500 mb-3 block flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />こだわり（任意）
                </label>
                <textarea
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="例：美味しい海鮮が食べたい、温泉でゆっくりしたい、できるだけ安く済ませたい..."
                  className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-xl text-center border border-red-100">
                  ⚠️ {error}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 rounded-2xl text-slate-500 font-bold text-sm bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  戻る
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-[2] btn-primary py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />プラン作成中...</>
                  ) : (
                    <><Sparkles className="w-5 h-5" />プランを作成する</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
