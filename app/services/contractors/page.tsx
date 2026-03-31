import type { Metadata } from 'next'
import NicheServicePage from '@/components/NicheServicePage'

export const metadata: Metadata = {
  title: 'Contractor Websites | Zyph Labs — Built, Hosted & Maintained For You',
  description:
    'Professional websites for contractors, roofers, HVAC, plumbers, and builders. From $149 one-time build fee + managed hosting. We handle everything.',
}

export default function ContractorsPage() {
  return <NicheServicePage nicheKey="contractors" />
}
