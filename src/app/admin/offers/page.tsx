'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react'

const difficultyLabels: Record<string, string> = {
  easy: 'かんたん',
  medium: 'ふつう',
  hard: 'むずかしい',
}

const defaultForm = {
  title: '',
  brand: '',
  description: '',
  points: 0,
  category: '',
  category_label: '',
  category_emoji: '',
  conditions: '',
  time_estimate: '',
  difficulty: 'easy' as string,
  popular: false,
  limited: false,
  gradient: '',
  url: '',
  sort_order: 0,
  is_active: true,
}

export default function AdminOffersPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const loadData = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/offers')
    if (res.ok) setItems(await res.json())
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const openNew = () => {
    setEditing({ ...defaultForm })
  }

  const openEdit = (item: any) => {
    setEditing({
      ...item,
      conditions: Array.isArray(item.conditions)
        ? item.conditions.join('\n')
        : item.conditions ?? '',
    })
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)

    const payload = {
      ...editing,
      points: Number(editing.points),
      sort_order: Number(editing.sort_order),
      conditions: editing.conditions
        ? editing.conditions
            .split('\n')
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
    }

    const method = payload.id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/offers', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      setEditing(null)
      setMessage({
        type: 'success',
        text: payload.id ? '更新しました' : '作成しました',
      })
      await loadData()
    } else {
      setMessage({ type: 'error', text: 'エラーが発生しました' })
    }
    setSaving(false)
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return
    const res = await fetch(`/api/admin/offers?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMessage({ type: 'success', text: '削除しました' })
      await loadData()
    } else {
      setMessage({ type: 'error', text: '削除に失敗しました' })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleToggleActive = async (item: any) => {
    const res = await fetch('/api/admin/offers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, is_active: !item.is_active }),
    })
    if (res.ok) {
      setMessage({
        type: 'success',
        text: item.is_active ? '非公開にしました' : '公開しました',
      })
      await loadData()
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const updateField = (field: string, value: any) => {
    setEditing((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <div>
      {message && (
        <div
          className={`fixed right-8 top-6 z-[60] rounded-lg px-5 py-3 text-sm font-medium shadow-lg transition-all ${
            message.type === 'success'
              ? 'bg-emerald-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ポイント案件管理</h1>
          <p className="mt-1 text-sm text-slate-500">
            全 {items.length} 件のポイント案件
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          新規作成
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white py-20 text-center text-sm text-slate-400">
          データがありません
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">タイトル</th>
                  <th className="px-4 py-3">ブランド</th>
                  <th className="px-4 py-3">カテゴリ</th>
                  <th className="px-4 py-3 text-right">ポイント</th>
                  <th className="px-4 py-3">難易度</th>
                  <th className="px-4 py-3 text-center">人気</th>
                  <th className="px-4 py-3 text-center">限定</th>
                  <th className="px-4 py-3 text-center">ステータス</th>
                  <th className="px-4 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-slate-50/50"
                  >
                    <td className="max-w-[200px] truncate px-4 py-3 font-medium text-slate-800">
                      {item.title}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{item.brand}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        {item.category_emoji && (
                          <span>{item.category_emoji}</span>
                        )}
                        {item.category_label || item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-indigo-600">
                        {Number(item.points).toLocaleString()}
                      </span>
                      <span className="ml-0.5 text-xs text-slate-400">pt</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.difficulty === 'easy'
                            ? 'bg-green-100 text-green-700'
                            : item.difficulty === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {difficultyLabels[item.difficulty] ?? item.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.popular && (
                        <span className="inline-block rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                          人気
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.limited && (
                        <span className="inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                          限定
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                          item.is_active
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {item.is_active ? '公開' : '非公開'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(item)}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-indigo-600"
                          title="編集"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="削除"
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
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-[5vh]">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editing.id ? 'ポイント案件を編集' : 'ポイント案件を新規作成'}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      タイトル <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editing.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      ブランド <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editing.brand}
                      onChange={(e) => updateField('brand', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    説明 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={editing.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      ポイント <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={editing.points}
                      onChange={(e) => updateField('points', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      カテゴリID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editing.category}
                      onChange={(e) => updateField('category', e.target.value)}
                      placeholder="credit, securities..."
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      カテゴリ表示名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editing.category_label}
                      onChange={(e) =>
                        updateField('category_label', e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      カテゴリ絵文字
                    </label>
                    <input
                      type="text"
                      value={editing.category_emoji}
                      onChange={(e) =>
                        updateField('category_emoji', e.target.value)
                      }
                      placeholder="💳"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      所要時間 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editing.time_estimate}
                      onChange={(e) =>
                        updateField('time_estimate', e.target.value)
                      }
                      placeholder="約10分"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      難易度
                    </label>
                    <select
                      value={editing.difficulty}
                      onChange={(e) =>
                        updateField('difficulty', e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="easy">かんたん</option>
                      <option value="medium">ふつう</option>
                      <option value="hard">むずかしい</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    条件（1行に1つ）
                  </label>
                  <textarea
                    value={editing.conditions}
                    onChange={(e) => updateField('conditions', e.target.value)}
                    rows={4}
                    placeholder="18歳以上&#10;初回申込みの方限定&#10;本人確認書類が必要"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    改行で区切ると配列として保存されます
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      グラデーション
                    </label>
                    <input
                      type="text"
                      value={editing.gradient}
                      onChange={(e) => updateField('gradient', e.target.value)}
                      placeholder="from-blue-500 to-indigo-600"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      表示順
                    </label>
                    <input
                      type="number"
                      value={editing.sort_order}
                      onChange={(e) =>
                        updateField('sort_order', e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editing.url}
                    onChange={(e) => updateField('url', e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div className="flex flex-wrap items-center gap-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={editing.popular}
                      onChange={(e) =>
                        updateField('popular', e.target.checked)
                      }
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                    />
                    人気
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={editing.limited}
                      onChange={(e) =>
                        updateField('limited', e.target.checked)
                      }
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                    />
                    限定
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={editing.is_active}
                      onChange={(e) =>
                        updateField('is_active', e.target.checked)
                      }
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                    />
                    公開する
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button
                onClick={() => setEditing(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? '保存中...' : '保存する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
