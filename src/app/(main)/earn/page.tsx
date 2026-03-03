'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Task, UserTask } from '@/types'
import { Clock, Users, Star, CheckCircle, Camera, ChevronRight } from 'lucide-react'
import AppraisalModal from '@/components/earn/AppraisalModal'

const CATEGORY_LABELS: Record<string, string> = {
  survey: 'アンケート',
  review: '口コミ',
  research: 'リサーチ',
  other: 'その他',
}

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  easy: { label: 'かんたん', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
  medium: { label: 'ふつう', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
  hard: { label: 'むずかしい', color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
}

export default function EarnPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [userTasks, setUserTasks] = useState<UserTask[]>([])
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showAppraisal, setShowAppraisal] = useState(false)
  const supabase = createClient()

  useEffect(() => { loadData() }, [])

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
    const { error } = await supabase.from('user_tasks').insert({ user_id: user.id, task_id: taskId, status: 'in_progress' })
    if (!error) {
      setUserTasks((prev) => [...prev, { id: '', user_id: user.id, task_id: taskId, status: 'in_progress', points_earned: 0, created_at: new Date().toISOString() }])
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
        setUserTasks((prev) => prev.map((ut) => ut.task_id === taskId ? { ...ut, status: 'completed' } : ut))
        await loadData()
      }
    } finally {
      setCompleting(null)
    }
  }

  const getTaskStatus = (taskId: string) => userTasks.find((ut) => ut.task_id === taskId)?.status
  const categories = ['all', 'survey', 'review', 'research', 'other']
  const filteredTasks = selectedCategory === 'all' ? tasks : tasks.filter((t) => t.category === selectedCategory)
  const totalEarned = userTasks.filter((ut) => ut.status === 'completed').reduce((sum, ut) => sum + (ut.points_earned || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-bounce mb-2">💸</div>
          <p className="text-slate-400 text-sm">案件を読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 md:pb-12">
      <div className="app-container pt-8 md:pt-12">
        {/* ヘッダー */}
        <div className="mb-8">
          <p className="text-slate-500 text-sm font-medium mb-1">スキマ時間を活用</p>
          <div className="flex items-end justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">お金を増やす 💸</h1>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-0.5">今月の獲得</p>
              <p className="text-emerald-600 font-black text-xl">{totalEarned.toLocaleString()} <span className="text-xs font-medium text-slate-400">pt</span></p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 不用品査定バナー */}
          <button
            onClick={() => setShowAppraisal(true)}
            className="w-full rounded-3xl p-6 relative overflow-hidden group text-left transition-all hover:shadow-lg hover:shadow-orange-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-600 transition-transform group-hover:scale-105" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
            
            <div className="relative z-10 flex items-center gap-5">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 flex-shrink-0 shadow-inner">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">NEW</span>
                  <p className="font-bold text-white text-lg">不用品をAI査定</p>
                </div>
                <p className="text-orange-50 text-sm">写真を撮るだけで推定売却価格をAIが瞬時に算出</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </button>

          {/* カテゴリフィルター */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 text-xs px-4 py-2 rounded-full font-bold transition-all border ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {cat === 'all' ? 'すべて' : CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* 案件リスト */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => {
              const status = getTaskStatus(task.id)
              const isCompleted = status === 'completed'
              const isInProgress = status === 'in_progress'
              const remaining = task.max_participants - task.current_participants
              const daysLeft = Math.ceil((new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              const diff = DIFFICULTY_CONFIG[task.difficulty]

              return (
                <div
                  key={task.id}
                  className={`bento-card p-5 rounded-3xl transition-all ${
                    isCompleted ? 'opacity-60 grayscale-[0.5]' : 'hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 pr-3">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {CATEGORY_LABELS[task.category]}
                        </span>
                        <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${diff.color} ${diff.bg}`}>
                          {diff.label}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />完了
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug mb-1">{task.title}</h3>
                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{task.description}</p>
                    </div>

                    {/* ポイント */}
                    <div className="text-right flex-shrink-0 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-amber-600 font-black text-lg">{task.reward_points}</span>
                      </div>
                      <p className="text-amber-400 text-[10px] font-bold">pt</p>
                    </div>
                  </div>

                  {/* メタ情報 */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium mb-4 bg-slate-50 p-2 rounded-lg">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />{task.estimated_minutes}分
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />残り{remaining}枠
                    </span>
                    <span className={daysLeft <= 3 ? 'text-red-500 font-bold' : ''}>
                      {daysLeft <= 0 ? '終了' : `あと${daysLeft}日`}
                    </span>
                  </div>

                  {/* 応募状況バー */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>人気度</span>
                      <span>{Math.round((task.current_participants / task.max_participants) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full"
                        style={{ width: `${(task.current_participants / task.max_participants) * 100}%` }}
                      />
                    </div>
                  </div>

                  {!isCompleted && (
                    <button
                      onClick={() => isInProgress ? handleCompleteTask(task.id) : handleStartTask(task.id)}
                      disabled={completing === task.id || remaining <= 0}
                      className={`w-full py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
                        isInProgress
                          ? 'bg-slate-900 text-white hover:bg-slate-800'
                          : remaining <= 0
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      }`}
                    >
                      {completing === task.id ? '処理中...' :
                       isInProgress ? '完了報告する' :
                       remaining <= 0 ? '満員です' :
                       '参加する'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {showAppraisal && <AppraisalModal onClose={() => setShowAppraisal(false)} />}
    </div>
  )
}
