'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react'

const CATEGORY_LABELS: Record<string, string> = {
  travel: '旅行',
  food: 'グルメ',
  shopping: 'ショッピング',
  tax: '節税',
  telecom: '通信費',
  investment: '投資',
}

const CATEGORIES = Object.keys(CATEGORY_LABELS)

const EMPTY_FORM = {
  title: '',
  brand_name: '',
  description: '',
  discount_type: 'percentage' as 'percentage' | 'fixed',
  discount_value: 0,
  category: 'travel',
  valid_until: '',
  affiliate_url: '',
  is_active: true,
}

type Coupon = typeof EMPTY_FORM & { id: string; created_at?: string }

export default function AdminCouponsPage() {
  const [items, setItems] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Coupon> | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin/coupons')
      if (res.ok) setItems(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSave = async (form: Partial<Coupon>) => {
    setSaving(true)
    const method = form.id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/coupons', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setEditing(null)
      showMessage('success', form.id ? '更新しました' : '作成しました')
      await loadData()
    } else {
      showMessage('error', 'エラーが発生しました')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return
    const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      showMessage('success', '削除しました')
      await loadData()
    } else {
      showMessage('error', '削除に失敗しました')
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const formatDiscount = (type: string, value: number) => {
    return type === 'percentage' ? `${value}%` : `¥${value.toLocaleString()}`
  }

  return (
    <div>
      {message && (
        <div
          className={`fixed left-1/2 top-6 z-[60] -translate-x-1/2 rounded-lg px-6 py-3 text-sm font-medium text-white shadow-lg transition-all ${
            message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">クーポン管理</h1>
          <p className="mt-1 text-sm text-slate-500">クーポンの追加・編集・削除を行います</p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY_FORM })}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          新規作成
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white py-20 text-center text-sm text-slate-400">
          クーポンがまだありません
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">タイトル</th>
                <th className="px-5 py-3">ブランド</th>
                <th className="px-5 py-3">カテゴリ</th>
                <th className="px-5 py-3">割引</th>
                <th className="px-5 py-3">有効期限</th>
                <th className="px-5 py-3">ステータス</th>
                <th className="px-5 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-slate-50/60">
                  <td className="px-5 py-3.5 font-medium text-slate-900">{item.title}</td>
                  <td className="px-5 py-3.5 text-slate-600">{item.brand_name}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                      {CATEGORY_LABELS[item.category] ?? item.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    {formatDiscount(item.discount_type, item.discount_value)}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{formatDate(item.valid_until)}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.is_active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.is_active ? '有効' : '無効'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => setEditing({
                          ...item,
                          valid_until: item.valid_until ? new Date(item.valid_until).toISOString().split('T')[0] : '',
                        })}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-indigo-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing !== null && (
        <CouponModal
          initial={editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function CouponModal({
  initial,
  saving,
  onClose,
  onSave,
}: {
  initial: Partial<Coupon>
  saving: boolean
  onClose: () => void
  onSave: (form: Partial<Coupon>) => void
}) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial })
  const isEdit = !!initial.id

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(isEdit ? { ...form, id: initial.id } : form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEdit ? 'クーポンを編集' : 'クーポンを新規作成'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="space-y-4">
            <Field label="タイトル" required>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </Field>

            <Field label="ブランド名" required>
              <input
                type="text"
                required
                value={form.brand_name}
                onChange={(e) => set('brand_name', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </Field>

            <Field label="説明" required>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="割引タイプ" required>
                <select
                  required
                  value={form.discount_type}
                  onChange={(e) => set('discount_type', e.target.value as 'percentage' | 'fixed')}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="percentage">パーセント (%)</option>
                  <option value="fixed">固定額 (¥)</option>
                </select>
              </Field>

              <Field label="割引値" required>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.discount_value}
                  onChange={(e) => set('discount_value', Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </Field>
            </div>

            <Field label="カテゴリ" required>
              <select
                required
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="有効期限" required>
              <input
                type="date"
                required
                value={form.valid_until}
                onChange={(e) => set('valid_until', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </Field>

            <Field label="アフィリエイトURL" required>
              <input
                type="text"
                required
                value={form.affiliate_url}
                onChange={(e) => set('affiliate_url', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </Field>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => set('is_active', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
              />
              <span className="text-sm font-medium text-slate-700">有効にする</span>
            </label>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isEdit ? '更新' : '作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}
