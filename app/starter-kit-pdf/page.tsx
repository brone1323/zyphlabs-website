// PDF-only page — no nav, no footer, print-optimized
// Loaded by Playwright to render zero-payroll-starter-kit.pdf

export const metadata = {
  title: 'The $0 AI Starter Kit — Zero Payroll',
  robots: { index: false },
}

const tools = [
  {
    num: '01',
    name: 'Fathom',
    url: 'fathom.video',
    desc: 'Automatically records, transcribes, and summarizes every Zoom or Google Meet call. Action items emailed to everyone before they close their laptops.',
    bestFor: 'Any business running client calls or team meetings',
    timeSaved: '1–2 hrs/week',
    honest: 'Eliminates meeting notes entirely. Won\'t manage your projects or follow up on action items — but your notes will actually exist now.',
  },
  {
    num: '02',
    name: 'ChatGPT (Free Tier)',
    url: 'chat.openai.com',
    desc: 'Writes emails, proposals, job postings, social posts, and training documents when you tell it what you need. The key: give it a proper brief, not a vague request.',
    bestFor: 'Any business owner who spends time writing things',
    timeSaved: '2–4 hrs/week',
    honest: 'Powerful writing assistant. It doesn\'t know your business history or your clients — a full agentic system does. But for drafting? It\'s the best free tool available.',
  },
  {
    num: '03',
    name: 'Calendly (Free)',
    url: 'calendly.com',
    desc: 'Send a link. People pick a time. It books in both calendars. No back-and-forth emails.',
    bestFor: 'Booking client calls, estimates, consultations',
    timeSaved: '45 min/week',
    honest: 'Kills the scheduling email chain dead. Won\'t qualify leads or follow up after the meeting — it just books. That alone is worth it.',
  },
  {
    num: '04',
    name: 'Loom (Free)',
    url: 'loom.com',
    desc: 'Record your screen and face simultaneously. Send a video instead of a long email or unnecessary meeting. Clients watch it on their time.',
    bestFor: 'Explaining proposals, training staff, walking through estimates',
    timeSaved: '1–2 hrs/week',
    honest: 'Replaces 30-minute calls with 3-minute videos. Your clients will thank you. Free plan: 25 videos, 5-minute max.',
  },
  {
    num: '05',
    name: 'Wave (Free)',
    url: 'waveapps.com',
    desc: 'Free invoicing, accounting, and payment processing. Cleaner than spreadsheets. Cheaper than QuickBooks. More professional than a Word doc with a bank transfer request.',
    bestFor: 'Service businesses invoicing under $500K/year',
    timeSaved: '1–2 hrs/week',
    honest: 'Solid free accounting. You still send invoices manually — a Level 3+ system triggers them automatically when a job closes. But if you\'re on spreadsheets, Wave is your upgrade today.',
  },
  {
    num: '06',
    name: 'Canva (Free)',
    url: 'canva.com',
    desc: 'Design social posts, proposals, flyers, and presentations with drag-and-drop templates. No design skills needed.',
    bestFor: 'Business owners who need to look professional without a designer',
    timeSaved: '2–3 hrs/week',
    honest: 'Makes you look better than you have any right to without hiring a designer. Won\'t create your content strategy — just makes whatever you create look sharp.',
  },
  {
    num: '07',
    name: 'HubSpot CRM (Free)',
    url: 'hubspot.com/crm',
    desc: 'A real CRM. Tracks contacts, deals, emails, and call history. The free tier is genuinely useful — not a hobbled trial.',
    bestFor: 'Any service business with more than 20 active client relationships',
    timeSaved: '1–2 hrs/week',
    honest: 'Best free CRM on the market. Still requires manual updates — a Level 3 system updates it automatically when things happen. Start here, see the value, then decide if you want automation.',
  },
  {
    num: '08',
    name: 'Google Gemini (Free)',
    url: 'gemini.google.com',
    desc: "Google's AI assistant. Better than ChatGPT's free tier for research because it has access to current web information.",
    bestFor: 'Researching clients before calls, competitor analysis, industry trends',
    timeSaved: '45 min–1 hr/session',
    honest: 'Ask it "What challenges are residential HVAC companies facing in 2026?" and get a cited, current answer in 30 seconds. Use it before every significant sales conversation.',
  },
  {
    num: '09',
    name: 'Otter.ai (Free)',
    url: 'otter.ai',
    desc: 'Transcribes meetings and calls in real time. Works with Zoom, Teams, or your phone mic. Free tier: 300 minutes/month.',
    bestFor: 'In-person meetings, phone calls, any meeting where Fathom doesn\'t reach',
    timeSaved: '1 hr/week',
    honest: 'Great complement to Fathom for situations outside of Zoom/Meet. 300 free minutes covers most small business use cases.',
  },
  {
    num: '10',
    name: 'Clockify (Free)',
    url: 'clockify.me',
    desc: 'Time tracking for you and your team. See exactly where hours go. Generates timesheets automatically.',
    bestFor: 'Project-based businesses, hourly billing, anyone who suspects admin is eating more time than they think',
    timeSaved: '30 min/week',
    honest: 'Run this for one month. You\'ll know exactly which jobs, clients, and task types are eating unprofitable time. That data alone is worth the setup.',
  },
]

