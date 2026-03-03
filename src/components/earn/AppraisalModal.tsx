'use client'

import { useState, useRef } from 'react'
import { X, Upload, Camera, Loader2 } from 'lucide-react'

interface AppraisalModalProps {
  onClose: () => void
}

interface AppraisalResult {
  item_name: string
  condition: string
  estimated_price_low: number
  estimated_price_high: number
  selling_tips: string[]
  recommended_platforms: { name: string; url: string; reason: string }[]
}

export default function AppraisalModal({ onClose }: AppraisalModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AppraisalResult | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImageUrl(URL.createObjectURL(file))
    setResult(null)
  }

  const handleAppraise = async () => {
    if (!imageFile) return
    setLoading(true)
    setError('')

    try {
      const base64 = await fileToBase64(imageFile)

      const res = await fetch('/api/appraise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType: imageFile.type }),
      })

      if (!res.ok) throw new Error('査定に失敗しました')

      const data = await res.json()
      setResult(data.result)
    } catch {
      setError('査定に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve((reader.result as string).split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg text-gray-800">📸 不用品AI査定</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {!result ? (
            <>
              <p className="text-gray-500 text-sm">
                売りたいものの写真を撮影または選択してください。AIが推定価格をお教えします！
              </p>

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  imageUrl
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : 'border-gray-200 bg-gray-50 hover:border-amber-300 hover:bg-amber-50/30'
                }`}
                style={{ minHeight: imageUrl ? 'auto' : '200px' }}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="査定対象" className="w-full rounded-2xl object-contain max-h-64" />
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-gray-300 mb-2" />
                    <p className="text-gray-400 text-sm font-medium">タップして写真を選択</p>
                    <p className="text-gray-300 text-xs mt-1">JPG / PNG / WEBP</p>
                  </>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                onClick={handleAppraise}
                disabled={!imageFile || loading}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-3 rounded-xl font-bold disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AIが査定中...
                  </>
                ) : (
                  '✨ AI査定する'
                )}
              </button>
            </>
          ) : (
            <>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200">
                <h3 className="font-bold text-gray-800 mb-1">{result.item_name}</h3>
                <p className="text-gray-500 text-xs mb-3">状態：{result.condition}</p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">推定価格</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    ¥{result.estimated_price_low.toLocaleString()} 〜 ¥{result.estimated_price_high.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 text-sm mb-2">💡 高く売るコツ</h4>
                <ul className="space-y-1">
                  {result.selling_tips.map((tip, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 text-sm mb-2">🏪 おすすめ販売先</h4>
                <div className="space-y-2">
                  {result.recommended_platforms.map((platform, i) => (
                    <a
                      key={i}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md transition-all"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-sm">{platform.name}</p>
                        <p className="text-gray-500 text-xs">{platform.reason}</p>
                      </div>
                      <span className="text-amber-500 text-xs font-medium">出品する →</span>
                    </a>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setResult(null); setImageUrl(null); setImageFile(null) }}
                className="w-full border border-gray-200 py-3 rounded-xl text-gray-600 font-medium text-sm hover:bg-gray-50"
              >
                別の商品を査定する
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
