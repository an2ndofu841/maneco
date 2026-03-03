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
1. **予算内に収めることを最優先**してください。
2. **往復の移動手段**（行きと帰り）を必ず明記し、費用を計算に含めてください。
3. **現地での移動**（例：空港から市内、ホテルから観光地）の手段と費用も必ず計算に含めてください。
4. **具体的な店名・施設名**を提案してください（「カフェ」ではなく「カフェ〇〇」、「ホテル」ではなく「ホテル〇〇」）。
5. 予算が厳しい場合は、具体的な「妥協ポイント（我慢ポイント）」を提案してください（例：1時間徒歩、食事をコンビニにする等）。
6. **予算オーバーしても快適になる「課金オプション（アップグレード）」**を提案してください（例：+2000円でタクシー移動、+5000円でホテルランクアップ）。

以下のJSON形式で返してください：
{
  "plan_title": "キャッチーなプラン名",
  "departure": "出発地",
  "destination": "目的地",
  "budget": 予算数値,
  "total_estimated_cost": 合計費用数値,
  "transportation": {
    "outbound": { "type": "移動手段（例：LCC MM505便）", "time": "時間（例：10:00-13:00）", "cost": 費用数値, "detail": "詳細（例：成田→那覇）", "booking_url": "Google検索URL" },
    "inbound": { "type": "移動手段", "time": "時間", "cost": 費用数値, "detail": "詳細", "booking_url": "Google検索URL" }
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
  "upgrade_options": [
    { "title": "課金オプションタイトル", "cost_diff": 追加費用数値, "description": "メリットの説明（例：移動時間を30分短縮）" }
  ],
  "itinerary": [
    {
      "day": 1,
      "activities": [
        { "time": "10:00", "type": "move", "activity": "移動：那覇空港→国際通り", "method": "ゆいレール", "cost": 費用数値, "tip": "移動のコツ" },
        { "time": "11:00", "type": "spot", "activity": "国際通り散策", "cost": 0, "tip": "無料で見れるスポット" },
        { "time": "12:00", "type": "meal", "activity": "ランチ：具体的な店名", "cost": 費用数値, "booking_url": "Google検索URL" }
      ],
      "accommodation": { "name": "具体的な宿泊先名", "cost": 宿泊費数値, "booking_url": "Google検索URL" }
    }
  ],
  "saving_tips": ["節約ヒント1", "節約ヒント2"]
}

JSONのみ返してください。`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2500,
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
