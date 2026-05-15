'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Gift,
  Sparkles,
  Calendar,
  CheckCircle2,
  Mail,
  HelpCircle,
} from 'lucide-react'
import {
  estimateFurusatoLimit,
  INCOME_OPTIONS,
  FAMILY_OPTIONS,
  FURUSATO_FAQS,
  type FamilyType,
} from '@/lib/furusato'

type Step = 0 | 1 | 2 | 3 | 4

export default function FurusatoPage() {
  const [step, setStep] = useState<Step>(0)
  const [income, setIncome] = useState<number | null>(null)
  const [family, setFamily] = useState<FamilyType | null>(null)
  const [hasMortgage, setHasMortgage] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const limit = income !== null && family !== null
    ? estimateFurusatoLimit({ incomeManYen: income, family, hasMortgage })
    : 0

  const recommendedItems = [
    {
      title: 'お米 5kg×4回 (定期便)',
      brand: '北海道 / 新潟 など人気自治体',
      donation: 20000,
      tag: '🍚 主食',
      desc: '毎月届くから「買い物リストから消える」のが快感',
      url: 'https://www.satofull.jp/products/list.php?cat=11',
      color: 'from-amber-100 to-orange-100',
      border: 'border-amber-200',
    },
    {
      title: '黒毛和牛 切り落とし 1kg',
      brand: '宮崎県・佐賀県 などブランド和牛',
      donation: 15000,
      tag: '🥩 お肉',
      desc: '焼肉・しゃぶしゃぶに。家族イベントが格上げ',
      url: 'https://www.satofull.jp/products/list.php?cat=12',
      color: 'from-rose-100 to-red-100',
      border: 'border-rose-200',
    },
    {
      title: 'トイレットペーパー 96ロール',
      brand: '静岡県・愛媛県 など製紙工場直送',
      donation: 13000,
      tag: '🧻 日用品',
      desc: '半年分まとめて届く。生活費の節約効果が一番大きい',
      url: 'https://www.satofull.jp/search/category-list.php?keyword=%E3%83%88%E3%82%A4%E3%83%AC%E3%83%83%E3%83%88%E3%83%9A%E3%83%BC%E3%83%91%E3%83%BC',
      color: 'from-sky-100 to-blue-100',
      border: 'border-sky-200',
    },
  ]

  const filteredItems = recommendedItems.filter((item) => item.donation <= Math.max(limit, 5000))

  const PORTAL_LINKS = [
    { name: 'さとふる', url: 'https://www.satofull.jp/', desc: 'CMで有名・初心者にやさしい', emoji: '⭐' },
    { name: '楽天ふるさと納税', url: 'https://event.rakuten.co.jp/furusato/', desc: '楽天ポイントが貯まる', emoji: '🛒' },
    { name: 'ふるなび', url: 'https://furunavi.jp/', desc: 'Amazonギフト券還元あり', emoji: '🎁' },
  ]

  const goNext = () => {
    if (step === 1 && (income === null || family === null)) return
    setStep((prev) => (Math.min(4, prev + 1) as Step))
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const goBack = () => {
    setStep((prev) => (Math.max(0, prev - 1) as Step))
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen md:pb-12">
      <div className="app-container pt-6 md:pt-12 max-w-3xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          ダッシュボードに戻る
        </Link>

        {/* ヘッダー */}
        <div className="mb-6">
          <p className="text-slate-500 text-sm font-medium mb-1">超やさしい ふるさと納税ガイド</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            実質2,000円で、<br className="md:hidden" />
            <span className="text-gradient-primary">毎日のごはんがランクアップ。</span>
          </h1>
        </div>

        {/* プログレスバー */}
        <div className="flex items-center gap-2 mb-8">
          {[0, 1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                s <= step ? 'bg-gradient-to-r from-indigo-500 to-blue-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* STEP 0: イントロ */}
        {step === 0 && (
          <div className="space-y-5 animate-fade-in">
            <div className="bento-card rounded-3xl p-6 md:p-8">
              <p className="text-xs font-bold tracking-widest text-indigo-600 mb-2">STEP 1 / 5</p>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 leading-tight">
                ふるさと納税って、結局なに？
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                難しく聞こえますが、たった一行で説明できます。
              </p>

              <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 mb-6">
                <p className="text-base md:text-lg font-bold text-slate-900 leading-relaxed">
                  <span className="text-indigo-600">「2,000円払うと、</span><br />
                  それ以上の特産品がもらえる<br />
                  <span className="text-indigo-600">国公認のお得な制度」</span>
                </p>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                仕組みはこんな感じです。
              </p>

              {/* ステップ図解 */}
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-black flex-shrink-0">1</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">好きな自治体を応援（寄付）</p>
                    <p className="text-xs text-slate-500 mt-0.5">「北海道のお米くださいなー」と思って¥10,000寄付する</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-sm font-black flex-shrink-0">2</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">特産品（返礼品）が届く</p>
                    <p className="text-xs text-slate-500 mt-0.5">寄付額の約3割が目安。¥10,000寄付なら¥3,000相当のお米</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-black flex-shrink-0">3</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">来年の税金が安くなる</p>
                    <p className="text-xs text-slate-500 mt-0.5">寄付額¥10,000 − 自己負担¥2,000 = ¥8,000が税金から差し引かれる</p>
                  </div>
                </div>
              </div>

              {/* 結論ボックス */}
              <div className="mt-6 rounded-2xl p-5 bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 border border-orange-100">
                <p className="text-xs font-bold text-orange-700 mb-1 tracking-wider">＝ つまり</p>
                <p className="text-base font-bold text-slate-900 leading-relaxed">
                  実質 <span className="text-2xl text-orange-600">¥2,000</span> の負担で、<br />
                  <span className="text-orange-600">¥3,000相当のお米</span>が手に入る！
                </p>
                <p className="text-xs text-slate-500 mt-2">※ 返礼品が3,000円相当の場合の例</p>
              </div>
            </div>

            <button
              onClick={goNext}
              className="w-full btn-primary py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
            >
              じゃあ、わたしはいくらまでお得？
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 1: 限度額計算入力 */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="bento-card rounded-3xl p-6 md:p-8">
              <p className="text-xs font-bold tracking-widest text-indigo-600 mb-2">STEP 2 / 5</p>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 leading-tight">
                あなたの「お得の上限額」を計算
              </h2>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                寄付の上限額は、年収と家族構成で決まります。<br />
                以下に答えるだけで一発でわかります。
              </p>

              {/* 年収 */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">
                  Q1. 額面年収（おおよそでOK）
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {INCOME_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setIncome(opt.value)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        income === opt.value
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">💡 給与明細・源泉徴収票の「支払金額」が額面年収です</p>
              </div>

              {/* 家族構成 */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">
                  Q2. 家族構成
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FAMILY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFamily(opt.value)}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        family === opt.value
                          ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xl mb-1">{opt.emoji}</div>
                      <p className={`font-bold text-sm ${family === opt.value ? 'text-indigo-700' : 'text-slate-900'}`}>
                        {opt.label}
                      </p>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 住宅ローン */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">
                  Q3. 住宅ローン控除を受けていますか？
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setHasMortgage(false)}
                    className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                      !hasMortgage
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    受けていない
                  </button>
                  <button
                    onClick={() => setHasMortgage(true)}
                    className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                      hasMortgage
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    受けている
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2">💡 持ち家でローン控除中の場合は限度額が少し下がります</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={goBack} className="py-4 rounded-2xl font-bold text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
                戻る
              </button>
              <button
                onClick={goNext}
                disabled={income === null || family === null}
                className="btn-primary py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                結果を見る
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: 限度額結果 */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="rounded-3xl p-6 md:p-8 text-white relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500">
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/20 rounded-full blur-3xl" />
              <div className="absolute bottom-[-30%] left-[-10%] w-72 h-72 bg-purple-400/30 rounded-full blur-3xl" />
              <div className="relative z-10 text-center">
                <p className="text-xs font-bold tracking-widest opacity-90 mb-2">あなたの寄付上限額（目安）</p>
                <Sparkles className="w-6 h-6 mx-auto mb-3 text-amber-300" />
                <p className="text-5xl md:text-6xl font-black tracking-tight mb-2">
                  ¥{limit.toLocaleString()}
                </p>
                <p className="text-sm opacity-90">この範囲で寄付すれば、自己負担は<strong>¥2,000</strong>だけ</p>
              </div>
            </div>

            {/* お得計算 */}
            <div className="bento-card rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-3">
                <Gift className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-slate-900">どのくらいお得？</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-sm text-slate-600">寄付できる額</span>
                  <span className="font-bold text-slate-900">¥{limit.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-sm text-slate-600">返礼品の金額（約3割）</span>
                  <span className="font-bold text-orange-600">約¥{Math.round(limit * 0.3).toLocaleString()}相当</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-sm text-slate-600">あなたの実質負担</span>
                  <span className="font-bold text-slate-900">¥2,000</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                  <span className="text-sm font-bold">差額（お得分）</span>
                  <span className="font-black text-xl">+¥{Math.max(0, Math.round(limit * 0.3) - 2000).toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                ※ 返礼品の金額は寄付額の3割を上限とする総務省ルール基準。実際の還元率は商品により異なります。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={goBack} className="py-4 rounded-2xl font-bold text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
                戻る
              </button>
              <button
                onClick={goNext}
                className="btn-primary py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                おすすめ返礼品を見る
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: おすすめ返礼品 */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="bento-card rounded-3xl p-6 md:p-8">
              <p className="text-xs font-bold tracking-widest text-indigo-600 mb-2">STEP 4 / 5</p>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 leading-tight">
                初心者におすすめの3選
              </h2>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                <strong className="text-slate-700">「日常で必ず使うもの」</strong>を選ぶのがコツ。<br />
                生活費が浮いて、お得感がもっと実感できます。
              </p>

              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <a
                    key={item.title}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block rounded-2xl border ${item.border} bg-gradient-to-br ${item.color} p-4 hover:shadow-md transition-all group`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-slate-700 mb-2">
                          {item.tag}
                        </span>
                        <h4 className="font-bold text-slate-900 mb-0.5 leading-tight">{item.title}</h4>
                        <p className="text-xs text-slate-600 mb-1">{item.brand}</p>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[10px] text-slate-500 mb-0.5">寄付額</p>
                        <p className="text-base font-black text-slate-900">¥{item.donation.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-indigo-600 group-hover:underline">
                      探す →
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* ポータルサイト */}
            <div className="bento-card rounded-3xl p-6 md:p-8">
              <h3 className="font-bold text-slate-900 mb-1">どこで申し込めばいい？</h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                好きなポータルサイトから申込み。お試しなら「さとふる」がやさしいです。
              </p>
              <div className="space-y-2">
                {PORTAL_LINKS.map((portal) => (
                  <a
                    key={portal.name}
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
                  >
                    <div className="text-2xl flex-shrink-0">{portal.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-900">{portal.name}</p>
                      <p className="text-xs text-slate-500">{portal.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={goBack} className="py-4 rounded-2xl font-bold text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
                戻る
              </button>
              <button
                onClick={goNext}
                className="btn-primary py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                申込み後の手続きへ
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: 申込み後の手続き */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div className="bento-card rounded-3xl p-6 md:p-8">
              <p className="text-xs font-bold tracking-widest text-indigo-600 mb-2">STEP 5 / 5</p>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 leading-tight">
                申込み後にやること、たった3つ。
              </h2>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                ふるさと納税は申込み後に「税金の手続き」が必要です。<br />
                <strong className="text-slate-700">ワンストップ特例</strong>を使えば確定申告は不要！
              </p>

              <div className="space-y-3">
                <ChecklistItem
                  num={1}
                  title="ワンストップ特例の申請書をチェック"
                  desc="申込み時に「ワンストップ特例を希望する」にチェックを入れる。後日、自治体から書類が届きます"
                  icon={<Check className="w-5 h-5" />}
                  color="bg-emerald-100 text-emerald-600"
                />
                <ChecklistItem
                  num={2}
                  title="書類に記入＋本人確認書類のコピー"
                  desc="マイナンバーカードのコピー（裏表）か、運転免許証＋通知カードのコピー。書類の指示通りに記入"
                  icon={<Mail className="w-5 h-5" />}
                  color="bg-blue-100 text-blue-600"
                />
                <ChecklistItem
                  num={3}
                  title="翌年1/10までに郵送"
                  desc="返信用封筒に入れて、自治体ごとに送るだけ。これで翌年の住民税から自動的に差し引かれます"
                  icon={<Calendar className="w-5 h-5" />}
                  color="bg-amber-100 text-amber-600"
                />
              </div>

              <div className="mt-6 rounded-2xl p-4 bg-rose-50 border border-rose-100">
                <p className="text-xs font-bold text-rose-700 mb-1">⚠️ こんな人は確定申告が必要</p>
                <ul className="text-xs text-rose-600 leading-relaxed space-y-0.5">
                  <li>・6つ以上の自治体に寄付した人</li>
                  <li>・もともと確定申告をしている人（自営業など）</li>
                  <li>・医療費控除なども一緒に申告したい人</li>
                </ul>
              </div>

              {/* 完了演出 */}
              <div className="mt-6 rounded-2xl p-5 bg-gradient-to-br from-amber-400 via-orange-400 to-pink-500 text-white text-center">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-sm font-bold mb-1">これで完璧！</p>
                <p className="text-xs opacity-90 leading-relaxed">
                  実質¥2,000で<strong>¥{Math.round(limit * 0.3).toLocaleString()}相当</strong>の返礼品ゲット完了です
                </p>
              </div>
            </div>

            {/* よくある質問 */}
            <div className="bento-card rounded-3xl p-6 md:p-8">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-500" />
                よくある質問
              </h3>
              <div className="space-y-2">
                {FURUSATO_FAQS.map((faq, i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={goBack} className="py-4 rounded-2xl font-bold text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
                戻る
              </button>
              <Link
                href="/dashboard"
                className="btn-primary py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                ダッシュボードへ
                <CheckCircle2 className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface ChecklistItemProps {
  num: number
  title: string
  desc: string
  icon: React.ReactNode
  color: string
}

function ChecklistItem({ num, title, desc, icon, color }: ChecklistItemProps) {
  return (
    <div className="flex gap-3 p-4 rounded-2xl border border-slate-200 bg-white">
      <div className="relative flex-shrink-0">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center">
          {num}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-slate-900 mb-1">{title}</p>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
