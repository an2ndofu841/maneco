'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, X, Loader2, ChevronDown } from 'lucide-react'
import { useChatStore } from '@/store/chatStore'
import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'

const QUICK_PROMPTS = [
  '💰 今月お金が足りない',
  '✈️ 安く旅行したい',
  '📈 投資を始めたい',
  '🛍️ もっとお得に買い物したい',
  '📱 スマホ代を下げたい',
  '💳 おすすめクレカは？',
]

export default function ChatWidget() {
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, isLoading, addMessage, setLoading } = useChatStore()
  const supabase = createClient()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return
    setIsOpen(true)
    setInput('')

    const { data: { user } } = await supabase.auth.getUser()

    const userMsg = {
      id: uuidv4(),
      user_id: user?.id ?? 'guest',
      role: 'user' as const,
      content: text,
      created_at: new Date().toISOString(),
    }
    addMessage(userMsg)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      addMessage({
        id: uuidv4(),
        user_id: user?.id ?? 'guest',
        role: 'assistant',
        content: data.message,
        created_at: new Date().toISOString(),
      })

      if (user) {
        await supabase.from('chat_history').insert([
          { user_id: user.id, role: 'user', content: text },
          { user_id: user.id, role: 'assistant', content: data.message },
        ])
      }
    } catch {
      addMessage({
        id: uuidv4(),
        user_id: 'system',
        role: 'assistant',
        content: '申し訳ありません、エラーが発生しました。もう一度お試しください。',
        created_at: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      {/* 入力エリア */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 gradient-gold rounded-full flex items-center justify-center text-[10px]">🐱</div>
          <p className="text-slate-500 text-xs font-medium">AIコンシェルジュに相談</p>
        </div>
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="「今月ピンチ」「旅行したい」など..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-all"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="gradient-gold text-black p-3 rounded-2xl hover:opacity-90 transition-all disabled:opacity-30 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* クイックプロンプト */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              className="flex-shrink-0 text-xs text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* チャット履歴 */}
      {isOpen && messages.length > 0 && (
        <div className="border-t border-slate-200">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-slate-500 text-xs">チャット履歴</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-700 transition-colors">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="h-60 overflow-y-auto px-4 pb-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 gradient-gold rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    🐱
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'gradient-gold text-black font-medium rounded-br-sm'
                    : 'bg-slate-100 text-slate-700 rounded-bl-sm border border-slate-200'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start gap-2">
                <div className="w-6 h-6 gradient-gold rounded-full flex items-center justify-center text-xs flex-shrink-0">🐱</div>
                <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5 border border-slate-200">
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </div>
  )
}
