import type { Metadata } from 'next'
import TestCheckoutWrapper from './TestCheckoutWrapper'

export const metadata: Metadata = {
  title: 'Test Checkout | Zyph Labs',
  robots: { index: false, follow: false },
}

export default function TestCheckoutPage() {
  return <TestCheckoutWrapper />
}
