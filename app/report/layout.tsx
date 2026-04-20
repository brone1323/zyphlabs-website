import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Opportunity Report · Zyph Labs',
  description:
    'A personalized opportunity map built from your business assessment — three tiers of AI and automation recommendations, from free DIY fixes to custom systems we build for you.',
  robots: { index: false, follow: false },
}

// This layout scopes a light theme to everything under /report,
// overriding the global dark body styling from app/globals.css.
// It also hides the site's dark Navbar/Footer for a cleaner report chrome.
export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="report-root bg-white text-slate-900 min-h-screen">
      <style>{`
        /* Force light mode inside the report */
        .report-root {
          background-color: #ffffff;
          color: #0f172a;
        }
        /* Hide the global site navbar/footer when viewing a report.
           The report has its own chrome (Zyph wordmark top, CTA bottom). */
        body:has(.report-root) > nav,
        body:has(.report-root) > header,
        body:has(.report-root) footer:not(.report-footer) {
          display: none !important;
        }
        /* Ensure the body background stays white while on /report pages */
        body:has(.report-root) {
          background-color: #ffffff !important;
        }
        /* Tidy the main wrapper from the root layout */
        body:has(.report-root) main {
          padding: 0 !important;
          max-width: none !important;
        }
        /* Print styles — clean PDF export */
        @media print {
          .report-root nav[class*='sticky'] { display: none !important; }
          .report-root a { text-decoration: none; color: #0f172a; }
          .report-root * { box-shadow: none !important; }
          .report-root section { page-break-inside: avoid; }
        }
      `}</style>
      {children}
    </div>
  )
}
