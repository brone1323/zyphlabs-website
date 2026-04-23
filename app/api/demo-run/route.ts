import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// POST /api/demo-run
// Body: { demoSlug, demoTitle, business, outputs: DemoOutputPreview[], viewerEmail? }
// Sends the generated demo output as a real email to maya@zyphlabs.com so
// we have a live thread to forward to prospects. If viewerEmail is supplied
// we also CC them so they see it land in real time.

const MAYA = 'maya@zyphlabs.com'
const FROM = 'Zyph Labs Demo <notifications@zyphlabs.com>'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { demoSlug, demoTitle, business, outputs, viewerEmail } = body as {
      demoSlug: string
      demoTitle: string
      business: { name: string; ownerName: string; industry: string }
      outputs: Array<{
        type: string
        subject?: string
        recipient?: string
        channelLabel?: string
        body: string
        htmlBody?: string
      }>
      viewerEmail?: string
    }

    if (!demoSlug || !demoTitle || !outputs?.length) {
      return NextResponse.json({ ok: false, error: 'missing fields' }, { status: 400 })
    }

    const key = process.env.RESEND_API_KEY
    if (!key) {
      // In dev mode w/o key, still return success so UI flow works
      return NextResponse.json({
        ok: true,
        sent: false,
        reason: 'no_api_key',
        outputs,
      })
    }

    const resend = new Resend(key)

    const channelBlocks = outputs
      .map((o, i) => renderChannelBlock(o, i + 1))
      .join('\n<hr style="border:none;border-top:1px dashed #d1d5db;margin:24px 0"/>\n')

    const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:680px;margin:0 auto;color:#0f172a">
        <div style="background:linear-gradient(135deg,#6c5ce7,#00cec9);padding:24px;border-radius:12px 12px 0 0;color:white">
          <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:0.85">Zyph Labs Demo</div>
          <div style="font-size:22px;font-weight:700;margin-top:4px">${escapeHtml(demoTitle)}</div>
          <div style="font-size:14px;opacity:0.9;margin-top:6px">
            Run against fictional business: <strong>${escapeHtml(business.name)}</strong> · Owner: ${escapeHtml(business.ownerName)}
          </div>
        </div>
        <div style="background:#f8fafc;padding:20px;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 12px 12px">
          <p style="margin:0 0 16px;color:#475569;font-size:14px">
            This is a live output from the <strong>${escapeHtml(demoTitle)}</strong> demo at
            <a href="https://zyphlabs.com/demos/${escapeHtml(demoSlug)}" style="color:#6c5ce7">zyphlabs.com/demos/${escapeHtml(demoSlug)}</a>.
            Forward this thread to any prospect who wants to see exactly what they'd get.
          </p>
          ${channelBlocks}
        </div>
        <p style="color:#94a3b8;font-size:11px;margin-top:16px;text-align:center">
          Zyph Labs · Custom AI integrations for operators · zyphlabs.com
        </p>
      </div>
    `

    const recipients = [MAYA]
    if (viewerEmail && viewerEmail.includes('@')) recipients.push(viewerEmail)

    const result = await resend.emails.send({
      from: FROM,
      to: recipients,
      subject: `[Demo] ${demoTitle} — ${business.name}`,
      html,
    })

    return NextResponse.json({ ok: true, sent: true, id: result.data?.id, recipients })
  } catch (err: any) {
    console.error('[demo-run] error', err)
    return NextResponse.json({ ok: false, error: err?.message ?? 'unknown' }, { status: 500 })
  }
}

function renderChannelBlock(
  o: { type: string; subject?: string; recipient?: string; channelLabel?: string; body: string; htmlBody?: string },
  n: number,
): string {
  const badge = channelBadge(o.type, o.channelLabel)
  const metaLines: string[] = []
  if (o.recipient) metaLines.push(`<div><strong>To:</strong> ${escapeHtml(o.recipient)}</div>`)
  if (o.subject) metaLines.push(`<div><strong>Subject:</strong> ${escapeHtml(o.subject)}</div>`)

  const bodyHtml = o.htmlBody
    ? o.htmlBody
    : `<div style="white-space:pre-wrap;line-height:1.55">${escapeHtml(o.body)}</div>`

  return `
    <div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-top:12px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <span style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#6c5ce7;font-weight:700">Step ${n}</span>
        <span style="background:#ede9fe;color:#6c5ce7;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600">${badge}</span>
      </div>
      ${metaLines.length ? `<div style="color:#475569;font-size:13px;margin-bottom:10px">${metaLines.join('')}</div>` : ''}
      ${bodyHtml}
    </div>
  `
}

function channelBadge(type: string, label?: string): string {
  if (label) return label
  switch (type) {
    case 'email':
      return 'Email'
    case 'sms':
      return 'SMS'
    case 'dashboard':
      return 'Dashboard alert'
    case 'call-summary':
      return 'Call summary'
    case 'multi-channel':
      return 'Multi-channel'
    default:
      return type
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
