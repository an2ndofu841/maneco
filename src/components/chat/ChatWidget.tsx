'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Mic, X, Loader2 } from 'lucide-react'
import { useChatStore } from '@/store/chatStore'
import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'

const QUICK_PROMPTS = [
  '💰 今月お金が足りない',
  '✈️ 安く旅行したい',
  '📈 投資を始めたい',
  '🛍️ 買い物をお得に',
  '💳 クレカを節約に使いたい',
  '📱 スマホ代を下げたい',
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
      const assistantMsg = {
        id: uuidv4(),
        user_id: user?.id ?? 'guest',
        role: 'assistant' as const,
        content: data.message,
        created_at: new Date().toISOString(),
      }
      addMessage(assistantMsg)

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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* チャット入力エリア */}
      <div className="p-4">
        <p className="text-xs font-medium text-gray-400 mb-2">AIコンシェルジュに相談する</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="「今月ピンチ」「旅行したい」など気軽に話しかけて！"
            className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 border border-gray-100"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-3 rounded-xl hover:shadow-md transition-all disabled:opacity-40"
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
              className="flex-shrink-0 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* チャット履歴 */}
      {isOpen && messages.length > 0 && (
        <div className="border-t border-gray-100">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
            <span className="text-xs text-gray-500 font-medium">チャット</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0">
                    🐱
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-sm mr-2">
                  🐱
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5">
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
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
