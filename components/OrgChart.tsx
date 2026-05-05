'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  BriefcaseIcon,
  TrendingUpIcon,
  BarChartIcon,
  BookOpenIcon,
  MailIcon,
  UsersIcon,
  CalculatorIcon,
  UserPlusIcon,
  HeadphonesIcon,
} from '@/components/icons'

const executiveTeam = [
  {
    Icon: BriefcaseIcon,
    role: 'PROJECT RUNNER',
    title: 'COO',
    desc: 'Runs proposals, projects, billing, change orders.',
    href: '/project-runner',
  },
  {
    Icon: TrendingUpIcon,
    role: 'STRATEGIST',
    title: 'CSO',
    desc: 'Pricing, positioning, deal review, industry scans.',
    href: null,
  },
  {
    Icon: BarChartIcon,
    role: 'FINANCIAL ANALYST',
    title: 'CFO',
    desc: 'P&L review, cash-flow forecast, margin analysis, scenario modeling.',
    href: null,
  },
  {
    Icon: BookOpenIcon,
    role: 'KNOWLEDGE EXPERT',
    title: 'CKO',
    desc: 'Industry foresight — regulatory shifts, tech changes, competitor moves.',
    href: null,
  },
]

const officeTeam = [
  {
    Icon: MailIcon,
    role: 'EMAIL OFFICER',
    desc: 'Reads, classifies, drafts, replies — clears your inbox.',
    href: null,
  },
  {
    Icon: UsersIcon,
    role: 'CRM OPERATOR',
    desc: 'Tracks every relationship and follow-up.',
    href: null,
  },
  {
    Icon: CalculatorIcon,
    role: 'BOOKKEEPER',
    desc: 'Categorizes, invoices, reconciles, runs payroll.',
    href: null,
  },
  {
    Icon: UserPlusIcon,
    role: 'RECRUITER',
    desc: 'Sources, screens, schedules — never lets a role sit open.',
    href: null,
  },
  {
    Icon: HeadphonesIcon,
    role: 'CUSTOMER SUPPORT',
    desc: 'Answers, escalates, follows up. 24/7.',
    href: null,
  },
]

// Animation delays: exec L→R, then office L→R, 70ms stagger
const STAGGER = 70
const ALL_ROLES = [
  ...executiveTeam.map((m) => m.role),
  ...officeTeam.map((m) => m.role),
]

export default function OrgChart() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [reducedMotion, setReducedMotion] = useState(true) // safe default = show all
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const noHover = window.matchMedia('(hover: none)')
    setReducedMotion(mq.matches)
    setIsTouchDevice(noHover.matches)

    if (mq.matches) {
      setRevealed(new Set<string>(ALL_ROLES))
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        ALL_ROLES.forEach((role, i) => {
          setTimeout(() => {
            setRevealed((prev) => new Set(Array.from(prev).concat(role)))
          }, i * STAGGER)
        })
        observer.disconnect()
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Tap-away dismiss on mobile
  useEffect(() => {
    if (!activeCard || !isTouchDevice) return
    function onDocClick() {
      setActiveCard(null)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [activeCard, isTouchDevice])

  function Card({
    Icon,
    role,
    title,
    desc,
    href,
    accentColor,
    delay,
  }: {
    Icon: React.ComponentType<{ size?: number; color?: string }>
    role: string
    title?: string
    desc: string
    href?: string | null
    accentColor: string
    delay: number
  }) {
    const isRevealed = reducedMotion || revealed.has(role)
    const showDesc = reducedMotion || activeCard === role

    const cardStyle: React.CSSProperties = reducedMotion
      ? {}
      : {
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? 'translateY(0)' : 'translateY(10px)',
          transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
        }

    const handleClick = (e: React.MouseEvent) => {
      if (!isTouchDevice) return
      e.stopPropagation()
      setActiveCard((prev) => (prev === role ? null : role))
    }

    const hoverProps = isTouchDevice
      ? {}
      : {
          onMouseEnter: () => setActiveCard(role),
          onMouseLeave: () => setActiveCard(null),
        }

    const inner = (
      <div
        className="glass card-glow p-6 flex flex-col h-full"
        style={cardStyle}
        onClick={handleClick}
        {...hoverProps}
      >
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
          style={{
            background: `${accentColor}1a`,
            border: `1px solid ${accentColor}4d`,
          }}
        >
          <Icon size={20} color={accentColor} />
        </div>

        {/* Role name */}
        <p
          className="text-xs font-bold uppercase tracking-widest mb-1"
          style={{ color: accentColor }}
        >
          {role}
        </p>

        {/* Title (exec only) */}
        {title && (
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{title}</p>
        )}

        {/* Description — always in DOM (preserves height), opacity reveals on interaction */}
        <p
          className="text-sm text-[#8888aa] leading-relaxed flex-1"
          style={{
            opacity: showDesc ? 1 : 0,
            transition: reducedMotion ? 'none' : 'opacity 0.2s ease',
          }}
          aria-hidden={!showDesc}
        >
          {desc}
        </p>
      </div>
    )

    if (href) {
      return (
        <Link key={role} href={href} className="block">
          {inner}
        </Link>
      )
    }
    return <div key={role}>{inner}</div>
  }

  return (
    <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="eyebrow mb-3">
          Meet Your AI Company
        </p>
        <h2
          className="mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: 'var(--text-heading)',
          }}
        >
          Two teams. One company.
          <br />
          <span className="gradient-text">Running your business.</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '44ch', margin: '0 auto' }}>
          An executive team to decide. An office team to do the work. Nine roles, one integrated AI company.
        </p>
      </div>

      <div ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Executive Team */}
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-6 pb-4"
            style={{ color: '#C76548', borderBottom: '1px solid rgba(199,101,72,0.18)' }}
          >
            EXECUTIVE TEAM — they decide
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {executiveTeam.map((m, i) => (
              <Card
                key={m.role}
                {...m}
                accentColor="#C76548"
                delay={i * STAGGER}
              />
            ))}
          </div>
        </div>

        {/* Office Team */}
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-6 pb-4"
            style={{ color: '#8C6F47', borderBottom: '1px solid rgba(140,111,71,0.18)' }}
          >
            OFFICE TEAM — they do the work
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {officeTeam.map((m, i) => (
              <Card
                key={m.role}
                {...m}
                accentColor="#8C6F47"
                delay={(executiveTeam.length + i) * STAGGER}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
