'use client'

import { useState } from 'react'
import { Star, ExternalLink, Clock, ChevronRight, X, CheckCircle, Shield, Gift, CreditCard, Landmark, Smartphone, Heart } from 'lucide-react'

interface PointOffer {
  id: string
  title: string
  brand: string
  description: string
  points: number
  category: string
  categoryLabel: string
  categoryEmoji: string
  conditions: string[]
  timeEstimate: string
  difficulty: 'easy' | 'medium' | 'hard'
  popular: boolean
  limited?: boolean
  gradient: string
  url: string
}

const OFFERS: PointOffer[] = [
  {
    id: 'credit-1',
    title: '年会費無料クレカ発行',
    brand: '楽天カード',
    description: '新規発行＆利用で大量ポイント！年会費永年無料で普段使いに最適。ポイント還元率1%で日常の買い物もお得に。',
    points: 5000,
    category: 'credit',
    categoryLabel: 'クレジットカード',
    categoryEmoji: '💳',
    conditions: ['新規申込み', '発行後に1回以上の利用', '18歳以上（高校生不可）'],
    timeEstimate: '申込み5分・発行まで約1週間',
    difficulty: 'easy',
    popular: true,
    gradient: 'from-rose-500 to-pink-600',
    url: '#',
  },
  {
    id: 'credit-2',
    title: 'ナンバーレスカード発行',
    brand: '三井住友カード(NL)',
    description: 'コンビニ・飲食店で最大7%還元。カード番号がないセキュリティ重視の設計。学生にもおすすめ。',
    points: 3000,
    category: 'credit',
    categoryLabel: 'クレジットカード',
    categoryEmoji: '💳',
    conditions: ['新規申込み', '発行後にアプリ登録', '18歳以上（高校生不可）'],
    timeEstimate: '申込み5分・最短10秒で発番',
    difficulty: 'easy',
    popular: false,
    gradient: 'from-emerald-500 to-teal-600',
    url: '#',
  },
  {
    id: 'securities-1',
    title: 'NISA口座開設',
    brand: 'SBI証券',
    description: 'ネット証券No.1。NISA口座を開設して投資デビュー！手数料無料で初心者にも安心。',
    points: 4000,
    category: 'securities',
    categoryLabel: '証券口座',
    categoryEmoji: '📈',
    conditions: ['新規口座開設', 'NISA口座同時申込み', '20歳以上'],
    timeEstimate: '申込み10分・開設まで約3日',
    difficulty: 'easy',
    popular: true,
    limited: true,
    gradient: 'from-blue-500 to-indigo-600',
    url: '#',
  },
  {
    id: 'securities-2',
    title: '証券口座開設＆積立設定',
    brand: '楽天証券',
    description: '楽天ポイントで投資ができる！口座開設後に積立設定で追加ポイント獲得。',
    points: 3500,
    category: 'securities',
    categoryLabel: '証券口座',
    categoryEmoji: '📈',
    conditions: ['新規口座開設', '月1万円以上の積立設定', '20歳以上'],
    timeEstimate: '申込み10分・開設まで約5日',
    difficulty: 'medium',
    popular: false,
    gradient: 'from-red-500 to-rose-600',
    url: '#',
  },
  {
    id: 'mobile-1',
    title: '格安SIM新規契約',
    brand: 'IIJmio',
    description: 'スマホ代を月1,000円台に！新規契約で大量ポイント。余ったお金を投資に回そう。',
    points: 2500,
    category: 'mobile',
    categoryLabel: '通信',
    categoryEmoji: '📱',
    conditions: ['新規またはMNP', '音声SIM契約', '3ヶ月以上継続'],
    timeEstimate: '申込み10分・最短翌日開通',
    difficulty: 'medium',
    popular: false,
    gradient: 'from-violet-500 to-purple-600',
    url: '#',
  },
  {
    id: 'insurance-1',
    title: '無料保険相談',
    brand: 'ほけんの窓口',
    description: 'プロのFPに無料で保険の見直しを相談。ムダな保険を削減して月々の支出を改善！',
    points: 2000,
    category: 'insurance',
    categoryLabel: '保険',
    categoryEmoji: '🛡️',
    conditions: ['初回面談完了', '30分以上の相談', '20歳以上'],
    timeEstimate: '予約3分・面談60分',
    difficulty: 'easy',
    popular: false,
    gradient: 'from-cyan-500 to-blue-600',
    url: '#',
  },
]

const CATEGORY_ICONS: Record<string, typeof CreditCard> = {
  credit: CreditCard,
  securities: Landmark,
  mobile: Smartphone,
  insurance: Shield,
}

