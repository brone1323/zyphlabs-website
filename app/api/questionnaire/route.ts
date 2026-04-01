import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'notifications@zyphlabs.com'
const BRIAN = 'brian@solardev.ca'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData()

    const businessName = (data.get('businessName') as string | null)?.trim() ?? ''
    const contactEmail = (data.get('contactEmail') as string | null)?.trim() ?? ''
    const brandColors = (data.get('brandColors') as string | null)?.trim() ?? ''
    const serviceDescriptions = (data.get('serviceDescriptions') as string | null)?.trim() ?? ''
    const targetArea = (data.get('targetArea') as string | null)?.trim() ?? ''
    const requirements = (data.get('requirements') as string | null)?.trim() ?? ''

    if (!businessName || !contactEmail || !serviceDescriptions || !targetArea) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Build file attachments
    const attachments: { filename: string; content: Buffer }[] = []

    const logo = data.get('logo') as File | null
    if (logo && logo.size > 0) {
      const bytes = await logo.arrayBuffer()
      attachments.push({ filename: logo.name, content: Buffer.from(bytes) })
    }

    const photos = data.getAll('photos') as File[]
    for (const photo of photos) {
      if (photo.size > 0) {
        const bytes = await photo.arrayBuffer()
        attachments.push({ filename: photo.name, content: Buffer.from(bytes) })
      }
    }

    const attachmentNames = attachments.map((a) => a.filename)

    await resend.emails.send({
      from: FROM,
      to: BRIAN,
      subject: `New Onboarding Questionnaire — ${escapeHtml(businessName)}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#2563eb">New Onboarding Questionnaire 📋</h2>
          <table style="border-collapse:collapse;width:100%;max-width:560px">
            <tr><td style="padding:8px 12px;font-weight:600;background:#f1f5f9;width:180px">Business Name</td><td style="padding:8px 12px">${escapeHtml(businessName)}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:600;background:#f1f5f9">Contact Email</td><td style="padding:8px 12px"><a href="mailto:${escapeHtml(contactEmail)}">${escapeHtml(contactEmail)}</a></td></tr>
            <tr><td style="padding:8px 12px;font-weight:600;background:#f1f5f9">Brand Colors</td><td style="padding:8px 12px">${escapeHtml(brandColors || '(not provided)')}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:600;background:#f1f5f9">Target Area</td><td style="padding:8px 12px">${escapeHtml(targetArea)}</td></tr>
          </table>
          <h3 style="margin-top:24px;color:#374151">Services Offered</h3>
          <p style="background:#f9fafb;padding:12px;border-radius:6px;white-space:pre-wrap;margin:0">${escapeHtml(serviceDescriptions)}</p>
          <h3 style="margin-top:24px;color:#374151">Specific Requirements / Notes</h3>
          <p style="background:#f9fafb;padding:12px;border-radius:6px;white-space:pre-wrap;margin:0">${escapeHtml(requirements || '(none provided)')}</p>
          <p style="margin-top:16px;color:#6b7280;font-size:13px">
            ${attachmentNames.length > 0
              ? `${attachmentNames.length} file(s) attached: ${attachmentNames.join(', ')}`
              : 'No files uploaded.'}
          </p>
        </div>
      `,
      attachments,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Questionnaire submission error:', err)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
