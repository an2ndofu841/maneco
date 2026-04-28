'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Coupon } from '@/types'
import { X, CheckCircle, Tag } from 'lucide-react'

const COUPON_CATEGORY_CONFIG: Record<string, { label: string; emoji: string }> = {
  travel: { label: '旅行', emoji: '✈️' },
  food: { label: 'グルメ', emoji: '🍽️' },
  shopping: { label: 'ショッピング', emoji: '🛍️' },
  tax: { label: '節税', emoji: '💰' },
  telecom: { label: '通信費', emoji: '📱' },
  investment: { label: '投資', emoji: '📈' },
}

interface CouponRedeemModalProps {
  coupon: Coupon
  onClose: () => void
  onRedeem: (coupon: Coupon) => void
}

export default function CouponRedeemModal({ coupon, onClose, onRedeem }: CouponRedeemModalProps) {
  const [slideX, setSlideX] = useState(0)
  const [isRedeemed, setIsRedeemed] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const trackWidth = useRef(0)

  const THUMB_SIZE = 64
  const THRESHOLD = 0.85

  useEffect(() => {
    if (sliderRef.current) {
      trackWidth.current = sliderRef.current.offsetWidth - THUMB_SIZE
    }
  }, [])

  const getDiscountText = () =>
    coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `¥${coupon.discount_value.toLocaleString()}`

  const catConfig = COUPON_CATEGORY_CONFIG[coupon.category]

  const handleStart = useCallback((clientX: number) => {
    if (isRedeemed) return
    setIsDragging(true)
  }, [isRedeemed])

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || isRedeemed || !sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const offsetX = clientX - rect.left - THUMB_SIZE / 2
    const maxX = trackWidth.current
    setSlideX(Math.max(0, Math.min(offsetX, maxX)))
  }, [isDragging, isRedeemed])

  const handleEnd = useCallback(() => {
    if (!isDragging || isRedeemed) return
    setIsDragging(false)

    const progress = slideX / trackWidth.current
    if (progress >= THRESHOLD) {
      setSlideX(trackWidth.current)
      setIsRedeemed(true)
      onRedeem(coupon)
    } else {
      setSlideX(0)
    }
  }, [isDragging, isRedeemed, slideX, coupon, onRedeem])

  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX)
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX)
  const onTouchEnd = () => handleEnd()

  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX)
  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX)
  const onMouseUp = () => handleEnd()
  const onMouseLeave = () => { if (isDragging) handleEnd() }

  const progress = trackWidth.current > 0 ? slideX / trackWidth.current : 0

  const now = new Date()
  const timeStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
        <h2 className="font-bold text-slate-900">クーポンを使う</h2>
        <div className="w-10" />
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-auto">
        {!isRedeemed ? (
          <>
            {/* Coupon Card */}
            <div className="w-full max-w-sm">
              <div className="relative bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full" />
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full" />

                <div className="relative z-10">
                  {catConfig && (
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                      {catConfig.emoji} {catConfig.label}
                    </span>
                  )}

                  <p className="text-white/70 text-sm font-medium mb-1">{coupon.brand_name}</p>
                  <h3 className="text-xl font-bold mb-4 leading-snug">{coupon.title}</h3>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-black tracking-tight">{getDiscountText()}</span>
                    <span className="text-lg font-bold text-white/80">OFF</span>
                  </div>

                  <p className="text-white/70 text-sm leading-relaxed mb-4">{coupon.description}</p>

                  {/* Dashed separator */}
                  <div className="border-t border-dashed border-white/30 my-4" />

                  <div className="flex justify-between items-center text-xs text-white/60">
                    <span>有効期限: {new Date(coupon.valid_until).toLocaleDateString('ja-JP')}</span>
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {coupon.id.slice(0, 8)}</span>
                  </div>
                </div>

                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 right-4 w-32 h-32 border-4 border-white rounded-full" />
                  <div className="absolute bottom-4 left-4 w-20 h-20 border-4 border-white rounded-full" />
                </div>
              </div>
            </div>

            {/* Instruction */}
            <p className="text-slate-400 text-sm font-medium mt-8 mb-2">
              店員さんにこの画面を見せてください
            </p>
            <p className="text-slate-300 text-xs mb-8">
              スライドしてクーポンを使用済みにします
            </p>

            {/* Swipe Slider */}
            <div
              ref={sliderRef}
              className="relative w-full max-w-sm h-16 bg-slate-100 rounded-full overflow-hidden select-none touch-none"
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseLeave}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Progress fill */}
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500/20 to-indigo-500/40 rounded-full transition-none"
                style={{ width: `${slideX + THUMB_SIZE}px` }}
              />

              {/* Label */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ opacity: 1 - progress }}
              >
                <span className="text-slate-400 text-sm font-bold tracking-widest ml-8">
                  スライドで使用 →
                </span>
              </div>

              {/* Thumb */}
              <div
                className="absolute top-1 left-1 w-[56px] h-[56px] bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
                style={{
                  transform: `translateX(${slideX}px)`,
                  transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                }}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          </>
        ) : (
          /* Redeemed State */
          <div className="flex flex-col items-center text-center coupon-redeemed-enter">
            <div className="w-full max-w-sm relative">
              {/* Grayed out coupon */}
              <div className="relative bg-gradient-to-br from-slate-400 to-slate-500 rounded-3xl p-6 text-white shadow-xl overflow-hidden">
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full" />
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full" />

                <div className="relative z-10 opacity-50">
                  {catConfig && (
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                      {catConfig.emoji} {catConfig.label}
                    </span>
                  )}
                  <p className="text-white/70 text-sm font-medium mb-1">{coupon.brand_name}</p>
                  <h3 className="text-xl font-bold mb-4 leading-snug">{coupon.title}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-black tracking-tight">{getDiscountText()}</span>
                    <span className="text-lg font-bold text-white/80">OFF</span>
                  </div>
                  <div className="border-t border-dashed border-white/30 my-4" />
                  <div className="flex justify-between items-center text-xs text-white/60">
                    <span>有効期限: {new Date(coupon.valid_until).toLocaleDateString('ja-JP')}</span>
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {coupon.id.slice(0, 8)}</span>
                  </div>
                </div>

                {/* USED stamp */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="coupon-stamp-enter border-4 border-red-500 rounded-2xl px-8 py-3 -rotate-12">
                    <p className="text-red-500 text-4xl font-black tracking-wider">使用済み</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 coupon-check-enter">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-slate-900 text-lg font-bold mb-1">クーポンを使用しました</p>
              <p className="text-slate-400 text-sm">{timeStr}</p>
            </div>

            <button
              onClick={onClose}
              className="mt-10 w-full max-w-sm bg-slate-900 text-white py-4 rounded-2xl font-bold text-base hover:bg-slate-800 transition-colors"
            >
              閉じる
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
