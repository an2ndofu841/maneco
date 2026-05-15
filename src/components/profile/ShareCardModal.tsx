'use client'

import { useEffect, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { Download, Share2, X, Sparkles, Trophy, Wallet, Star } from 'lucide-react'
import { User } from '@/types'

const levelEmojis = ['🐣', '🐱', '😺', '😸', '🎯', '👑', '🏆', '⭐', '💫', '🌟']

const MONTH_THEMES = [
  { name: '新春', from: '#fde68a', via: '#fbbf24', to: '#f97316' },
  { name: '梅花', from: '#fbcfe8', via: '#f472b6', to: '#ec4899' },
  { name: '桜', from: '#fecdd3', via: '#fb7185', to: '#e11d48' },
  { name: '若葉', from: '#bbf7d0', via: '#4ade80', to: '#16a34a' },
  { name: '皐月', from: '#bae6fd', via: '#38bdf8', to: '#0284c7' },
  { name: '紫陽花', from: '#ddd6fe', via: '#a78bfa', to: '#7c3aed' },
  { name: '夏空', from: '#a5f3fc', via: '#22d3ee', to: '#0891b2' },
  { name: '向日葵', from: '#fef08a', via: '#facc15', to: '#eab308' },
  { name: '秋桜', from: '#fbcfe8', via: '#f472b6', to: '#be185d' },
  { name: '紅葉', from: '#fed7aa', via: '#fb923c', to: '#c2410c' },
  { name: '錦秋', from: '#fde68a', via: '#f59e0b', to: '#b45309' },
  { name: '聖夜', from: '#a7f3d0', via: '#34d399', to: '#047857' },
]

interface ShareCardModalProps {
  open: boolean
  onClose: () => void
  user: User
  completedTasksCount: number
}

export default function ShareCardModal({ open, onClose, user, completedTasksCount }: ShareCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const theme = MONTH_THEMES[now.getMonth()]
  const emoji = levelEmojis[Math.min(user.character_level - 1, levelEmojis.length - 1)]

  const generatePng = async () => {
    if (!cardRef.current) return null
    return toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    })
  }

  const handleDownload = async () => {
    setBusy(true)
    try {
      const dataUrl = await generatePng()
      if (!dataUrl) return
      const link = document.createElement('a')
      link.download = `maneco-${year}-${String(month).padStart(2, '0')}.png`
      link.href = dataUrl
      link.click()
    } catch (e) {
      console.error('Failed to generate image', e)
    } finally {
      setBusy(false)
    }
  }

  const handleShare = async () => {
    setBusy(true)
    try {
      const dataUrl = await generatePng()
      if (!dataUrl) return
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], `maneco-${year}-${month}.png`, { type: 'image/png' })

      if (typeof navigator !== 'undefined' && 'share' in navigator && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${year}年${month}月のわたし`,
          text: `${user.nickname}さん、今月もお金とのいい関係を築けました🐱 #マネコ #maneco`,
        })
      } else {
        await handleDownload()
      }
    } catch (e) {
      console.error('Failed to share', e)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-[2rem] p-6 shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900 text-lg">今月のシェアカード</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          がんばった{month}月の自分を、SNSで自慢できるカードに。<br />
          失敗の記録ではなく、<span className="font-bold text-indigo-600">成功だけ</span>を残します🎉
        </p>

        {/* 1:1 Share Card */}
        <div
          ref={cardRef}
          className="relative w-full aspect-square rounded-3xl overflow-hidden mx-auto"
          style={{
            background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.via} 50%, ${theme.to} 100%)`,
          }}
        >
          {/* Decorative blobs */}
          <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-white/30 blur-3xl" />
          <div className="absolute bottom-[-30%] left-[-15%] w-[70%] h-[70%] rounded-full bg-white/20 blur-3xl" />

          <div className="relative h-full flex flex-col text-white p-6">
            {/* Top: Brand & Month */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-white/30 backdrop-blur-md flex items-center justify-center text-xs">
                  🐱
                </div>
                <span className="font-bold text-sm tracking-tight drop-shadow-sm">maneco</span>
              </div>
              <div className="text-[10px] font-bold tracking-[0.2em] opacity-90 drop-shadow-sm">
                {theme.name.toUpperCase()}
              </div>
            </div>

            <div className="mt-2">
              <p className="text-[11px] font-bold tracking-[0.3em] opacity-80 drop-shadow-sm">
                {year}.{String(month).padStart(2, '0')}
              </p>
              <h3 className="text-2xl font-black drop-shadow-md leading-tight">
                {month}月のわたし
              </h3>
            </div>

            {/* Center: Mascot & Level */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-150" />
                <div className="relative w-24 h-24 rounded-full bg-white/30 backdrop-blur-md border-4 border-white/40 flex items-center justify-center text-5xl shadow-2xl">
                  {emoji}
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black tracking-wider shadow-lg whitespace-nowrap">
                  Lv.{user.character_level}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-white/30 backdrop-blur-md rounded-2xl p-2.5 border border-white/30">
                <div className="text-[9px] font-bold opacity-90 mb-0.5 flex items-center gap-1">
                  <Wallet className="w-2.5 h-2.5" /> SAVED
                </div>
                <p className="text-base font-black leading-none drop-shadow-sm">
                  ¥{user.total_savings.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/30 backdrop-blur-md rounded-2xl p-2.5 border border-white/30">
                <div className="text-[9px] font-bold opacity-90 mb-0.5 flex items-center gap-1">
                  <Star className="w-2.5 h-2.5" /> POINTS
                </div>
                <p className="text-base font-black leading-none drop-shadow-sm">
                  {user.total_points.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/30 backdrop-blur-md rounded-2xl p-2.5 border border-white/30">
                <div className="text-[9px] font-bold opacity-90 mb-0.5 flex items-center gap-1">
                  <Trophy className="w-2.5 h-2.5" /> TASKS
                </div>
                <p className="text-base font-black leading-none drop-shadow-sm">
                  {completedTasksCount}件
                </p>
              </div>
            </div>

            {/* Footer message */}
            <div className="text-center">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/30 backdrop-blur-md border border-white/30 text-[10px] font-bold drop-shadow-sm">
                <Sparkles className="w-2.5 h-2.5" />
                <span>お金との、いい関係。</span>
              </div>
              <p className="text-[9px] mt-1.5 opacity-80 drop-shadow-sm">
                @{user.nickname} ・ maneco.app
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-5">
          <button
            onClick={handleDownload}
            disabled={busy}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            画像で保存
          </button>
          <button
            onClick={handleShare}
            disabled={busy}
            className="btn-primary flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 disabled:opacity-50"
          >
            <Share2 className="w-4 h-4" />
            {busy ? '生成中...' : 'シェアする'}
          </button>
        </div>

        <p className="text-[11px] text-slate-400 text-center mt-3 leading-relaxed">
          📱 SNS（Instagram・X・LINE）で1:1サイズで綺麗に投稿できます
        </p>
      </div>
    </div>
  )
}
