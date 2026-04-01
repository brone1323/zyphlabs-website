import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'notifications@zyphlabs.com'
const BRIAN = 'brian@solardev.ca'

function formatAmount(cents: number | null): string {
  if (cents == null) return 'N/A'
  return `$${(cents / 100).toFixed(2)} CAD`
}

// ── Brian alert: new sale ────────────────────────────────────────────────────

export async function sendNewSaleAlert(params: {
  customerEmail: string | null | undefined
  niche: string | undefined
  tier: string | undefined
  hostingPlan: string | undefined
  amountTotal: number | null
}) {
  const { customerEmail, niche, tier, hostingPlan, amountTotal } = params

  await resend.emails.send({
    from: FROM,
    to: BRIAN,
    subject: `New Sale! ${niche ?? 'Unknown'} — ${tier ?? ''} (${formatAmount(amountTotal)})`,
    html: `
      <h2 style="color:#2563eb">New Sale on Zyph Labs 🎉</h2>
      <table style="border-collapse:collapse;width:100%;max-width:480px">
        <tr><td style="padding:6px 12px;font-weight:600;background:#f1f5f9">Customer</td><td style="padding:6px 12px">${customerEmail ?? 'N/A'}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;background:#f1f5f9">Niche</td><td style="padding:6px 12px">${niche ?? 'N/A'}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;background:#f1f5f9">Tier</td><td style="padding:6px 12px">${tier ?? 'N/A'}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;background:#f1f5f9">Hosting Plan</td><td style="padding:6px 12px">${hostingPlan ?? 'N/A'}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;background:#f1f5f9">Amount Paid</td><td style="padding:6px 12px;font-weight:700;color:#16a34a">${formatAmount(amountTotal)}</td></tr>
      </table>
      <p style="color:#64748b;font-size:13px;margin-top:16px">Log in to Stripe to view the full session.</p>
    `,
  })
}

// ── Brian alert: payment failed ──────────────────────────────────────────────

export async function sendPaymentFailedAlert(params: {
  customerEmail: string | null | undefined
  customerId: string | null
  invoiceId: string
  attemptCount: number | null
}) {
  const { customerEmail, customerId, invoiceId, attemptCount } = params

  await resend.emails.send({
    from: FROM,
    to: BRIAN,
    subject: `Payment Failed — ${customerEmail ?? customerId ?? invoiceId}`,
    html: `
      <h2 style="color:#dc2626">Payment Failed</h2>
      <table style="border-collapse:collapse;width:100%;max-width:480px">
        <tr><td style="padding:6px 12px;font-weight:600;background:#f1f5f9">Customer Email</td><td style="padding:6px 12px">${customerEmail ?? 'N/A'}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;background:#f1f5f9">Customer ID</td><td style="padding:6px 12px">${customerId ?? 'N/A'}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;background:#f1f5f9">Invoice ID</td><td style="padding:6px 12px">${invoiceId}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;background:#f1f5f9">Attempt #</td><td style="padding:6px 12px">${attemptCount ?? 1}</td></tr>
      </table>
      <p style="color:#64748b;font-size:13px;margin-top:16px">Stripe will retry automatically. You may want to reach out to the customer directly.</p>
    `,
  })
}

// ── Brian alert: subscription cancelled ─────────────────────────────────────

export async function sendCancellationAlert(params: {
  customerId: string | null
  subscriptionId: string
  niche: string | undefined
  customerEmail?: string | null
}) {
  const { customerId, subscriptionId, niche, customerEmail } = params

  await resend.emails.send({
    from: FROM,
    to: BRIAN,
    subject: `Customer Cancelled — ${customerEmail ?? customerId ?? subscriptionId}`,
    html: `
      <h2 style="color:#9333ea">Subscription Cancelled</h2>
      <table style="border-collapse:collapse;width:100%;max-width:480px">
        <tr><td style="padding:6px 12px;font-weight:600;background:#f1f5f9">Customer Email</td><td style="padding:6px 12px">${customerEmail ?? 'N/A'}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;background:#f1f5f9">Customer ID</td><td style="padding:6px 12px">${customerId ?? 'N/A'}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;background:#f1f5f9">Subscription ID</td><td style="padding:6px 12px">${subscriptionId}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;background:#f1f5f9">Niche</td><td style="padding:6px 12px">${niche ?? 'N/A'}</td></tr>
      </table>
      <p style="color:#64748b;font-size:13px;margin-top:16px">Begin offboarding: deliver site files and update the client record.</p>
    `,
  })
}

// ── Customer: welcome email ──────────────────────────────────────────────────

export async function sendWelcomeEmail(params: {
  to: string
  niche: string | undefined
  tier: string | undefined
  hostingPlan: string | undefined
}) {
  const { to, niche, tier, hostingPlan } = params

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Welcome to Zyph Labs — your website is on its way!`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <h1 style="color:#2563eb">Welcome to Zyph Labs!</h1>
        <p>Hi there,</p>
        <p>Thank you for your order — we're excited to build your new website.</p>
        <h3 style="margin-top:24px">Your order summary</h3>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:6px 12px;font-weight:600;background:#f1f5f9">Niche</td><td style="padding:6px 12px">${niche ?? 'N/A'}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:600;background:#f1f5f9">Package</td><td style="padding:6px 12px">${tier ?? 'N/A'}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:600;background:#f1f5f9">Hosting Plan</td><td style="padding:6px 12px">${hostingPlan ?? 'N/A'}</td></tr>
        </table>
        <h3 style="margin-top:24px">What happens next?</h3>
        <ol style="padding-left:20px;line-height:1.8">
          <li>Brian will reach out within <strong>1 business day</strong> to kick off onboarding.</li>
          <li>We'll collect your branding, content, and preferences.</li>
          <li>Your site will be live within the agreed turnaround window.</li>
        </ol>
        <p style="margin-top:24px">Questions? Reply to this email or reach us at <a href="mailto:contact@zyphlabs.com">contact@zyphlabs.com</a>.</p>
        <p style="color:#64748b;font-size:13px;margin-top:32px">— The Zyph Labs Team</p>
      </div>
    `,
  })
}
