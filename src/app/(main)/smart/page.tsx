'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Coupon } from '@/types'
import TravelPlanner from '@/components/smart/TravelPlanner'
import { Plane, Tag, ExternalLink, Search } from 'lucide-react'

const COUPON_CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  travel: { label: '旅行', emoji: '✈️' },
  food: { label: 'グルメ', emoji: '🍽️' },
  shopping: { label: 'ショッピング', emoji: '🛍️' },
  tax: { label: '節税', emoji: '💰' },
  telecom: { label: '通信費', emoji: '📱' },
  investment: { label: '投資', emoji: '📈' },
}

export default function SmartPage() {
  const [activeTab, setActiveTab] = useState<'coupon' | 'travel'>('coupon')
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  useEffect(() => {
    loadCoupons()
  }, [])

  const loadCoupons = async () => {
    const { data } = await supabase
      .from('coupons')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    setCoupons((data ?? []) as Coupon[])
    setLoading(false)
  }

  const filteredCoupons = coupons.filter((c) => {
    const matchCategory = selectedCategory === 'all' || c.category === selectedCategory
    const matchSearch = !searchQuery ||
      c.title.includes(searchQuery) ||
      c.brand_name.includes(searchQuery) ||
      c.description.includes(searchQuery)
    return matchCategory && matchSearch
  })

  const categories = ['all', ...Array.from(new Set(coupons.map((c) => c.category)))]

  const getDiscountText = (coupon: Coupon) =>
    coupon.discount_type === 'percentage'
      ? `${coupon.discount_value}%オフ`
      : `¥${coupon.discount_value.toLocaleString()}オフ`

  const getDaysLeft = (dateStr: string) => {
    const days = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-violet-400 to-purple-500 px-4 pt-12 pb-6">
        <h1 className="text-white font-bold text-xl mb-1">🛍️ 賢く使う</h1>
        <p className="text-white/80 text-sm">クーポン & AIトラベルプランナー</p>

        {/* タブ */}
        <div className="mt-4 flex bg-white/20 rounded-2xl p-1 gap-1">
          <button
            onClick={() => setActiveTab('coupon')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'coupon' ? 'bg-white text-violet-600 shadow' : 'text-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            クーポン
          </button>
          <button
            onClick={() => setActiveTab('travel')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'travel' ? 'bg-white text-violet-600 shadow' : 'text-white'
            }`}
          >
            <Plane className="w-4 h-4" />
            旅行プランナー
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        {activeTab === 'coupon' ? (
          <div className="space-y-4">
            {/* 検索 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="クーポンを検索..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>

            {/* カテゴリフィルター */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 text-xs px-3 py-2 rounded-full font-medium transition-colors flex items-center gap-1 ${
                    selectedCategory === cat
                      ? 'bg-violet-500 text-white'
                      : 'bg-white text-gray-500 border border-gray-200'
                  }`}
                >
                  {cat !== 'all' && COUPON_CATEGORY_LABELS[cat]?.emoji}
                  {cat === 'all' ? 'すべて' : COUPON_CATEGORY_LABELS[cat]?.label ?? cat}
                </button>
              ))}
            </div>

            {/* クーポン一覧 */}
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="text-4xl animate-bounce">🛍️</div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCoupons.map((coupon) => {
                  const daysLeft = getDaysLeft(coupon.valid_until)
                  const isExpiringSoon = daysLeft <= 7
                  return (
                    <div key={coupon.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="flex">
                        {/* 割引バッジ */}
                        <div className="bg-gradient-to-br from-violet-400 to-purple-500 w-20 flex items-center justify-center text-white p-3 flex-shrink-0">
                          <div className="text-center">
                            <p className="font-black text-lg leading-tight">{getDiscountText(coupon).split('オフ')[0]}</p>
                            <p className="text-xs">オフ</p>
                          </div>
                        </div>

                        <div className="flex-1 p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-1 mb-0.5">
                                <span className="text-xs">{COUPON_CATEGORY_LABELS[coupon.category]?.emoji}</span>
                                <span className="text-xs text-gray-400">{coupon.brand_name}</span>
                              </div>
                              <h3 className="font-bold text-gray-800 text-sm leading-snug">{coupon.title}</h3>
                              <p className="text-gray-500 text-xs mt-1 line-clamp-2">{coupon.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs ${isExpiringSoon ? 'text-red-400 font-medium' : 'text-gray-400'}`}>
                              {isExpiringSoon ? `⚠️ 残り${daysLeft}日` : `${daysLeft}日有効`}
                            </span>
                            <a
                              href={coupon.affiliate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 bg-gradient-to-r from-violet-400 to-purple-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium"
                            >
                              使う
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {filteredCoupons.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
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
      </div>
    </div>
  )
}
