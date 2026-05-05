'use client'

import { ReactNode, CSSProperties, MouseEvent } from 'react'
import { useChatWidget } from './ChatWidgetProvider'

interface Props {
  children: ReactNode
  tier?: string
  className?: string
  style?: CSSProperties
  onMouseEnter?: (e: MouseEvent<HTMLButtonElement>) => void
  onMouseLeave?: (e: MouseEvent<HTMLButtonElement>) => void
}

export default function OpenChatButton({ children, tier, className, style, onMouseEnter, onMouseLeave }: Props) {
  const { openWidget } = useChatWidget()
  return (
    <button
      type="button"
      onClick={() => openWidget(tier)}
      className={className}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </button>
  )
}
