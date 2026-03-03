'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message === 'User already registered'
        ? 'このメールアドレスはすでに登録されています'
        : '登録に失敗しました')
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/login'), 3000)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 border border-emerald-500/30">
            📧
          </div>
          <h2 className="text-xl font-black text-white mb-2">確認メールを送りました！</h2>
          <p className="text-white/40 text-sm leading-relaxed">
            メールのリンクをクリックして<br />登録を完了してください
          </p>
          <p className="text-white/25 text-xs mt-4">3秒後にログイン画面へ移動します...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f14] flex flex-col overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-30%] right-[-10%] w-[400px] h-[400px] bg-amber-500/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-orange-500/6 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 flex items-center gap-2.5 px-6 pt-14 pb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-lg">
          🐱
        </div>
        <span className="font-black text-white text-base">マネコ</span>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-8">
        <div className="max-w-sm mx-auto w-full">
          <h1 className="text-3xl font-black text-white mb-1">はじめまして</h1>
          <p className="text-white/40 text-sm mb-8">30秒で登録完了！無料で全機能使えます</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 mb-5 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="ニックネーム"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 transition-all"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレス"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード（8文字以上）"
                minLength={8}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-11 py-3.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-gold text-black font-black py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 glow-gold-sm hover:opacity-90 transition-all disabled:opacity-40 active:scale-[0.98] mt-2"
            >
              {loading ? '登録中...' : (
                <>無料で登録する <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-white/30 text-xs mt-6">
            すでにアカウントをお持ちの方は{' '}
            <Link href="/login" className="text-amber-400 hover:text-amber-300 font-medium">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
