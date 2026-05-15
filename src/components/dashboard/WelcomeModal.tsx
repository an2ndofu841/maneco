'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  X,
  MessageCircle,
  TrendingUp,
  Wallet,
  Ticket,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

const CONFETTI_COLORS = ['#fbbf24', '#f97316', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981']

const QUICK_STARTS = [
  {
    href: '/earn',
    icon: TrendingUp,
    title: 'まず1件こなして稼ぐ',
    desc: '5分のアンケートで最大300pt',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    iconColor: 'text-emerald-600 bg-emerald-100',
  },
  {
    href: '/profile/fixed-costs',
    icon: Wallet,
    title: '固定費を登録',
    desc: 'AIが見直しポイントを提案',
    color: 'text-indigo-700 bg-indigo-50 border-indigo-100',
    iconColor: 'text-indigo-600 bg-indigo-100',
  },
  {
    href: '/smart',
    icon: Ticket,
    title: 'クーポン・旅行プランを見る',
    desc: '今すぐ使える特典をチェック',
    color: 'text-violet-700 bg-violet-50 border-violet-100',
    iconColor: 'text-violet-600 bg-violet-100',
  },
]

interface WelcomeModalProps {
  shouldClaim: boolean
  nickname: string
}

export default function WelcomeModal({ shouldClaim, nickname }: WelcomeModalProps) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [open, setOpen] = useState(false)
  const [pointsClaimed, setPointsClaimed] = useState<number | null>(null)
  const [claiming, setClaiming] = useState(false)
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    if (!shouldClaim) return
    let cancelled = false

    const claim = async () => {
      setClaiming(true)
      const { data, error } = await supabase.rpc('claim_welcome_bonus')
      if (cancelled) return
      const awarded = !error && typeof data === 'number' ? data : 0
      setPointsClaimed(awarded)
      setClaiming(false)
      if (awarded > 0) setOpen(true)
    }

    void claim()
    return () => {
      cancelled = true
    }
  }, [shouldClaim, supabase])

  useEffect(() => {
    if (!open || pointsClaimed === null) return
    let frame = 0
    const target = pointsClaimed
    const interval = setInterval(() => {
      frame += 1
      const next = Math.min(target, frame)
      setCounter(next)
      if (next >= target) clearInterval(interval)
    }, 80)
    return () => clearInterval(interval)
  }, [open, pointsClaimed])

  const handleClose = () => {
    setOpen(false)
    router.refresh()
  }

  if (!open || claiming) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      {/* コンフェッティ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => {
          const left = Math.random() * 100
          const delay = Math.random() * 1.5
          const duration = 2.5 + Math.random() * 2
          const size = 6 + Math.random() * 8
          const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length]
          return (
            <span
              key={i}
              className="absolute confetti-particle"
              style={{
                left: `${left}%`,
                top: '-20px',
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                borderRadius: i % 3 === 0 ? '50%' : '2px',
              }}
            />
          )
        })}
      </div>

      <div
        className="relative w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl text-center animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
          aria-label="閉じる"
        >
          <X className="w-5 h-5" />
        </button>

        {/* キラキラ装飾 */}
        <div className="absolute top-6 left-6 text-amber-400 animate-pulse">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="absolute top-12 right-12 text-pink-400 animate-pulse" style={{ animationDelay: '0.5s' }}>
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="absolute bottom-32 left-10 text-indigo-400 animate-pulse" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-3 h-3" />
        </div>

        {/* マスコット */}
        <div className="relative w-28 h-28 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-pink-400 blur-2xl opacity-60 animate-pulse" />
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-6xl shadow-2xl shadow-indigo-500/40 animate-bounce-soft border-4 border-white">
            🐱
          </div>
        </div>

        <p className="text-xs font-bold tracking-wider text-indigo-600 mb-2">WELCOME TO MANECO</p>
        <h2 className="text-2xl font-black text-slate-900 mb-2 leading-tight">
          ようこそ、<br />
          <span className="text-gradient-primary">{nickname}</span>さん！
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          登録ありがとうございます🎉<br />
          ここから一緒に、お金の不安をなくしていきましょう。
        </p>

        {/* ポイント付与カード */}
        <div className="relative bg-gradient-to-br from-amber-400 via-orange-400 to-pink-500 rounded-2xl p-5 mb-6 text-white overflow-hidden shadow-lg shadow-amber-200">
          <div className="absolute top-[-30%] right-[-10%] w-32 h-32 bg-white/20 rounded-full blur-2xl" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="text-4xl">🎁</div>
            <div className="text-left flex-1">
              <p className="text-[11px] font-bold opacity-90 tracking-wider mb-0.5">
                登録お祝いプレゼント
              </p>
              <p className="text-3xl font-black tracking-tight leading-none">
                +{counter}
                <span className="text-base font-bold ml-1">pt</span>
              </p>
              <p className="text-[11px] opacity-90 mt-1">アカウントに付与しました</p>
            </div>
          </div>
        </div>

        {/* クイックスタート */}
        <p className="text-xs font-bold text-slate-500 tracking-wider mb-3">FIRST STEP</p>
        <div className="space-y-2 mb-6 text-left">
          {QUICK_STARTS.map(({ href, icon: Icon, title, desc, color, iconColor }) => (
            <Link
              key={href}
              href={href}
              onClick={handleClose}
              className={`flex items-center gap-3 p-3 rounded-2xl border ${color} hover:shadow-md transition-all group`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-900">{title}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>

        <button
          onClick={handleClose}
          className="w-full btn-primary py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
        >
          <MessageCircle className="w-4 h-4" />
          まずはAIに話しかけてみる
        </button>
      </div>
    </div>
  )
}
