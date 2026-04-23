'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import type { DemoOutputPreview } from '@/lib/demos/types'
import { getDemoBySlug } from '@/lib/demos/registry'

interface Props {
  demoSlug: string
}

type Phase = 'idle' | 'waiting-scroll' | 'typing-inputs' | 'streaming-outputs' | 'done'

export default function DemoPlayer({ demoSlug }: Props) {
  const demo = getDemoBySlug(demoSlug)

  const [values, setValues] = useState<Record<string, string>>({})
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0)
  const [viewerEmail, setViewerEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'running' | 'sent' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('waiting-scroll')
  const [visibleOutputCount, setVisibleOutputCount] = useState(0)
  const [outputReveal, setOutputReveal] = useState<Record<number, number>>({})
  const [activeTypingField, setActiveTypingField] = useState<string | null>(null)
  const [replayTick, setReplayTick] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  const cancelledRef = useRef(false)
  const userTouchedRef = useRef(false)
  const runCountRef = useRef(0)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Scroll trigger: start the demo when it enters the viewport
  useEffect(() => {
    if (hasStarted) return
    if (typeof window === 'undefined') return
    const el = containerRef.current
    if (!el) return

    // If already in view on mount, kick off immediately
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
      setHasStarted(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHasStarted(true)
            observer.disconnect()
            break
          }
        }
      },
      { root: null, rootMargin: '0px 0px -15% 0px', threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return
    if (!demo) return
    const scn = demo.scenarios[activeScenarioIdx]
    if (!scn) return

    cancelledRef.current = false
    const thisRun = ++runCountRef.current
    const isCancelled = () => cancelledRef.current || runCountRef.current !== thisRun

    const run = async () => {
      setValues({})
      setVisibleOutputCount(0)
      setOutputReveal({})
      setStatus('idle')
      setErrMsg(null)
      setPhase('typing-inputs')

      const targetValues = scn.values
      const orderedKeys = demo.inputFields.map((f) => f.key).filter((k) => targetValues[k] != null)

      const initBlanks: Record<string, string> = {}
      demo.inputFields.forEach((f) => {
        initBlanks[f.key] = ''
      })
      setValues(initBlanks)

      await sleep(420)
      if (isCancelled()) return

      for (const key of orderedKeys) {
        const target = targetValues[key] ?? ''
        setActiveTypingField(key)
        for (let i = 1; i <= target.length; i++) {
          if (isCancelled()) return
          setValues((v) => ({ ...v, [key]: target.slice(0, i) }))
          // Slower, more readable typing speeds
          const base = target.length > 220 ? 8 : target.length > 100 ? 16 : 32
          await sleep(base)
        }
        setActiveTypingField(null)
        await sleep(320)
        if (isCancelled()) return
      }

      await sleep(500)
      if (isCancelled()) return

      setPhase('streaming-outputs')
      let outs: DemoOutputPreview[] = []
      try {
        outs = demo.generateOutput(targetValues, demo.business)
      } catch {
        outs = []
      }

      for (let idx = 0; idx < outs.length; idx++) {
        if (isCancelled()) return
        setVisibleOutputCount(idx + 1)
        setOutputReveal((r) => ({ ...r, [idx]: 0 }))
        await sleep(500)

        const bodyLen = outs[idx].body?.length ?? 0
        // Slower stream — cap longer but still readable
        const totalDurMs = Math.min(2600, Math.max(900, bodyLen * 7))
        const steps = 50
        const stepMs = totalDurMs / steps
        for (let s = 1; s <= steps; s++) {
          if (isCancelled()) return
          const chars = Math.round((bodyLen * s) / steps)
          setOutputReveal((r) => ({ ...r, [idx]: chars }))
          await sleep(stepMs)
        }
        setOutputReveal((r) => ({ ...r, [idx]: bodyLen }))
        await sleep(420)
      }
      if (isCancelled()) return
      setPhase('done')
    }

    run()
    return () => {
      cancelledRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo, activeScenarioIdx, replayTick, hasStarted])

  const skipToEnd = () => {
    if (!demo) return
    cancelledRef.current = true
    if (!hasStarted) setHasStarted(true)
    const scn = demo.scenarios[activeScenarioIdx]
    if (!scn) return
    setValues(scn.values)
    setActiveTypingField(null)
    try {
      const outs = demo.generateOutput(scn.values, demo.business)
      setVisibleOutputCount(outs.length)
      const full: Record<number, number> = {}
      outs.forEach((o, i) => {
        full[i] = o.body?.length ?? 0
      })
      setOutputReveal(full)
    } catch {
      /* noop */
    }
    setPhase('done')
  }

  const replay = () => {
    userTouchedRef.current = false
    if (!hasStarted) setHasStarted(true)
    setReplayTick((t) => t + 1)
  }

  const applyScenario = (idx: number) => {
    userTouchedRef.current = false
    if (!hasStarted) setHasStarted(true)
    if (idx === activeScenarioIdx) {
      replay()
      return
    }
    setActiveScenarioIdx(idx)
  }

  const handleFieldEdit = (key: string, value: string) => {
    userTouchedRef.current = true
    cancelledRef.current = true
    if (!hasStarted) setHasStarted(true)
    setValues((v) => ({ ...v, [key]: value }))
    setPhase('done')
    if (demo) {
      try {
        const outs = demo.generateOutput({ ...values, [key]: value }, demo.business)
        setVisibleOutputCount(outs.length)
        const full: Record<number, number> = {}
        outs.forEach((o, i) => {
          full[i] = o.body?.length ?? 0
        })
        setOutputReveal(full)
      } catch {
        /* noop */
      }
    }
  }

  const liveOutputs = useMemo(() => {
    if (!demo) return null
    try {
      return demo.generateOutput(values, demo.business)
    } catch {
      return null
    }
  }, [values, demo])

  if (!demo) return null

  const handleRun = async () => {
    setStatus('running')
    setErrMsg(null)
    try {
      const generated = demo.generateOutput(values, demo.business)
      const res = await fetch('/api/demo-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          demoSlug: demo.slug,
          demoTitle: demo.title,
          business: {
            name: demo.business.name,
            ownerName: demo.business.ownerName,
            industry: demo.business.industry,
          },
          outputs: generated,
          viewerEmail: viewerEmail || undefined,
        }),
      })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error || 'send failed')
      setStatus('sent')
    } catch (e: any) {
      setStatus('error')
      setErrMsg(e?.message ?? 'Unknown error')
    }
  }

  return (
    <div ref={containerRef} style={{ display: 'grid', gap: 24 }}>
      <div
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '10px 14px',
          background: 'linear-gradient(90deg, rgba(108,92,231,0.12), rgba(0,206,201,0.06))',
          border: '1px solid var(--border-subtle)',
          borderRadius: 10,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: 'var(--teal)',
            fontWeight: 700,
          }}
        >
          <LiveDot phase={phase} /> {phaseLabel(phase)}
        </span>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1, minWidth: 200 }}>
          {phaseHint(phase)}
        </span>
        {phase !== 'done' && (
          <button onClick={skipToEnd} style={ghostBtn}>
            Skip ahead
          </button>
        )}
        {phase === 'done' && (
          <button onClick={replay} style={ghostBtn}>
            ↻ Replay
          </button>
        )}
      </div>

      {demo.scenarios.length > 1 && (
        <div>
          <div style={labelStyle}>Try a scenario</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {demo.scenarios.map((s, i) => (
              <button
                key={i}
                onClick={() => applyScenario(i)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: `1px solid ${i === activeScenarioIdx ? 'var(--purple)' : 'var(--border-subtle)'}`,
                  background: i === activeScenarioIdx ? 'rgba(108,92,231,0.15)' : 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
            {demo.scenarios[activeScenarioIdx]?.description}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 20 }}>
        <div style={cardStyle}>
          <div style={sectionHeader}>Input — watch the agent fill the form</div>
          <div style={{ display: 'grid', gap: 14, marginTop: 14 }}>
            {demo.inputFields.map((f) => {
              const isActive = activeTypingField === f.key
              const highlight: React.CSSProperties = isActive
                ? { borderColor: 'var(--purple)', boxShadow: '0 0 0 3px rgba(108,92,231,0.18)' }
                : {}
              return (
                <div key={f.key}>
                  <div style={labelStyle}>
                    {f.label}
                    {isActive && (
                      <span style={{ marginLeft: 8, color: 'var(--teal)', fontSize: 10, letterSpacing: 1 }}>
                        ● typing
                      </span>
                    )}
                  </div>
                  {f.type === 'textarea' ? (
                    <textarea
                      value={values[f.key] ?? ''}
                      placeholder={f.placeholder}
                      onChange={(e) => handleFieldEdit(f.key, e.target.value)}
                      style={{ ...inputStyle, ...highlight, minHeight: 90, resize: 'vertical' }}
                    />
                  ) : f.type === 'select' ? (
                    <select
                      value={values[f.key] ?? ''}
                      onChange={(e) => handleFieldEdit(f.key, e.target.value)}
                      style={{ ...inputStyle, ...highlight }}
                    >
                      <option value="">-- select --</option>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : f.type === 'phone' ? 'tel' : 'text'}
                      value={values[f.key] ?? ''}
                      placeholder={f.placeholder}
                      onChange={(e) => handleFieldEdit(f.key, e.target.value)}
                      style={{ ...inputStyle, ...highlight }}
                    />
                  )}
                  {f.helperText && (
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{f.helperText}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={sectionHeader}>
            {phase === 'streaming-outputs'
              ? 'AI generating…'
              : phase === 'done'
                ? 'Output'
                : phase === 'waiting-scroll'
                  ? 'Output (scroll to start)'
                  : 'Output (waiting…)'}
          </div>
          <div style={{ marginTop: 14, display: 'grid', gap: 12 }}>
            {phase === 'waiting-scroll' ? (
              <div
                style={{
                  padding: '24px 16px',
                  color: 'var(--text-secondary)',
                  fontSize: 13,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px dashed var(--border-subtle)',
                  borderRadius: 10,
                  textAlign: 'center',
                }}
              >
                ↓ scroll down to start the live demo
              </div>
            ) : phase === 'typing-inputs' || phase === 'idle' ? (
              <div
                style={{
                  padding: '24px 16px',
                  color: 'var(--text-secondary)',
                  fontSize: 13,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px dashed var(--border-subtle)',
                  borderRadius: 10,
                  textAlign: 'center',
                }}
              >
                waiting for the form to fill in…
              </div>
            ) : (
              liveOutputs
                ?.slice(0, visibleOutputCount)
                .map((o, i) => (
                  <OutputCard
                    key={i}
                    output={o}
                    stepNumber={i + 1}
                    revealChars={
                      phase === 'done' && userTouchedRef.current ? o.body?.length ?? 0 : outputReveal[i] ?? 0
                    }
                    streaming={phase === 'streaming-outputs' && i === visibleOutputCount - 1}
                  />
                ))
            )}
            {phase === 'streaming-outputs' && visibleOutputCount < (liveOutputs?.length ?? 0) && (
              <div
                style={{
                  padding: '10px 14px',
                  color: 'var(--text-secondary)',
                  fontSize: 12,
                  fontStyle: 'italic',
                  textAlign: 'center',
                }}
              >
                generating step {visibleOutputCount + 1}…
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, rgba(108,92,231,0.12), rgba(0,206,201,0.08))',
          border: '1px solid var(--border-glow)',
          borderRadius: 14,
          padding: 20,
          display: 'grid',
          gap: 14,
        }}
      >
        <div>
          <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>
            Send this output to a real inbox
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Click run and we&apos;ll email exactly what you see above to <strong>maya@zyphlabs.com</strong> (the
            Zyph Labs demo inbox) so you can see a real thread. Add your own email to cc yourself.
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <input
            type="email"
            placeholder="you@example.com (optional)"
            value={viewerEmail}
            onChange={(e) => setViewerEmail(e.target.value)}
            style={{ ...inputStyle, flex: '1 1 240px' }}
          />
          <button
            onClick={handleRun}
            disabled={status === 'running' || phase !== 'done'}
            style={{
              padding: '12px 28px',
              borderRadius: 10,
              border: 'none',
              background:
                status === 'running' || phase !== 'done' ? '#64748b' : 'linear-gradient(135deg,#6c5ce7,#00cec9)',
              color: 'white',
              fontSize: 14,
              fontWeight: 600,
              cursor: status === 'running' ? 'wait' : phase !== 'done' ? 'not-allowed' : 'pointer',
              letterSpacing: 0.3,
            }}
          >
            {status === 'running'
              ? 'Sending…'
              : phase !== 'done'
                ? 'Waiting for demo to finish…'
                : 'Run live demo → send email'}
          </button>
        </div>
        {status === 'sent' && (
          <div style={{ ...statusBoxStyle, borderColor: '#10b981', color: '#6ee7b7' }}>
            ✓ Sent to maya@zyphlabs.com{viewerEmail ? ` and ${viewerEmail}` : ''}. Check the inbox to see the
            real thread.
          </div>
        )}
        {status === 'error' && (
          <div style={{ ...statusBoxStyle, borderColor: '#ef4444', color: '#fca5a5' }}>Error: {errMsg}</div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: demo.brainHook ? '2fr 1fr' : '1fr', gap: 20 }}>
        <div style={cardStyle}>
          <div style={sectionHeader}>How it works</div>
          <ol style={{ marginTop: 14, paddingLeft: 22, color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 14 }}>
            {demo.howItWorks.map((s, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                {s}
              </li>
            ))}
          </ol>
        </div>
        {demo.brainHook && (
          <div
            style={{
              ...cardStyle,
              background: 'linear-gradient(135deg, rgba(108,92,231,0.08), rgba(0,206,201,0.04))',
              borderColor: 'var(--border-glow)',
            }}
          >
            <div style={{ ...sectionHeader, color: 'var(--purple-light)' }}>+ The Brain</div>
            <div style={{ marginTop: 14, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {demo.brainHook}
            </div>
            <div
              style={{
                marginTop: 14,
                fontSize: 11,
                letterSpacing: 1,
                textTransform: 'uppercase',
                color: 'var(--teal)',
                fontWeight: 700,
              }}
            >
              Tier 3 only
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes demo-card-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes demo-cursor-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes demo-pulse {
          0% { box-shadow: 0 0 0 0 currentColor; }
          70% { box-shadow: 0 0 0 8px rgba(0, 0, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
        }
      `}</style>
    </div>
  )
}

function OutputCard({
  output,
  stepNumber,
  revealChars,
  streaming,
}: {
  output: DemoOutputPreview
  stepNumber: number
  revealChars: number
  streaming: boolean
}) {
  const badge = channelBadge(output.type, output.channelLabel)
  const fullBody = output.body ?? ''
  const shown = fullBody.slice(0, Math.max(0, revealChars))
  const isFullyShown = revealChars >= fullBody.length
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 10,
        padding: 14,
        animation: 'demo-card-in 320ms ease-out both',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span
          style={{
            fontSize: 10,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: 'var(--purple-light)',
            fontWeight: 700,
          }}
        >
          Step {stepNumber}
        </span>
        <span
          style={{
            background: 'rgba(108,92,231,0.18)',
            color: 'var(--purple-light)',
            padding: '2px 8px',
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          {badge}
        </span>
        {streaming && !isFullyShown && (
          <span style={{ fontSize: 10, color: 'var(--teal)', letterSpacing: 1, marginLeft: 'auto' }}>
            ● generating
          </span>
        )}
      </div>
      {(output.recipient || output.subject) && (
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.5 }}>
          {output.recipient && (
            <div><strong style={{ color: 'var(--text-primary)' }}>To:</strong> {output.recipient}</div>
          )}
          {output.subject && (
            <div><strong style={{ color: 'var(--text-primary)' }}>Subject:</strong> {output.subject}</div>
          )}
        </div>
      )}
      <div
        style={{
          fontSize: 13,
          color: 'var(--text-primary)',
          lineHeight: 1.55,
          whiteSpace: 'pre-wrap',
          fontFamily: output.type === 'dashboard' ? 'ui-monospace, monospace' : 'inherit',
        }}
      >
        {shown}
        {!isFullyShown && (
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 15,
              background: 'var(--teal)',
              marginLeft: 2,
              verticalAlign: 'text-bottom',
              animation: 'demo-cursor-blink 0.9s steps(2) infinite',
            }}
          />
        )}
      </div>
    </div>
  )
}

function LiveDot({ phase }: { phase: Phase }) {
  const color =
    phase === 'typing-inputs'
      ? '#00cec9'
      : phase === 'streaming-outputs'
        ? '#a29bfe'
        : phase === 'done'
          ? '#10b981'
          : phase === 'waiting-scroll'
            ? '#64748b'
            : '#64748b'
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        color: color,
        animation: phase === 'typing-inputs' || phase === 'streaming-outputs' ? 'demo-pulse 1.4s infinite' : undefined,
      }}
    />
  )
}

function phaseLabel(p: Phase): string {
  switch (p) {
    case 'waiting-scroll':
      return 'Scroll to start'
    case 'typing-inputs':
      return 'Agent is filling the form'
    case 'streaming-outputs':
      return 'Agent is generating outputs'
    case 'done':
      return 'Live demo ready'
    default:
      return 'Starting…'
  }
}

function phaseHint(p: Phase): string {
  switch (p) {
    case 'waiting-scroll':
      return 'Scroll down so the demo is in view and the agent will start typing for you'
    case 'typing-inputs':
      return 'Watch on the left — the agent is ingesting the customer scenario'
    case 'streaming-outputs':
      return 'Each card that appears on the right is one message the agent would actually send'
    case 'done':
      return 'Switch scenarios above, edit any field, or send this exact output to our demo inbox below'
    default:
      return 'The agent will fill the form and generate the outputs automatically — sit back'
  }
}

function channelBadge(type: string, label?: string): string {
  if (label) return label
  switch (type) {
    case 'email': return 'Email'
    case 'sms': return 'SMS'
    case 'dashboard': return 'Dashboard'
    case 'call-summary': return 'Call summary'
    case 'multi-channel': return 'Multi-channel'
    default: return type
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const cardStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 14,
  padding: 20,
}

const sectionHeader: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: 2,
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
  fontWeight: 700,
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: 1,
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
  fontWeight: 600,
  marginBottom: 4,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 8,
  padding: '10px 12px',
  color: 'var(--text-primary)',
  fontSize: 14,
  fontFamily: 'inherit',
  transition: 'border-color 120ms ease, box-shadow 120ms ease',
}

const statusBoxStyle: React.CSSProperties = {
  padding: '10px 14px',
  border: '1px solid',
  borderRadius: 8,
  fontSize: 13,
}

const ghostBtn: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 6,
  border: '1px solid var(--border-subtle)',
  background: 'transparent',
  color: 'var(--text-secondary)',
  fontSize: 12,
  cursor: 'pointer',
  fontWeight: 500,
}
