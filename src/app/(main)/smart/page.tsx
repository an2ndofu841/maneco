'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Coupon } from '@/types'
import TravelPlanner from '@/components/smart/TravelPlanner'
import { Plane, Tag, ExternalLink, Search } from 'lucide-react'

const COUPON_CATEGORY_CONFIG: Record<string, { label: string; emoji: string; color: string }> = {
  travel: { label: '旅行', emoji: '✈️', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  food: { label: 'グルメ', emoji: '🍽️', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  shopping: { label: 'ショッピング', emoji: '🛍️', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
  tax: { label: '節税', emoji: '💰', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  telecom: { label: '通信費', emoji: '📱', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  investment: { label: '投資', emoji: '📈', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
}

export default function SmartPage() {
  const [activeTab, setActiveTab] = useState<'coupon' | 'travel'>('coupon')
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  useEffect(() => { loadCoupons() }, [])

  const loadCoupons = async () => {
    const { data } = await supabase.from('coupons').select('*').eq('is_active', true).order('created_at', { ascending: false })
    setCoupons((data ?? []) as Coupon[])
    setLoading(false)
  }

  const filteredCoupons = coupons.filter((c) => {
    const matchCategory = selectedCategory === 'all' || c.category === selectedCategory
    const matchSearch = !searchQuery || c.title.includes(searchQuery) || c.brand_name.includes(searchQuery)
    return matchCategory && matchSearch
  })

  const categories = ['all', ...Array.from(new Set(coupons.map((c) => c.category)))]

  const getDaysLeft = (dateStr: string) =>
    Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  const getDiscountText = (coupon: Coupon) =>
    coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `¥${coupon.discount_value.toLocaleString()}`

  return (
    <div className="min-h-screen bg-transparent">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-violet-500/6 rounded-full blur-[80px]" />
      </div>

      {/* ヘッダー */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-4 pt-14 md:px-0 md:pt-10">
        <p className="text-white/40 text-xs mb-1">お得に賢く</p>
        <h1 className="text-white font-black text-2xl mb-4 md:text-3xl">賢く使う 🛍️</h1>

        {/* タブ */}
        <div className="flex bg-white/5 rounded-2xl p-1 border border-white/8">
          <button
            onClick={() => setActiveTab('coupon')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'coupon'
                ? 'gradient-gold text-black'
                : 'text-white/40'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            クーポン
          </button>
          <button
            onClick={() => setActiveTab('travel')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'travel'
                ? 'gradient-gold text-black'
                : 'text-white/40'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            旅行プランナー
          </button>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 md:px-0">
        {activeTab === 'coupon' ? (
          <div className="space-y-4">
            {/* 検索 */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="クーポンを検索..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/40 transition-all"
              />
            </div>

            {/* カテゴリフィルター */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => {
                const config = COUPON_CATEGORY_CONFIG[cat]
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border font-medium transition-all flex items-center gap-1 ${
                      selectedCategory === cat
                        ? 'bg-violet-500/20 text-violet-400 border-violet-500/40'
                        : 'text-white/30 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {cat !== 'all' && config?.emoji}
                    {cat === 'all' ? 'すべて' : config?.label ?? cat}
                  </button>
                )
              })}
            </div>

            {/* クーポン一覧 */}
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="text-3xl animate-bounce">🛍️</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {filteredCoupons.map((coupon) => {
                  const daysLeft = getDaysLeft(coupon.valid_until)
                  const isExpiringSoon = daysLeft <= 7
                  const catConfig = COUPON_CATEGORY_CONFIG[coupon.category]

                  return (
                    <div key={coupon.id} className="rounded-3xl overflow-hidden border border-white/8"
                      style={{ background: '#1a1a24' }}>
                      <div className="flex">
                        {/* 割引バッジ */}
                        <div className="w-20 flex-shrink-0 flex flex-col items-center justify-center py-4 px-2"
                          style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.2) 0%, rgba(139,92,246,0.1) 100%)', borderRight: '1px solid rgba(167,139,250,0.15)' }}>
                          <p className="text-violet-300 font-black text-xl leading-none">{getDiscountText(coupon)}</p>
                          <p className="text-violet-400/60 text-[10px]">オフ</p>
                        </div>

                        <div className="flex-1 p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`text-[10px] border px-1.5 py-0.5 rounded-full ${catConfig?.color}`}>
                              {catConfig?.emoji} {catConfig?.label}
                            </span>
                          </div>
                          <p className="text-white/50 text-[10px]">{coupon.brand_name}</p>
                          <p className="font-bold text-white text-sm leading-snug">{coupon.title}</p>
                          <p className="text-white/35 text-[11px] mt-0.5 line-clamp-2">{coupon.description}</p>

                          <div className="flex items-center justify-between mt-2.5">
                            <span className={`text-[10px] ${isExpiringSoon ? 'text-red-400' : 'text-white/25'}`}>
                              {isExpiringSoon ? `⚠️ 残り${daysLeft}日` : `${daysLeft}日有効`}
                            </span>
                            <a
                              href={coupon.affiliate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[11px] font-bold text-violet-400 bg-violet-500/15 border border-violet-500/25 px-3 py-1 rounded-lg hover:bg-violet-500/25 transition-colors"
                            >
                              使う <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {filteredCoupons.length === 0 && (
                  <div className="text-center py-10 text-white/30">
                    <p className="text-3xl mb-2">🔍</p>
                    <p className="text-sm">クーポンが見つかりません</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <TravelPlanner />
        )}

        <div className="h-4" />
      </div>
    </div>
  )
}
