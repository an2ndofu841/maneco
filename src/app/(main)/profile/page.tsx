'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@/types'
import { LogOut, ChevronRight, Target, User as UserIcon, Edit2 } from 'lucide-react'

const AGE_GROUPS = [
  { value: 'teen', label: '10代' },
  { value: '20s', label: '20代' },
  { value: '30s', label: '30代' },
  { value: '40s', label: '40代' },
  { value: '50s', label: '50代' },
  { value: '60plus', label: '60代以上' },
]

const OCCUPATIONS = [
  { value: 'student', label: '学生' },
  { value: 'employee', label: '会社員' },
  { value: 'freelance', label: 'フリーランス' },
  { value: 'part_time', label: 'アルバイト/パート' },
  { value: 'housewife', label: '専業主婦/夫' },
  { value: 'other', label: 'その他' },
]

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ nickname: '', age_group: '', occupation: '', goal_title: '', goal_amount: '' })
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return

    const { data } = await supabase.from('users').select('*').eq('id', authUser.id).single()
    if (data) {
      setUser(data as User)
      setForm({
        nickname: data.nickname ?? '',
        age_group: data.age_group ?? '',
        occupation: data.occupation ?? '',
        goal_title: data.goal_title ?? '',
        goal_amount: data.goal_amount?.toString() ?? '',
      })
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

    if (!error) {
      await loadProfile()
      setEditing(false)
    }
    setSaving(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-4xl animate-bounce">🐱</div>
      </div>
    )
  }

  const levelEmojis = ['🐣', '🐱', '😺', '😸', '🎯', '👑', '🏆', '⭐', '💫', '🌟']
  const emoji = levelEmojis[Math.min(user.character_level - 1, levelEmojis.length - 1)]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-4 pt-12 pb-8">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg mb-3">
            {emoji}
          </div>
          <h2 className="text-white font-bold text-xl">{user.nickname}</h2>
          <p className="text-white/60 text-sm">{user.email}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="bg-amber-400/30 text-amber-300 text-xs px-3 py-1 rounded-full">
              Lv.{user.character_level}
            </span>
            <span className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full">
              {user.total_points.toLocaleString()}pt
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {!editing ? (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-700 text-sm">プロフィール</span>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1 text-amber-500 text-xs font-medium"
                >
                  <Edit2 className="w-3 h-3" />
                  編集
                </button>
              </div>

              <div className="divide-y divide-gray-50">
                {[
                  { label: 'ニックネーム', value: user.nickname },
                  { label: '年代', value: AGE_GROUPS.find((a) => a.value === user.age_group)?.label ?? '未設定' },
                  { label: '職業', value: OCCUPATIONS.find((o) => o.value === user.occupation)?.label ?? '未設定' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs text-gray-400">{label}</span>
                    <span className="text-sm text-gray-700 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-50">
                <Target className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-700 text-sm">目標設定</span>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { label: '目標タイトル', value: user.goal_title ?? '未設定' },
                  { label: '目標金額', value: user.goal_amount ? `¥${user.goal_amount.toLocaleString()}` : '未設定' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs text-gray-400">{label}</span>
                    <span className="text-sm text-gray-700 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-50">
                {[
                  { label: '累計獲得ポイント', value: `${user.total_points.toLocaleString()} pt` },
                  { label: '累計節約額', value: `¥${user.total_savings.toLocaleString()}` },
                  { label: 'キャラクターレベル', value: `Lv.${user.character_level}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs text-gray-400">{label}</span>
                    <span className="text-sm text-amber-500 font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-500 py-3.5 rounded-2xl font-medium text-sm hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              ログアウト
            </button>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
            <h3 className="font-bold text-gray-800">プロフィール編集</h3>

            {[
              { label: 'ニックネーム', key: 'nickname', type: 'text', placeholder: 'マネコタロウ' },
              { label: '目標タイトル', key: 'goal_title', type: 'text', placeholder: '例：沖縄旅行資金' },
              { label: '目標金額', key: 'goal_amount', type: 'number', placeholder: '50000' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            ))}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">年代</label>
              <div className="grid grid-cols-3 gap-2">
                {AGE_GROUPS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setForm({ ...form, age_group: value })}
                    className={`py-2 rounded-xl text-xs font-medium border transition-colors ${
                      form.age_group === value
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'text-gray-500 border-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">職業</label>
              <div className="grid grid-cols-2 gap-2">
                {OCCUPATIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setForm({ ...form, occupation: value })}
                    className={`py-2 rounded-xl text-xs font-medium border transition-colors ${
                      form.occupation === value
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'text-gray-500 border-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 border border-gray-200 py-3 rounded-xl text-gray-600 text-sm font-medium"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50"
              >
                {saving ? '保存中...' : '保存する'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
