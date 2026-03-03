'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Coupon } from '@/types'
import TravelPlanner from '@/components/smart/TravelPlanner'
import { Plane, Tag, ExternalLink, Search } from 'lucide-react'

const COUPON_CATEGORY_CONFIG: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  travel: { label: '旅行', emoji: '✈️', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
  food: { label: 'グルメ', emoji: '🍽️', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' },
  shopping: { label: 'ショッピング', emoji: '🛍️', color: 'text-pink-600', bg: 'bg-pink-50 border-pink-100' },
  tax: { label: '節税', emoji: '💰', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
  telecom: { label: '通信費', emoji: '📱', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
  investment: { label: '投資', emoji: '📈', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
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
    <div className="min-h-screen pb-24 md:pb-12">
      <div className="app-container pt-8 md:pt-12">
        {/* ヘッダー */}
        <div className="mb-8">
          <p className="text-slate-500 text-sm font-medium mb-1">お得に賢く</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">賢く使う 🛍️</h1>

          {/* タブ */}
          <div className="flex bg-slate-100 p-1 rounded-2xl max-w-md">
            <button
              onClick={() => setActiveTab('coupon')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'coupon'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Tag className="w-4 h-4" />
              クーポン
            </button>
            <button
              onClick={() => setActiveTab('travel')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'travel'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Plane className="w-4 h-4" />
              旅行プランナー
            </button>
          </div>
        </div>

        {activeTab === 'coupon' ? (
          <div className="space-y-6">
            {/* 検索 & フィルター */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="クーポンを検索..."
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => {
                const config = COUPON_CATEGORY_CONFIG[cat]
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-shrink-0 text-xs px-4 py-2 rounded-full border font-bold transition-all flex items-center gap-1.5 ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCoupons.map((coupon) => {
                  const daysLeft = getDaysLeft(coupon.valid_until)
                  const isExpiringSoon = daysLeft <= 7
                  const catConfig = COUPON_CATEGORY_CONFIG[coupon.category]

                  return (
                    <div key={coupon.id} className="bento-card rounded-3xl overflow-hidden group hover:border-indigo-200 transition-all">
                      <div className="flex h-full">
                        {/* 割引バッジ */}
                        <div className="w-24 flex-shrink-0 flex flex-col items-center justify-center p-2 bg-gradient-to-br from-indigo-50 to-blue-50 border-r border-indigo-100">
                          <p className="text-indigo-600 font-black text-2xl leading-none tracking-tight">{getDiscountText(coupon)}</p>
                          <p className="text-indigo-400 text-[10px] font-bold mt-1">OFF</p>
                        </div>

                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${catConfig?.color} ${catConfig?.bg}`}>
                                {catConfig?.emoji} {catConfig?.label}
                              </span>
                            </div>
                            <p className="text-slate-400 text-[10px] font-bold mb-0.5">{coupon.brand_name}</p>
                            <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{coupon.title}</h3>
                          </div>

                          <div className="flex items-end justify-between mt-3">
                            <span className={`text-[10px] font-medium ${isExpiringSoon ? 'text-red-500' : 'text-slate-400'}`}>
                              {isExpiringSoon ? `⚠️ 残り${daysLeft}日` : `あと${daysLeft}日有効`}
                            </span>
                            <a
                              href={coupon.affiliate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[11px] font-bold text-white bg-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                            >
                              使う <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {filteredCoupons.length === 0 && (
                  <div className="col-span-full text-center py-12 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                    <p className="text-4xl mb-3">🔍</p>
                    <p className="text-slate-500 font-medium">クーポンが見つかりません</p>
                    <p className="text-slate-400 text-sm mt-1">条件を変えて検索してみてください</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <TravelPlanner />
        )}
      </div>
    </div>
  )
}
