import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  try {
    const { departure, destination, budget, days, preferences } = await req.json()

    const prompt = `
旅行プランを提案してください。
今の時期のリアルタイムな相場観を考慮して、具体的かつ現実的なプランを作成してください。

【旅行条件】
- 出発地：${departure}
- 目的地：${destination}
- 予算：${budget.toLocaleString()}円（交通費（航空券/新幹線など）・宿泊・食事・観光全て込み）
- 日数：${days}日間
- こだわり：${preferences || 'なし'}

【重要な指示】
1. 予算内に収めることを最優先してください。
2. 予算が厳しい場合は、具体的な「妥協ポイント（我慢ポイント）」を提案してください（例：新幹線ではなく夜行バスにする、ホテルではなくカプセルホテルにする、食事をコンビニにする等）。
3. 交通費は出発地からの往復費用を含めて計算してください。
4. プランの評価スコア（楽さ、快適さ、コスパ、総合点）を5段階で算出してください。
5. 予約に使える検索キーワードやリンクを生成してください。

以下のJSON形式で返してください：
{
  "plan_title": "キャッチーなプラン名",
  "departure": "出発地",
  "destination": "目的地",
  "budget": 予算数値,
  "total_estimated_cost": 合計費用数値,
  "transportation": {
    "type": "移動手段（例：夜行バス、LCC、新幹線）",
    "cost": 往復費用数値,
    "details": "移動の詳細（例：東京駅23:00発→大阪駅6:00着）",
    "booking_url": "Google検索URL（例：https://www.google.com/search?q=東京+大阪+夜行バス+予約）"
  },
  "scores": {
    "comfort": 1-5の数値（快適さ）,
    "excitement": 1-5の数値（楽しさ）,
    "cost_performance": 1-5の数値（コスパ）,
    "overall": 1-5の数値（総合点）
  },
  "compromise_points": [
    { "title": "妥協点タイトル", "description": "具体的な我慢ポイントの説明" }
  ],
  "itinerary": [
    {
      "day": 1,
      "activities": [
        { "time": "10:00", "activity": "活動名", "cost": コスト数値, "tip": "節約のコツ" }
      ],
      "accommodation": { "name": "宿泊先タイプ/名", "cost": 宿泊費数値, "booking_url": "Google検索URL" }
    }
  ],
  "saving_tips": ["節約ヒント1", "節約ヒント2"]
}

JSONのみ返してください。`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
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
