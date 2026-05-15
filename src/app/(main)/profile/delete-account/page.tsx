'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@/types'
import {
  ArrowLeft,
  AlertTriangle,
  Trash2,
  X,
  Heart,
  Wallet,
  Star,
  Trophy,
  ShieldAlert,
} from 'lucide-react'

const CONFIRM_PHRASE = 'アカウントを削除します'

const REASONS = [
  { value: 'not_using', label: 'あまり使わなくなった', emoji: '😴' },
  { value: 'expectation', label: '期待した内容と違った', emoji: '🤔' },
  { value: 'bug', label: '不具合・使いづらかった', emoji: '🐛' },
  { value: 'privacy', label: 'プライバシーが気になる', emoji: '🔒' },
  { value: 'other_app', label: '他のアプリに乗り換える', emoji: '👋' },
  { value: 'temporary', label: '一時的にやめたい', emoji: '⏸️' },
  { value: 'other', label: 'その他', emoji: '✏️' },
]

export default function DeleteAccountPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [reason, setReason] = useState<string>('')
  const [feedback, setFeedback] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [showFinal, setShowFinal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/login')
        return
      }
      const { data } = await supabase.from('users').select('*').eq('id', authUser.id).single()
      if (data) setUser(data as User)
      setLoading(false)
    }
    void load()
  }, [router, supabase])

  const canConfirm = reason !== '' && confirmText === CONFIRM_PHRASE

  const handleDelete = async () => {
    if (!canConfirm) return
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmPhrase: confirmText,
          reason,
          feedback,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'アカウント削除に失敗しました')
        setSubmitting(false)
        return
      }

      // クライアント側もサインアウト
      await supabase.auth.signOut()
      router.push('/?goodbye=1')
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('通信エラーが発生しました')
      setSubmitting(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🐱</div>
      </div>
    )
  }

  const daysWithUs = user.created_at
    ? Math.max(1, Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)))
    : 1

  return (
    <div className="min-h-screen md:pb-12">
      <div className="app-container pt-6 md:pt-12 max-w-2xl">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          マイページに戻る
        </Link>

        <div className="mb-8">
          <p className="text-slate-500 text-sm font-medium mb-1">アカウント削除</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">本当にお別れですか？</h1>
        </div>

        {/* これまでの記録 */}
        <div className="rounded-3xl p-6 mb-6 relative overflow-hidden bg-gradient-to-br from-indigo-500 to-blue-500 text-white">
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4" />
              <p className="text-xs font-bold tracking-widest opacity-90">YOUR JOURNEY</p>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              {user.nickname}さんがマネコを使って<strong>{daysWithUs}日</strong>。
              これまでに積み重ねた成功は、こんな感じでした。
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/30">
                <Wallet className="w-4 h-4 mb-1 opacity-90" />
                <p className="text-[10px] font-bold opacity-90 mb-0.5">節約額</p>
                <p className="text-lg font-black leading-none">¥{user.total_savings.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/30">
                <Star className="w-4 h-4 mb-1 opacity-90" />
                <p className="text-[10px] font-bold opacity-90 mb-0.5">ポイント</p>
                <p className="text-lg font-black leading-none">{user.total_points.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/30">
                <Trophy className="w-4 h-4 mb-1 opacity-90" />
                <p className="text-[10px] font-bold opacity-90 mb-0.5">レベル</p>
                <p className="text-lg font-black leading-none">Lv.{user.character_level}</p>
              </div>
            </div>
          </div>
        </div>

        {/* やんわり引き止め */}
        <div className="rounded-2xl p-5 mb-6 bg-amber-50 border border-amber-200">
          <p className="text-sm text-amber-900 leading-relaxed">
            <strong>💡 ちょっと待って！こんな選択肢もあります</strong>
          </p>
          <ul className="mt-3 space-y-2 text-xs text-amber-800 leading-relaxed">
            <li>・通知が多いだけなら、<Link href="/profile" className="underline font-bold">マイページ</Link>から設定変更できます</li>
            <li>・しばらく使わないだけなら、ログアウトでOK（データはそのまま保持）</li>
            <li>・困っていることがあれば、AIに「使い方教えて」と話しかけてみてください</li>
          </ul>
        </div>

        {/* 削除すると失うもの */}
        <div className="bento-card rounded-3xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <h2 className="font-bold text-slate-900">アカウントを削除すると...</h2>
          </div>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 mt-0.5">●</span>
              <span>これまでの<strong className="text-slate-900">節約額・ポイント・キャラクターのレベル</strong>がすべて失われます</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 mt-0.5">●</span>
              <span>登録した<strong className="text-slate-900">固定費・目標・チャット履歴</strong>もすべて削除されます</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 mt-0.5">●</span>
              <span><strong className="text-slate-900">復元はできません</strong>（再登録すると新規ユーザーとして始まります）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">●</span>
              <span>同じメールアドレスで<strong className="text-slate-900">再登録は可能</strong>です</span>
            </li>
          </ul>
        </div>

        {/* 退会理由 */}
        <div className="bento-card rounded-3xl p-6 mb-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            よろしければ理由を教えてください
          </p>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            匿名で記録されます。ユーザーIDとは紐付きません。<br />
            あなたの声がサービス改善に役立ちます🙏
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {REASONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setReason(opt.value)}
                className={`p-3 rounded-2xl text-left border transition-all flex items-center gap-2 ${
                  reason === opt.value
                    ? 'bg-rose-50 border-rose-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl">{opt.emoji}</span>
                <span className={`text-sm font-bold ${reason === opt.value ? 'text-rose-700' : 'text-slate-700'}`}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
              一言コメント (任意)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="改善してほしい点・あったら使い続けた機能などお聞かせください"
              rows={3}
              maxLength={500}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{feedback.length} / 500</p>
          </div>
        </div>

        {/* 確認文字列 */}
        <div className="bento-card rounded-3xl p-6 mb-6 border-2 border-rose-100">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <p className="font-bold text-slate-900">最終確認</p>
          </div>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            退会の意思を確認するため、以下のテキストを<strong className="text-rose-600">そのまま</strong>入力してください。
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3 font-mono text-center font-bold text-slate-900">
            {CONFIRM_PHRASE}
          </div>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="ここに上の文字列を入力"
            className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all"
          />
        </div>

        {error && (
          <div className="rounded-2xl p-4 mb-4 bg-red-50 border border-red-200 text-red-700 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* アクションボタン */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/profile"
            className="py-4 rounded-2xl font-bold text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 text-rose-500" />
            やっぱりやめる
          </Link>
          <button
            onClick={() => setShowFinal(true)}
            disabled={!canConfirm || submitting}
            className="py-4 rounded-2xl font-bold text-sm bg-rose-600 text-white hover:bg-rose-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            アカウントを削除する
          </button>
        </div>

        <p className="text-xs text-slate-400 text-center mt-6 leading-relaxed">
          不具合や問題があった場合は、<br />
          削除前にお問い合わせいただけると改善できます🙏
        </p>
      </div>

      {/* 最終確認モーダル */}
      {showFinal && (
        <div
          className="fixed inset-0 z-[60] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => !submitting && setShowFinal(false)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {!submitting && (
              <button
                onClick={() => setShowFinal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">本当に削除しますか？</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                この操作は<strong className="text-rose-600">取り消せません</strong>。<br />
                {user.nickname}さんのすべてのデータが、サーバーから完全に削除されます。
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowFinal(false)}
                  disabled={submitting}
                  className="py-3.5 rounded-2xl font-bold text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleDelete}
                  disabled={submitting}
                  className="py-3.5 rounded-2xl font-bold text-sm bg-rose-600 text-white hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? '削除中...' : '完全に削除する'}
                </button>
              </div>

              {!submitting && (
                <p className="text-xs text-slate-400 mt-4">
                  削除後はトップページに戻ります
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