const DIFFICULTY_LABELS = {
  easy: { label: 'かんたん', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  medium: { label: 'ふつう', color: 'text-amber-600 bg-amber-50 border-amber-100' },
  hard: { label: 'むずかしい', color: 'text-red-600 bg-red-50 border-red-100' },
}

export default function PointOffers() {
  const [selectedOffer, setSelectedOffer] = useState<PointOffer | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const filters = [
    { id: 'all', label: 'おすすめ', emoji: '🔥' },
    { id: 'credit', label: 'クレカ', emoji: '💳' },
    { id: 'securities', label: '証券', emoji: '📈' },
    { id: 'mobile', label: '通信', emoji: '📱' },
    { id: 'insurance', label: '保険', emoji: '🛡️' },
  ]

  const filtered = filter === 'all' ? OFFERS : OFFERS.filter(o => o.category === filter)

  return (
    <>
      <div className="space-y-4">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
              <Gift className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">高額ポイント案件</h2>
              <p className="text-[11px] text-slate-400 font-medium">カード発行・口座開設でガッツリ稼ぐ</p>
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:-mx-0 md:px-0">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full font-bold transition-all border ${
                filter === f.id
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{f.emoji}</span> {f.label}
            </button>
          ))}
        </div>

        {/* Offer cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(offer => (
            <button
              key={offer.id}
              onClick={() => setSelectedOffer(offer)}
              className="text-left group"
            >
              <div className="bento-card rounded-2xl overflow-hidden transition-all hover:border-indigo-200 hover:shadow-md">
                {/* Top color bar */}
                <div className={`h-2 bg-gradient-to-r ${offer.gradient}`} />

                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${offer.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      {(() => {
                        const Icon = CATEGORY_ICONS[offer.category] || Gift
                        return <Icon className="w-6 h-6 text-white" />
                      })()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="text-[10px] text-slate-400 font-medium">{offer.brand}</span>
                        {offer.popular && (
                          <span className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-full">人気</span>
                        )}
                        {offer.limited && (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full">期間限定</span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1.5">{offer.title}</h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{offer.description}</p>
                    </div>

                    {/* Points */}
                    <div className="text-right flex-shrink-0">
                      <div className="bg-amber-50 border border-amber-100 rounded-xl px-2.5 py-1.5">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="text-amber-600 font-black text-lg leading-none">{offer.points.toLocaleString()}</span>
                        </div>
                        <p className="text-amber-400 text-[10px] font-bold mt-0.5">pt</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold border px-1.5 py-0.5 rounded-full ${DIFFICULTY_LABELS[offer.difficulty].color}`}>
                        {DIFFICULTY_LABELS[offer.difficulty].label}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />{offer.timeEstimate.split('・')[0]}
                      </span>
                    </div>
                    <span className="text-indigo-500 text-[11px] font-bold flex items-center gap-0.5 group-hover:gap-1 transition-all">
                      詳しく見る <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedOffer && (
        <OfferDetailModal offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
      )}
    </>
  )
}

// ─── Offer Detail Modal ───

function OfferDetailModal({ offer, onClose }: { offer: PointOffer; onClose: () => void }) {
  const Icon = CATEGORY_ICONS[offer.category] || Gift

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
          <X className="w-5 h-5 text-slate-500" />
        </button>
        <h2 className="font-bold text-slate-900 text-sm">案件詳細</h2>
        <div className="w-10" />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto">
        {/* Hero */}
        <div className={`bg-gradient-to-br ${offer.gradient} px-6 py-10 text-center relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-40 h-40 border-4 border-white rounded-full" />
            <div className="absolute bottom-4 left-4 w-24 h-24 border-4 border-white rounded-full" />
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-white/30">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <p className="text-white/70 text-sm font-medium mb-1">{offer.brand}</p>
            <h1 className="text-xl font-black text-white mb-4">{offer.title}</h1>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2.5">
              <Star className="w-5 h-5 text-amber-200 fill-amber-200" />
              <span className="text-white text-2xl font-black">{offer.points.toLocaleString()}</span>
              <span className="text-white/80 text-sm font-bold">pt 獲得</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 max-w-lg mx-auto space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">概要</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{offer.description}</p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 mb-1">カテゴリ</p>
              <p className="text-sm font-bold text-slate-900">{offer.categoryEmoji} {offer.categoryLabel}</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 mb-1">難易度</p>
              <p className="text-sm font-bold text-slate-900">{DIFFICULTY_LABELS[offer.difficulty].label}</p>
            </div>
            <div className="col-span-2 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 mb-1">所要時間</p>
              <p className="text-sm font-bold text-slate-900">{offer.timeEstimate}</p>
            </div>
          </div>

          {/* Conditions */}
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
            <h3 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              ポイント獲得条件
            </h3>
            <ul className="space-y-2">
              {offer.conditions.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                  <span className="text-[10px] font-black bg-amber-200 text-amber-700 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Safety notice */}
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-blue-800 mb-1">安心してご利用ください</p>
              <p className="text-xs text-blue-600 leading-relaxed">提携企業の公式サイトに移動します。マネコが個人情報を保管することはありません。</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex-shrink-0 space-y-2">
        <a
          href={offer.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all active:scale-[0.98]"
        >
          <ExternalLink className="w-5 h-5" />
          公式サイトで申し込む（{offer.points.toLocaleString()} pt）
        </a>
        <p className="text-center text-[10px] text-slate-400">条件達成後、ポイントは自動で付与されます</p>
      </div>
    </div>
  )
}
