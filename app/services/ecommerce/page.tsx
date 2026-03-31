import type { Metadata } from 'next'
import NicheServicePage from '@/components/NicheServicePage'

export const metadata: Metadata = {
  title: 'E-Commerce Store Design | Zyph Labs — Shopify Stores Built & Managed For You',
  description:
    'Shopify store setup and management for e-commerce brands. From $199 one-time build fee + managed hosting. We build, launch, and maintain your store.',
}

export default function EcommercePage() {
  return <NicheServicePage nicheKey="ecommerce" />
}
