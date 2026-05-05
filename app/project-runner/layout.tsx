import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Project Runner — Your AI COO | Zyph Labs',
  description:
    'An executive team to decide. An office team to do the work. You run the company. Starts at $129/mo.',
  openGraph: {
    title: 'Project Runner — Your AI COO | Zyph Labs',
    description:
      'An executive team to decide. An office team to do the work. You run the company. Starts at $129/mo.',
  },
}

export default function ProjectRunnerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
