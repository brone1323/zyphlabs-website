import type { Metadata } from 'next'
import NicheServicePage from '@/components/NicheServicePage'

export const metadata: Metadata = {
  title: 'Real Estate Websites | Zyph Labs — Built, Hosted & Maintained For You',
  description:
    'Professional real estate websites for agents and realtors. From $179 one-time build fee + managed hosting. IDX integration available.',
}

export default function RealEstatePage() {
  return <NicheServicePage nicheKey="real-estate" />
}
