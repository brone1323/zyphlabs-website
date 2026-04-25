import { NextResponse } from 'next/server'
import { getManifest, adminApiAuthorized } from '@/lib/video-storage'

export const revalidate = 0

export async function GET(request: Request): Promise<NextResponse> {
  if (!adminApiAuthorized(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const entries = await getManifest()
  return NextResponse.json({ entries })
}