const levels = [
  {
    num: 1,
    title: 'Free Tools',
    badge: 'You are here',
    desc: 'Handle specific tasks. Zero cost. Start today.',
    active: true,
  },
  {
    num: 2,
    title: 'Custom Software',
    badge: null,
    desc: 'Tools built for how your business actually works. One-time cost. No more renting software that doesn\'t fit.',
    active: false,
  },
  {
    num: 3,
    title: 'AI-Integrated Tools',
    badge: null,
    desc: 'Your tools connect and start running workflows automatically. Real automation. Real output.',
    active: false,
  },
  {
    num: 4,
    title: 'Full Agentic Systems',
    badge: null,
    desc: 'The work of 10 people. The payroll of zero new hires. Your business runs. You make the decisions.',
    active: false,
  },
]

export default function StarterKitPdfPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Montserrat:wght@400;600;700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          font-family: 'Inter', -apple-system, sans-serif;
          background: #0A1628;
          color: #ffffff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .pdf-page {
          width: 8.5in;
          min-height: 11in;
          margin: 0 auto;
          background: #0A1628;
          padding: 0.55in 0.6in;
          position: relative;
          overflow: hidden;
        }

        .page-break {
          page-break-after: always;
          break-after: page;
        }

        @media print {
          html, body { background: #0A1628; }
          .pdf-page {
            width: 100%;
            min-height: auto;
            padding: 0.5in 0.55in;
            page-break-after: always;
            break-after: page;
          }
          .pdf-page:last-child {
            page-break-after: avoid;
            break-after: avoid;
          }
        }

        @media screen {
          body { padding: 20px; }
          .pdf-page {
            box-shadow: 0 8px 48px rgba(0,0,0,0.5);
            margin-bottom: 32px;
          }
        }

        /* Typography */
        .wordmark {
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 18px;
          letter-spacing: 0.04em;
          color: #ffffff;
        }
        .wordmark span { color: #F4A024; }

        .tagline {
          font-size: 10px;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 500;
          margin-top: 2px;
        }

        .headline {
          font-family: 'Montserrat', sans-serif;
          font-weight: 900;
          font-size: 48px;
          line-height: 1.05;
          color: #ffffff;
          letter-spacing: -0.02em;
        }
        .headline span.dollar { color: #F4A024; }

        .subhead {
          font-size: 16px;
          font-weight: 600;
          color: #2D7DD2;
          letter-spacing: 0.01em;
          margin-top: 10px;
        }

        .intro {
          font-size: 11.5px;
          line-height: 1.7;
          color: rgba(255,255,255,0.65);
          margin-top: 14px;
          max-width: 6in;
        }

        /* Tool cards grid */
        .tools-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 20px;
        }

        .tool-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(45,125,210,0.22);
          border-radius: 10px;
          padding: 12px 14px;
          position: relative;
          break-inside: avoid;
        }

        .tool-card-header {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 7px;
        }

        .tool-num {
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          font-size: 11px;
          color: #F4A024;
          min-width: 22px;
          margin-top: 2px;
        }

        .tool-name {
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #ffffff;
          line-height: 1.2;
        }

        .tool-url {
          font-size: 9.5px;
          color: #2D7DD2;
          font-weight: 500;
          margin-top: 1px;
          letter-spacing: 0.02em;
        }

        .tool-desc {
          font-size: 10.5px;
          line-height: 1.6;
          color: rgba(255,255,255,0.72);
          margin-bottom: 7px;
        }

        .tool-meta {
          display: flex;
          gap: 14px;
          margin-bottom: 7px;
          flex-wrap: wrap;
        }

        .meta-item {
          font-size: 9.5px;
          color: rgba(255,255,255,0.5);
        }
        .meta-item strong {
          color: rgba(255,255,255,0.8);
          font-weight: 600;
        }

        .time-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(244,160,36,0.12);
          border: 1px solid rgba(244,160,36,0.25);
          border-radius: 20px;
          padding: 2px 8px;
          font-size: 9px;
          font-weight: 600;
          color: #F4A024;
        }

        .honest-note {
          font-size: 9.5px;
          font-style: italic;
          color: rgba(255,255,255,0.42);
          line-height: 1.5;
          border-top: 1px solid rgba(255,255,255,0.07);
          padding-top: 7px;
          margin-top: 5px;
        }

        /* Page 1 header row */
        .page1-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 22px;
        }

        /* Background accent */
        .bg-accent {
          position: absolute;
          top: -80px;
          right: -120px;
          width: 400px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(45,125,210,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .bg-accent-2 {
          position: absolute;
          bottom: -60px;
          left: -80px;
          width: 320px;
          height: 320px;
          background: radial-gradient(ellipse, rgba(244,160,36,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Page footer */
        .pdf-footer {
          position: absolute;
          bottom: 0.3in;
          left: 0.6in;
          right: 0.6in;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 10px;
        }

        .footer-text {
          font-size: 8.5px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.04em;
        }

        .page-num {
          font-size: 8.5px;
          color: rgba(255,255,255,0.25);
          font-weight: 600;
          font-family: 'Montserrat', sans-serif;
        }

        /* Page 2 — Levels */
        .page2-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .section-label {
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #2D7DD2;
          margin-bottom: 8px;
        }

        .page2-headline {
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 30px;
          color: #ffffff;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .levels-container {
          margin-top: 4px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .level-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          position: relative;
        }

        .level-connector {
          position: absolute;
          left: 19px;
          top: 40px;
          width: 2px;
          height: calc(100% + 12px);
          background: linear-gradient(180deg, rgba(45,125,210,0.4) 0%, rgba(45,125,210,0.1) 100%);
        }

        .level-num-wrap {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 16px;
          position: relative;
          z-index: 1;
        }

        .level-num-active {
          background: #F4A024;
          color: #0A1628;
        }

        .level-num-inactive {
          background: rgba(45,125,210,0.15);
          border: 2px solid rgba(45,125,210,0.35);
          color: rgba(255,255,255,0.5);
        }

        .level-content {
          flex: 1;
          padding-top: 4px;
        }

        .level-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
        }

        .level-title {
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          font-size: 15px;
          color: #ffffff;
        }

        .level-title-inactive {
          color: rgba(255,255,255,0.6);
        }

        .level-badge {
          background: #F4A024;
          color: #0A1628;
          font-size: 8px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 20px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-family: 'Montserrat', sans-serif;
        }

        .level-desc {
          font-size: 11px;
          line-height: 1.6;
          color: rgba(255,255,255,0.55);
        }

        .level-desc-active {
          color: rgba(255,255,255,0.8);
        }

        /* CTA cards */
        .cta-section {
          margin-top: 36px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
        }

        .cta-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(45,125,210,0.22);
          border-radius: 10px;
          padding: 16px;
        }

        .cta-card.featured {
          background: rgba(45,125,210,0.1);
          border-color: rgba(45,125,210,0.45);
        }

        .cta-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #2D7DD2;
          margin-bottom: 6px;
          font-family: 'Montserrat', sans-serif;
        }

        .cta-card.featured .cta-label {
          color: #F4A024;
        }

        .cta-title {
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #ffffff;
          line-height: 1.3;
          margin-bottom: 6px;
        }

        .cta-desc {
          font-size: 10px;
          line-height: 1.6;
          color: rgba(255,255,255,0.55);
          margin-bottom: 10px;
        }

        .cta-url {
          font-size: 10px;
          font-weight: 600;
          color: #2D7DD2;
          letter-spacing: 0.01em;
          text-decoration: none;
        }

        .cta-card.featured .cta-url {
          color: #F4A024;
        }

        .cta-arrow {
          display: inline-block;
          margin-left: 3px;
        }
      `}</style>

      {/* ===== PAGE 1 ===== */}
      <div className="pdf-page page-break">
        <div className="bg-accent" />
        <div className="bg-accent-2" />

        {/* Header */}
        <div className="page1-header">
          <div>
            <div className="wordmark">ZERO <span>PAYROLL</span></div>
            <div className="tagline">Grow your business without growing your payroll.</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="tagline" style={{ color: 'rgba(255,255,255,0.35)' }}>FREE RESOURCE</div>
          </div>
        </div>

        {/* Hero copy */}
        <div style={{ marginBottom: '20px' }}>
          <div className="headline">
            The <span className="dollar">$0</span> AI Starter Kit<br />
            for Service Businesses
          </div>
          <div className="subhead">10 free tools. Real time savings. Zero cost to start.</div>
          <p className="intro">
            These tools won&apos;t run your whole business. That&apos;s Level 4 — and we&apos;ll get there.
            But every business starts at Level 1. These ten tools handle specific tasks, save real hours,
            and cost nothing. Set them up this week. Start saving time before Friday.
            <br /><br />
            Each one includes an honest note on what it does — and what it doesn&apos;t.
          </p>
        </div>

        {/* Tool grid */}
        <div className="tools-grid">
          {tools.map((tool) => (
            <div key={tool.num} className="tool-card">
              <div className="tool-card-header">
                <div className="tool-num">{tool.num}</div>
                <div>
                  <div className="tool-name">{tool.name}</div>
                  <div className="tool-url">{tool.url}</div>
                </div>
              </div>
              <p className="tool-desc">{tool.desc}</p>
              <div className="tool-meta">
                <span className="meta-item"><strong>Best for:</strong> {tool.bestFor}</span>
              </div>
              <div>
                <span className="time-badge">&#9203; {tool.timeSaved}</span>
              </div>
              <div className="honest-note">{tool.honest}</div>
            </div>
          ))}
        </div>

        {/* Page footer */}
        <div className="pdf-footer">
          <div className="footer-text">zeropayroll.substack.com &nbsp;|&nbsp; zyphlabs.com &nbsp;|&nbsp; Written by Hemingway</div>
          <div className="page-num">01</div>
        </div>
      </div>

      {/* ===== PAGE 2 ===== */}
      <div className="pdf-page">
        <div className="bg-accent" />

        {/* Header */}
        <div className="page2-header">
          <div>
            <div className="section-label">The Framework</div>
            <div className="page2-headline">
              Where does your business<br />fit on the Levels?
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="wordmark">ZERO <span>PAYROLL</span></div>
          </div>
        </div>

        {/* Levels */}
        <div className="levels-container">
          {levels.map((level, i) => (
            <div key={level.num} className="level-row">
              {i < levels.length - 1 && <div className="level-connector" />}
              <div className={`level-num-wrap ${level.active ? 'level-num-active' : 'level-num-inactive'}`}>
                {level.num}
              </div>
              <div className="level-content">
                <div className="level-title-row">
                  <span className={`level-title ${!level.active ? 'level-title-inactive' : ''}`}>
                    Level {level.num} — {level.title}
                  </span>
                  {level.badge && <span className="level-badge">{level.badge}</span>}
                </div>
                <p className={`level-desc ${level.active ? 'level-desc-active' : ''}`}>{level.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA section */}
        <div style={{ marginTop: '36px' }}>
          <div className="section-label" style={{ marginBottom: '14px' }}>What&apos;s your next move?</div>
          <div className="cta-section">
            {/* CTA 1: Level Assessment */}
            <div className="cta-card featured">
              <div className="cta-label">Free Assessment</div>
              <div className="cta-title">Find out which Level your business is at.</div>
              <div className="cta-desc">Take the free 10-minute assessment. Get a clear picture of where you are — and what to do next.</div>
              <div className="cta-url">zyphlabs.com/level-assessment <span className="cta-arrow">→</span></div>
            </div>

            {/* CTA 2: Newsletter */}
            <div className="cta-card">
              <div className="cta-label">Every Tuesday · Free</div>
              <div className="cta-title">Get the weekly Zero Payroll newsletter.</div>
              <div className="cta-desc">Plain-English AI tools and systems for service businesses. No fluff. No pitch. Just what works.</div>
              <div className="cta-url">zeropayroll.substack.com <span className="cta-arrow">→</span></div>
            </div>

            {/* CTA 3: Book a Conversation */}
            <div className="cta-card">
              <div className="cta-label">Ready for Level 4?</div>
              <div className="cta-title">Book a conversation.</div>
              <div className="cta-desc">See what a full agentic system looks like for your specific business. No obligation, no template pitch.</div>
              <div className="cta-url">zyphlabs.com/book <span className="cta-arrow">→</span></div>
            </div>
          </div>
        </div>

        {/* Page footer */}
        <div className="pdf-footer">
          <div className="footer-text">Zero Payroll is published by Zyph Labs &nbsp;|&nbsp; zyphlabs.com &nbsp;|&nbsp; Written by Hemingway</div>
          <div className="page-num">02</div>
        </div>
      </div>
    </>
  )
}
