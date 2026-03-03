'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Task, UserTask } from '@/types'
import { Clock, Users, Star, CheckCircle, Camera, ChevronRight, Filter } from 'lucide-react'
import AppraisalModal from '@/components/earn/AppraisalModal'

const CATEGORY_LABELS: Record<string, string> = {
  survey: 'アンケート',
  review: '口コミ評価',
  research: 'リサーチ',
  other: 'その他',
}

const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  easy: { label: 'かんたん', color: 'bg-green-100 text-green-700' },
  medium: { label: 'ふつう', color: 'bg-yellow-100 text-yellow-700' },
  hard: { label: 'むずかしい', color: 'bg-red-100 text-red-700' },
}

export default function EarnPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [userTasks, setUserTasks] = useState<UserTask[]>([])
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showAppraisal, setShowAppraisal] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    const [tasksRes, userTasksRes] = await Promise.all([
      supabase.from('tasks_b2b').select('*').eq('is_active', true).order('reward_points', { ascending: false }),
      user ? supabase.from('user_tasks').select('*').eq('user_id', user.id) : { data: [] },
    ])

    setTasks(tasksRes.data ?? [])
    setUserTasks((userTasksRes.data ?? []) as UserTask[])
    setLoading(false)
  }

  const handleStartTask = async (taskId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('user_tasks').insert({
      user_id: user.id,
      task_id: taskId,
      status: 'in_progress',
    })

    if (!error) {
      setUserTasks((prev) => [
        ...prev,
        { id: '', user_id: user.id, task_id: taskId, status: 'in_progress', points_earned: 0, created_at: new Date().toISOString() },
      ])
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    setCompleting(taskId)
    try {
      const res = await fetch('/api/tasks/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      })

      if (res.ok) {
        setUserTasks((prev) =>
          prev.map((ut) =>
            ut.task_id === taskId ? { ...ut, status: 'completed' } : ut
          )
        )
        await loadData()
      }
    } finally {
      setCompleting(null)
    }
  }

  const getTaskStatus = (taskId: string) => {
    return userTasks.find((ut) => ut.task_id === taskId)?.status
  }

  const categories = ['all', 'survey', 'review', 'research', 'other']

  const filteredTasks = selectedCategory === 'all'
    ? tasks
    : tasks.filter((t) => t.category === selectedCategory)

  const totalEarned = userTasks
    .filter((ut) => ut.status === 'completed')
    .reduce((sum, ut) => sum + (ut.points_earned || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-bounce mb-2">🐱</div>
          <p className="text-gray-500 text-sm">案件を読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-emerald-400 to-teal-500 px-4 pt-12 pb-6">
        <h1 className="text-white font-bold text-xl mb-1">💰 お金を増やす</h1>
        <p className="text-white/80 text-sm">スキマ時間にサクッと稼ごう</p>
        <div className="mt-4 bg-white/20 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-white/80 text-xs">今月の獲得ポイント</p>
            <p className="text-white font-bold text-2xl">{totalEarned.toLocaleString()} pt</p>
          </div>
          <div className="text-4xl">🎯</div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* 不用品査定ボタン */}
        <button
          onClick={() => setShowAppraisal(true)}
          className="w-full bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Camera className="w-6 h-6 text-orange-500" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-bold text-gray-800">不用品をAI査定 📸</p>
            <p className="text-gray-500 text-xs">写真を撮るだけで推定価格を即チェック！</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        {/* カテゴリフィルター */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 text-xs px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              {cat === 'all' ? 'すべて' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* 案件リスト */}
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const status = getTaskStatus(task.id)
            const isCompleted = status === 'completed'
            const isInProgress = status === 'in_progress'
            const remaining = task.max_participants - task.current_participants
            const deadline = new Date(task.deadline)
            const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl p-4 border shadow-sm ${
                  isCompleted ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {CATEGORY_LABELS[task.category]}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_LABELS[task.difficulty].color}`}>
                        {DIFFICULTY_LABELS[task.difficulty].label}
                      </span>
                      {isCompleted && (
                        <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />完了
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm">{task.title}</h3>
                    <p className="text-gray-500 text-xs mt-1">{task.description}</p>
                  </div>
                  <div className="text-right ml-3 flex-shrink-0">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span className="font-bold text-lg">{task.reward_points}</span>
                    </div>
                    <p className="text-gray-400 text-xs">ポイント</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.estimated_minutes}分
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    残り{remaining}枠
                  </span>
                  <span className={daysLeft <= 3 ? 'text-red-400 font-medium' : ''}>
                    {daysLeft <= 0 ? '終了' : `あと${daysLeft}日`}
                  </span>
                  <span className="ml-auto">{task.company_name}</span>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>応募状況</span>
                    <span>{task.current_participants} / {task.max_participants}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                      style={{ width: `${(task.current_participants / task.max_participants) * 100}%` }}
                    />
                  </div>
                </div>

                {!isCompleted && (
                  <button
                    onClick={() => isInProgress ? handleCompleteTask(task.id) : handleStartTask(task.id)}
                    disabled={completing === task.id || remaining <= 0}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isInProgress
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:shadow-md'
                        : remaining <= 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white hover:shadow-md'
                    }`}
                  >
                    {completing === task.id ? '処理中...' :
                     isInProgress ? '✅ 完了してポイントをもらう' :
                     remaining <= 0 ? '満員です' :
                     '参加する →'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {showAppraisal && <AppraisalModal onClose={() => setShowAppraisal(false)} />}
    </div>
  )
}
