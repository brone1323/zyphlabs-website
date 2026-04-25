import { notFound } from 'next/navigation'
import { ALL_DEMOS, getDemoBySlug } from '@/lib/demos/registry'
import VideoPlayer from '@/components/demos/VideoPlayer'

interface PageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return ALL_DEMOS.map((d) => ({ slug: d.slug }))
}

export function generateMetadata({ params }: PageProps) {
  const demo = getDemoBySlug(params.slug)
  if (!demo) return { title: 'Demo video' }
  return {
    title: `${demo.title} — video`,
    description: demo.description,
    robots: 'noindex, nofollow',
  }
}

// This route renders the vertical 9:16 video stage as a full-viewport overlay
// that hides the rest of the site (nav, footer, banner). Intended for
// headless screen recording at 1080x1920.
export default function VideoPage({ params }: PageProps) {
  const demo = getDemoBySlug(params.slug)
  if (!demo) notFound()

  return (
    <>
      {/* Aggressive style override: hide everything except our overlay */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html, body {
              background: #0a0a14 !important;
              overflow: hidden !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            body > nav,
            body > header,
            body > footer,
            body > [class*="Navbar"],
            body > [class*="Footer"],
            body > [class*="SaleBanner"],
            body > [class*="sale-banner"],
            body > .noise-overlay,
            body > div:not(.video-root):not(:has(.video-root)) {
              display: none !important;
            }
            .video-root {
              position: fixed;
              inset: 0;
              z-index: 99999;
              background: #0a0a14;
              width: 1080px;
              height: 1920px;
              overflow: hidden;
            }
          `,
        }}
      />
      <div className="video-root">
        <VideoPlayer demoSlug={demo.slug} />
      </div>
    </>
  )
}
