'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Coupon } from '@/types'
import { X, CheckCircle, Tag, Coins, ArrowRight } from 'lucide-react'

const COUPON_CATEGORY_CONFIG: Record<string, { label: string; emoji: string }> = {
  travel: { label: '旅行', emoji: '✈️' },
  food: { label: 'グルメ', emoji: '🍽️' },
  shopping: { label: 'ショッピング', emoji: '🛍️' },
  tax: { label: '節税', emoji: '💰' },
  telecom: { label: '通信費', emoji: '📱' },
  investment: { label: '投資', emoji: '📈' },
}

const QUICK_AMOUNTS = [500, 1000, 2000, 3000, 5000, 10000]

interface CouponRedeemModalProps {
  coupon: Coupon
  onClose: () => void
  onRedeem: (coupon: Coupon, savingsAmount: number) => void
}

type ModalStep = 'slide' | 'input_amount' | 'redeemed'

export default function CouponRedeemModal({ coupon, onClose, onRedeem }: CouponRedeemModalProps) {
  const [step, setStep] = useState<ModalStep>('slide')
  const [slideX, setSlideX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const trackWidth = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const [purchaseAmount, setPurchaseAmount] = useState('')
  const [savingsAmount, setSavingsAmount] = useState(0)

  const THUMB_SIZE = 64
  const THRESHOLD = 0.85

  const isPercentage = coupon.discount_type === 'percentage'

  useEffect(() => {
    if (sliderRef.current) {
      trackWidth.current = sliderRef.current.offsetWidth - THUMB_SIZE
    }
  }, [])

  useEffect(() => {
    if (step === 'input_amount' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [step])

  useEffect(() => {
    const amount = parseInt(purchaseAmount) || 0
    setSavingsAmount(Math.floor(amount * (coupon.discount_value / 100)))
  }, [purchaseAmount, coupon.discount_value])

  const getDiscountText = () =>
    coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `¥${coupon.discount_value.toLocaleString()}`

  const catConfig = COUPON_CATEGORY_CONFIG[coupon.category]

  const handleStart = useCallback(() => {
    if (step !== 'slide') return
    setIsDragging(true)
  }, [step])

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || step !== 'slide' || !sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const offsetX = clientX - rect.left - THUMB_SIZE / 2
    const maxX = trackWidth.current
    setSlideX(Math.max(0, Math.min(offsetX, maxX)))
  }, [isDragging, step])

  const handleEnd = useCallback(() => {
    if (!isDragging || step !== 'slide') return
    setIsDragging(false)

    const progress = slideX / trackWidth.current
    if (progress >= THRESHOLD) {
      setSlideX(trackWidth.current)
      if (isPercentage) {
        setStep('input_amount')
      } else {
        setStep('redeemed')
        onRedeem(coupon, coupon.discount_value)
      }
    } else {
      setSlideX(0)
    }
  }, [isDragging, step, slideX, coupon, onRedeem, isPercentage])

  const handleConfirmSavings = () => {
    if (savingsAmount <= 0) return
    setStep('redeemed')
    onRedeem(coupon, savingsAmount)
  }

  const handleSkipSavings = () => {
    setStep('redeemed')
    onRedeem(coupon, 0)
  }

  const onTouchStart = (e: React.TouchEvent) => handleStart()
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX)
  const onTouchEnd = () => handleEnd()

  const onMouseDown = (e: React.MouseEvent) => handleStart()
  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX)
  const onMouseUp = () => handleEnd()
  const onMouseLeave = () => { if (isDragging) handleEnd() }

  const progress = trackWidth.current > 0 ? slideX / trackWidth.current : 0

  const now = new Date()
  const timeStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const displaySavings = step === 'redeemed'
    ? (isPercentage ? savingsAmount : coupon.discount_value)
    : 0

  const renderCouponCard = (grayed: boolean) => (
    <div className="w-full max-w-sm">
      <div className={`relative rounded-3xl p-6 text-white shadow-xl overflow-hidden ${
        grayed
          ? 'bg-gradient-to-br from-slate-400 to-slate-500'
          : 'bg-gradient-to-br from-indigo-500 to-blue-600'
      }`}>
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full" />
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full" />

        <div className={`relative z-10 ${grayed ? 'opacity-50' : ''}`}>
          {catConfig && (
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
              {catConfig.emoji} {catConfig.label}
            </span>
          )}
          <p className="text-white/70 text-sm font-medium mb-1">{coupon.brand_name}</p>
          <h3 className="text-xl font-bold mb-4 leading-snug">{coupon.title}</h3>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl sm:text-5xl font-black tracking-tight">{getDiscountText()}</span>
            <span className="text-lg font-bold text-white/80">OFF</span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-4">{coupon.description}</p>
          <div className="border-t border-dashed border-white/30 my-4" />
          <div className="flex justify-between items-center text-xs text-white/60">
            <span>有効期限: {new Date(coupon.valid_until).toLocaleDateString('ja-JP')}</span>
            <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {coupon.id.slice(0, 8)}</span>
          </div>
        </div>

        {grayed && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="coupon-stamp-enter border-4 border-red-500 rounded-2xl px-8 py-3 -rotate-12">
              <p className="text-red-500 text-4xl font-black tracking-wider">使用済み</p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 w-32 h-32 border-4 border-white rounded-full" />
          <div className="absolute bottom-4 left-4 w-20 h-20 border-4 border-white rounded-full" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 safe-area-pt">
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
        <h2 className="font-bold text-slate-900 text-sm sm:text-base">
          {step === 'slide' && 'クーポンを使う'}
          {step === 'input_amount' && '節約額を記録'}
          {step === 'redeemed' && '使用完了'}
        </h2>
        <div className="w-10" />
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 overflow-auto safe-area-pb">
        {step === 'slide' && (
          <>
            {renderCouponCard(false)}

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
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500/20 to-indigo-500/40 rounded-full transition-none"
                style={{ width: `${slideX + THUMB_SIZE}px` }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ opacity: 1 - progress }}
              >
                <span className="text-slate-400 text-xs sm:text-sm font-bold tracking-widest ml-6 sm:ml-8">
                  スライドで使用 →
                </span>
              </div>
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
        )}

        {step === 'input_amount' && (
          <div className="w-full max-w-sm animate-fade-in">
            {/* Mini coupon reference */}
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl px-4 py-3 mb-6 flex items-center gap-3">
              <div className="bg-white/20 rounded-xl px-3 py-1.5">
                <span className="text-white text-lg font-black">{coupon.discount_value}%<span className="text-sm ml-0.5">OFF</span></span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/70 text-[10px] font-medium">{coupon.brand_name}</p>
                <p className="text-white text-sm font-bold truncate">{coupon.title}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0" />
            </div>

            {/* Input section */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <Coins className="w-4 h-4 text-amber-500" />
                <p className="text-slate-900 text-sm font-bold">お会計はいくらでしたか？</p>
              </div>
              <p className="text-slate-400 text-xs mb-5">割引前の金額を入力してください</p>

              {/* Amount input */}
              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-bold">¥</span>
                <input
                  ref={inputRef}
                  type="number"
                  inputMode="numeric"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-10 pr-4 py-4 text-2xl font-bold text-slate-900 text-right focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              {/* Quick amount buttons */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {QUICK_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setPurchaseAmount(String(amount))}
                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                      purchaseAmount === String(amount)
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 active:scale-95'
                    }`}
                  >
                    ¥{amount.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Savings preview */}
              <div className={`rounded-2xl p-4 transition-all ${
                savingsAmount > 0
                  ? 'bg-emerald-50 border border-emerald-100'
                  : 'bg-white border border-slate-100'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">今回の節約額</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-black transition-all ${
                      savingsAmount > 0 ? 'text-emerald-600' : 'text-slate-300'
                    }`}>
                      ¥{savingsAmount.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400">おトク</span>
                  </div>
                </div>
                {savingsAmount > 0 && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
                    <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    ¥{parseInt(purchaseAmount).toLocaleString()} の {coupon.discount_value}% = ¥{savingsAmount.toLocaleString()} 節約
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <button
              onClick={handleConfirmSavings}
              disabled={savingsAmount <= 0}
              className={`mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all ${
                savingsAmount > 0
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 active:scale-[0.98]'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              <Coins className="w-5 h-5" />
              ¥{savingsAmount.toLocaleString()} を節約額に記録
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleSkipSavings}
              className="mt-3 w-full py-3 text-sm font-medium text-slate-400 hover:text-slate-500 transition-colors"
            >
              スキップ（節約額を記録しない）
            </button>
          </div>
        )}

        {step === 'redeemed' && (
          <div className="flex flex-col items-center text-center coupon-redeemed-enter">
            {renderCouponCard(true)}

            <div className="mt-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 coupon-check-enter">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-slate-900 text-lg font-bold mb-1">クーポンを使用しました</p>
              <p className="text-slate-400 text-sm mb-3">{timeStr}</p>

              {displaySavings > 0 && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-6 py-3 flex items-center gap-3">
                  <Coins className="w-5 h-5 text-emerald-600" />
                  <div className="text-left">
                    <p className="text-emerald-800 text-xs font-medium">今回の節約額</p>
                    <p className="text-emerald-600 text-xl font-black">¥{displaySavings.toLocaleString()}</p>
                  </div>
                </div>
              )}
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
