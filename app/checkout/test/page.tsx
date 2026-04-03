import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'Test Checkout | Zyph Labs',
  robots: { index: false, follow: false },
}

const TestCheckoutClient = dynamic(() => import('./TestCheckoutClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-[#8888aa]">Loading…</p>
    </div>
  ),
})

export default function TestCheckoutPage() {
  return <TestCheckoutClient />
}
