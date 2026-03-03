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
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/50 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-xl p-12 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mb-6 mx-auto animate-bounce">
            <Mail className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">確認メールを送信しました</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            メール内のリンクをクリックして<br />登録を完了してください。
          </p>
          <p className="text-xs text-slate-400">3秒後にログイン画面へ移動します...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/50 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-xl overflow-hidden">
        
        {/* 左側：ブランディング (PCのみ) */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-lg shadow-md">
              🐱
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">maneco</span>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
              無理なく続く、<br />
              <span className="text-indigo-600">マネープラン習慣。</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              登録後すぐに、AIコンシェルジュが<br />
              あなた向けの節約・収益アクションを提案します。
            </p>
          </div>
          
          <div className="text-xs text-slate-400">
            © 2026 maneco
          </div>
        </div>

        {/* 右側：フォーム */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-lg shadow-md">
              🐱
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">maneco</span>
          </div>

          <div className="text-center md:text-left mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">はじめまして</h1>
            <p className="text-slate-500 text-sm">30秒で登録完了！無料で全機能使えます</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-6 flex items-center gap-2 border border-red-100">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="ニックネーム"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレス"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード（8文字以上）"
                minLength={8}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-12 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登録中...' : (
                <>無料で登録する <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-8">
            すでにアカウントをお持ちの方は{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-bold">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
