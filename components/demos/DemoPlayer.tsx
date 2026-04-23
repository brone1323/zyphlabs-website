'use client'

import { useState, useMemo } from 'react'
import type { DemoOutputPreview } from '@/lib/demos/types'
import { getDemoBySlug } from '@/lib/demos/registry'

interface Props {
  demoSlug: string
}

export default function DemoPlayer({ demoSlug }: Props) {
  const demo = getDemoBySlug(demoSlug)
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    if (!demo) return initial
    demo.inputFields.forEach((f) => {
      initial[f.key] = f.defaultValue ?? ''
    })
    if (demo.scenarios[0]) Object.assign(initial, demo.scenarios[0].values)
    return initial
  })

  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0)
  const [viewerEmail, setViewerEmail] = useState('')
  const [outputs, setOutputs] = useState<DemoOutputPreview[] | null>(null)
  const [status, setStatus] = useState<'idle' | 'running' | 'sent' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState<string | null>(null)

  const applyScenario = (idx: number) => {
    setActiveScenarioIdx(idx)
    const scn = demo.scenarios[idx]
    if (scn) {
      setValues((v) => ({ ...v, ...scn.values }))
      setOutputs(null)
      setStatus('idle')
    }
  }

  const previewOutputs = useMemo(() => {
    if (!demo) return null
    try {
      return demo.generateOutput(values, demo.business)
    } catch (e) {
      return null
    }
  }, [values, demo])

  if (!demo) return null

  const handleRun = async () => {
    setStatus('running')
    setErrMsg(null)
    try {
      const generated = demo.generateOutput(values, demo.business)
      setOutputs(generated)
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
    <div style={{ display: 'grid', gap: 24 }}>
      {/* Scenario switcher */}
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

      {/* Split layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 20 }}>
        {/* Inputs */}
        <div style={cardStyle}>
          <div style={sectionHeader}>Input</div>
          <div style={{ display: 'grid', gap: 14, marginTop: 14 }}>
            {demo.inputFields.map((f) => (
              <div key={f.key}>
                <div style={labelStyle}>{f.label}</div>
                {f.type === 'textarea' ? (
                  <textarea
                    value={values[f.key] ?? ''}
                    placeholder={f.placeholder}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
                  />
                ) : f.type === 'select' ? (
                  <select
                    value={values[f.key] ?? ''}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    style={inputStyle}
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
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    style={inputStyle}
                  />
                )}
                {f.helperText && (
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{f.helperText}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Live preview */}
        <div style={cardStyle}>
          <div style={sectionHeader}>Live preview</div>
          <div style={{ marginTop: 14, display: 'grid', gap: 12 }}>
            {previewOutputs?.map((o, i) => (
              <OutputCard key={i} output={o} stepNumber={i + 1} />
            ))}
          </div>
        </div>
      </div>

      {/* Run panel */}
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
            Send this demo to a real inbox
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Click run and we'll email this output to <strong>maya@zyphlabs.com</strong> (the Zyph Labs demo inbox)
            so you can see exactly what a customer would receive. Add your own email to get a copy too.
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <input
            type="email"
            placeholder="you@example.com (optional, to cc yourself)"
            value={viewerEmail}
            onChange={(e) => setViewerEmail(e.target.value)}
            style={{ ...inputStyle, flex: '1 1 240px' }}
          />
          <button
            onClick={handleRun}
            disabled={status === 'running'}
            style={{
              padding: '12px 28px',
              borderRadius: 10,
              border: 'none',
              background: status === 'running' ? '#64748b' : 'linear-gradient(135deg,#6c5ce7,#00cec9)',
              color: 'white',
              fontSize: 14,
              fontWeight: 600,
              cursor: status === 'running' ? 'wait' : 'pointer',
              letterSpacing: 0.3,
            }}
          >
            {status === 'running' ? 'Sending…' : 'Run live demo → send email'}
          </button>
        </div>
        {status === 'sent' && (
          <div style={{ ...statusBoxStyle, borderColor: '#10b981', color: '#6ee7b7' }}>
            ✓ Sent to maya@zyphlabs.com{viewerEmail ? ` and ${viewerEmail}` : ''}. Check the inbox (or your own email)
            to see the real thread.
          </div>
        )}
        {status === 'error' && (
          <div style={{ ...statusBoxStyle, borderColor: '#ef4444', color: '#fca5a5' }}>
            Error: {errMsg}
          </div>
        )}
      </div>

      {/* How it works + Brain hook */}
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
    </div>
  )
}

function OutputCard({ output, stepNumber }: { output: DemoOutputPreview; stepNumber: number }) {
  const badge = channelBadge(output.type, output.channelLabel)
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 10,
        padding: 14,
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
      </div>
      {(output.recipient || output.subject) && (
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.5 }}>
          {output.recipient && (
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>To:</strong> {output.recipient}
            </div>
          )}
          {output.subject && (
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Subject:</strong> {output.subject}
            </div>
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
        {output.body}
      </div>
    </div>
  )
}

function channelBadge(type: string, label?: string): string {
  if (label) return label
  switch (type) {
    case 'email':
      return 'Email'
    case 'sms':
      return 'SMS'
    case 'dashboard':
      return 'Dashboard'
    case 'call-summary':
      return 'Call summary'
    case 'multi-channel':
      return 'Multi-channel'
    default:
      return type
  }
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
}

const statusBoxStyle: React.CSSProperties = {
  padding: '10px 14px',
  border: '1px solid',
  borderRadius: 8,
  fontSize: 13,
}
