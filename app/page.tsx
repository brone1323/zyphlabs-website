import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zyph Labs | Websites That Help You Win More Business',
  description:
    'Modern, fast, conversion-focused websites for businesses that want to look better, move faster, and win more customers.',
}

const benefits = [
  {
    number: '01',
    title: 'Built to convert',
    description:
      'Clear messaging, strong calls to action, and a structure designed to turn visitors into real conversations.',
  },
  {
    number: '02',
    title: 'Built for every screen',
    description:
      'A polished experience on phones, tablets, laptops, and large displays — without the cramped mobile feel.',
  },
  {
    number: '03',
    title: 'Built to move fast',
    description:
      'Lean pages, modern code, and focused content so customers can understand what you do immediately.',
  },
]

const services = [
  'New business websites',
  'Website redesigns',
  'Landing pages',
  'Lead generation systems',
  'AI automations',
  'Custom software',
]

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07090d] text-white">
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6 lg:px-8">
          <a
            href="/"
            className="text-lg font-black tracking-[-0.04em] text-white sm:text-xl"
            aria-label="Zyph Labs home"
          >
            ZYPH<span className="text-[#8ef3dc]">LABS</span>
          </a>

          <div className="flex items-center gap-3">
            <a
              href="#services"
              className="hidden text-sm font-semibold text-white/60 transition hover:text-white sm:inline"
            >
              What we do
            </a>
            <a
              href="https://calendly.com/zyphlabs/15min"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] px-4 text-sm font-bold text-white backdrop-blur transition hover:border-white/30 hover:bg-white/10"
            >
              Start a project
            </a>
          </div>
        </div>
      </header>

      <section className="relative isolate flex min-h-[92svh] items-center px-5 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="absolute inset-0 -z-20 bg-[#07090d]" />
        <div className="absolute left-1/2 top-[-22rem] -z-10 h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-[#375dfb]/20 blur-[110px] sm:h-[58rem] sm:w-[58rem]" />
        <div className="absolute bottom-[-14rem] right-[-12rem] -z-10 h-[32rem] w-[32rem] rounded-full bg-[#34d7b7]/15 blur-[110px]" />

        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-5xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/65 backdrop-blur sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-[#8ef3dc] shadow-[0_0_20px_rgba(142,243,220,.9)]" />
              Modern websites for growing businesses
            </div>

            <h1
              className="max-w-5xl text-[clamp(3.2rem,11vw,8.6rem)] font-black leading-[0.86] tracking-[-0.075em] text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Get a new website today.
              <span className="mt-2 block bg-gradient-to-r from-[#8ef3dc] via-[#8ab6ff] to-[#cba6ff] bg-clip-text text-transparent">
                Get more business tomorrow.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-white/62 sm:mt-9 sm:text-lg sm:leading-8 lg:text-xl">
              We build fast, modern websites that make your business look
              established, explain your value clearly, and give customers an
              obvious reason to contact you.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
              <a
                href="https://calendly.com/zyphlabs/15min"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-7 text-base font-black text-[#07090d] transition duration-300 hover:-translate-y-0.5 hover:bg-[#8ef3dc] sm:min-h-16 sm:px-8"
              >
                Get my new website
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#why"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/12 px-7 text-sm font-bold text-white/75 transition hover:border-white/25 hover:bg-white/[0.05] hover:text-white sm:min-h-16"
              >
                See why Zyph Labs
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/35 sm:mt-10 sm:text-sm">
              <span>Responsive</span>
              <span>Fast</span>
              <span>SEO-ready</span>
              <span>Conversion-focused</span>
            </div>
          </div>
        </div>
      </section>

      <section id="why" className="border-y border-white/8 bg-white/[0.025] px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8ef3dc]">
                Why it works
              </p>
              <h2
                className="mt-4 max-w-xl text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-5xl lg:text-6xl"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Your website should make selling easier.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-8 text-white/55 sm:text-lg">
                Most business websites have too much text, too many choices,
                and no clear next step. We simplify the experience around what
                customers actually need to decide.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-3">
              {benefits.map((benefit) => (
                <article
                  key={benefit.number}
                  className="min-h-[260px] bg-[#0b0e14] p-6 sm:min-h-[330px] sm:p-7 lg:p-8"
                >
                  <p className="text-xs font-black tracking-[0.18em] text-[#8ef3dc]">
                    {benefit.number}
                  </p>
                  <h3 className="mt-16 text-2xl font-black tracking-[-0.04em] sm:mt-24">
                    {benefit.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/48 sm:text-base">
                    {benefit.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8ab6ff]">
                More than a website
              </p>
              <h2
                className="mt-4 max-w-2xl text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-5xl lg:text-6xl"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Start with the website. Add technology when it earns its place.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-white/55 sm:text-lg lg:justify-self-end">
              Zyph Labs can also connect lead generation, AI automation, and
              custom software behind the site. But the homepage stays simple:
              one strong message, one clear next step.
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service}
                className="group flex min-h-24 items-center justify-between rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05] sm:min-h-28 sm:px-6"
              >
                <span className="text-lg font-bold tracking-[-0.025em] sm:text-xl">
                  {service}
                </span>
                <span className="text-xl text-white/25 transition group-hover:translate-x-1 group-hover:text-[#8ef3dc]">
                  ↗
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-5 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-white px-6 py-14 text-[#07090d] sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#8ef3dc]/35 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-[#8ab6ff]/25 blur-3xl" />

          <div className="relative max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-black/45">
              Ready when you are
            </p>
            <h2
              className="mt-4 text-4xl font-black leading-[0.9] tracking-[-0.065em] sm:text-6xl lg:text-7xl"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Your next customer is already looking.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-black/58 sm:text-lg">
              Give them a website that makes choosing you easy.
            </p>
            <a
              href="https://calendly.com/zyphlabs/15min"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#07090d] px-7 text-base font-black text-white transition hover:-translate-y-0.5 hover:bg-[#17213d] sm:min-h-16 sm:px-8"
            >
              Get a new website
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="px-5 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Zyph Labs</p>
          <div className="flex flex-wrap gap-5">
            <a href="/leads" className="transition hover:text-white">
              Lead generation
            </a>
            <a
              href="https://calendly.com/zyphlabs/15min"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
