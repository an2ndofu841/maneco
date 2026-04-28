'use client'

import { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Star, CheckCircle, Sparkles } from 'lucide-react'
import { Task } from '@/types'

type QuestionType = 'radio' | 'rating' | 'textarea' | 'checkbox'

interface Question {
  id: string
  text: string
  type: QuestionType
  options?: string[]
  placeholder?: string
  required?: boolean
}

interface SurveyData {
  questions: Question[]
}

const SURVEY_MAP: Record<string, SurveyData> = {
  'スマホアプリの使い心地アンケート': {
    questions: [
      { id: 'q1', text: '普段よく使うショッピングアプリはどれですか？', type: 'radio', options: ['Amazon', '楽天市場', 'Yahoo!ショッピング', 'メルカリ', 'その他'], required: true },
      { id: 'q2', text: 'アプリを選ぶとき、最も重視するポイントは？', type: 'radio', options: ['使いやすさ', '商品の豊富さ', 'ポイント還元', '配送の速さ', '価格の安さ'], required: true },
      { id: 'q3', text: 'ショッピングアプリの使い心地を5段階で評価してください', type: 'rating', required: true },
      { id: 'q4', text: 'アプリで「これは不便だな」と思う機能はありますか？', type: 'checkbox', options: ['検索がしづらい', '決済方法が少ない', '通知が多すぎる', 'ページの読み込みが遅い', '特になし'], required: true },
      { id: 'q5', text: '改善してほしい点を自由にお書きください', type: 'textarea', placeholder: '例：もっと写真が大きく見れるといいです...', required: false },
    ],
  },
  'カフェチェーンの新メニュー評価': {
    questions: [
      { id: 'q1', text: 'カフェチェーンの利用頻度はどれくらいですか？', type: 'radio', options: ['ほぼ毎日', '週2〜3回', '週1回', '月1〜2回', 'ほとんど行かない'], required: true },
      { id: 'q2', text: '新メニューの「味」を5段階で評価してください', type: 'rating', required: true },
      { id: 'q3', text: '新メニューの「見た目」を5段階で評価してください', type: 'rating', required: true },
      { id: 'q4', text: '新メニューの「コスパ」を5段階で評価してください', type: 'rating', required: true },
      { id: 'q5', text: 'リピートしたいと思いますか？', type: 'radio', options: ['絶対リピートしたい', 'たまに飲みたい', 'どちらでもない', 'もう頼まない'], required: true },
      { id: 'q6', text: 'ご感想を自由にどうぞ！', type: 'textarea', placeholder: '例：甘さ控えめで飲みやすかったです...', required: false },
    ],
  },
  '若者の節約術リサーチ': {
    questions: [
      { id: 'q1', text: '月の貯金額はだいたいどれくらいですか？', type: 'radio', options: ['0円（できていない）', '1万円未満', '1〜3万円', '3〜5万円', '5万円以上'], required: true },
      { id: 'q2', text: '実践している節約術を教えてください（複数可）', type: 'checkbox', options: ['自炊する', 'マイボトル持参', '格安SIMを使う', 'ポイ活をしている', 'サブスクを定期的に見直す', 'フリマアプリで売る', 'まとめ買い/セール活用', '特にしていない'], required: true },
      { id: 'q3', text: '節約で一番効果があったことを詳しく教えてください', type: 'textarea', placeholder: '100文字以上でお書きください。例：格安SIMに変えたら月5,000円浮いて、そのお金を積立NISAに回しています...', required: true },
      { id: 'q4', text: '節約していて「つらいな」と感じることはありますか？', type: 'textarea', placeholder: '例：友達との外食を断ることが増えました...', required: false },
    ],
  },
  '旅行に関する詳細アンケート': {
    questions: [
      { id: 'q1', text: '直近1年で国内旅行は何回しましたか？', type: 'radio', options: ['0回', '1回', '2〜3回', '4〜5回', '6回以上'], required: true },
      { id: 'q2', text: '旅行の予約はどのサービスを使いますか？（複数可）', type: 'checkbox', options: ['楽天トラベル', 'じゃらん', '一休.com', 'Booking.com', 'Airbnb', 'Yahoo!トラベル', '直接ホテルに予約', 'その他'], required: true },
      { id: 'q3', text: '1回の旅行の予算はどれくらいですか？', type: 'radio', options: ['1万円以下', '1〜3万円', '3〜5万円', '5〜10万円', '10万円以上'], required: true },
      { id: 'q4', text: '旅行で重視することは？', type: 'checkbox', options: ['食事が美味しい', '温泉・リラックス', '観光スポット', '写真映え', 'コスパ', 'アクセスの良さ', '自然・アウトドア'], required: true },
      { id: 'q5', text: '旅行先の満足度を5段階で教えてください', type: 'rating', required: true },
      { id: 'q6', text: '一番印象に残った旅行先とその理由を教えてください', type: 'textarea', placeholder: '例：箱根の温泉旅館が最高でした。露天風呂からの景色が...', required: true },
    ],
  },
  '新サービスのUI評価テスト': {
    questions: [
      { id: 'q1', text: 'サービスの第一印象を5段階で評価してください', type: 'rating', required: true },
      { id: 'q2', text: '操作のわかりやすさを5段階で評価してください', type: 'rating', required: true },
      { id: 'q3', text: 'デザインの見やすさを5段階で評価してください', type: 'rating', required: true },
      { id: 'q4', text: '使いにくいと感じた点はありますか？（複数可）', type: 'checkbox', options: ['ボタンが小さい', '文字が読みにくい', '操作の順番がわかりにくい', '読み込みが遅い', '色の区別がつきにくい', '特になし'], required: true },
      { id: 'q5', text: '改善提案があれば教えてください', type: 'textarea', placeholder: '例：トップページにチュートリアルがあるとわかりやすいです...', required: false },
    ],
  },
  'SNS利用実態調査': {
    questions: [
      { id: 'q1', text: '普段使っているSNSは？（複数可）', type: 'checkbox', options: ['X（旧Twitter）', 'Instagram', 'TikTok', 'YouTube', 'LINE', 'Facebook', 'Threads', 'BeReal', 'その他'], required: true },
      { id: 'q2', text: '1日のSNS利用時間はどれくらいですか？', type: 'radio', options: ['30分未満', '30分〜1時間', '1〜2時間', '2〜3時間', '3時間以上'], required: true },
      { id: 'q3', text: 'SNSで一番見るコンテンツは？', type: 'radio', options: ['友達の投稿', 'ニュース・情報', 'エンタメ・動画', 'ショッピング・広告', 'ハウツー・学習'], required: true },
      { id: 'q4', text: 'SNSへの満足度を5段階で教えてください', type: 'rating', required: true },
      { id: 'q5', text: 'SNSでストレスを感じることはありますか？', type: 'textarea', placeholder: '例：比較してしまうことがある...', required: false },
    ],
  },
}

