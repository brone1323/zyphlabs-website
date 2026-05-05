import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SaleBanner from '@/components/SaleBanner'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import GlobalReveal from '@/components/GlobalReveal'

export const metadata: Metadata = {
  title: 'Zyph Labs — Run Your Business on an AI Company',
  description:
    'An executive team to decide. An office team to do the work. You run the company. Starts at $129/mo.',
  keywords:
    'AI executive team, AI company, AI agents for business, project runner, service business AI, OpenClaw, construction AI',
  openGraph: {
    title: 'Zyph Labs — Run Your Business on an AI Company',
    description:
      'An executive team to decide. An office team to do the work. You run the company. Starts at $129/mo.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        <SaleBanner />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <AnalyticsTracker />
        <GlobalReveal />
      </body>
    </html>
  )
}
