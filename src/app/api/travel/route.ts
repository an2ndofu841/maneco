import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  try {
    const { destination, budget, days, preferences } = await req.json()

    const prompt = `
旅行プランを提案してください。

【旅行条件】
- 目的地：${destination}
- 予算：${budget.toLocaleString()}円（交通費・宿泊・食事・観光全て込み）
- 日数：${days}日間
- こだわり：${preferences || 'なし'}

以下のJSON形式で返してください：
{
  "destination": "目的地",
  "budget": 予算数値,
  "days": 日数,
  "itinerary": [
    {
      "day": 1,
      "activities": [
        { "time": "10:00", "activity": "活動名", "cost": コスト数値, "tip": "節約のコツ" }
      ],
      "accommodation": { "name": "宿泊先名", "cost": 宿泊費数値 }
    }
  ],
  "total_estimated_cost": 合計費用数値,
  "saving_tips": ["節約ヒント1", "節約ヒント2", "節約ヒント3"],
  "recommended_booking_sites": [
    { "name": "サイト名", "url": "URL", "discount_info": "割引情報" }
  ]
}

予算内に収まるよう、実際に行ける現実的なプランにしてください。
JSONのみ返してください。`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content ?? '{}'
    const plan = JSON.parse(content)

    return NextResponse.json({ plan })
  } catch (error) {
    console.error('Travel API error:', error)
    return NextResponse.json({ error: '旅行プランの生成に失敗しました' }, { status: 500 })
  }
}
