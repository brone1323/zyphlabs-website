'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function QuestionnairePage() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('/api/questionnaire', {
        method: 'POST',
        body: data,
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or email us at contact@zyphlabs.com.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00cec9]/20 to-[#6c5ce7]/20 border border-[#00cec9]/30 flex items-center justify-center mx-auto mb-8">
            <span className="text-5xl">✓</span>
          </div>
          <p className="text-[#00cec9] text-sm font-semibold uppercase tracking-widest mb-3">
            Submitted
          </p>
          <h1
            className="text-3xl font-bold text-white mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            We've got everything we need.
          </h1>
          <p className="text-[#8888aa] mb-8">
            Your questionnaire has been received. We'll get started on your site and send you a
            preview link within 7–14 days. Keep an eye on your inbox.
          </p>
          <Link href="/" className="btn-secondary inline-block px-8 py-3">
            ← Back to Zyph Labs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-12 px-4 sm:px-6 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(108,92,231,0.12) 0%, transparent 65%)',
          }}
        />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <p className="text-[#6c5ce7] text-sm font-semibold uppercase tracking-widest mb-3">
            Onboarding
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Let's build your<br />
            <span className="gradient-text">website.</span>
          </h1>
          <p className="text-[#8888aa] max-w-lg mx-auto">
            Fill out this short questionnaire and we'll have everything we need to get started.
            Most clients finish in under 15 minutes.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-8 pb-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">

            {/* Business Name */}
            <div className="glass p-6 rounded-2xl">
              <label className="block text-sm font-semibold text-white mb-1">
                Business Name <span className="text-[#6c5ce7]">*</span>
              </label>
              <p className="text-xs text-[#8888aa] mb-3">
                The full name of your business as it should appear on the website.
              </p>
              <input
                type="text"
                name="businessName"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#555577] focus:outline-none focus:border-[#6c5ce7]/60 transition-colors"
                placeholder="e.g. Apex Roofing & Restoration"
              />
            </div>

            {/* Contact Email */}
            <div className="glass p-6 rounded-2xl">
              <label className="block text-sm font-semibold text-white mb-1">
                Your Email Address <span className="text-[#6c5ce7]">*</span>
              </label>
              <p className="text-xs text-[#8888aa] mb-3">
                We'll send your preview link and updates here.
              </p>
              <input
                type="email"
                name="contactEmail"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#555577] focus:outline-none focus:border-[#6c5ce7]/60 transition-colors"
                placeholder="you@yourbusiness.com"
              />
            </div>

            {/* Logo */}
            <div className="glass p-6 rounded-2xl">
              <label className="block text-sm font-semibold text-white mb-1">
                Business Logo
              </label>
              <div className="flex items-start gap-2 bg-[#00cec9]/8 border border-[#00cec9]/25 rounded-lg px-4 py-3 mb-3">
                <span className="text-[#00cec9] flex-shrink-0 text-sm">✓</span>
                <p className="text-sm text-[#00cec9]">
                  <strong>Don't have a logo? No problem — we'll design one for you for free.</strong>{' '}
                  Just leave this field empty and we'll take care of it.
                </p>
              </div>
              <p className="text-xs text-[#8888aa] mb-3">
                If you do have a logo, upload it here. PNG, SVG, or PDF preferred.
              </p>
              <input
                type="file"
                name="logo"
                accept=".png,.jpg,.jpeg,.svg,.pdf,.ai,.eps"
                className="w-full text-sm text-[#8888aa] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#6c5ce7]/20 file:text-[#a29bfe] hover:file:bg-[#6c5ce7]/30 transition-colors"
              />
            </div>

            {/* Brand Colors */}
            <div className="glass p-6 rounded-2xl">
              <label className="block text-sm font-semibold text-white mb-1">
                Brand Colors
              </label>
              <p className="text-xs text-[#8888aa] mb-3">
                List your brand colors as hex codes (e.g. #2563EB, #1E293B) or just describe them
                (e.g. "navy blue and gold"). If unsure, describe the feel: professional, bold,
                earthy, minimal, etc.
              </p>
              <input
                type="text"
                name="brandColors"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#555577] focus:outline-none focus:border-[#6c5ce7]/60 transition-colors"
                placeholder="e.g. #1D4ED8 (dark blue), #F59E0B (gold) — or 'clean and professional'"
              />
            </div>

            {/* Photos */}
            <div className="glass p-6 rounded-2xl">
              <label className="block text-sm font-semibold text-white mb-1">
                Photos
              </label>
              <p className="text-xs text-[#8888aa] mb-3">
                Upload any photos you'd like on your site — team photos, job site shots, product
                images, your location, etc. No photos? Leave this empty — we source stock
                photography for your industry at no extra cost.
              </p>
              <input
                type="file"
                name="photos"
                multiple
                accept=".png,.jpg,.jpeg,.webp,.heic"
                className="w-full text-sm text-[#8888aa] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#6c5ce7]/20 file:text-[#a29bfe] hover:file:bg-[#6c5ce7]/30 transition-colors"
              />
            </div>

            {/* Service Descriptions */}
            <div className="glass p-6 rounded-2xl">
              <label className="block text-sm font-semibold text-white mb-1">
                Services You Offer <span className="text-[#6c5ce7]">*</span>
              </label>
              <p className="text-xs text-[#8888aa] mb-3">
                Describe what your business does. Don't worry about polished writing — just give
                us the gist and we'll write the copy for you.
              </p>
              <textarea
                name="serviceDescriptions"
                required
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#555577] focus:outline-none focus:border-[#6c5ce7]/60 transition-colors resize-none"
                placeholder="e.g. Residential and commercial roofing — shingle replacement, flat roofs, emergency repairs. Also do gutters and siding."
              />
            </div>

            {/* Target Area */}
            <div className="glass p-6 rounded-2xl">
              <label className="block text-sm font-semibold text-white mb-1">
                Target Area / Service Region <span className="text-[#6c5ce7]">*</span>
              </label>
              <p className="text-xs text-[#8888aa] mb-3">
                Where do you serve customers? City, region, state/province, or radius.
              </p>
              <input
                type="text"
                name="targetArea"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#555577] focus:outline-none focus:border-[#6c5ce7]/60 transition-colors"
                placeholder="e.g. Greater Toronto Area — or — Calgary and surrounding areas within 100km"
              />
            </div>

            {/* Specific Requirements */}
            <div className="glass p-6 rounded-2xl">
              <label className="block text-sm font-semibold text-white mb-1">
                Anything else we should know?
              </label>
              <p className="text-xs text-[#8888aa] mb-3">
                Special requests, things you love or hate about other websites, competitors to
                reference, a domain you already own — anything that helps us build the right site.
              </p>
              <textarea
                name="requirements"
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#555577] focus:outline-none focus:border-[#6c5ce7]/60 transition-colors resize-none"
                placeholder="e.g. I already own apex-roofing.ca — and I want a contact form that goes straight to my phone."
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-4 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting…' : 'Submit Questionnaire →'}
            </button>

            <p className="text-center text-xs text-[#444466]">
              Questions? Email us at{' '}
              <span className="text-[#a29bfe]">contact@zyphlabs.com</span>
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}
