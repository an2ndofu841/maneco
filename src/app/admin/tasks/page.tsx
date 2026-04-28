'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react'

const CATEGORY_LABELS: Record<string, string> = {
  survey: 'アンケート',
  review: '口コミ',
  research: 'リサーチ',
  other: 'その他',
}

const CATEGORIES = Object.keys(CATEGORY_LABELS)

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'かんたん',
  medium: 'ふつう',
  hard: 'むずかしい',
}

const DIFFICULTIES = Object.keys(DIFFICULTY_LABELS)

const EMPTY_FORM = {
  title: '',
  company_name: '',
  description: '',
  category: 'survey',
  reward_points: 0,
  max_participants: 0,
  deadline: '',
  difficulty: 'easy',
  estimated_minutes: 0,
  is_active: true,
}

type Task = typeof EMPTY_FORM & {
  id: string
  current_participants?: number
  created_at?: string
}

export default function AdminTasksPage() {
  const [items, setItems] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Task> | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin/tasks')
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

  const handleSave = async (form: Partial<Task>) => {
    setSaving(true)
    const method = form.id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/tasks', {
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
    const res = await fetch(`/api/admin/tasks?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      showMessage('success', '削除しました')
      await loadData()
    } else {
      showMessage('error', '削除に失敗しました')
    }
  }

  const formatDeadline = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
          <h1 className="text-2xl font-bold text-slate-900">タスク管理</h1>
          <p className="mt-1 text-sm text-slate-500">タスクの追加・編集・削除を行います</p>
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
          タスクがまだありません
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">タイトル</th>
                  <th className="px-5 py-3">企業名</th>
                  <th className="px-5 py-3">カテゴリ</th>
                  <th className="px-5 py-3">報酬pt</th>
                  <th className="px-5 py-3">難易度</th>
                  <th className="px-5 py-3">参加状況</th>
                  <th className="px-5 py-3">ステータス</th>
                  <th className="px-5 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-5 py-3.5 font-medium text-slate-900">{item.title}</td>
                    <td className="px-5 py-3.5 text-slate-600">{item.company_name}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                        {CATEGORY_LABELS[item.category] ?? item.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-amber-600">
                      {item.reward_points.toLocaleString()} pt
                    </td>
                    <td className="px-5 py-3.5">
                      <DifficultyBadge difficulty={item.difficulty} />
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {item.current_participants ?? 0}/{item.max_participants}
                    </td>
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
                            deadline: item.deadline ? new Date(item.deadline).toISOString().slice(0, 16) : '',
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
        </div>
      )}

      {editing !== null && (
        <TaskModal
          initial={editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const styles: Record<string, string> = {
    easy: 'bg-green-50 text-green-700',
    medium: 'bg-yellow-50 text-yellow-700',
    hard: 'bg-red-50 text-red-700',
  }

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[difficulty] ?? 'bg-slate-100 text-slate-700'}`}
    >
      {DIFFICULTY_LABELS[difficulty] ?? difficulty}
    </span>
  )
}

function TaskModal({
  initial,
  saving,
  onClose,
  onSave,
}: {
  initial: Partial<Task>
  saving: boolean
  onClose: () => void
  onSave: (form: Partial<Task>) => void
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
            {isEdit ? 'タスクを編集' : 'タスクを新規作成'}
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

            <Field label="企業名" required>
              <input
                type="text"
                required
                value={form.company_name}
                onChange={(e) => set('company_name', e.target.value)}
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

              <Field label="難易度" required>
                <select
                  required
                  value={form.difficulty}
                  onChange={(e) => set('difficulty', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {DIFFICULTY_LABELS[d]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="報酬ポイント" required>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.reward_points}
                  onChange={(e) => set('reward_points', Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </Field>

              <Field label="最大参加人数" required>
                <input
                  type="number"
                  required
                  min={1}
                  value={form.max_participants}
                  onChange={(e) => set('max_participants', Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="締切日時" required>
                <input
                  type="datetime-local"
                  required
                  value={form.deadline}
                  onChange={(e) => set('deadline', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </Field>

              <Field label="所要時間（分）" required>
                <input
                  type="number"
                  required
                  min={1}
                  value={form.estimated_minutes}
                  onChange={(e) => set('estimated_minutes', Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </Field>
            </div>

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
