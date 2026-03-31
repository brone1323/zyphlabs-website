import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Checkout Cancelled | Zyph Labs',
  description: 'Your checkout was not completed. Come back anytime — your package selection will be waiting.',
}

const niches = [
  { label: 'Contractors & Trades', href: '/services/contractors', from: 149 },
  { label: 'E-Commerce Stores', href: '/services/ecommerce', from: 199 },
  { label: 'Realtors & Real Estate', href: '/services/real-estate', from: 179 },
  { label: 'Law Firms & Attorneys', href: '/services/law-firms', from: 199 },
]

export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 py-24">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl">👋</span>
          </div>

          <p className="text-[#8888aa] text-sm font-semibold uppercase tracking-widest mb-3">
            No Problem
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            No worries —<br />
            <span className="gradient-text">come back anytime.</span>
          </h1>
          <p className="text-lg text-[#8888aa] mb-12 max-w-lg mx-auto">
            Your checkout wasn't completed. That's totally fine. Pick up where you left off whenever you're ready.
          </p>

          {/* Niche links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {niches.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="glass card-glow p-5 text-left flex items-center justify-between group"
              >
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-[#a29bfe] transition-colors"
                     style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {n.label}
                  </p>
                  <p className="text-xs text-[#8888aa] mt-0.5">From ${n.from}</p>
                </div>
                <span className="text-[#6c5ce7] group-hover:translate-x-1 transition-transform text-lg">→</span>
              </Link>
            ))}
          </div>

          {/* Have questions */}
          <div className="glass p-6 rounded-xl text-left max-w-md mx-auto">
            <h3
              className="text-base font-semibold text-white mb-2"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Have questions before you commit?
            </h3>
            <p className="text-sm text-[#8888aa] mb-4">
              We're happy to answer any questions about our packages, process, or hosting before you check out.
            </p>
            <a
              href="mailto:contact@zyphlabs.com"
              className="btn-secondary text-sm inline-block px-6 py-2.5"
            >
              Email contact@zyphlabs.com
            </a>
          </div>

          <div className="mt-10">
            <Link href="/" className="text-sm text-[#8888aa] hover:text-white transition-colors">
              ← Return to home
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
