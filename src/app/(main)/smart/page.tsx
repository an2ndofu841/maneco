'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Coupon } from '@/types'
import TravelPlanner from '@/components/smart/TravelPlanner'
import { Plane, Tag, ExternalLink, Search, Utensils, ShoppingBag, Palmtree, MapPin, SlidersHorizontal, X } from 'lucide-react'

const COUPON_CATEGORY_CONFIG: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  travel: { label: '旅行', emoji: '✈️', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
  food: { label: 'グルメ', emoji: '🍽️', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' },
  shopping: { label: 'ショッピング', emoji: '🛍️', color: 'text-pink-600', bg: 'bg-pink-50 border-pink-100' },
  tax: { label: '節税', emoji: '💰', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
  telecom: { label: '通信費', emoji: '📱', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
  investment: { label: '投資', emoji: '📈', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
}

const USAGE_TYPES = [
  { id: 'food', label: 'ご飯', icon: Utensils, color: 'bg-orange-500', categories: ['food'] },
  { id: 'daily', label: '日用品', icon: ShoppingBag, color: 'bg-pink-500', categories: ['shopping', 'telecom', 'tax', 'investment'] },
  { id: 'leisure', label: 'レジャー', icon: Palmtree, color: 'bg-blue-500', categories: ['travel'] },
]

// Mock locations for demo purposes (Tokyo area)
const MOCK_LOCATIONS = [
  { lat: 35.6895, lng: 139.6917, address: '新宿区' },
  { lat: 35.6586, lng: 139.7454, address: '港区' },
  { lat: 35.6284, lng: 139.7387, address: '品川区' },
  { lat: 35.7023, lng: 139.7745, address: '台東区' },
  { lat: 35.6812, lng: 139.7671, address: '千代田区' },
]

export default function SmartPage() {
  const [activeTab, setActiveTab] = useState<'coupon' | 'travel'>('coupon')
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [selectedUsage, setSelectedUsage] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [maxBudget, setMaxBudget] = useState<number | null>(null)
  const [useLocation, setUseLocation] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  
  // Savings Animation
  const [showSavings, setShowSavings] = useState<{ amount: number } | null>(null)

  const supabase = createClient()

  useEffect(() => { loadCoupons() }, [])

  // Get user location
  useEffect(() => {
    if (useLocation && !userLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          },
          (error) => {
            console.error('Error getting location:', error)
            setUseLocation(false)
            alert('位置情報の取得に失敗しました。設定をご確認ください。')
          }
        )
      } else {
        alert('お使いのブラウザは位置情報をサポートしていません。')
        setUseLocation(false)
      }
    }
  }, [useLocation, userLocation])

  const loadCoupons = async () => {
    const { data } = await supabase.from('coupons').select('*').eq('is_active', true).order('created_at', { ascending: false })
    
    // Mock additional data for demo
    const enhancedCoupons = (data ?? []).map((c: any) => ({
      ...c,
      approx_price: Math.floor(Math.random() * 5000) + 500, // 500 - 5500 yen
      location: MOCK_LOCATIONS[Math.floor(Math.random() * MOCK_LOCATIONS.length)]
    }))
    
    setCoupons(enhancedCoupons as Coupon[])
    setLoading(false)
  }

  const handleUseCoupon = async (coupon: Coupon) => {
    // 1. Open link immediately
    window.open(coupon.affiliate_url, '_blank')

    // 2. Calculate savings
    let amount = 0
    if (coupon.discount_type === 'fixed') {
      amount = coupon.discount_value
    } else if (coupon.discount_type === 'percentage') {
      // Use approx_price if available, otherwise assume a base price (e.g. 3000 yen) for demo
      const basePrice = coupon.approx_price || 3000
      amount = Math.floor(basePrice * (coupon.discount_value / 100))
    }

    if (amount > 0) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('users').select('total_savings').eq('id', user.id).single()
        if (data) {
          await supabase.from('users').update({ 
            total_savings: (data.total_savings || 0) + amount 
          }).eq('id', user.id)
          
          setShowSavings({ amount })
          setTimeout(() => setShowSavings(null), 3000)
        }
      }
    }
  }

  // Haversine formula to calculate distance in km
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371 // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLng = (lng2 - lng1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const filteredCoupons = coupons.filter((c) => {
    // Usage Filter
    if (selectedUsage) {
      const usage = USAGE_TYPES.find(u => u.id === selectedUsage)
      if (usage && !usage.categories.includes(c.category)) return false
    }

    // Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!c.title.toLowerCase().includes(query) && !c.brand_name.toLowerCase().includes(query)) return false
    }

    // Budget Filter
    if (maxBudget && c.approx_price && c.approx_price > maxBudget) return false

    // Location Filter (within 5km)
    if (useLocation && userLocation && c.location) {
      const distance = calculateDistance(userLocation.lat, userLocation.lng, c.location.lat, c.location.lng)
      if (distance > 5) return false
    }

    return true
  })

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
          <div className="flex bg-slate-100 p-1 rounded-2xl max-w-md mb-6">
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
            {/* 用途選択（大カテゴリ） */}
            <div className="grid grid-cols-3 gap-3">
              {USAGE_TYPES.map((usage) => (
                <button
                  key={usage.id}
                  onClick={() => setSelectedUsage(selectedUsage === usage.id ? null : usage.id)}
                  className={`relative overflow-hidden rounded-2xl p-4 h-28 flex flex-col items-center justify-center gap-2 transition-all ${
                    selectedUsage === usage.id
                      ? 'ring-4 ring-indigo-200 scale-[1.02]'
                      : 'hover:scale-[1.02]'
                  }`}
                >
                  <div className={`absolute inset-0 ${usage.color} opacity-10`} />
                  <div className={`w-10 h-10 rounded-full ${usage.color} text-white flex items-center justify-center shadow-md`}>
                    <usage.icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-900 text-sm">{usage.label}</span>
                  {selectedUsage === usage.id && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* 検索 & フィルターバー */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="お店やブランド名で検索..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center w-12 h-12 rounded-xl border transition-all ${
                    showFilters || maxBudget || useLocation
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* 詳細フィルター */}
              {(showFilters || maxBudget || useLocation) && (
                <div className="space-y-4 pt-2 border-t border-slate-100 animate-fade-in">
                  {/* 予算フィルター */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                      <span>予算（クーポン適用後）</span>
                      {maxBudget && <span className="text-indigo-600">¥{maxBudget.toLocaleString()}以下</span>}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {[1000, 3000, 5000, 10000].map((price) => (
                        <button
                          key={price}
                          onClick={() => setMaxBudget(maxBudget === price ? null : price)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            maxBudget === price
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          ¥{price.toLocaleString()}
                        </button>
                      ))}
                      {maxBudget && (
                        <button
                          onClick={() => setMaxBudget(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"
                        >
                          <X className="w-3 h-3" /> クリア
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 現在地フィルター */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${useLocation ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">現在地周辺のお店</p>
                        <p className="text-xs text-slate-500">5km以内のクーポンを表示</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setUseLocation(!useLocation)}
                      className={`w-12 h-7 rounded-full transition-colors relative ${
                        useLocation ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                        useLocation ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              )}
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
                              {coupon.approx_price && (
                                <span className="text-[10px] text-slate-400 font-medium">
                                  目安: ¥{coupon.approx_price.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <p className="text-slate-400 text-[10px] font-bold mb-0.5">{coupon.brand_name}</p>
                            <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{coupon.title}</h3>
                            {coupon.location?.address && (
                              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {coupon.location.address}
                              </p>
                            )}
                          </div>

                          <div className="flex items-end justify-between mt-3">
                            <span className={`text-[10px] font-medium ${isExpiringSoon ? 'text-red-500' : 'text-slate-400'}`}>
                              {isExpiringSoon ? `⚠️ 残り${daysLeft}日` : `あと${daysLeft}日有効`}
                            </span>
                            <button
                              onClick={() => handleUseCoupon(coupon)}
                              className="flex items-center gap-1 text-[11px] font-bold text-white bg-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                            >
                              使う <ExternalLink className="w-3 h-3" />
                            </button>
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
                    <button 
                      onClick={() => {
                        setSelectedUsage(null)
                        setSearchQuery('')
                        setMaxBudget(null)
                        setUseLocation(false)
                      }}
                      className="mt-4 text-indigo-600 text-xs font-bold hover:underline"
                    >
                      フィルターをリセット
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <TravelPlanner />
        )}
      </div>

      {showSavings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-[2rem] shadow-2xl border border-emerald-100 animate-bounce-in text-center transform scale-110">
            <div className="text-5xl mb-3 animate-bounce">💰</div>
            <p className="text-slate-500 text-xs font-bold mb-1">節約成功！</p>
            <p className="text-emerald-600 font-black text-4xl tracking-tight">
              +{showSavings.amount.toLocaleString()}<span className="text-lg ml-1">円</span>
            </p>
            <p className="text-slate-400 text-[10px] mt-2 font-medium">累計節約額に反映されました</p>
          </div>
        </div>
      )}
    </div>
  )
}
