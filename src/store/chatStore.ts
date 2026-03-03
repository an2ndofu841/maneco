import { create } from 'zustand'
import { ChatMessage } from '@/types'

interface ChatStore {
  messages: ChatMessage[]
  isLoading: boolean
  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  setLoading: (loading: boolean) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setLoading: (loading) => set({ isLoading: loading }),
  clearMessages: () => set({ messages: [] }),
}))
