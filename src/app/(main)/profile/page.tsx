'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@/types'
import { LogOut, Edit2, Target, ChevronRight } from 'lucide-react'

const AGE_GROUPS = [
  { value: 'teen', label: '10代' }, { value: '20s', label: '20代' },
  { value: '30s', label: '30代' }, { value: '40s', label: '40代' },
  { value: '50s', label: '50代' }, { value: '60plus', label: '60代+' },
]

const OCCUPATIONS = [
  { value: 'student', label: '学生' }, { value: 'employee', label: '会社員' },
  { value: 'freelance', label: 'フリーランス' }, { value: 'part_time', label: 'バイト/パート' },
  { value: 'housewife', label: '専業主婦/夫' }, { value: 'other', label: 'その他' },
]

const levelEmojis = ['🐣', '🐱', '😺', '😸', '🎯', '👑', '🏆', '⭐', '💫', '🌟']

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ nickname: '', age_group: '', occupation: '', goal_title: '', goal_amount: '' })
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => { loadProfile() }, [])

  const loadProfile = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return
    const { data } = await supabase.from('users').select('*').eq('id', authUser.id).single()
    if (data) {
      setUser(data as User)
      setForm({ nickname: data.nickname ?? '', age_group: data.age_group ?? '', occupation: data.occupation ?? '', goal_title: data.goal_title ?? '', goal_amount: data.goal_amount?.toString() ?? '' })
    }
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    const { error } = await supabase.from('users').update({
      nickname: form.nickname,
      age_group: form.age_group || null,
      occupation: form.occupation || null,
      goal_title: form.goal_title || null,
      goal_amount: form.goal_amount ? parseInt(form.goal_amount) : null,
    }).eq('id', user.id)
    if (!error) { await loadProfile(); setEditing(false) }
    setSaving(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-3xl animate-bounce">🐱</div>
      </div>
    )
  }

  const emoji = levelEmojis[Math.min(user.character_level - 1, levelEmojis.length - 1)]
  const ageLabel = AGE_GROUPS.find((a) => a.value === user.age_group)?.label
  const occupationLabel = OCCUPATIONS.find((o) => o.value === user.occupation)?.label

  return (
    <div className="min-h-screen bg-transparent">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-[50%] -translate-x-[50%] w-[300px] h-[200px] bg-amber-500/6 rounded-full blur-[60px]" />
      </div>

      {/* プロフィールヘッダー */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 pb-6 pt-16 text-center md:px-0 md:pt-10">
        <div className="relative inline-block mb-3">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto animate-float"
            style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)' }}>
            {emoji}
          </div>
          <div className="absolute -bottom-1 -right-1 gradient-gold text-black text-xs font-black rounded-full w-6 h-6 flex items-center justify-center">
            {user.character_level}
          </div>
        </div>
        <h2 className="text-white font-black text-xl">{user.nickname}</h2>
        <p className="text-white/30 text-xs mt-0.5">{user.email}</p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            {user.total_points.toLocaleString()} pt
          </span>
          {ageLabel && <span className="text-xs text-white/30 bg-white/5 border border-white/10 px-3 py-1 rounded-full">{ageLabel}</span>}
          {occupationLabel && <span className="text-xs text-white/30 bg-white/5 border border-white/10 px-3 py-1 rounded-full">{occupationLabel}</span>}
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl space-y-4 px-4 md:px-0">
        {!editing ? (
          <>
            {/* 実績 */}
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {[
                { label: '保有pt', value: `${user.total_points.toLocaleString()}`, color: 'text-amber-400' },
                { label: '節約額', value: `¥${user.total_savings.toLocaleString()}`, color: 'text-emerald-400' },
                { label: 'キャラLv', value: `Lv.${user.character_level}`, color: 'text-violet-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-2xl p-3 text-center border border-white/8" style={{ background: '#1a1a24' }}>
                  <p className={`font-black text-base ${color}`}>{value}</p>
                  <p className="text-white/30 text-[10px] mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* プロフィール情報 */}
            <div className="rounded-3xl overflow-hidden border border-white/8" style={{ background: '#1a1a24' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <p className="text-white/50 text-xs font-medium">プロフィール</p>
                <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-amber-400 text-xs font-medium">
                  <Edit2 className="w-3 h-3" />編集
                </button>
              </div>
              {[
                { label: 'ニックネーム', value: user.nickname },
                { label: '年代', value: ageLabel ?? '未設定' },
                { label: '職業', value: occupationLabel ?? '未設定' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-4 py-3.5 border-b border-white/5 last:border-0">
                  <span className="text-white/30 text-xs">{label}</span>
                  <span className="text-white text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>

            {/* 目標設定 */}
            {user.goal_title && (
              <div className="rounded-3xl p-4 border border-amber-500/15"
                style={{ background: 'linear-gradient(135deg, #1a1005 0%, #1e1408 100%)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-amber-400" />
                  <p className="text-amber-400 text-xs font-bold">目標設定</p>
                </div>
                <p className="text-white font-bold">{user.goal_title}</p>
                {user.goal_amount && (
                  <>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full gradient-gold rounded-full"
                        style={{ width: `${Math.min(user.total_points / user.goal_amount * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-white/30 text-xs mt-1">
                      ¥{user.total_points.toLocaleString()} / ¥{user.goal_amount.toLocaleString()}
                    </p>
                  </>
                )}
              </div>
            )}

            {/* ログアウト */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 border border-red-500/20 text-red-400 py-3.5 rounded-2xl font-medium text-sm bg-red-500/5 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              ログアウト
            </button>
          </>
        ) : (
          <div className="rounded-3xl p-5 border border-white/8 space-y-4" style={{ background: '#1a1a24' }}>
            <h3 className="font-black text-white text-lg">プロフィール編集</h3>

            {[
              { label: 'ニックネーム', key: 'nickname', type: 'text', placeholder: 'マネコタロウ' },
              { label: '目標タイトル', key: 'goal_title', type: 'text', placeholder: '例：沖縄旅行資金' },
              { label: '目標金額', key: 'goal_amount', type: 'number', placeholder: '50000' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="text-white/40 text-xs mb-1.5 block">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/40 transition-all"
                />
              </div>
            ))}

            <div>
              <label className="text-white/40 text-xs mb-2 block">年代</label>
              <div className="grid grid-cols-3 gap-2">
                {AGE_GROUPS.map(({ value, label }) => (
                  <button key={value} onClick={() => setForm({ ...form, age_group: value })}
                    className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                      form.age_group === value
                        ? 'gradient-gold text-black border-transparent'
                        : 'text-white/30 border-white/10 hover:border-white/20'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-white/40 text-xs mb-2 block">職業</label>
              <div className="grid grid-cols-2 gap-2">
                {OCCUPATIONS.map(({ value, label }) => (
                  <button key={value} onClick={() => setForm({ ...form, occupation: value })}
                    className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                      form.occupation === value
                        ? 'gradient-gold text-black border-transparent'
                        : 'text-white/30 border-white/10 hover:border-white/20'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditing(false)}
                className="flex-1 border border-white/10 py-3 rounded-2xl text-white/40 text-sm font-medium hover:bg-white/5">
                キャンセル
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 gradient-gold text-black font-black py-3 rounded-2xl text-sm disabled:opacity-40 glow-gold-sm">
                {saving ? '保存中...' : '保存する'}
              </button>
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  )
}
