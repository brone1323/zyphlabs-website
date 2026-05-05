'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ChatWidgetContextValue {
  open: boolean
  tier: string | null
  openWidget: (tier?: string) => void
  closeWidget: () => void
}

const ChatWidgetContext = createContext<ChatWidgetContextValue>({
  open: false,
  tier: null,
  openWidget: () => {},
  closeWidget: () => {},
})

export function useChatWidget() {
  return useContext(ChatWidgetContext)
}

export function ChatWidgetProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [tier, setTier] = useState<string | null>(null)
  return (
    <ChatWidgetContext.Provider
      value={{
        open,
        tier,
        openWidget: (t) => { setTier(t ?? null); setOpen(true) },
        closeWidget: () => setOpen(false),
      }}
    >
      {children}
    </ChatWidgetContext.Provider>
  )
}
