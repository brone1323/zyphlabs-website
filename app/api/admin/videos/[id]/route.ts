import { NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import { removeEntry, patchEntry, adminApiAuthorized } from '@/lib/video-storage'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  if (!adminApiAuthorized(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const removed = await removeEntry(params.id)
  if (!removed) return NextResponse.json({ error: 'not found' }, { status: 404 })

  // Best-effort blob cleanup
  try {
    await del(removed.blobUrl)
  } catch (e) {
    console.warn('[videos] blob delete failed:', e)
  }

  return NextResponse.json({ ok: true, removed })
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  if (!adminApiAuthorized(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const patch = await request.json().catch(() => ({}))
  const allowedKeys: (keyof typeof patch)[] = ['title', 'hook', 'industry', 'business', 'demoSlug']
  const filtered: any = {}
  for (const k of allowedKeys) if (patch[k] !== undefined) filtered[k] = patch[k]
  const updated = await patchEntry(params.id, filtered)
  if (!updated) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json({ ok: true, entry: updated })
}
