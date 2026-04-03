'use client'

import dynamic from 'next/dynamic'

const TestCheckoutClient = dynamic(() => import('./TestCheckoutClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-[#8888aa]">Loading…</p>
    </div>
  ),
})

export default function TestCheckoutWrapper() {
  return <TestCheckoutClient />
}
