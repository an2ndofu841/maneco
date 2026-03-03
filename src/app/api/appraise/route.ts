import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { image, mimeType } = await req.json()

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${image}` },
            },
            {
              type: 'text',
              text: `この商品を査定してください。以下のJSON形式で返してください：
{
  "item_name": "商品名",
  "condition": "状態の評価（良好/普通/やや傷あり等）",
  "estimated_price_low": 最低推定価格（整数）,
  "estimated_price_high": 最高推定価格（整数）,
  "selling_tips": ["高く売るコツ1", "コツ2", "コツ3"],
  "recommended_platforms": [
    { "name": "メルカリ", "url": "https://www.mercari.com/jp/", "reason": "理由" },
    { "name": "ヤフオク", "url": "https://auctions.yahoo.co.jp/", "reason": "理由" },
    { "name": "PayPayフリマ", "url": "https://paypayflea.com/", "reason": "理由" }
  ]
}
JSONのみ返してください。`,
            },
          ],
        },
      ],
      max_tokens: 800,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content ?? '{}'
    const result = JSON.parse(content)

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Appraise API error:', error)
    return NextResponse.json({ error: '査定に失敗しました' }, { status: 500 })
  }
}
