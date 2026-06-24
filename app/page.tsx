import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ZyphLabs CleanAgent',
  description:
    'CleanAgent automation demos for missed leads, lead generation, admin overload, purchasing, cash visibility, and project risk.',
}

const problemVideos = [
  {
    label: 'Sales problem',
    title: 'Stop missed calls from becoming missed jobs.',
    description:
      'The agent answers, captures the details, books the estimate, and keeps the conversation moving while your team is busy.',
    poster: '/videos/problems/lead-response.jpg',
    src: '/videos/problems/lead-response.mp4',
    accent: 'from-sky-500/20 to-cyan-400/10',
  },
  {
    label: 'Lead generation',
    title: 'Keep marketing moving when the business gets busy.',
    description:
      'The agent builds campaigns, uses testimonials and project photos, and turns scattered ideas into scheduled lead-generation work.',
    poster: '/videos/problems/lead-generation.jpg',
    src: '/videos/problems/lead-generation.mp4',
    accent: 'from-violet-500/20 to-fuchsia-400/10',
  },
  {
    label: 'Owner bottleneck',
    title: 'Get email, scheduling, and follow-up off your desk.',
    description:
      'The agent finds the action items, drafts replies, moves drawings to estimating, and keeps admin from stealing the day.',
    poster: '/videos/problems/admin-overload.jpg',
    src: '/videos/problems/admin-overload.mp4',
    accent: 'from-emerald-500/20 to-teal-400/10',
  },
  {
    label: 'Margin leak',
    title: 'Stop chasing suppliers and guessing on material costs.',
    description:
      'The agent reviews drawings, requests pricing, compares suppliers, and flags cost or delivery issues before orders are placed.',
    poster: '/videos/problems/buying-waste.jpg',
    src: '/videos/problems/buying-waste.mp4',
    accent: 'from-amber-500/20 to-orange-400/10',
  },
  {
    label: 'Cash visibility',
    title: 'Keep payroll, billing, and completed work visible.',
    description:
      'The agent records site hours, sends payroll details, and flags completed milestones so invoicing does not lag behind the work.',
    poster: '/videos/problems/cash-billing.jpg',
    src: '/videos/problems/cash-billing.mp4',
    accent: 'from-blue-500/20 to-indigo-400/10',
  },
  {
    label: 'Project risk',
    title: 'Know what needs attention before it gets expensive.',
    description:
      'The agent checks schedule, labor, material costs, billing, and risk so managers can act before small issues become real losses.',
    poster: '/videos/problems/project-risk.jpg',
    src: '/videos/problems/project-risk.mp4',
    accent: 'from-rose-500/20 to-red-400/10',
  },
]

const chatTopics = [
  'social media',
  'reception',
  'assistant work',
  'purchasing',
  'bookkeeping',
  'project visibility',
  'pricing',
  'setup',
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050713] text-white">
      <section className="relative overflow-hidden px-5 pb-14 pt-16 sm:px-6 lg:px-8 lg:pb-20 lg:pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(108,92,231,0.28),transparent_32%),radial-gradient(circle_at_top_right,rgba(0,206,201,0.18),transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00cec9]">
            ZyphLabs CleanAgent
          </p>
          <h1
            className="mx-auto mt-5 max-w-5xl text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Are you looking to automate your workflow to lower costs and
            increase sales?
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
            Watch the short demos below. Each one shows a real phone-style
            workflow between a customer, owner, or manager and an AI agent.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="https://calendly.com/zyphlabs/15min"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#00cec9] px-6 text-sm font-black text-[#041014] transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#00cec9]/30"
            >
              Book your free Business AI assessment today
            </a>
            <a
              href="/leads"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/15 px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/15"
            >
              View lead packages
            </a>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#6c5ce7]">
              Start with the problem
            </p>
            <h2
              className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              CleanAgent handles the work that costs you leads, margin, and
              owner time.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {problemVideos.map((video) => (
              <article
                key={video.src}
                className={`overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${video.accent} p-4 shadow-2xl shadow-black/25 transition hover:-translate-y-1 hover:border-white/25 sm:p-5`}
              >
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#00cec9]">
                    {video.label}
                  </p>
                  <h3
                    className="mt-3 text-xl font-bold leading-snug text-white sm:text-2xl"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {video.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/68">
                    {video.description}
                  </p>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black">
                  <video
                    className="aspect-video w-full bg-black object-cover"
                    controls
                    playsInline
                    preload="metadata"
                    poster={video.poster}
                  >
                    <source src={video.src} type="video/mp4" />
                  </video>
                </div>
                <a
                  href="https://calendly.com/zyphlabs/15min"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-white px-5 text-sm font-black text-[#050713] transition hover:bg-[#00cec9]"
                >
                  Book a call to learn more
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00cec9]">
              Live AI chat
            </p>
            <h2
              className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              CleanAgent bot answers from the full offer.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              Ask about social media, reception, assistant work, purchasing,
              bookkeeping, project visibility, pricing, contact, setup, or what
              to automate first.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
            <div className="rounded-xl border border-white/10 bg-black/25 p-4">
              <p className="rounded-xl bg-white/10 p-4 text-sm leading-7 text-white/78">
                Hi, I understand the CleanAgent services on this page. Ask what
                to automate first, or ask about {chatTopics.join(', ')}.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {chatTopics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                type="text"
                placeholder="Ask what to automate first..."
                className="min-h-12 rounded-lg border border-white/10 bg-white px-4 text-sm text-slate-950 outline-none"
                aria-label="Ask ZyphLabs"
              />
              <a
                href="mailto:alex@zyphlabs.com?subject=CleanAgent%20question"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#6c5ce7] px-6 text-sm font-black text-white transition hover:bg-[#00cec9] hover:text-[#041014]"
              >
                Ask
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
