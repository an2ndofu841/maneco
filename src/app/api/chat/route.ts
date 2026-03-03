import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

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

【マネコアプリの機能案内】
- 「増やす」→ アンケート・リサーチ案件でポイントを稼ぐ
- 「賢く使う」→ クーポン検索・旅行プランナーAI
- AIに画像を送る→ 不用品の査定額を提示`

export async function POST(req: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  try {
    const { message, history } = await req.json()

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
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
