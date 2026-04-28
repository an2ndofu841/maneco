'use client'

import { useState } from 'react'
import { X, BookOpen, Clock, ChevronRight, TrendingUp, Shield, Landmark, PiggyBank, Receipt, Building2 } from 'lucide-react'

interface Article {
  id: string
  title: string
  subtitle: string
  emoji: string
  icon: typeof BookOpen
  readMinutes: number
  level: 'beginner' | 'intermediate' | 'advanced'
  color: string
  gradient: string
  sections: { heading: string; body: string }[]
  keyTakeaway: string
}

const LEVEL_CONFIG = {
  beginner: { label: '入門', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
  intermediate: { label: '基本', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
  advanced: { label: '応用', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
}

const ARTICLES: Article[] = [
  {
    id: 'nisa',
    title: '積立NISAってなに？',
    subtitle: '月1,000円から始められる非課税投資',
    emoji: '📈',
    icon: TrendingUp,
    readMinutes: 5,
    level: 'beginner',
    color: 'text-emerald-600',
    gradient: 'from-emerald-500 to-teal-600',
    sections: [
      {
        heading: '積立NISAとは？',
        body: '積立NISAは、年間120万円までの投資で得た利益が非課税になる制度です。通常、投資の利益には約20%の税金がかかりますが、NISA口座なら税金ゼロ。\n\n2024年から新NISAになり、非課税保有期間が無期限化。「つみたて投資枠」と「成長投資枠」を合わせて年間360万円まで投資できるようになりました。',
      },
      {
        heading: 'なぜ若いうちに始めるべき？',
        body: '投資で最も大事なのは「時間」です。月1万円を年利5%で運用した場合：\n\n・10年後 → 約155万円（元本120万円）\n・20年後 → 約411万円（元本240万円）\n・30年後 → 約832万円（元本360万円）\n\n早く始めるほど「複利の力」で資産が雪だるま式に増えていきます。',
      },
      {
        heading: 'まず何をすればいい？',
        body: '① ネット証券の口座を開設（SBI証券、楽天証券が人気）\n② NISA口座を申し込む\n③ 全世界株式や米国株式のインデックスファンドを選ぶ\n④ 毎月の積立金額を設定（月1,000円からOK）\n\nポイントは「低コストのインデックスファンド」を選ぶこと。信託報酬が年0.1%台のものがおすすめです。',
      },
    ],
    keyTakeaway: '月1,000円からOK。早く始めるほど複利の恩恵が大きい。まずはネット証券でNISA口座を開設しよう。',
  },
  {
    id: 'compound',
    title: '複利の力を味方にする',
    subtitle: 'アインシュタインが「人類最大の発明」と呼んだ仕組み',
    emoji: '🔄',
    icon: TrendingUp,
    readMinutes: 4,
    level: 'beginner',
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-indigo-600',
    sections: [
      {
        heading: '単利と複利の違い',
        body: '・単利：元本にだけ利息がつく\n・複利：元本＋利息にも利息がつく\n\n100万円を年利5%で運用すると：\n\n【単利】30年後 → 250万円\n【複利】30年後 → 432万円\n\n同じ利率なのに、複利なら182万円も多くなります。これが「複利の力」です。',
      },
      {
        heading: '72の法則',
        body: '「72 ÷ 年利 = 資産が2倍になる年数」という便利な公式があります。\n\n・年利3% → 約24年で2倍\n・年利5% → 約14年で2倍\n・年利7% → 約10年で2倍\n\n逆に言えば、銀行預金（年利0.02%）では2倍になるのに3,600年かかります。',
      },
      {
        heading: '複利を活かすコツ',
        body: '① なるべく早く始める（時間が味方）\n② 途中で引き出さない（雪だるまを壊さない）\n③ 配当金は再投資する\n④ 手数料の低い商品を選ぶ（コストも複利で効く）\n\n焦らず、コツコツ続けることが最大のポイントです。',
      },
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
    color: 'text-amber-600',
    gradient: 'from-amber-500 to-orange-600',
    sections: [
      {
        heading: '生活防衛資金とは？',
        body: '病気やケガ、失業など「もしも」に備えて確保しておくお金のことです。投資を始める前に、まずはこれを準備するのが鉄則。\n\n目安は「生活費の3〜6ヶ月分」。月の生活費が15万円なら、45〜90万円を貯めておきましょう。',
      },
      {
        heading: '効率的な貯め方',
        body: '① 先取り貯金：給料日に自動で別口座に移す\n② 固定費を見直す：サブスク整理、格安SIMへの変更\n③ 変動費の「見える化」：家計簿アプリで把握\n④ ボーナスの50%を貯金に回す\n\n毎月3万円の先取り貯金なら、1年半で約54万円。無理のない金額から始めるのがコツです。',
      },
      {
        heading: 'どこに置いておく？',
        body: '生活防衛資金は「すぐに引き出せる」ことが大事。おすすめの置き場所：\n\n・ネット銀行の普通預金（金利が比較的高い）\n・定期預金（数ヶ月単位の短期）\n\n投資には回さないこと。株が暴落した時に生活費が足りない、という事態を防ぎます。',
      },
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
    color: 'text-rose-600',
    gradient: 'from-rose-500 to-pink-600',
    sections: [
      {
        heading: 'ふるさと納税の仕組み',
        body: '好きな自治体に「寄付」をすると、寄付額から2,000円を引いた金額が翌年の税金から控除される制度です。\n\nさらに、寄付のお礼として各地の特産品（返礼品）がもらえます。つまり実質2,000円で、お米やお肉、フルーツなどが届くイメージです。',
      },
      {
        heading: 'いくらまで寄付できる？',
        body: '控除上限額は年収や家族構成によって変わります。ざっくりの目安：\n\n・年収300万円（独身）→ 約28,000円\n・年収400万円（独身）→ 約42,000円\n・年収500万円（独身）→ 約61,000円\n\n上限を超えると自己負担が増えるので、シミュレーションサイトで事前に確認しましょう。',
      },
      {
        heading: '始め方3ステップ',
        body: '① シミュレーションで上限額を確認\n② ふるさと納税サイトで返礼品を選ぶ（楽天、さとふる等）\n③ ワンストップ特例制度を申請（確定申告が不要に）\n\nワンストップ特例は、寄付先が5自治体以内なら使えます。届いた書類に記入して返送するだけで完了。会社員にはこちらが簡単です。',
      },
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
    color: 'text-violet-600',
    gradient: 'from-violet-500 to-purple-600',
    sections: [
      {
        heading: 'なぜ固定費から見直すべき？',
        body: '節約には2種類あります：\n\n・変動費の節約（食費を削る、電気をこまめに消す）→ 毎回ガマンが必要\n・固定費の節約（スマホ代、保険料を下げる）→ 一度やれば毎月自動で節約\n\n固定費の見直しは「一度の手間で効果がずっと続く」最も効率的な節約法です。',
      },
      {
        heading: '見直しチェックリスト',
        body: '【通信費】大手キャリア → 格安SIM\n→ 月5,000〜8,000円 → 月1,000〜3,000円に\n\n【保険】不要な保険を解約\n→ 若くて健康なら医療保険は最低限でOK\n\n【サブスク】使っていないサービスを解約\n→ 平均3〜5個の使っていないサブスクがある\n\n【電気・ガス】新電力に切り替え\n→ 年間5,000〜15,000円の削減',
      },
      {
        heading: '浮いたお金の使い道',
        body: '月1万円浮いたら、そのまま積立NISAに回すのがおすすめ。\n\n月1万円を年利5%で20年積み立てると → 約411万円\n\n「節約 → 投資」の流れを作ると、お金が自動的に増える仕組みができあがります。',
      },
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
    color: 'text-cyan-600',
    gradient: 'from-cyan-500 to-blue-600',
    sections: [
      {
        heading: 'iDeCoとは？',
        body: '個人型確定拠出年金（iDeCo）は、自分で作る年金制度です。毎月一定額を積み立てて運用し、60歳以降に受け取ります。\n\n最大のメリットは「掛金が全額所得控除」になること。年収400万円の会社員が毎月23,000円（年間276,000円）を積み立てると、年間約55,000円の節税効果があります。',
      },
      {
        heading: 'NISAとの違い',
        body: '【NISA】\n・いつでも引き出せる\n・運用益が非課税\n・掛金の所得控除はなし\n\n【iDeCo】\n・60歳まで引き出せない\n・運用益が非課税\n・掛金が全額所得控除（節税効果）\n\nまずNISA、余裕があればiDeCoの順番がおすすめ。iDeCoは「絶対に使わないお金」で積み立てましょう。',
      },
      {
        heading: '始め方',
        body: '① 金融機関を選ぶ（ネット証券がおすすめ）\n② 掛金額を決める（会社員は月23,000円が上限）\n③ 運用商品を選ぶ（インデックスファンド推奨）\n④ 会社に「事業主証明書」を依頼して申込\n\n口座開設に1〜2ヶ月かかるので、早めに申し込みましょう。',
      },
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
    color: 'text-indigo-600',
    gradient: 'from-indigo-500 to-blue-600',
    sections: [
      {
        heading: '理想の支出バランス',
        body: '手取り収入を以下の比率で分けるのが基本の考え方です：\n\n・生活費（固定費＋変動費）：60%\n・貯蓄・投資：20%\n・自由に使うお金：20%\n\n手取り20万円なら、生活費12万、貯蓄・投資4万、自由費4万。まずはこの比率を目指しましょう。',
      },
      {
        heading: '実践のコツ',
        body: '① 給料日に先取りで20%を貯蓄口座へ\n② 残りの80%で生活する\n③ 自由費は「罪悪感なく使っていいお金」\n\n大切なのは、自由に使えるお金もちゃんと確保すること。ガマンばかりの節約は続きません。\n\n「収入が少ないから貯金できない」と思ったら、まず10%から始めてOK。習慣にすることが最優先です。',
      },
    ],
    keyTakeaway: '手取りの20%を先取り貯蓄。生活費60%、自由費20%。ガマンしない仕組みが続く秘訣。',
  },
]

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
        {/* Section header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">増やし方を学ぶ</h2>
              <p className="text-[11px] text-slate-400 font-medium">{readCount}/{totalCount} 記事読了</p>
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

        {/* Article cards - horizontal scroll */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:-mx-0 md:px-0">
          {ARTICLES.map((article) => {
            const isRead = readArticles.has(article.id)
            const levelConfig = LEVEL_CONFIG[article.level]
            return (
              <button
                key={article.id}
                onClick={() => {
                  setSelectedArticle(article)
                  markAsRead(article.id)
                }}
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
                    <p className="text-[11px] text-slate-400 line-clamp-1">{article.subtitle}</p>
                    <div className="mt-2.5 flex items-center text-indigo-500 text-[11px] font-bold group-hover:gap-1.5 gap-1 transition-all">
                      読む <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Article modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </>
  )
}

function ArticleModal({ article, onClose }: { article: Article; onClose: () => void }) {
  const levelConfig = LEVEL_CONFIG[article.level]

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${levelConfig.color} ${levelConfig.bg}`}>
            {levelConfig.label}
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />{article.readMinutes}分で読める
          </span>
        </div>
        <div className="w-10" />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto">
        {/* Hero */}
        <div className={`bg-gradient-to-br ${article.gradient} px-6 py-10 text-center`}>
          <span className="text-5xl mb-4 block">{article.emoji}</span>
          <h1 className="text-2xl font-black text-white mb-2 leading-snug">{article.title}</h1>
          <p className="text-white/70 text-sm">{article.subtitle}</p>
        </div>

        {/* Content */}
        <div className="px-6 py-8 max-w-2xl mx-auto space-y-8">
          {article.sections.map((section, i) => (
            <div key={i}>
              <div className="flex items-center gap-2.5 mb-3">
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${article.gradient} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                  {i + 1}
                </div>
                <h2 className="text-lg font-bold text-slate-900">{section.heading}</h2>
              </div>
              <div className="pl-9.5 text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {section.body}
              </div>
            </div>
          ))}

          {/* Key takeaway */}
          <div className={`bg-gradient-to-br ${article.gradient} rounded-2xl p-5 text-white`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💡</span>
              <p className="font-bold text-sm">まとめ</p>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">{article.keyTakeaway}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex-shrink-0">
        <button
          onClick={onClose}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-base hover:bg-slate-800 transition-colors"
        >
          閉じる
        </button>
      </div>
    </div>
  )
}
