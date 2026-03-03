'use client'

import { useState, useRef } from 'react'
import { X, Upload, Loader2, ExternalLink } from 'lucide-react'

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
      if (!res.ok) throw new Error()
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
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full rounded-t-3xl max-h-[90vh] overflow-y-auto border-t border-white/10" style={{ background: '#1a1a24' }}>
        {/* ヘッダー */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/8"
          style={{ background: '#1a1a24' }}>
          <h2 className="font-black text-white text-lg">📸 不用品AI査定</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/15 transition-colors">
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {!result ? (
            <>
              <p className="text-white/40 text-sm">売りたいものの写真を選んでください。AIが推定価格をお教えします！</p>

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                  imageUrl
                    ? 'border-amber-500/30 bg-amber-500/5'
                    : 'border-white/10 hover:border-white/20'
                }`}
                style={{ minHeight: imageUrl ? 'auto' : '180px' }}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="査定対象" className="w-full rounded-3xl object-contain max-h-60" />
                ) : (
                  <div className="text-center py-10">
                    <Upload className="w-8 h-8 text-white/20 mx-auto mb-2" />
                    <p className="text-white/30 text-sm">タップして写真を選択</p>
                    <p className="text-white/15 text-xs mt-1">JPG / PNG / WEBP</p>
                  </div>
                )}
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <button
                onClick={handleAppraise}
                disabled={!imageFile || loading}
                className="w-full gradient-gold text-black font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-30 glow-gold-sm"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />AIが査定中...</> : '✨ AI査定する'}
              </button>
            </>
          ) : (
            <>
              {/* 査定結果 */}
              <div className="rounded-3xl p-4 border border-emerald-500/20"
                style={{ background: 'linear-gradient(135deg, #0d2318 0%, #0f2e1e 100%)' }}>
                <p className="text-emerald-400/60 text-xs mb-1">AI査定結果</p>
                <h3 className="font-black text-white text-lg mb-0.5">{result.item_name}</h3>
                <p className="text-white/40 text-xs mb-3">状態：{result.condition}</p>
                <p className="text-white/40 text-xs">推定売却価格</p>
                <p className="text-emerald-400 font-black text-3xl">
                  ¥{result.estimated_price_low.toLocaleString()} <span className="text-white/30 text-xl">〜</span> ¥{result.estimated_price_high.toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl p-4 border border-amber-500/15"
                style={{ background: 'linear-gradient(135deg, #1a1005 0%, #1e1408 100%)' }}>
                <p className="text-amber-400 text-xs font-bold mb-2">💡 高く売るコツ</p>
                <ul className="space-y-1.5">
                  {result.selling_tips.map((tip, i) => (
                    <li key={i} className="text-white/50 text-xs flex items-start gap-2">
                      <span className="text-amber-500 flex-shrink-0">✓</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-white/40 text-xs font-medium">🏪 おすすめ販売先</p>
                {result.recommended_platforms.map((platform, i) => (
                  <a key={i} href={platform.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl p-3.5 border border-white/8 hover:border-white/15 transition-all"
                    style={{ background: '#222230' }}>
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">{platform.name}</p>
                      <p className="text-white/35 text-xs">{platform.reason}</p>
                    </div>
                    <span className="text-amber-400 text-xs font-bold flex items-center gap-1">
                      出品する <ExternalLink className="w-3 h-3" />
                    </span>
                  </a>
                ))}
              </div>

              <button
                onClick={() => { setResult(null); setImageUrl(null); setImageFile(null) }}
                className="w-full border border-white/10 py-3 rounded-2xl text-white/40 text-sm font-medium hover:bg-white/5 transition-all"
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
