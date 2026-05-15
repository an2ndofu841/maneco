'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { FixedCost, FixedCostCategory, FixedCostBillingCycle } from '@/types'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  X,
  Save,
  Wallet,
  Lightbulb,
  Smartphone,
  Tv,
  ShieldCheck,
  Train,
  MoreHorizontal,
  Home,
  Sparkles,
  Power,
} from 'lucide-react'

const CATEGORIES: {
  value: FixedCostCategory
  label: string
  emoji: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bg: string
}[] = [
  { value: 'housing', label: '家賃・住居', emoji: '🏠', icon: Home, color: 'text-rose-600', bg: 'bg-rose-50' },
  { value: 'utility', label: '光熱費', emoji: '💡', icon: Lightbulb, color: 'text-amber-600', bg: 'bg-amber-50' },
  { value: 'communication', label: '通信費', emoji: '📱', icon: Smartphone, color: 'text-sky-600', bg: 'bg-sky-50' },
  { value: 'subscription', label: 'サブスク', emoji: '🎬', icon: Tv, color: 'text-violet-600', bg: 'bg-violet-50' },
  { value: 'insurance', label: '保険', emoji: '🛡️', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { value: 'transportation', label: '交通費', emoji: '🚃', icon: Train, color: 'text-blue-600', bg: 'bg-blue-50' },
  { value: 'other', label: 'その他', emoji: '📌', icon: MoreHorizontal, color: 'text-slate-600', bg: 'bg-slate-50' },
]

const CYCLES: { value: FixedCostBillingCycle; label: string }[] = [
  { value: 'monthly', label: '月額' },
  { value: 'yearly', label: '年額' },
]

const monthlyAmount = (cost: Pick<FixedCost, 'amount' | 'billing_cycle'>) =>
  cost.billing_cycle === 'yearly' ? Math.round(cost.amount / 12) : cost.amount

type FormState = {
  id: string | null
  name: string
  category: FixedCostCategory
  amount: string
  billing_cycle: FixedCostBillingCycle
}

const emptyForm: FormState = {
  id: null,
  name: '',
  category: 'subscription',
  amount: '',
  billing_cycle: 'monthly',
}

export default function FixedCostsPage() {
  const supabase = createClient()
  const [costs, setCosts] = useState<FixedCost[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)

  useEffect(() => {
    void loadCosts()
  }, [])

  const loadCosts = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from('user_fixed_costs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setCosts((data as FixedCost[]) ?? [])
    setLoading(false)
  }

  const totalMonthly = useMemo(
    () => costs.filter((c) => c.is_active).reduce((sum, c) => sum + monthlyAmount(c), 0),
    [costs]
  )
  const activeCount = costs.filter((c) => c.is_active).length

  const grouped = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      ...cat,
      items: costs.filter((c) => c.category === cat.value),
    })).filter((g) => g.items.length > 0)
  }, [costs])

  const openNew = () => {
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (cost: FixedCost) => {
    setForm({
      id: cost.id,
      name: cost.name,
      category: cost.category,
      amount: cost.amount.toString(),
      billing_cycle: cost.billing_cycle,
    })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setForm(emptyForm)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.amount) return
    const amountNum = parseInt(form.amount, 10)
    if (Number.isNaN(amountNum) || amountNum < 0) return

    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setSaving(false)
      return
    }

    const payload = {
      user_id: user.id,
      name: form.name.trim(),
      category: form.category,
      amount: amountNum,
      billing_cycle: form.billing_cycle,
    }

    if (form.id) {
      await supabase.from('user_fixed_costs').update(payload).eq('id', form.id)
    } else {
      await supabase.from('user_fixed_costs').insert(payload)
    }

    await loadCosts()
    closeForm()
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('この固定費を削除しますか？')) return
    await supabase.from('user_fixed_costs').delete().eq('id', id)
    await loadCosts()
  }

  const handleToggleActive = async (cost: FixedCost) => {
    await supabase
      .from('user_fixed_costs')
      .update({ is_active: !cost.is_active })
      .eq('id', cost.id)
    await loadCosts()
  }

  return (
    <div className="min-h-screen md:pb-12">
      <div className="app-container pt-6 md:pt-12">
        {/* ヘッダー */}
        <div className="mb-6">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            マイページに戻る
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">固定費の管理</p>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">毎月のお金、何に使ってる？</h1>
              <p className="text-sm text-slate-500 mt-2 max-w-md">
                家賃・サブスク・保険などを登録すると、AIが見直しポイントを一緒に考えてくれます。
              </p>
            </div>
          </div>
        </div>

        {/* サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 bento-card rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-60" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Wallet className="w-4 h-4" />
                </div>
                <p className="text-slate-500 text-xs font-bold tracking-wider">MONTHLY TOTAL</p>
              </div>
              <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                ¥{totalMonthly.toLocaleString()}
                <span className="text-base font-medium text-slate-400 ml-2">/ 月</span>
              </p>
              <p className="text-sm text-slate-500 mt-2">
                登録中の固定費 <span className="font-bold text-slate-700">{activeCount}件</span>
                {activeCount > 0 && <> ・ 年間 <span className="font-bold text-slate-700">¥{(totalMonthly * 12).toLocaleString()}</span></>}
              </p>
            </div>
          </div>
          <button
            onClick={openNew}
            className="btn-primary rounded-3xl p-6 flex flex-col items-start justify-between text-left min-h-[140px] shadow-lg shadow-indigo-200"
          >
            <Plus className="w-7 h-7" />
            <div>
              <p className="font-bold text-base">固定費を追加</p>
              <p className="text-xs opacity-80 mt-0.5">サブスク・家賃などを登録</p>
            </div>
          </button>
        </div>

        {/* AI ヒント */}
        {totalMonthly > 0 && (
          <div className="rounded-2xl p-4 mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-base flex-shrink-0">
                🐱
              </div>
              <div className="text-sm text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">マネコより:</span> 固定費が登録されました。
                AIチャットで「<span className="font-semibold text-indigo-700">固定費を見直したい</span>」と話しかけると、
                あなたの状況に合わせた節約案を提案します。
              </div>
            </div>
          </div>
        )}

        {/* 一覧 */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-3xl animate-bounce">🐱</div>
        ) : costs.length === 0 ? (
          <div className="bento-card rounded-3xl p-10 text-center">
            <div className="text-5xl mb-4">🧾</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">まだ固定費が登録されていません</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
              家賃・サブスク・保険などを登録すると、AIが「ここを見直すと月◯円浮く」と提案できるようになります。
            </p>
            <button
              onClick={openNew}
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-indigo-200"
            >
              <Plus className="w-4 h-4" />
              最初の固定費を登録する
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map((group) => {
              const groupTotal = group.items
                .filter((c) => c.is_active)
                .reduce((sum, c) => sum + monthlyAmount(c), 0)
              const Icon = group.icon
              return (
                <section key={group.value}>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl ${group.bg} ${group.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h2 className="font-bold text-slate-900 text-sm">{group.label}</h2>
                      <span className="text-xs text-slate-400">{group.items.length}件</span>
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      ¥{groupTotal.toLocaleString()}
                      <span className="text-xs font-medium text-slate-400 ml-0.5">/月</span>
                    </span>
                  </div>
                  <div className="bento-card rounded-3xl divide-y divide-slate-100 overflow-hidden">
                    {group.items.map((cost) => (
                      <div
                        key={cost.id}
                        className={`p-4 flex items-center gap-3 transition-opacity ${
                          cost.is_active ? '' : 'opacity-50'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-slate-900 text-sm truncate">{cost.name}</p>
                            {cost.billing_cycle === 'yearly' && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 flex-shrink-0">
                                年払い
                              </span>
                            )}
                            {!cost.is_active && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 flex-shrink-0">
                                停止中
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            ¥{cost.amount.toLocaleString()} / {cost.billing_cycle === 'yearly' ? '年' : '月'}
                            {cost.billing_cycle === 'yearly' && (
                              <span className="ml-1.5 text-slate-400">
                                (月換算 ¥{monthlyAmount(cost).toLocaleString()})
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleToggleActive(cost)}
                            title={cost.is_active ? '停止する' : '再開する'}
                            className={`p-2 rounded-xl transition-colors ${
                              cost.is_active
                                ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEdit(cost)}
                            className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cost.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}

        {/* チャット相談誘導 */}
        {costs.length > 0 && (
          <div className="mt-8 rounded-3xl p-6 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-[-30%] right-[-10%] w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl" />
            <div className="relative z-10 flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-amber-300 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-base mb-1">登録した固定費でAIに相談しよう</h3>
                <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                  「サブスク見直したい」「通信費を下げたい」と話しかけると、
                  あなたの固定費を踏まえた具体的なアクションを提案します。
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-900 text-sm font-bold hover:bg-indigo-50 transition-colors"
                >
                  AIに相談する
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* フォームモーダル */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in"
          onClick={closeForm}
        >
          <div
            className="w-full md:max-w-lg bg-white rounded-t-[2rem] md:rounded-3xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                {form.id ? '固定費を編集' : '固定費を追加'}
              </h2>
              <button
                onClick={closeForm}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-5">
              {/* 名前 */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  名前
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="例: Netflix、家賃、電気代"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* カテゴリ */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  カテゴリ
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setForm({ ...form, category: cat.value })}
                      className={`py-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        form.category === cat.value
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 金額 */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  金額
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">¥</span>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="例: 1980"
                    inputMode="numeric"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* サイクル */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  支払サイクル
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CYCLES.map((cycle) => (
                    <button
                      key={cycle.value}
                      onClick={() => setForm({ ...form, billing_cycle: cycle.value })}
                      className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                        form.billing_cycle === cycle.value
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cycle.label}
                    </button>
                  ))}
                </div>
                {form.billing_cycle === 'yearly' && form.amount && (
                  <p className="text-xs text-slate-500 mt-2">
                    月換算: <span className="font-bold text-slate-700">¥{Math.round((parseInt(form.amount, 10) || 0) / 12).toLocaleString()}</span> / 月
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-5 border-t border-slate-100">
              <button
                onClick={closeForm}
                className="flex-1 py-3.5 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name.trim() || !form.amount}
                className="flex-1 btn-primary py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50"
              >
                {saving ? (
                  '保存中...'
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    保存
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
