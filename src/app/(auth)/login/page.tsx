'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('メールアドレスまたはパスワードが正しくありません')
    } else {
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen bg-[#0f0f14] flex flex-col overflow-hidden">
      {/* 背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-30%] left-[-20%] w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-orange-500/6 rounded-full blur-[80px]" />
      </div>

      {/* ヘッダー */}
      <div className="relative z-10 flex items-center gap-2.5 px-6 pt-14 pb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-lg">
          🐱
        </div>
        <span className="font-black text-white text-base">マネコ</span>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-8">
        <div className="max-w-sm mx-auto w-full">
          <h1 className="text-3xl font-black text-white mb-1">おかえり</h1>
          <p className="text-white/40 text-sm mb-8">アカウントにログインしてください</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 mb-5 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Googleログイン */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 glass py-3.5 rounded-2xl text-sm font-medium text-white hover:bg-white/10 transition-all mb-5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Googleでログイン
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/25 text-xs">または</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレス"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-11 py-3.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all"
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
              {loading ? '確認中...' : (
                <>ログイン <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-white/30 text-xs mt-6">
            アカウントをお持ちでない方は{' '}
            <Link href="/register" className="text-amber-400 hover:text-amber-300 font-medium">
              新規登録
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
