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
  easy: { label: 'かんたん', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  medium: { label: 'ふつう', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  hard: { label: 'むずかしい', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
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
      <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-bounce mb-2">💸</div>
          <p className="text-white/30 text-sm">案件を読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f14]">
      {/* 背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-emerald-500/6 rounded-full blur-[80px]" />
      </div>

      {/* ヘッダー */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-5 pt-14 md:px-0 md:pt-10">
        <p className="text-white/40 text-xs mb-1">スキマ時間を活用</p>
        <h1 className="text-white font-black text-2xl mb-1 md:text-3xl">お金を増やす 💸</h1>
        <p className="text-white/30 text-sm">今月の獲得：<span className="text-emerald-400 font-bold">{totalEarned.toLocaleString()} pt</span></p>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 space-y-4 md:px-0">
        {/* 不用品査定バナー */}
        <button
          onClick={() => setShowAppraisal(true)}
          className="w-full rounded-3xl p-4 border border-orange-500/20 flex items-center gap-4 hover:border-orange-500/40 transition-all active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #1e1005 0%, #251408 100%)' }}
        >
          <div className="w-12 h-12 bg-orange-500/15 rounded-2xl flex items-center justify-center border border-orange-500/20 flex-shrink-0">
            <Camera className="w-6 h-6 text-orange-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-bold text-white text-sm">不用品をAI査定 📸</p>
            <p className="text-white/40 text-xs">写真を撮るだけで推定売却価格をAIが瞬時に算出</p>
          </div>
          <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
        </button>

        {/* カテゴリフィルター */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 text-xs px-4 py-2 rounded-full font-medium transition-all border ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'text-white/30 border-white/10 hover:border-white/20'
              }`}
            >
              {cat === 'all' ? 'すべて' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* 案件リスト */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
                className={`rounded-3xl p-4 border transition-all ${
                  isCompleted
                    ? 'border-emerald-500/20 opacity-60'
                    : 'border-white/8 hover:border-white/15'
                }`}
                style={{ background: '#1a1a24' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-3">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                        {CATEGORY_LABELS[task.category]}
                      </span>
                      <span className={`text-[10px] border px-2 py-0.5 rounded-full ${diff.color} ${diff.bg}`}>
                        {diff.label}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5" />完了
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-white text-sm leading-snug">{task.title}</h3>
                    <p className="text-white/35 text-xs mt-1 line-clamp-2">{task.description}</p>
                  </div>

                  {/* ポイント */}
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-amber-400 font-black text-xl">{task.reward_points}</span>
                    </div>
                    <p className="text-white/25 text-[10px]">pt</p>
                  </div>
                </div>

                {/* メタ情報 */}
                <div className="flex items-center gap-3 text-[11px] text-white/25 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />{task.estimated_minutes}分
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />残り{remaining}枠
                  </span>
                  <span className={daysLeft <= 3 ? 'text-red-400' : ''}>
                    {daysLeft <= 0 ? '終了' : `あと${daysLeft}日`}
                  </span>
                  <span className="ml-auto">{task.company_name}</span>
                </div>

                {/* 応募状況バー */}
                <div className="mb-3">
                  <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      style={{ width: `${(task.current_participants / task.max_participants) * 100}%` }}
                    />
                  </div>
                </div>

                {!isCompleted && (
                  <button
                    onClick={() => isInProgress ? handleCompleteTask(task.id) : handleStartTask(task.id)}
                    disabled={completing === task.id || remaining <= 0}
                    className={`w-full py-2.5 rounded-2xl text-sm font-bold transition-all border ${
                      isInProgress
                        ? 'gradient-gold text-black border-transparent'
                        : remaining <= 0
                        ? 'text-white/20 border-white/8 cursor-not-allowed'
                        : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20'
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

        <div className="h-4" />
      </div>

      {showAppraisal && <AppraisalModal onClose={() => setShowAppraisal(false)} />}
    </div>
  )
}
