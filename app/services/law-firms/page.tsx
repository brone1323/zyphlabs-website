import type { Metadata } from 'next'
import NicheServicePage from '@/components/NicheServicePage'

export const metadata: Metadata = {
  title: 'Law Firm Websites | Zyph Labs — Built, Hosted & Maintained For You',
  description:
    'Authoritative law firm and attorney websites that convert consultations. From $199 one-time build fee + managed hosting. We handle everything.',
}

export default function LawFirmsPage() {
  return <NicheServicePage nicheKey="law-firms" />
}
