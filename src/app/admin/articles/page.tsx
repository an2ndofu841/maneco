'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Save, Loader2, FileJson } from 'lucide-react'

const levelLabels: Record<string, string> = {
  beginner: '入門',
  intermediate: '基本',
  advanced: '応用',
}

const iconOptions = [
  'TrendingUp',
  'Shield',
  'Landmark',
  'PiggyBank',
  'Receipt',
  'Building2',
  'BookOpen',
]

const sampleContent = [
  {
    type: 'heading',
    text: 'セクションタイトル',
  },
  {
    type: 'paragraph',
    text: 'ここに本文を記述します。マークダウンのような書き方ではなく、構造化されたJSONブロックで記事を構成します。',
  },
  {
    type: 'tip',
    title: 'ポイント',
    text: '重要なポイントや補足情報をここに記載します。',
  },
  {
    type: 'quiz',
    question: 'クイズの質問文をここに入れます',
    options: ['選択肢A', '選択肢B', '選択肢C'],
    correct: 0,
    explanation: '正解の解説をここに入れます。',
  },
]

const defaultForm = {
  slug: '',
  title: '',
  subtitle: '',
  emoji: '',
  icon_name: 'BookOpen',
  read_minutes: 5,
  level: 'beginner' as string,
  gradient: '',
  exp_reward: 0,
  badge_emoji: '',
  badge_title: '',
  key_takeaway: '',
  content: '',
  sort_order: 0,
  is_active: true,
}

export default function AdminArticlesPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const loadData = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/articles')
    if (res.ok) setItems(await res.json())
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const openNew = () => {
    setEditing({ ...defaultForm })
    setJsonError(null)
  }

  const openEdit = (item: any) => {
    setEditing({
      ...item,
      content: item.content ? JSON.stringify(item.content, null, 2) : '',
    })
    setJsonError(null)
  }

  const handleSave = async () => {
    if (!editing) return

    let parsedContent: any[] = []
    if (editing.content && editing.content.trim()) {
      try {
        parsedContent = JSON.parse(editing.content)
        setJsonError(null)
      } catch {
        setJsonError('JSONの形式が正しくありません。構文を確認してください。')
        return
      }
    }

    setSaving(true)

    const payload = {
      ...editing,
      read_minutes: Number(editing.read_minutes),
      exp_reward: Number(editing.exp_reward),
      sort_order: Number(editing.sort_order),
      content: parsedContent,
    }

    const method = payload.id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/articles', {
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
    const res = await fetch(`/api/admin/articles?id=${id}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      setMessage({ type: 'success', text: '削除しました' })
      await loadData()
    } else {
      setMessage({ type: 'error', text: '削除に失敗しました' })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleToggleActive = async (item: any) => {
    const res = await fetch('/api/admin/articles', {
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

  const insertSample = () => {
    updateField('content', JSON.stringify(sampleContent, null, 2))
    setJsonError(null)
  }

  const updateField = (field: string, value: any) => {
    setEditing((prev: any) => ({ ...prev, [field]: value }))
    if (field === 'content') setJsonError(null)
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
          <h1 className="text-2xl font-bold text-slate-900">学習記事管理</h1>
          <p className="mt-1 text-sm text-slate-500">
            全 {items.length} 件の学習記事
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
                  <th className="px-4 py-3">スラッグ</th>
                  <th className="px-4 py-3">レベル</th>
                  <th className="px-4 py-3 text-right">読了時間</th>
                  <th className="px-4 py-3 text-right">EXP報酬</th>
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
                    <td className="max-w-[250px] truncate px-4 py-3 font-medium text-slate-800">
                      <span className="mr-1.5">{item.emoji}</span>
                      {item.title}
                    </td>
                    <td className="px-4 py-3">
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                        {item.slug}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.level === 'beginner'
                            ? 'bg-green-100 text-green-700'
                            : item.level === 'intermediate'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {levelLabels[item.level] ?? item.level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {item.read_minutes}分
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-amber-600">
                        {Number(item.exp_reward).toLocaleString()}
                      </span>
                      <span className="ml-0.5 text-xs text-slate-400">
                        EXP
                      </span>
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
                {editing.id ? '学習記事を編集' : '学習記事を新規作成'}
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
                      スラッグ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editing.slug}
                      onChange={(e) => updateField('slug', e.target.value)}
                      placeholder="investment-basics"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                  </div>
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
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    サブタイトル <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editing.subtitle}
                    onChange={(e) => updateField('subtitle', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      絵文字
                    </label>
                    <input
                      type="text"
                      value={editing.emoji}
                      onChange={(e) => updateField('emoji', e.target.value)}
                      placeholder="📚"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      アイコン
                    </label>
                    <select
                      value={editing.icon_name}
                      onChange={(e) =>
                        updateField('icon_name', e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      レベル
                    </label>
                    <select
                      value={editing.level}
                      onChange={(e) => updateField('level', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="beginner">入門</option>
                      <option value="intermediate">基本</option>
                      <option value="advanced">応用</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      読了時間（分） <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={editing.read_minutes}
                      onChange={(e) =>
                        updateField('read_minutes', e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      EXP報酬 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={editing.exp_reward}
                      onChange={(e) =>
                        updateField('exp_reward', e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      バッジ絵文字
                    </label>
                    <input
                      type="text"
                      value={editing.badge_emoji}
                      onChange={(e) =>
                        updateField('badge_emoji', e.target.value)
                      }
                      placeholder="🏆"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      バッジタイトル
                    </label>
                    <input
                      type="text"
                      value={editing.badge_title}
                      onChange={(e) =>
                        updateField('badge_title', e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    キーテイクアウェイ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={editing.key_takeaway}
                    onChange={(e) =>
                      updateField('key_takeaway', e.target.value)
                    }
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700">
                      コンテンツ（JSON）
                    </label>
                    <button
                      type="button"
                      onClick={insertSample}
                      className="flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
                    >
                      <FileJson className="h-3.5 w-3.5" />
                      サンプルを挿入
                    </button>
                  </div>
                  <textarea
                    value={editing.content}
                    onChange={(e) => updateField('content', e.target.value)}
                    rows={14}
                    style={{ minHeight: '300px' }}
                    className={`w-full rounded-lg border px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 ${
                      jsonError
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                    }`}
                    placeholder='[{"type": "heading", "text": "..."}, ...]'
                  />
                  {jsonError && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {jsonError}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-slate-400">
                    コンテンツブロックをJSON形式で入力してください
                  </p>
                </div>

                <div className="flex items-center gap-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
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
