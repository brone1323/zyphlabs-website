// Video library storage layer.
// - Files (MP4s) live in Vercel Blob.
// - Metadata (industry, hook, slug, business name, blob URL) lives in
//   Vercel KV under the key "videos:manifest".
//
// Manifest entry:
//   {
//     id: string,             // unique id per video
//     title: string,          // display name
//     hook?: string,          // hook line shown in caption
//     industry: string,       // construction | appointment | retail | etc.
//     business?: string,      // fictional business this video uses
//     demoSlug?: string,      // if linked to a /demos/[slug] page
//     blobUrl: string,        // public URL of the MP4 in Vercel Blob
//     pathname: string,       // blob pathname (for delete)
//     sizeBytes: number,
//     createdAt: number,      // unix ms
//   }

import { kvPipeline, kvConfigured } from './kv'

const MANIFEST_KEY = 'videos:manifest'

export interface VideoEntry {
  id: string
  title: string
  hook?: string
  industry: string
  business?: string
  demoSlug?: string
  blobUrl: string
  pathname: string
  sizeBytes: number
  createdAt: number
}

export async function getManifest(): Promise<VideoEntry[]> {
  if (!kvConfigured()) return []
  const [json] = await kvPipeline([['GET', MANIFEST_KEY]])
  if (!json) return []
  try {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function setManifest(entries: VideoEntry[]): Promise<void> {
  await kvPipeline([['SET', MANIFEST_KEY, JSON.stringify(entries)]])
}

export async function addEntry(entry: VideoEntry): Promise<void> {
  const entries = await getManifest()
  // Replace if same id, else append
  const idx = entries.findIndex((e) => e.id === entry.id)
  if (idx >= 0) entries[idx] = entry
  else entries.unshift(entry)
  await setManifest(entries)
}

export async function removeEntry(id: string): Promise<VideoEntry | null> {
  const entries = await getManifest()
  const idx = entries.findIndex((e) => e.id === id)
  if (idx < 0) return null
  const [removed] = entries.splice(idx, 1)
  await setManifest(entries)
  return removed
}

export async function patchEntry(id: string, patch: Partial<VideoEntry>): Promise<VideoEntry | null> {
  const entries = await getManifest()
  const idx = entries.findIndex((e) => e.id === id)
  if (idx < 0) return null
  entries[idx] = { ...entries[idx], ...patch, id: entries[idx].id }
  await setManifest(entries)
  return entries[idx]
}

export function makeId(): string {
  return `vid_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export const INDUSTRIES = [
  'construction',
  'appointment',
  'retail',
  'ecommerce',
  'professional',
  'saas',
  'field',
  'creative',
  'other',
] as const

export function isAdminAuthorized(searchParams: { key?: string }): boolean {
  const secret = process.env.ANALYTICS_SECRET
  if (!secret) return true // dev mode: no secret = open
  return searchParams.key === secret
}

export function adminApiAuthorized(req: Request): boolean {
  const secret = process.env.ANALYTICS_SECRET
  if (!secret) return true
  const auth = req.headers.get('authorization') || ''
  if (auth === `Bearer ${secret}`) return true
  // Also accept ?key= in URL for browser fetch convenience
  const url = new URL(req.url)
  if (url.searchParams.get('key') === secret) return true
  return false
}
