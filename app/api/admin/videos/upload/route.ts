import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { addEntry, makeId, adminApiAuthorized } from '@/lib/video-storage'
import type { VideoEntry } from '@/lib/video-storage'

// Vercel Blob "client upload" — the browser uploads directly to Blob,
// the server only signs the upload URL and records metadata after.
// Bypasses the Vercel serverless 4.5MB body limit.

export async function POST(request: Request): Promise<NextResponse> {
  if (!adminApiAuthorized(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = (await request.json()) as HandleUploadBody

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const meta = clientPayload ? JSON.parse(clientPayload) : {}
        return {
          allowedContentTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
          maximumSizeInBytes: 200 * 1024 * 1024, // 200MB cap
          tokenPayload: JSON.stringify({
            title: meta.title || pathname,
            hook: meta.hook,
            industry: meta.industry || 'other',
            business: meta.business,
            demoSlug: meta.demoSlug,
          }),
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // After the browser finishes uploading to Blob, this fires.
        // Record metadata in KV.
        const meta = tokenPayload ? JSON.parse(tokenPayload) : {}
        const entry: VideoEntry = {
          id: makeId(),
          title: meta.title || blob.pathname,
          hook: meta.hook,
          industry: meta.industry || 'other',
          business: meta.business,
          demoSlug: meta.demoSlug,
          blobUrl: blob.url,
          pathname: blob.pathname,
          sizeBytes: blob.size || 0,
          createdAt: Date.now(),
        }
        await addEntry(entry)
      },
    })

    return NextResponse.json(json)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'upload failed' }, { status: 400 })
  }
}
