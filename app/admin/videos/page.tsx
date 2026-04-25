import { Metadata } from 'next'
import { getManifest, isAdminAuthorized } from '@/lib/video-storage'
import VideoLibrary from './VideoLibrary'

export const metadata: Metadata = {
  title: 'Video Library — Zyph Labs Admin',
  robots: 'noindex, nofollow',
}
export const revalidate = 0

export default async function VideoLibraryPage({
  searchParams,
}: {
  searchParams: { key?: string }
}) {
  if (!isAdminAuthorized(searchParams)) {
    return <LoginGate />
  }

  const entries = await getManifest()
  const adminKey = searchParams.key || ''

  return <VideoLibrary entries={entries} adminKey={adminKey} />
}

function LoginGate() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a14',
        color: '#f0f0ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <form
        method="GET"
        style={{
          maxWidth: 360,
          width: '100%',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14,
          padding: 28,
        }}
      >
        <h1 style={{ fontSize: 22, marginTop: 0, marginBottom: 14 }}>Video Library — admin</h1>
        <p style={{ color: '#8e8eaf', fontSize: 13, marginBottom: 18 }}>
          Enter the admin key to manage your video library.
        </p>
        <input
          name="key"
          type="password"
          placeholder="admin key"
          required
          autoFocus
          style={{
            width: '100%',
            padding: '12px 14px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10,
            color: '#f0f0ff',
            fontSize: 14,
            marginBottom: 16,
          }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px 14px',
            background: 'linear-gradient(135deg,#6c5ce7,#00cec9)',
            border: 'none',
            borderRadius: 10,
            color: 'white',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Unlock
        </button>
      </form>
    </div>
  )
}
