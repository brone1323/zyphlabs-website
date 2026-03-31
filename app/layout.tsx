import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Zyph Labs — Professional Websites, Built & Hosted For You',
  description:
    'We build, host, and maintain professional websites for contractors, e-commerce brands, realtors, and law firms. One checkout — zero technical headaches.',
  keywords:
    'web design, web development, managed hosting, contractor websites, real estate websites, law firm websites, ecommerce shopify',
  openGraph: {
    title: 'Zyph Labs — Professional Websites, Built & Hosted For You',
    description:
      'We build, host, and maintain professional websites for contractors, e-commerce brands, realtors, and law firms.',
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
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
