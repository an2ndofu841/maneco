import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const CATEGORY_LABELS: Record<string, string> = {
  housing: '家賃・住居',
  utility: '光熱費',
  communication: '通信費',
  subscription: 'サブスク',
  insurance: '保険',
  transportation: '交通費',
  other: 'その他',
}

const SYSTEM_PROMPT = `あなたは「マネコ」という招き猫ロボットのAIコンシェルジュです。
20〜30代の若者のお金の悩みを解決するアドバイザーとして振る舞ってください。

【キャラクター設定】
- 名前：マネコ（招き猫ロボット）
- 性格：親しみやすく、実用的。難しい金融用語を避けて話す
- 口調：友達に話しかけるような親しみやすい口調（ですます体を基本に）
- 絵文字を適度に使って親しみやすく

【役割】
1. お金の悩みを聞いて、具体的なアクションを提案する
2. 旅行・買い物・節約の相談に答える
3. アンケート案件や不用品売却など、今日・明日できる小銭を稼ぐ方法を提案する
4. 投資・積立などの中長期的な資産形成も分かりやすく説明する

【重要ルール】
- 必ず具体的で実行可能なアドバイスを含める
- 「マネコアプリ内の機能」を積極的に案内する（案件・クーポン・旅行プランナー）
- 返答は200文字以内に収める（簡潔に！）
- 投資は必ずリスクも伝える
- ユーザーの固定費情報が提供されている場合は、それを踏まえた具体的な節約案を出す

【マネコアプリの機能案内】
- 「増やす」→ アンケート・リサーチ案件でポイントを稼ぐ
- 「賢く使う」→ クーポン検索・旅行プランナーAI
- AIに画像を送る→ 不用品の査定額を提示
- 「マイページ > 固定費」→ 家賃・サブスクなどを登録すると、見直し提案が個別最適に`

type FixedCostRow = {
  name: string
  category: string
  amount: number
  billing_cycle: 'monthly' | 'yearly'
}

async function buildUserContext(): Promise<string> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return ''

    const [profileRes, fixedRes] = await Promise.all([
      supabase
        .from('users')
        .select('nickname, age_group, occupation, goal_title, goal_amount, total_savings')
        .eq('id', user.id)
        .single(),
      supabase
        .from('user_fixed_costs')
        .select('name, category, amount, billing_cycle')
        .eq('user_id', user.id)
        .eq('is_active', true),
    ])

    const profile = profileRes.data
    const fixedCosts = (fixedRes.data as FixedCostRow[] | null) ?? []

    const parts: string[] = []

    if (profile) {
      const profileLines: string[] = []
      if (profile.nickname) profileLines.push(`ニックネーム: ${profile.nickname}`)
      if (profile.age_group) profileLines.push(`年代: ${profile.age_group}`)
      if (profile.occupation) profileLines.push(`職業: ${profile.occupation}`)
      if (profile.goal_title) {
        const amount = profile.goal_amount ? `（目標額: ¥${profile.goal_amount.toLocaleString()}）` : ''
        profileLines.push(`目標: ${profile.goal_title}${amount}`)
      }
      if (profileLines.length > 0) {
        parts.push(`【ユーザープロフィール】\n${profileLines.join('\n')}`)
      }
    }

    if (fixedCosts.length > 0) {
      const totalMonthly = fixedCosts.reduce(
        (sum, c) => sum + (c.billing_cycle === 'yearly' ? Math.round(c.amount / 12) : c.amount),
        0
      )
      const breakdown = fixedCosts
        .map((c) => {
          const monthly = c.billing_cycle === 'yearly' ? Math.round(c.amount / 12) : c.amount
          const cycleLabel = c.billing_cycle === 'yearly' ? '年' : '月'
          const categoryLabel = CATEGORY_LABELS[c.category] ?? c.category
          return `- ${c.name}（${categoryLabel}）: ¥${c.amount.toLocaleString()}/${cycleLabel}（月換算 ¥${monthly.toLocaleString()}）`
        })
        .join('\n')
      parts.push(
        `【ユーザーの月間固定費（合計: ¥${totalMonthly.toLocaleString()}/月、年間 ¥${(totalMonthly * 12).toLocaleString()}）】\n${breakdown}`
      )
    }

    return parts.length > 0
      ? `\n\n【参考情報】\n以下はユーザーの登録情報です。相談内容に応じて、これらを踏まえた具体的なアドバイスをしてください。\n\n${parts.join('\n\n')}`
      : ''
  } catch (error) {
    console.error('Failed to build user context:', error)
    return ''
  }
}

export async function POST(req: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  try {
    const { message, history } = await req.json()
    const userContext = await buildUserContext()

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT + userContext },
      ...history.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 300,
      temperature: 0.7,
    })

    const responseMessage = completion.choices[0]?.message?.content ?? 'すみません、うまく答えられませんでした🙇'

    return NextResponse.json({ message: responseMessage })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { message: 'ただいまAIが混み合っています。少し経ってからお試しください🐱' },
      { status: 500 }
    )
  }
}
