import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get Started — Zyph Labs',
  description:
    'An executive team to decide. An office team to do the work. You run the company. Starts at $129/mo.',
  openGraph: {
    title: 'Get Started — Zyph Labs',
    description:
      'An executive team to decide. An office team to do the work. You run the company. Starts at $129/mo.',
  },
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
