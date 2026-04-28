'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, BookOpen, Clock, ChevronRight, TrendingUp, Shield, Landmark, PiggyBank, Receipt, Building2, Sparkles, Star, ExternalLink, Gift } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ─── Rich content block types ───

type ContentBlock =
  | { type: 'text'; body: string }
  | { type: 'heading'; text: string }
  | { type: 'callout'; emoji: string; title: string; body: string; variant: 'info' | 'warning' | 'success' | 'fun' }
  | { type: 'comparison'; title: string; left: { label: string; items: string[]; highlight?: boolean }; right: { label: string; items: string[]; highlight?: boolean } }
  | { type: 'visual_number'; items: { label: string; value: string; sub?: string; color: string }[] }
  | { type: 'steps'; items: { emoji: string; title: string; body: string }[] }
  | { type: 'growth_bars'; title: string; items: { label: string; amount: number; principal: number }[]; unit?: string }
  | { type: 'quiz'; question: string; options: { id: string; text: string; correct: boolean }[]; explanation: string }
  | { type: 'affiliate_cta'; title: string; subtitle: string; offers: { brand: string; description: string; points: number; gradient: string; url: string; badge?: string }[] }
  | { type: 'divider' }

interface Article {
  id: string
  title: string
  subtitle: string
  emoji: string
  icon: typeof BookOpen
  readMinutes: number
  level: 'beginner' | 'intermediate' | 'advanced'
  gradient: string
  expReward: number
  badge: { emoji: string; title: string }
  content: ContentBlock[]
  keyTakeaway: string
}