interface SurveyModalProps {
  task: Task
  onClose: () => void
  onComplete: (taskId: string) => void
}

export default function SurveyModal({ task, onClose, onComplete }: SurveyModalProps) {
  const survey = SURVEY_MAP[task.title]
  const questions = survey?.questions ?? []
  const [currentPage, setCurrentPage] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const totalPages = questions.length
  const question = questions[currentPage]
  const progress = totalPages > 0 ? ((currentPage + 1) / totalPages) * 100 : 0

  const isCurrentAnswered = () => {
    if (!question) return false
    const answer = answers[question.id]
    if (!question.required) return true
    if (answer === undefined || answer === null) return false
    if (typeof answer === 'string' && answer.trim() === '') return false
    if (Array.isArray(answer) && answer.length === 0) return false
    if (typeof answer === 'number' && answer === 0) return false
    return true
  }

  const setAnswer = (value: string | string[] | number) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }))
  }

  const handleNext = async () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1)
    } else {
      setSubmitting(true)
      await onComplete(task.id)
      setSubmitting(false)
      setIsCompleted(true)
    }
  }

  const handleBack = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1)
  }

  if (isCompleted) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col bg-white safe-area-inset">
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="confetti-particle absolute"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  animationDelay: `${Math.random() * 1.5}s`,
                  backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][i % 6],
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30 mb-6 coupon-check-enter">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">回答完了！</h2>
            <p className="text-slate-400 text-sm mb-6 text-center px-4">{task.title}</p>

            <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl px-6 sm:px-8 py-4 text-center shadow-lg shadow-amber-500/20 mb-2">
              <div className="flex items-center gap-2 justify-center">
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span className="text-white text-2xl sm:text-3xl font-black">+{task.reward_points}</span>
                <span className="text-amber-100 text-sm font-bold">pt</span>
              </div>
              <p className="text-amber-100 text-xs mt-1">ポイントが付与されました</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <button onClick={onClose} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm sm:text-base hover:bg-slate-800 transition-colors">
            閉じる
          </button>
        </div>
      </div>
    )
  }

  if (!question) return null

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      {/* Progress */}
      <div className="h-1 bg-slate-100 safe-area-pt">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-slate-100 safe-area-pt gap-2">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors flex-shrink-0">
          <X className="w-5 h-5 text-slate-500" />
        </button>
        <div className="text-center min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate">{task.company_name}</p>
          <p className="text-sm font-bold text-slate-900">{currentPage + 1} / {totalPages}</p>
        </div>
        <div className="flex items-center gap-1 bg-amber-50 px-2 sm:px-2.5 py-1 rounded-full border border-amber-100 flex-shrink-0">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span className="text-amber-600 text-[11px] sm:text-xs font-black">{task.reward_points} pt</span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-lg mx-auto">
          <p className="text-sm font-bold text-indigo-600 mb-2">Q{currentPage + 1}</p>
          <h2 className="text-lg font-bold text-slate-900 mb-6 leading-relaxed">{question.text}</h2>

          {question.type === 'radio' && question.options && (
            <div className="space-y-2.5">
              {question.options.map((option) => {
                const selected = answers[question.id] === option
                return (
                  <button
                    key={option}
                    onClick={() => setAnswer(option)}
                    className={`w-full text-left px-5 py-4 rounded-2xl border-2 text-sm font-bold transition-all ${
                      selected
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-[0.98]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        selected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                      }`}>
                        {selected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      {option}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {question.type === 'checkbox' && question.options && (
            <div className="space-y-2.5">
              {question.options.map((option) => {
                const currentArr = (answers[question.id] as string[]) || []
                const checked = currentArr.includes(option)
                return (
                  <button
                    key={option}
                    onClick={() => {
                      const updated = checked
                        ? currentArr.filter(o => o !== option)
                        : [...currentArr, option]
                      setAnswer(updated)
                    }}
                    className={`w-full text-left px-5 py-4 rounded-2xl border-2 text-sm font-bold transition-all ${
                      checked
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-[0.98]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        checked ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                      }`}>
                        {checked && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </div>
                      {option}
                    </div>
                  </button>
                )
              })}
              <p className="text-xs text-slate-400 mt-1">複数選択できます</p>
            </div>
          )}

          {question.type === 'rating' && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2 sm:gap-3">
                {[1, 2, 3, 4, 5].map((n) => {
                  const selected = (answers[question.id] as number) >= n
                  return (
                    <button
                      key={n}
                      onClick={() => setAnswer(n)}
                      className="transition-all active:scale-90 p-0.5"
                    >
                      <Star
                        className={`w-10 h-10 sm:w-12 sm:h-12 transition-all ${
                          selected
                            ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  )
                })}
              </div>
              <div className="flex justify-between w-full max-w-[260px] sm:max-w-[280px] text-xs text-slate-400">
                <span>悪い</span>
                <span>良い</span>
              </div>
            </div>
          )}

          {question.type === 'textarea' && (
            <div>
              <textarea
                value={(answers[question.id] as string) || ''}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={question.placeholder || '自由に入力してください'}
                rows={5}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
              />
              {!question.required && (
                <p className="text-xs text-slate-400 mt-2">任意回答です</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 sm:px-6 py-4 border-t border-slate-100 safe-area-pb flex gap-3">
        {currentPage > 0 && (
          <button
            onClick={handleBack}
            className="w-12 sm:w-14 flex items-center justify-center border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition-colors min-h-[3rem]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!isCurrentAnswered() || submitting}
          className={`flex-1 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
            isCurrentAnswered() && !submitting
              ? currentPage === totalPages - 1
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20 active:scale-[0.98]'
                : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]'
              : 'bg-slate-100 text-slate-300 cursor-not-allowed'
          }`}
        >
          {submitting ? '送信中...' :
           currentPage === totalPages - 1 ? (
            <>送信して {task.reward_points} pt ゲット <Sparkles className="w-4 h-4" /></>
          ) : (
            <>次の質問へ <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  )
}
