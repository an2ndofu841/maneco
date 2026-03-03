'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@/types'
import { LogOut, Edit2, Target, Save, X, User as UserIcon, Briefcase, Calendar } from 'lucide-react'

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
      setForm({
        nickname: data.nickname ?? '',
        age_group: data.age_group ?? '',
        occupation: data.occupation ?? '',
        goal_title: data.goal_title ?? '',
        goal_amount: data.goal_amount?.toString() ?? ''
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🐱</div>
      </div>
    )
  }

  const emoji = levelEmojis[Math.min(user.character_level - 1, levelEmojis.length - 1)]
  const ageLabel = AGE_GROUPS.find((a) => a.value === user.age_group)?.label
  const occupationLabel = OCCUPATIONS.find((o) => o.value === user.occupation)?.label

  return (
    <div className="min-h-screen pb-24 md:pb-12">
      <div className="app-container pt-8 md:pt-12">
        
        {/* ヘッダー */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">アカウント設定</p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">マイページ</h1>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-bold hover:bg-indigo-100 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              編集する
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左カラム：プロフィールカード */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bento-card p-6 rounded-[2.5rem] text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500 to-blue-500" />
              
              <div className="relative z-10 mt-12 mb-4">
                <div className="w-28 h-28 mx-auto bg-white rounded-3xl shadow-xl flex items-center justify-center text-6xl border-4 border-white">
                  {emoji}
                </div>
                <div className="absolute bottom-0 right-1/2 translate-x-10 translate-y-2 bg-slate-900 text-white text-xs font-black px-2 py-1 rounded-full border-2 border-white">
                  Lv.{user.character_level}
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-1">{user.nickname}</h2>
              <p className="text-slate-500 text-xs mb-6">{user.email}</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                  <p className="text-slate-400 text-[10px] font-bold mb-1">年代</p>
                  <p className="text-slate-900 text-sm font-bold">{ageLabel ?? '未設定'}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                  <p className="text-slate-400 text-[10px] font-bold mb-1">職業</p>
                  <p className="text-slate-900 text-sm font-bold">{occupationLabel ?? '未設定'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <span className="text-amber-700 font-bold">保有ポイント</span>
                  <span className="text-amber-600 font-black">{user.total_points.toLocaleString()} pt</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <span className="text-emerald-700 font-bold">累計節約額</span>
                  <span className="text-emerald-600 font-black">¥{user.total_savings.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 border border-red-100 text-red-500 py-4 rounded-2xl font-bold text-sm bg-red-50 hover:bg-red-100 transition-all"
            >
              <LogOut className="w-4 h-4" />
              ログアウト
            </button>
          </div>

          {/* 右カラム：編集フォーム or 詳細情報 */}
          <div className="lg:col-span-2">
            {editing ? (
              <div className="bento-card p-6 md:p-8 rounded-[2.5rem] space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900">プロフィール編集</h3>
                  <button onClick={() => setEditing(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* 基本情報 */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">基本情報</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-700 text-xs font-bold mb-2 block">ニックネーム</label>
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={form.nickname}
                            onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="ニックネーム"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 属性 */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">属性（任意）</label>
                    
                    <div>
                      <label className="text-slate-700 text-xs font-bold mb-2 block flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> 年代
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {AGE_GROUPS.map(({ value, label }) => (
                          <button
                            key={value}
                            onClick={() => setForm({ ...form, age_group: value })}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                              form.age_group === value
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 text-xs font-bold mb-2 block flex items-center gap-2">
                        <Briefcase className="w-3 h-3" /> 職業
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {OCCUPATIONS.map(({ value, label }) => (
                          <button
                            key={value}
                            onClick={() => setForm({ ...form, occupation: value })}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                              form.occupation === value
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 目標 */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">目標設定</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-700 text-xs font-bold mb-2 block">目標タイトル</label>
                        <div className="relative">
                          <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={form.goal_title}
                            onChange={(e) => setForm({ ...form, goal_title: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="例：沖縄旅行"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-slate-700 text-xs font-bold mb-2 block">目標金額</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">¥</span>
                          <input
                            type="number"
                            value={form.goal_amount}
                            onChange={(e) => setForm({ ...form, goal_amount: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="50000"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setEditing(false)}
                    className="flex-1 py-3.5 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-50 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 btn-primary py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50"
                  >
                    {saving ? '保存中...' : (
                      <>
                        <Save className="w-4 h-4" />
                        保存する
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 目標カード */}
                <div className="bento-card p-6 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute right-0 top-0 w-40 h-40 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-indigo-600">現在の目標</p>
                        <h3 className="text-lg font-bold text-slate-900">{user.goal_title || '目標未設定'}</h3>
                      </div>
                    </div>

                    {user.goal_amount ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <p className="text-3xl font-black text-slate-900 tracking-tight">
                            {Math.round(Math.min(user.total_points / user.goal_amount * 100, 100))}%
                            <span className="text-sm font-medium text-slate-400 ml-1">達成</span>
                          </p>
                          <p className="text-sm font-bold text-slate-500">
                            ¥{user.total_points.toLocaleString()} / ¥{user.goal_amount.toLocaleString()}
                          </p>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${Math.min(user.total_points / user.goal_amount * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                        <p className="text-slate-400 text-sm font-medium">目標を設定して<br/>モチベーションを上げよう！</p>
                        <button
                          onClick={() => setEditing(true)}
                          className="mt-3 text-indigo-600 text-xs font-bold hover:underline"
                        >
                          目標を設定する →
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 獲得履歴（プレースホルダー） */}
                <div className="bento-card p-6 rounded-[2.5rem]">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">最近のアクティビティ</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl">
                        📝
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">アンケート回答</p>
                        <p className="text-xs text-slate-400">2026/03/03</p>
                      </div>
                      <span className="text-emerald-600 font-bold text-sm">+500 pt</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                        ✈️
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">旅行プラン作成</p>
                        <p className="text-xs text-slate-400">2026/03/02</p>
                      </div>
                      <span className="text-blue-600 font-bold text-sm">完了</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
