/**
 * ふるさと納税の限度額計算（簡易版）
 *
 * 厳密な計算は所得・住民税・各種控除に依存するため、
 * 「給与所得者向け」の代表的な目安額をルックアップテーブルで返す。
 * 出典の目安: 総務省ふるさと納税ポータル / 各種シミュレーター
 *
 * 注意: あくまで目安。実際の限度額は前年所得の確定申告/住民税通知で決定する。
 */

export type FamilyType = 'single' | 'couple' | 'couple_kid' | 'single_parent'

export interface FurusatoLimitInput {
  /** 額面年収（万円単位） */
  incomeManYen: number
  /** 家族構成 */
  family: FamilyType
  /** 住宅ローン控除を受けているか（受けていると限度額が下がる） */
  hasMortgage: boolean
}

interface LimitTable {
  income: number
  single: number
  couple: number
  couple_kid: number
  single_parent: number
}

const LIMIT_TABLE: LimitTable[] = [
  { income: 200, single: 15000, couple: 9000, couple_kid: 0, single_parent: 6000 },
  { income: 250, single: 22000, couple: 14000, couple_kid: 5000, single_parent: 11000 },
  { income: 300, single: 28000, couple: 19000, couple_kid: 11000, single_parent: 16000 },
  { income: 350, single: 34000, couple: 26000, couple_kid: 17000, single_parent: 22000 },
  { income: 400, single: 42000, couple: 33000, couple_kid: 25000, single_parent: 29000 },
  { income: 450, single: 52000, couple: 41000, couple_kid: 33000, single_parent: 37000 },
  { income: 500, single: 61000, couple: 49000, couple_kid: 40000, single_parent: 44000 },
  { income: 550, single: 69000, couple: 60000, couple_kid: 48000, single_parent: 56000 },
  { income: 600, single: 77000, couple: 69000, couple_kid: 60000, single_parent: 66000 },
  { income: 650, single: 97000, couple: 77000, couple_kid: 68000, single_parent: 74000 },
  { income: 700, single: 108000, couple: 86000, couple_kid: 78000, single_parent: 83000 },
  { income: 750, single: 118000, couple: 109000, couple_kid: 87000, single_parent: 106000 },
  { income: 800, single: 129000, couple: 120000, couple_kid: 110000, single_parent: 117000 },
  { income: 850, single: 140000, couple: 131000, couple_kid: 121000, single_parent: 128000 },
  { income: 900, single: 152000, couple: 143000, couple_kid: 132000, single_parent: 140000 },
  { income: 950, single: 167000, couple: 157000, couple_kid: 144000, single_parent: 154000 },
  { income: 1000, single: 176000, couple: 166000, couple_kid: 157000, single_parent: 163000 },
  { income: 1100, single: 213000, couple: 194000, couple_kid: 185000, single_parent: 191000 },
  { income: 1200, single: 242000, couple: 232000, couple_kid: 222000, single_parent: 229000 },
  { income: 1300, single: 271000, couple: 261000, couple_kid: 251000, single_parent: 258000 },
  { income: 1400, single: 355000, couple: 343000, couple_kid: 277000, single_parent: 339000 },
  { income: 1500, single: 395000, couple: 369000, couple_kid: 361000, single_parent: 367000 },
  { income: 1600, single: 429000, couple: 418000, couple_kid: 407000, single_parent: 415000 },
  { income: 1800, single: 538000, couple: 527000, couple_kid: 514000, single_parent: 524000 },
  { income: 2000, single: 569000, couple: 557000, couple_kid: 545000, single_parent: 555000 },
  { income: 2500, single: 856000, couple: 843000, couple_kid: 829000, single_parent: 840000 },
]

export function estimateFurusatoLimit({ incomeManYen, family, hasMortgage }: FurusatoLimitInput): number {
  const sorted = [...LIMIT_TABLE].sort((a, b) => a.income - b.income)
  const lower = [...sorted].reverse().find((row) => row.income <= incomeManYen) ?? sorted[0]
  const upper = sorted.find((row) => row.income >= incomeManYen) ?? sorted[sorted.length - 1]

  let baseAmount: number
  if (lower.income === upper.income) {
    baseAmount = lower[family]
  } else {
    const ratio = (incomeManYen - lower.income) / (upper.income - lower.income)
    baseAmount = Math.round(lower[family] + (upper[family] - lower[family]) * ratio)
  }

  const adjusted = hasMortgage ? Math.round(baseAmount * 0.92) : baseAmount
  return Math.max(0, Math.floor(adjusted / 1000) * 1000)
}

export const INCOME_OPTIONS: { label: string; value: number; sub?: string }[] = [
  { label: '〜250万円', value: 250 },
  { label: '300万円', value: 300 },
  { label: '350万円', value: 350 },
  { label: '400万円', value: 400 },
  { label: '450万円', value: 450 },
  { label: '500万円', value: 500 },
  { label: '550万円', value: 550 },
  { label: '600万円', value: 600 },
  { label: '650万円', value: 650 },
  { label: '700万円', value: 700 },
  { label: '800万円', value: 800 },
  { label: '900万円', value: 900 },
  { label: '1000万円', value: 1000 },
  { label: '1200万円', value: 1200 },
  { label: '1500万円', value: 1500 },
  { label: '2000万円〜', value: 2000 },
]

export const FAMILY_OPTIONS: { label: string; value: FamilyType; emoji: string; desc: string }[] = [
  { value: 'single', emoji: '🙋', label: '独身', desc: '一人暮らし／扶養家族なし' },
  { value: 'couple', emoji: '👫', label: '共働き夫婦', desc: '配偶者も働いている' },
  { value: 'couple_kid', emoji: '👨‍👩‍👧', label: '子どもあり', desc: '配偶者・お子様を扶養' },
  { value: 'single_parent', emoji: '🧑‍🍼', label: 'ひとり親', desc: 'シングル＋お子様を扶養' },
]

export interface FurusatoOnePager {
  greeting: string
  bullet: string[]
}

export const FURUSATO_FAQS: { q: string; a: string }[] = [
  {
    q: '本当に2,000円だけで返礼品がもらえるの？',
    a: '寄付金額のうち2,000円を超える部分が、所得税の還付や翌年の住民税から差し引かれます。「先に払って、後で返ってくる」イメージです。',
  },
  {
    q: '限度額を超えるとどうなるの？',
    a: '超えた分は単なる寄付として扱われ、税金から戻ってこない自腹になります。算出された限度額の範囲内に収めるのが鉄則です。',
  },
  {
    q: '確定申告は必要？',
    a: '5自治体以下なら「ワンストップ特例」が使え、申請書を送るだけでOK（確定申告不要）。6自治体以上は確定申告が必要です。',
  },
  {
    q: 'いつまでに申し込めばいい？',
    a: '対象年は「1月1日〜12月31日」。年内最終締切は12月31日23:59ですが、年末は混雑するので11月末までの実行を推奨。',
  },
  {
    q: 'おすすめの返礼品は？',
    a: '初心者は「日常で使うもの（お米・お肉・トイレットペーパー）」がおすすめ。生活費が浮くので実質的なお得感が高いです。',
  },
]