const LEVEL_CONFIG = {
  beginner: { label: '入門', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
  intermediate: { label: '基本', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
  advanced: { label: '応用', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
}

// ─── Articles ───

const ARTICLES: Article[] = [
  {
    id: 'nisa',
    title: '積立NISAってなに？',
    subtitle: '月1,000円から始められる非課税投資',
    emoji: '📈',
    icon: TrendingUp,
    readMinutes: 5,
    level: 'beginner',
    gradient: 'from-emerald-500 to-teal-600',
    expReward: 30,
    badge: { emoji: '🌱', title: '投資デビューの芽' },
    content: [
      { type: 'callout', emoji: '🤔', title: 'ぶっちゃけNISAって何？', body: '一言でいうと「投資で儲けたお金に税金がかからなくなる、国の超お得な制度」です。\n\n普通は投資で10万円儲けたら、約2万円が税金で持っていかれます。でもNISAなら10万円まるごと自分のもの！', variant: 'fun' },

      { type: 'divider' },
      { type: 'heading', text: 'まず、これだけ覚えよう' },

      { type: 'comparison', title: '銀行預金 vs NISA', left: { label: '🏦 銀行に預ける', items: ['年利 0.02%くらい', '100万円 → 30年後 100.6万円', '増えない...けど安全'], highlight: false }, right: { label: '📈 NISAで積立', items: ['年利 5%が目安', '100万円 → 30年後 432万円', 'しかも利益に税金ゼロ！'], highlight: true } },

      { type: 'callout', emoji: '💡', title: 'つまり...', body: '銀行に眠らせておくお金を、NISAで運用するだけで将来の資産が全然違ってくるんです。もちろんリスクはあるけど、長期でコツコツやれば歴史的にはプラスになっています。', variant: 'info' },

      { type: 'divider' },
      { type: 'heading', text: '若いうちに始めると、こんなに差がつく' },

      { type: 'text', body: '投資で一番の武器は「才能」でも「お金」でもなく「時間」。\n月たった1万円でも、早く始めるだけでこれだけ変わります：' },

      { type: 'growth_bars', title: '月1万円を年利5%で積み立てると...', items: [ { label: '10年後', amount: 155, principal: 120 }, { label: '20年後', amount: 411, principal: 240 }, { label: '30年後', amount: 832, principal: 360 } ], unit: '万円' },

      { type: 'callout', emoji: '⛄', title: 'これが「複利」の力！', body: '雪だるまを想像してみて。最初は小さくても、転がし続けるとどんどん大きくなる。お金も同じ。利益が利益を生んで、時間が経つほど加速するんです。', variant: 'fun' },

      { type: 'divider' },
      { type: 'heading', text: 'じゃあ、何をすればいい？' },

      { type: 'steps', items: [
        { emoji: '📱', title: 'ネット証券で口座をつくる', body: 'SBI証券か楽天証券がおすすめ。スマホで10分で申し込めます。口座開設は無料！' },
        { emoji: '🏷️', title: 'NISA口座を申し込む', body: '証券口座と一緒に「NISA口座も開設」にチェックするだけ。1人1口座なので、どこで開くか先に決めよう。' },
        { emoji: '🎯', title: '投資先を1つ選ぶ', body: '迷ったら「全世界株式インデックスファンド」一択でOK。世界中の会社にまとめて投資できて、手数料も激安（年0.1%くらい）。' },
        { emoji: '⏰', title: '毎月の積立を設定する', body: '月1,000円からOK！給料日に自動で積み立てる設定にすれば、あとは放置でOK。見なくていい。むしろ見ない方がいい。' },
      ] },

      { type: 'affiliate_cta', title: '口座開設はここからがおトク', subtitle: 'マネコ経由で開設するとポイントがもらえます', offers: [
        { brand: 'SBI証券', description: 'ネット証券No.1。NISA口座と同時開設で手数料ずっと無料。初心者に一番人気。', points: 4000, gradient: 'from-blue-500 to-indigo-600', url: '#', badge: '人気No.1' },
        { brand: '楽天証券', description: '楽天ポイントで投資ができる。楽天経済圏ユーザーならこちらがおすすめ。', points: 3500, gradient: 'from-red-500 to-rose-600', url: '#' },
      ] },

      { type: 'callout', emoji: '⚠️', title: '注意ポイント', body: '・投資なので元本保証ではありません\n・短期で売らない（最低10年は続ける気持ちで）\n・生活費を削ってまで投資しない\n・まずは生活防衛資金（3〜6ヶ月分の生活費）を確保してから！', variant: 'warning' },

      { type: 'divider' },
      { type: 'heading', text: '新NISAの枠はこうなってる' },

      { type: 'visual_number', items: [
        { label: 'つみたて投資枠', value: '年120万', sub: 'コツコツ積立向け', color: 'emerald' },
        { label: '成長投資枠', value: '年240万', sub: '個別株も買える', color: 'blue' },
        { label: '非課税保有限度額', value: '1,800万', sub: '生涯で使える総額', color: 'purple' },
      ] },

      { type: 'text', body: '初心者はまず「つみたて投資枠」だけ使えばOK。年120万円 ＝ 月10万円まで積立できます。月1万円からでも全然大丈夫！' },

      { type: 'callout', emoji: '🚀', title: 'NISAを始める準備はOK？', body: '「いつかやろう」は一番もったいない。口座開設は無料で、スマホから10分で完了します。まずは口座だけでも作っておけば、いつでもスタートできますよ。', variant: 'success' },

      { type: 'affiliate_cta', title: '今すぐ始めるなら', subtitle: '口座開設は無料・維持費もゼロ。マネコ経由でポイントも獲得', offers: [
        { brand: 'SBI証券', description: '口座開設数No.1。取扱ファンド数も業界最多クラス。', points: 4000, gradient: 'from-blue-500 to-indigo-600', url: '#', badge: 'おすすめ' },
      ] },

      { type: 'divider' },

      { type: 'quiz', question: 'NISAの最大のメリットはどれ？', options: [
        { id: 'a', text: '元本が保証される', correct: false },
        { id: 'b', text: '投資の利益に税金がかからない', correct: true },
        { id: 'c', text: '銀行より金利が高い', correct: false },
      ], explanation: '正解！ NISAの最大のメリットは「運用益が非課税」になること。通常は約20%かかる税金がゼロになります。ちなみに元本保証ではないので注意。' },
    ],
    keyTakeaway: '月1,000円からOK。早く始めるほど複利の恩恵が大きい。迷ったら全世界株式インデックスを積立設定するだけ。あとは放置！',
  },
  {
    id: 'compound',
    title: '複利の力を味方にする',
    subtitle: 'アインシュタインが「人類最大の発明」と呼んだ仕組み',
    emoji: '🔄',
    icon: TrendingUp,
    readMinutes: 4,
    level: 'beginner',
    gradient: 'from-blue-500 to-indigo-600',
    expReward: 25,
    badge: { emoji: '⛄', title: '複利マスターの卵' },
    content: [
      { type: 'text', body: '・単利：元本にだけ利息がつく\n・複利：元本＋利息にも利息がつく\n\n100万円を年利5%で運用すると：\n\n【単利】30年後 → 250万円\n【複利】30年後 → 432万円\n\n同じ利率なのに、複利なら182万円も多くなります。' },
      { type: 'callout', emoji: '💡', title: '72の法則', body: '「72 ÷ 年利 = 資産が2倍になる年数」\n\n・年利3% → 約24年で2倍\n・年利5% → 約14年で2倍\n・年利7% → 約10年で2倍\n\n銀行預金（年利0.02%）では2倍になるのに3,600年かかります。', variant: 'info' },
    ],
    keyTakeaway: '複利は「時間 × 継続」で威力を発揮する。72の法則で将来をイメージしよう。',
  },
  {
    id: 'emergency-fund',
    title: '生活防衛資金の作り方',
    subtitle: '「もしも」に備える最初の一歩',
    emoji: '🛡️',
    icon: Shield,
    readMinutes: 4,
    level: 'beginner',
    gradient: 'from-amber-500 to-orange-600',
    expReward: 25,
    badge: { emoji: '🛡️', title: '守りの達人' },
    content: [
      { type: 'text', body: '病気やケガ、失業など「もしも」に備えて確保しておくお金。投資を始める前に、まずはこれを準備するのが鉄則。\n\n目安は「生活費の3〜6ヶ月分」。月の生活費が15万円なら、45〜90万円を貯めておきましょう。' },
      { type: 'steps', items: [
        { emoji: '💰', title: '先取り貯金', body: '給料日に自動で別口座に移す' },
        { emoji: '📱', title: '固定費を見直す', body: 'サブスク整理、格安SIMへの変更' },
        { emoji: '📊', title: '変動費の見える化', body: '家計簿アプリで把握' },
      ] },
    ],
    keyTakeaway: '生活費3〜6ヶ月分を先取り貯金で確保。投資はその後。すぐ引き出せる場所に置こう。',
  },
  {
    id: 'furusato',
    title: 'ふるさと納税の基本',
    subtitle: '実質2,000円で豪華な返礼品をもらう方法',
    emoji: '🏘️',
    icon: Landmark,
    readMinutes: 5,
    level: 'intermediate',
    gradient: 'from-rose-500 to-pink-600',
    expReward: 30,
    badge: { emoji: '🏘️', title: 'ふるさと納税デビュー' },
    content: [
      { type: 'text', body: '好きな自治体に「寄付」をすると、寄付額から2,000円を引いた金額が翌年の税金から控除される制度。さらに返礼品ももらえます。つまり実質2,000円で、お米やお肉、フルーツなどが届く！' },
      { type: 'visual_number', items: [
        { label: '年収300万（独身）', value: '約2.8万', sub: '控除上限額', color: 'rose' },
        { label: '年収400万（独身）', value: '約4.2万', sub: '控除上限額', color: 'rose' },
        { label: '年収500万（独身）', value: '約6.1万', sub: '控除上限額', color: 'rose' },
      ] },
    ],
    keyTakeaway: '実質2,000円で返礼品がもらえるお得な制度。シミュレーションで上限額を確認してから始めよう。',
  },
  {
    id: 'fixed-cost',
    title: '固定費見直しで月1万円浮かす',
    subtitle: 'ストレスゼロで節約できる最強の方法',
    emoji: '💡',
    icon: PiggyBank,
    readMinutes: 4,
    level: 'beginner',
    gradient: 'from-violet-500 to-purple-600',
    expReward: 25,
    badge: { emoji: '💡', title: '固定費ハンター' },
    content: [
      { type: 'comparison', title: '節約の2タイプ', left: { label: '😣 変動費の節約', items: ['食費を削る', '電気をこまめに消す', '毎回ガマンが必要'], highlight: false }, right: { label: '😊 固定費の節約', items: ['スマホ代を下げる', '保険を見直す', '一度やれば自動で節約！'], highlight: true } },
      { type: 'text', body: '【通信費】大手キャリア → 格安SIMで月5,000円削減\n【保険】不要な保険を解約\n【サブスク】使っていないサービスを解約\n【電気・ガス】新電力に切り替え\n\n月1万円浮いたら、そのまま積立NISAに回すのがおすすめ！' },
    ],
    keyTakeaway: '格安SIM・保険・サブスクの3つを見直すだけで月1万円は浮く。浮いたお金は積立投資へ。',
  },
  {
    id: 'ideco',
    title: 'iDeCoで老後資金を作る',
    subtitle: '掛金が全額所得控除になる最強の節税術',
    emoji: '🏦',
    icon: Building2,
    readMinutes: 5,
    level: 'intermediate',
    gradient: 'from-cyan-500 to-blue-600',
    expReward: 30,
    badge: { emoji: '🏦', title: '節税マスター見習い' },
    content: [
      { type: 'text', body: '個人型確定拠出年金（iDeCo）は、自分で作る年金制度。毎月一定額を積み立てて運用し、60歳以降に受け取ります。\n\n最大のメリットは「掛金が全額所得控除」になること。' },
      { type: 'comparison', title: 'NISA vs iDeCo', left: { label: '📈 NISA', items: ['いつでも引き出せる', '運用益が非課税', '掛金の所得控除はなし'], highlight: false }, right: { label: '🏦 iDeCo', items: ['60歳まで引き出せない', '運用益が非課税', '掛金が全額所得控除！'], highlight: true } },
      { type: 'callout', emoji: '💡', title: 'おすすめの順番', body: 'まずNISA → 余裕があればiDeCo。iDeCoは「絶対に使わないお金」で積み立てましょう。', variant: 'info' },
    ],
    keyTakeaway: '掛金が全額所得控除で節税効果大。ただし60歳まで引き出せないので、NISAの次に検討しよう。',
  },
  {
    id: 'budget',
    title: '手取りの黄金比率',
    subtitle: '収入の使い方を最適化する予算術',
    emoji: '📊',
    icon: Receipt,
    readMinutes: 3,
    level: 'beginner',
    gradient: 'from-indigo-500 to-blue-600',
    expReward: 20,
    badge: { emoji: '📊', title: '家計マネージャー' },
    content: [
      { type: 'visual_number', items: [
        { label: '生活費（固定費+変動費）', value: '60%', sub: '家賃・食費・光熱費など', color: 'blue' },
        { label: '貯蓄・投資', value: '20%', sub: 'NISA・貯金など', color: 'emerald' },
        { label: '自由に使うお金', value: '20%', sub: '趣味・交際費など', color: 'amber' },
      ] },
      { type: 'callout', emoji: '😊', title: '大事なポイント', body: '自由に使えるお金もちゃんと確保すること！ガマンばかりの節約は続きません。まず10%の貯蓄から始めてOK。', variant: 'success' },
    ],
    keyTakeaway: '手取りの20%を先取り貯蓄。生活費60%、自由費20%。ガマンしない仕組みが続く秘訣。',
  },
]

// ─── Main Component ───

export default function LearnSection() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [readArticles, setReadArticles] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('maneco_read_articles')
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch { return new Set() }
  })

  const markAsRead = (id: string) => {
    const updated = new Set(readArticles)
    updated.add(id)
    setReadArticles(updated)
    try {
      localStorage.setItem('maneco_read_articles', JSON.stringify([...updated]))
    } catch {}
  }

  const readCount = readArticles.size
  const totalCount = ARTICLES.length
  const progress = Math.round((readCount / totalCount) * 100)

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">増やし方を学ぶ</h2>
              <p className="text-xs text-slate-400 font-medium">{readCount}/{totalCount} 記事読了</p>
            </div>
          </div>
          {readCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-indigo-600">{progress}%</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {ARTICLES.map((article) => {
            const isRead = readArticles.has(article.id)
            const levelConfig = LEVEL_CONFIG[article.level]
            return (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="flex-shrink-0 w-56 text-left group"
              >
                <div className={`bento-card rounded-2xl overflow-hidden transition-all hover:border-indigo-200 hover:shadow-md ${isRead ? 'opacity-75' : ''}`}>
                  <div className={`h-20 bg-gradient-to-br ${article.gradient} relative flex items-center justify-center`}>
                    <span className="text-3xl">{article.emoji}</span>
                    {isRead && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3.5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className={`text-[10px] font-bold border px-1.5 py-0.5 rounded-full ${levelConfig.color} ${levelConfig.bg}`}>
                        {levelConfig.label}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />{article.readMinutes}分
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1 line-clamp-2">{article.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{article.subtitle}</p>
                    <div className="mt-2.5 flex items-center text-indigo-500 text-xs font-bold group-hover:gap-1.5 gap-1 transition-all">
                      {isRead ? '読み返す' : '読む'} <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          alreadyRead={readArticles.has(selectedArticle.id)}
          onComplete={() => markAsRead(selectedArticle.id)}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </>
  )
}

// ─── Article Modal ───

function ArticleModal({ article, alreadyRead, onComplete, onClose }: {
  article: Article
  alreadyRead: boolean
  onComplete: () => void
  onClose: () => void
}) {
  const [showCompletion, setShowCompletion] = useState(false)
  const [quizAnswered, setQuizAnswered] = useState<Record<number, string>>({})
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const levelConfig = LEVEL_CONFIG[article.level]

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    const progress = Math.min(scrollTop / (scrollHeight - clientHeight), 1)
    setScrollProgress(progress)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true })
      return () => el.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  const handleComplete = async () => {
    onComplete()
    setShowCompletion(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('users').select('character_exp, character_level').eq('id', user.id).single()
        if (data) {
          const newExp = (data.character_exp || 0) + article.expReward
          const newLevel = newExp >= data.character_level * 100 ? data.character_level + 1 : data.character_level
          await supabase.from('users').update({ character_exp: newExp, character_level: newLevel }).eq('id', user.id)
        }
      }
    } catch {}
  }

  if (showCompletion) {
    return <CompletionScreen article={article} onClose={onClose} />
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 z-10 safe-area-pt">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-150"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0 safe-area-pt">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
          <X className="w-5 h-5 text-slate-500" />
        </button>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold border px-2 py-0.5 rounded-full ${levelConfig.color} ${levelConfig.bg}`}>
            {levelConfig.label}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />{article.readMinutes}分
          </span>
        </div>
        <div className="w-10" />
      </div>

      {/* Scrollable body */}
      <div ref={scrollRef} className="flex-1 overflow-auto">
        {/* Hero */}
        <div className={`bg-gradient-to-br ${article.gradient} px-6 py-12 text-center relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-6 right-6 w-40 h-40 border-4 border-white rounded-full" />
            <div className="absolute bottom-6 left-6 w-24 h-24 border-4 border-white rounded-full" />
          </div>
          <span className="text-6xl mb-4 block relative z-10">{article.emoji}</span>
          <h1 className="text-2xl font-black text-white mb-2 leading-snug relative z-10">{article.title}</h1>
          <p className="text-white/70 text-sm relative z-10">{article.subtitle}</p>

          <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 relative z-10">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span className="text-white text-xs font-bold">読了で +{article.expReward} EXP</span>
          </div>
        </div>

        {/* Content blocks */}
        <div className="px-5 py-8 max-w-2xl mx-auto space-y-6">
          {article.content.map((block, i) => (
            <ContentBlockRenderer
              key={i}
              block={block}
              index={i}
              gradient={article.gradient}
              quizAnswered={quizAnswered}
              onQuizAnswer={(idx, id) => setQuizAnswered(prev => ({ ...prev, [idx]: id }))}
            />
          ))}

          {/* Key takeaway */}
          <div className={`bg-gradient-to-br ${article.gradient} rounded-3xl p-6 text-white`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <p className="font-bold">この記事のまとめ</p>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">{article.keyTakeaway}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex-shrink-0 safe-area-pb">
        {alreadyRead ? (
          <button onClick={onClose} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm sm:text-base hover:bg-slate-800 transition-colors">
            閉じる
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-2xl font-bold text-sm sm:text-base hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 article-complete-btn"
          >
            <Sparkles className="w-5 h-5" />
            読了！ +{article.expReward} EXP をゲット
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Content Block Renderer ───

function ContentBlockRenderer({ block, index, gradient, quizAnswered, onQuizAnswer }: {
  block: ContentBlock
  index: number
  gradient: string
  quizAnswered: Record<number, string>
  onQuizAnswer: (index: number, id: string) => void
}) {
  switch (block.type) {
    case 'divider':
      return <div className="border-t border-dashed border-slate-200 my-2" />

    case 'heading':
      return (
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <div className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${gradient}`} />
          {block.text}
        </h2>
      )

    case 'text':
      return <p className="text-slate-600 text-sm leading-[1.9] whitespace-pre-line">{block.body}</p>

    case 'callout': {
      const variants = {
        info: 'bg-blue-50 border-blue-100',
        warning: 'bg-amber-50 border-amber-100',
        success: 'bg-emerald-50 border-emerald-100',
        fun: 'bg-indigo-50 border-indigo-100',
      }
      return (
        <div className={`rounded-2xl p-5 border ${variants[block.variant]}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{block.emoji}</span>
            <p className="font-bold text-slate-900 text-sm">{block.title}</p>
          </div>
          <p className="text-slate-600 text-sm leading-[1.9] whitespace-pre-line">{block.body}</p>
        </div>
      )
    }

    case 'comparison':
      return (
        <div>
          {block.title && <p className="text-sm font-bold text-slate-500 mb-3 text-center">{block.title}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[block.left, block.right].map((side, i) => (
              <div key={i} className={`rounded-2xl p-4 border ${side.highlight ? 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                <p className={`text-sm font-bold mb-3 text-center ${side.highlight ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {side.label}
                </p>
                <ul className="space-y-2">
                  {side.items.map((item, j) => (
                    <li key={j} className={`text-xs leading-relaxed ${side.highlight ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {side.highlight ? '✓' : '・'} {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )

    case 'visual_number':
      return (
        <div className="grid grid-cols-1 gap-3">
          {block.items.map((item, i) => {
            const colors: Record<string, string> = {
              emerald: 'from-emerald-500 to-teal-600',
              blue: 'from-blue-500 to-indigo-600',
              purple: 'from-purple-500 to-violet-600',
              amber: 'from-amber-500 to-orange-600',
              rose: 'from-rose-500 to-pink-600',
            }
            return (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 shadow-sm">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors[item.color] || colors.blue} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-lg font-black">{item.value}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.label}</p>
                  {item.sub && <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>}
                </div>
              </div>
            )
          })}
        </div>
      )

    case 'steps':
      return (
        <div className="space-y-3">
          {block.items.map((step, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl">
                  {step.emoji}
                </div>
                {i < block.items.length - 1 && <div className="w-0.5 h-6 bg-slate-100 mt-1" />}
              </div>
              <div className="pt-1 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-slate-400 bg-slate-100 w-5 h-5 rounded-full flex items-center justify-center">{i + 1}</span>
                  <p className="text-sm font-bold text-slate-900">{step.title}</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      )

    case 'growth_bars': {
      const maxAmount = Math.max(...block.items.map(d => d.amount))
      return (
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <p className="text-sm font-bold text-slate-700 mb-4">{block.title}</p>
          <div className="space-y-4">
            {block.items.map((item, i) => {
              const pctTotal = (item.amount / maxAmount) * 100
              const pctPrincipal = (item.principal / maxAmount) * 100
              const profit = item.amount - item.principal
              return (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-xs font-bold text-slate-500">{item.label}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black text-slate-900">{item.amount}</span>
                      <span className="text-xs text-slate-400">{block.unit}</span>
                    </div>
                  </div>
                  <div className="h-8 bg-slate-200 rounded-xl overflow-hidden relative">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-xl transition-all duration-700 flex items-center justify-end pr-2"
                      style={{ width: `${pctTotal}%` }}
                    >
                      <span className="text-[10px] font-bold text-white drop-shadow-sm">+{profit}{block.unit} の利益</span>
                    </div>
                    <div
                      className="absolute inset-y-0 left-0 bg-emerald-600/30 rounded-l-xl"
                      style={{ width: `${pctPrincipal}%` }}
                    />
                  </div>
                  <div className="flex gap-4 mt-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span className="w-2 h-2 bg-emerald-600/30 rounded-sm" />元本 {item.principal}{block.unit}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 bg-emerald-400 rounded-sm" />利益 +{profit}{block.unit}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    case 'affiliate_cta':
      return (
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <Gift className="w-4 h-4 text-amber-600" />
              <p className="text-sm font-bold text-slate-900">{block.title}</p>
            </div>
            <p className="text-xs text-slate-500">{block.subtitle}</p>
          </div>
          <div className="px-4 pb-4 space-y-3">
            {block.offers.map((offer, i) => (
              <a
                key={i}
                href={offer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-xl border border-slate-100 p-4 hover:border-amber-200 hover:shadow-md transition-all active:scale-[0.98] group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${offer.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <Landmark className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">{offer.brand}</span>
                      {offer.badge && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-full">{offer.badge}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-2">{offer.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-amber-600 font-black text-base">{offer.points.toLocaleString()}</span>
                        <span className="text-amber-400 text-[10px] font-bold">pt もらえる</span>
                      </div>
                      <span className="text-xs font-bold text-indigo-500 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                        詳しく見る <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div className="px-5 pb-4">
            <p className="text-[10px] text-slate-400 text-center">提携企業の公式サイトに遷移します。マネコが個人情報を保管することはありません。</p>
          </div>
        </div>
      )

    case 'quiz': {
      const answered = quizAnswered[index]
      const correctOption = block.options.find(o => o.correct)
      return (
        <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-black">Q</span>
            </div>
            <p className="font-bold text-slate-900 text-sm flex-1">{block.question}</p>
          </div>
          <div className="space-y-2">
            {block.options.map((option) => {
              let style = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-[0.98]'
              if (answered) {
                if (option.correct) {
                  style = 'bg-emerald-500 border-emerald-500 text-white'
                } else if (answered === option.id && !option.correct) {
                  style = 'bg-red-50 border-red-200 text-red-500'
                } else {
                  style = 'bg-slate-50 border-slate-200 text-slate-300'
                }
              }
              return (
                <button
                  key={option.id}
                  onClick={() => !answered && onQuizAnswer(index, option.id)}
                  disabled={!!answered}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-bold transition-all ${style}`}
                >
                  {option.text}
                  {answered && option.correct && <span className="float-right">✓</span>}
                  {answered === option.id && !option.correct && <span className="float-right">✗</span>}
                </button>
              )
            })}
          </div>
          {answered && (
            <div className={`mt-4 p-4 rounded-xl ${answered === correctOption?.id ? 'bg-emerald-100 border border-emerald-200' : 'bg-amber-100 border border-amber-200'}`}>
              <p className={`text-sm font-bold mb-1 ${answered === correctOption?.id ? 'text-emerald-700' : 'text-amber-700'}`}>
                {answered === correctOption?.id ? '正解！ 🎉' : '残念！ 😅'}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">{block.explanation}</p>
            </div>
          )}
        </div>
      )
    }

    default:
      return null
  }
}

// ─── Completion Screen ───

function CompletionScreen({ article, onClose }: { article: Article; onClose: () => void }) {
  const [showBadge, setShowBadge] = useState(false)
  const [showExp, setShowExp] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShowBadge(true), 400)
    const t2 = setTimeout(() => setShowExp(true), 900)
    const t3 = setTimeout(() => setShowButton(true), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white safe-area-inset">
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Confetti particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
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

        {/* Badge */}
        <div className={`transition-all duration-700 ${showBadge ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="relative">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30">
              <span className="text-5xl sm:text-6xl">{article.badge.emoji}</span>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
              NEW BADGE!
            </div>
          </div>
        </div>

        {/* Title */}
        <div className={`text-center mt-8 transition-all duration-700 ${showBadge ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-2xl font-black text-slate-900 mb-1">読了おめでとう！</p>
          <p className="text-slate-400 text-sm">{article.title}</p>
        </div>

        {/* Badge name */}
        <div className={`mt-6 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3 text-center transition-all duration-700 ${showBadge ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-xs text-slate-400 font-medium mb-0.5">獲得バッジ</p>
          <p className="text-sm font-bold text-slate-900">{article.badge.emoji} {article.badge.title}</p>
        </div>

        {/* EXP reward */}
        <div className={`mt-5 transition-all duration-700 ${showExp ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl px-8 py-4 text-center shadow-lg shadow-emerald-500/20">
            <div className="flex items-center gap-2 justify-center">
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span className="text-white text-3xl font-black">+{article.expReward}</span>
              <span className="text-emerald-100 text-sm font-bold">EXP</span>
            </div>
            <p className="text-emerald-100 text-xs mt-1">キャラクターの経験値に加算されました</p>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className={`px-6 py-4 transition-all duration-500 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <button
          onClick={onClose}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm sm:text-base hover:bg-slate-800 transition-colors"
        >
          つぎの記事へ
        </button>
      </div>
    </div>
  )
}
