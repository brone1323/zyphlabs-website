import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

// Legacy path — now just redirects to the unified booking flow.
export default function Tier1SetupRedirect() {
  redirect('/book/setup')
}
