'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ContactModalContextValue {
  open: boolean
  openModal: () => void
  closeModal: () => void
}

const ContactModalContext = createContext<ContactModalContextValue>({
  open: false,
  openModal: () => {},
  closeModal: () => {},
})

export function useContactModal() {
  return useContext(ContactModalContext)
}

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <ContactModalContext.Provider
      value={{ open, openModal: () => setOpen(true), closeModal: () => setOpen(false) }}
    >
      {children}
    </ContactModalContext.Provider>
  )
}
