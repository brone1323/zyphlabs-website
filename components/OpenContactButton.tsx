'use client'

import { ReactNode, CSSProperties, MouseEvent } from 'react'
import { useContactModal } from './ContactModalProvider'

interface Props {
  children: ReactNode
  className?: string
  style?: CSSProperties
  onMouseEnter?: (e: MouseEvent<HTMLButtonElement>) => void
  onMouseLeave?: (e: MouseEvent<HTMLButtonElement>) => void
}

export default function OpenContactButton({ children, className, style, onMouseEnter, onMouseLeave }: Props) {
  const { openModal } = useContactModal()
  return (
    <button
      type="button"
      onClick={openModal}
      className={className}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </button>
  )
}
