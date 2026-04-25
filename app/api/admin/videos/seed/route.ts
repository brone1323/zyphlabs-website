// Admin-only seed endpoint: accepts a raw video body + metadata in headers,
// uploads to Vercel Blob, records in KV manifest. Used by scripts/seed-video-library.mjs
// to bulk-import the 48 pre-rendered MP4s.

import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { addEntry, makeId, adminApiAuthorized } from '@/lib/video-storage'
import type { VideoEntry } from '@/lib/video-storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: Request): Promise<NextResponse> {
  if (!adminApiAuthorized(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const slug = request.headers.get('x-video-slug') || `video-${Date.now()}`
  const title = decodeURIComponent(request.headers.get('x-video-title') || slug)
  const hook = decodeURIComponent(request.headers.get('x-video-hook') || '')
  const industry = request.headers.get('x-video-industry') || 'other'
  const business = decodeURIComponent(request.headers.get('x-video-business') || '')
  const demoSlug = request.headers.get('x-video-demo-slug') || ''

  const buffer = Buffer.from(await request.arrayBuffer())
  if (buffer.length === 0) {
    return NextResponse.json({ error: 'empty body' }, { status: 400 })
  }

  try {
    const blob = await put(`videos/${slug}.mp4`, buffer, {
      access: 'public',
      contentType: 'video/mp4',
      addRandomSuffix: false,
      allowOverwrite: true,
    })

    const entry: VideoEntry = {
      id: makeId(),
      title,
      hook: hook || undefined,
      industry,
      business: business || undefined,
      demoSlug: demoSlug || undefined,
      blobUrl: blob.url,
      pathname: blob.pathname,
      sizeBytes: buffer.length,
      createdAt: Date.now(),
    }
    await addEntry(entry)

    return NextResponse.json({ ok: true, entry })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'upload failed' }, { status: 500 })
  }
}
