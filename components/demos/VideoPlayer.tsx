'use client'

import { useState, useEffect, useRef } from 'react'
import type { DemoOutputPreview } from '@/lib/demos/types'
import { getDemoBySlug } from '@/lib/demos/registry'
import { getVideoHook } from '@/lib/demos/hooks'

interface Props {
  demoSlug: string
}

type Phase = 'hook' | 'scenario' | 'typing' | 'streaming' | 'outro'

// Vertical (9:16) social-media-ready demo. Auto-plays immediately on mount,
// no scroll trigger (intended for screen recording at 1080x1920).
//
// Timeline:
//   0.0–3.0s   Hook card (big text, brand)
//   3.0–4.0s   Business name + scenario chip slide-in
//   4.0–~12s   Inputs typewrite
//   ~12–~50s   Outputs stream (1 card at a time)
//   last 3.5s  Outro card with logo + zyphlabs.com/assessment

export default function VideoPlayer({ demoSlug }: Props) {
  const demo = getDemoBySlug(demoSlug)
  const [values, setValues] = useState<Record<string, string>>({})
  const [phase, setPhase] = useState<Phase>('hook')
  const [activeTypingField, setActiveTypingField] = useState<string | null>(null)
  const [visibleOutputs, setVisibleOutputs] = useState(0)
  const [outputReveal, setOutputReveal] = useState<Record<number, number>>({})
  const cancelledRef = useRef(false)

  useEffect(() => {
    if (!demo) return
    const scn = demo.scenarios[0]
    if (!scn) return

    cancelledRef.current = false
    const isCancelled = () => cancelledRef.current

    const run = async () => {
      // Phase 1: Hook (3s)
      setPhase('hook')
      await sleep(3000)
      if (isCancelled()) return

      // Phase 2: Scenario reveal (1s)
      setPhase('scenario')
      await sleep(1000)
      if (isCancelled()) return

      // Phase 3: Typing inputs
      setPhase('typing')
      const initBlanks: Record<string, string> = {}
      demo.inputFields.forEach((f) => {
        initBlanks[f.key] = ''
      })
      setValues(initBlanks)

      const targetValues = scn.values
      const orderedKeys = demo.inputFields.map((f) => f.key).filter((k) => targetValues[k] != null)

      for (const key of orderedKeys) {
        const target = targetValues[key] ?? ''
        setActiveTypingField(key)
        for (let i = 1; i <= target.length; i++) {
          if (isCancelled()) return
          setValues((v) => ({ ...v, [key]: target.slice(0, i) }))
          // Faster than the desktop demo to keep the video tight
          const base = target.length > 200 ? 6 : target.length > 80 ? 12 : 22
          await sleep(base)
        }
        setActiveTypingField(null)
        await sleep(220)
        if (isCancelled()) return
      }
      await sleep(360)
      if (isCancelled()) return

      // Phase 4: Streaming outputs
      setPhase('streaming')
      let outs: DemoOutputPreview[] = []
      try {
        outs = demo.generateOutput(targetValues, demo.business)
      } catch {
        outs = []
      }

      for (let idx = 0; idx < outs.length; idx++) {
        if (isCancelled()) return
        setVisibleOutputs(idx + 1)
        setOutputReveal((r) => ({ ...r, [idx]: 0 }))
        await sleep(360)

        const bodyLen = outs[idx].body?.length ?? 0
        // Cap at ~2s per output card; long bodies get faster char rate
        const totalDurMs = Math.min(2400, Math.max(700, bodyLen * 5))
        const steps = 50
        const stepMs = totalDurMs / steps
        for (let s = 1; s <= steps; s++) {
          if (isCancelled()) return
          const chars = Math.round((bodyLen * s) / steps)
          setOutputReveal((r) => ({ ...r, [idx]: chars }))
          await sleep(stepMs)
        }
        setOutputReveal((r) => ({ ...r, [idx]: bodyLen }))
        await sleep(380)
      }

      if (isCancelled()) return

      // Phase 5: Outro (3.5s)
      setPhase("outro"); if (typeof window !== "undefined") { (window as any).__zyphDone = true; }
      // Stay on outro indefinitely; the recording script will stop the recording
    }

    run()
    return () => {
      cancelledRef.current = true
    }
  }, [demo])

  if (!demo) return null

  const hookText = getVideoHook(demoSlug, demo.subtitle)
  const liveOutputs: DemoOutputPreview[] = (() => {
    try {
      return demo.generateOutput(demo.scenarios[0]?.values ?? {}, demo.business)
    } catch {
      return []
    }
  })()

  return (
    <div className="video-stage">
      {/* Hook overlay — visible during 'hook' phase */}
      {phase === 'hook' && (
        <div className="hook-card">
          <div className="hook-eyebrow">ZYPH LABS · LIVE AI DEMO</div>
          <div className="hook-text">{hookText}</div>
          <div className="hook-bottom">
            <span className="hook-business-pill">{demo.business.name} · {demo.business.city}</span>
          </div>
        </div>
      )}

      {/* Outro overlay — visible during 'outro' phase */}
      {phase === 'outro' && (
        <div className="outro-card">
          <div className="outro-brand">
            <div className="outro-logo-row">
              <span className="outro-dot" />
              <span className="outro-zyph">ZYPH LABS</span>
            </div>
            <div className="outro-tagline">Custom AI integrations for operators</div>
          </div>
          <div className="outro-cta-block">
            <div className="outro-cta-line">Find your version of this in 5 minutes →</div>
            <div className="outro-url">zyphlabs.com/assessment</div>
          </div>
          <div className="outro-demo-name">{demo.title}</div>
        </div>
      )}

      {/* Main demo content — visible during scenario / typing / streaming */}
      {(phase === 'scenario' || phase === 'typing' || phase === 'streaming') && (
        <>
          {/* Top header */}
          <div className="vp-header">
            <div className="vp-header-row">
              <span className="vp-dot" />
              <span className="vp-eyebrow">{demo.title.toUpperCase()}</span>
            </div>
            <div className="vp-business">
              <strong>{demo.business.name}</strong> · {demo.business.city}
            </div>
            {demo.scenarios[0] && (
              <div className="vp-scenario-chip">{demo.scenarios[0].label}</div>
            )}
          </div>

          {/* Inputs panel */}
          <div className="vp-inputs">
            <div className="vp-section-title">CUSTOMER SCENARIO</div>
            {demo.inputFields.slice(0, 5).map((f) => {
              const isActive = activeTypingField === f.key
              return (
                <div key={f.key} className={`vp-field ${isActive ? 'vp-field-active' : ''}`}>
                  <div className="vp-field-label">{f.label}</div>
                  <div className="vp-field-value">
                    {values[f.key] || (phase === 'scenario' ? '' : '')}
                    {isActive && <span className="vp-cursor" />}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Outputs panel */}
          <div className="vp-outputs">
            <div className="vp-section-title">
              {phase === 'streaming' ? 'AI GENERATING…' : 'AI OUTPUT'}
            </div>
            {liveOutputs.slice(0, visibleOutputs).map((o, i) => {
              const reveal = outputReveal[i] ?? 0
              const fullBody = o.body ?? ''
              const shown = fullBody.slice(0, Math.max(0, reveal))
              const isFullyShown = reveal >= fullBody.length
              return (
                <div key={i} className="vp-card">
                  <div className="vp-card-head">
                    <span className="vp-step">STEP {i + 1}</span>
                    <span className="vp-channel">{o.channelLabel ?? o.type}</span>
                    {!isFullyShown && phase === 'streaming' && (
                      <span className="vp-streaming-tag">● LIVE</span>
                    )}
                  </div>
                  {(o.recipient || o.subject) && (
                    <div className="vp-meta">
                      {o.recipient && <div><b>To:</b> {o.recipient}</div>}
                      {o.subject && <div><b>Subject:</b> {o.subject}</div>}
                    </div>
                  )}
                  <div className="vp-body">
                    {shown}
                    {!isFullyShown && <span className="vp-cursor" />}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Persistent footer brand */}
          <div className="vp-footer">
            <span className="vp-footer-dot" />
            <span className="vp-footer-zyph">ZYPH LABS</span>
            <span className="vp-footer-sep">·</span>
            <span className="vp-footer-cta">zyphlabs.com/assessment</span>
          </div>
        </>
      )}

      <style jsx>{`
        .video-stage {
          width: 1080px;
          height: 1920px;
          background: linear-gradient(180deg, #0a0a14 0%, #0f0f1f 100%);
          color: #f0f0ff;
          font-family: 'Space Grotesk', system-ui, sans-serif;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* Hook card */
        .hook-card {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 80px 80px 120px;
          background: radial-gradient(ellipse at center, rgba(108, 92, 231, 0.25) 0%, transparent 70%);
          animation: fade-in 0.4s ease-out;
        }
        .hook-eyebrow {
          font-size: 28px;
          letter-spacing: 6px;
          color: #00cec9;
          font-weight: 700;
          margin-bottom: 56px;
        }
        .hook-text {
          font-size: 110px;
          line-height: 1.05;
          font-weight: 700;
          text-align: center;
          max-width: 920px;
          background: linear-gradient(135deg, #ffffff 0%, #a29bfe 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: -2px;
        }
        .hook-bottom {
          margin-top: 60px;
        }
        .hook-business-pill {
          display: inline-block;
          padding: 18px 36px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          font-size: 32px;
          color: #c8c8e0;
        }

        /* Outro card */
        .outro-card {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 80px;
          padding: 100px;
          background: radial-gradient(ellipse at center, rgba(0, 206, 201, 0.18) 0%, transparent 70%);
          animation: fade-in 0.5s ease-out;
        }
        .outro-brand {
          text-align: center;
        }
        .outro-logo-row {
          display: flex;
          align-items: center;
          gap: 24px;
          justify-content: center;
        }
        .outro-dot {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6c5ce7, #00cec9);
        }
        .outro-zyph {
          font-size: 88px;
          font-weight: 700;
          letter-spacing: -2px;
          background: linear-gradient(135deg, #ffffff 0%, #a29bfe 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .outro-tagline {
          margin-top: 32px;
          font-size: 32px;
          color: #8e8eaf;
          letter-spacing: 1px;
        }
        .outro-cta-block {
          text-align: center;
        }
        .outro-cta-line {
          font-size: 56px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 28px;
          letter-spacing: -0.5px;
        }
        .outro-url {
          font-size: 64px;
          font-weight: 700;
          background: linear-gradient(135deg, #6c5ce7, #00cec9);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: -1px;
        }
        .outro-demo-name {
          margin-top: 20px;
          font-size: 28px;
          color: #6e6e93;
        }

        /* Main stage layout */
        .vp-header {
          padding: 60px 60px 30px;
        }
        .vp-header-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        .vp-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00cec9;
          box-shadow: 0 0 24px #00cec9;
        }
        .vp-eyebrow {
          font-size: 26px;
          letter-spacing: 4px;
          font-weight: 700;
          color: #a29bfe;
        }
        .vp-business {
          font-size: 36px;
          color: #c8c8e0;
          margin-bottom: 18px;
        }
        .vp-business strong {
          color: #ffffff;
          font-weight: 700;
        }
        .vp-scenario-chip {
          display: inline-block;
          padding: 14px 28px;
          background: rgba(108, 92, 231, 0.18);
          border: 1px solid rgba(108, 92, 231, 0.4);
          border-radius: 999px;
          font-size: 28px;
          color: #d6d0ff;
          font-weight: 500;
        }

        .vp-section-title {
          font-size: 22px;
          letter-spacing: 4px;
          color: #6e6e93;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .vp-inputs {
          padding: 30px 60px;
          flex-shrink: 0;
        }
        .vp-field {
          background: rgba(255, 255, 255, 0.04);
          border: 2px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 20px 26px;
          margin-bottom: 14px;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .vp-field-active {
          border-color: #6c5ce7;
          box-shadow: 0 0 0 6px rgba(108, 92, 231, 0.18);
        }
        .vp-field-label {
          font-size: 22px;
          letter-spacing: 2px;
          color: #8e8eaf;
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .vp-field-value {
          font-size: 34px;
          color: #f5f5ff;
          line-height: 1.3;
          min-height: 44px;
          word-break: break-word;
        }

        .vp-outputs {
          padding: 20px 60px 100px;
          flex-grow: 1;
          overflow: hidden;
        }
        .vp-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(108, 92, 231, 0.3);
          border-radius: 22px;
          padding: 26px 30px;
          margin-bottom: 18px;
          animation: card-in 0.35s ease-out both;
        }
        .vp-card-head {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 14px;
        }
        .vp-step {
          font-size: 20px;
          letter-spacing: 3px;
          color: #a29bfe;
          font-weight: 700;
        }
        .vp-channel {
          font-size: 18px;
          padding: 6px 16px;
          background: rgba(108, 92, 231, 0.25);
          color: #d6d0ff;
          border-radius: 999px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        .vp-streaming-tag {
          font-size: 18px;
          color: #00cec9;
          font-weight: 700;
          letter-spacing: 2px;
          margin-left: auto;
        }
        .vp-meta {
          font-size: 22px;
          color: #8e8eaf;
          margin-bottom: 14px;
          line-height: 1.5;
        }
        .vp-meta b {
          color: #ffffff;
        }
        .vp-body {
          font-size: 28px;
          line-height: 1.5;
          color: #f0f0ff;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .vp-cursor {
          display: inline-block;
          width: 14px;
          height: 32px;
          background: #00cec9;
          margin-left: 4px;
          vertical-align: text-bottom;
          animation: blink 0.85s steps(2) infinite;
        }

        .vp-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 28px 60px;
          background: linear-gradient(180deg, transparent 0%, rgba(10, 10, 20, 0.95) 60%);
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .vp-footer-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6c5ce7, #00cec9);
        }
        .vp-footer-zyph {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 3px;
          color: #ffffff;
        }
        .vp-footer-sep {
          color: #4a4a6a;
          font-size: 22px;
        }
        .vp-footer-cta {
          font-size: 22px;
          color: #00cec9;
          font-weight: 600;
          letter-spacing: 1px;
        }

        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes card-in {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
