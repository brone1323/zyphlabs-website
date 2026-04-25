'use client'

import { useState, useMemo, useRef } from 'react'
import { upload } from '@vercel/blob/client'
import type { VideoEntry } from '@/lib/video-storage'

interface Props {
  entries: VideoEntry[]
  adminKey: string
}

const INDUSTRIES = [
  { value: 'construction', label: 'Construction', color: '#f59e0b' },
  { value: 'appointment', label: 'Appointment', color: '#10b981' },
  { value: 'retail', label: 'Retail', color: '#ec4899' },
  { value: 'ecommerce', label: 'E-commerce', color: '#8b5cf6' },
  { value: 'professional', label: 'Pro Services', color: '#0ea5e9' },
  { value: 'saas', label: 'B2B SaaS', color: '#06b6d4' },
  { value: 'field', label: 'Field Services', color: '#ef4444' },
  { value: 'creative', label: 'Creative', color: '#a855f7' },
  { value: 'other', label: 'Other', color: '#9ca3af' },
]

export default function VideoLibrary({ entries: initial, adminKey }: Props) {
  const [entries, setEntries] = useState<VideoEntry[]>(initial)
  const [filter, setFilter] = useState<string>('all')
  const [showUpload, setShowUpload] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = entries
    if (filter !== 'all') list = list.filter((e) => e.industry === filter)
    if (search.trim()) {
      const s = search.toLowerCase()
      list = list.filter(
        (e) =>
          (e.title || '').toLowerCase().includes(s) ||
          (e.hook || '').toLowerCase().includes(s) ||
          (e.business || '').toLowerCase().includes(s),
      )
    }
    return list
  }, [entries, filter, search])

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: entries.length }
    for (const e of entries) m[e.industry] = (m[e.industry] || 0) + 1
    return m
  }, [entries])

  const removeOne = async (id: string) => {
    if (!confirm('Delete this video?')) return
    const r = await fetch(`/api/admin/videos/${id}${adminKey ? `?key=${adminKey}` : ''}`, {
      method: 'DELETE',
    })
    if (r.ok) setEntries((es) => es.filter((e) => e.id !== id))
    else alert('Failed to delete')
  }

  const refresh = async () => {
    const r = await fetch(`/api/admin/videos/list${adminKey ? `?key=${adminKey}` : ''}`)
    const j = await r.json()
    if (j.entries) setEntries(j.entries)
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0a0a14',
        color: '#f0f0ff',
        padding: '32px 28px 80px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <h1 style={{ fontSize: 28, margin: 0, fontWeight: 700 }}>Video Library</h1>
            <div style={{ color: '#8e8eaf', fontSize: 14, marginTop: 4 }}>
              {entries.length} video{entries.length !== 1 ? 's' : ''} · admin only
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="search"
              placeholder="search title, hook, business…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                color: '#f0f0ff',
                fontSize: 14,
                width: 240,
              }}
            />
            <button
              onClick={() => setShowUpload(true)}
              style={{
                padding: '10px 22px',
                background: 'linear-gradient(135deg,#6c5ce7,#00cec9)',
                border: 'none',
                borderRadius: 10,
                color: 'white',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              + Upload
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          <Chip
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            color="#a29bfe"
            label={`All (${counts.all || 0})`}
          />
          {INDUSTRIES.map((i) => (
            <Chip
              key={i.value}
              active={filter === i.value}
              onClick={() => setFilter(i.value)}
              color={i.color}
              label={`${i.label} (${counts[i.value] || 0})`}
            />
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 20px',
              color: '#8e8eaf',
              border: '1px dashed rgba(255,255,255,0.1)',
              borderRadius: 14,
            }}
          >
            {entries.length === 0 ? (
              <>
                <div style={{ fontSize: 18, marginBottom: 6 }}>No videos yet.</div>
                <div style={{ fontSize: 14 }}>Click + Upload to add your first.</div>
              </>
            ) : (
              <div style={{ fontSize: 14 }}>No videos match this filter.</div>
            )}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 18,
            }}
          >
            {filtered.map((v) => (
              <VideoCard key={v.id} entry={v} onDelete={() => removeOne(v.id)} adminKey={adminKey} />
            ))}
          </div>
        )}
      </div>

      {showUpload && (
        <UploadModal
          adminKey={adminKey}
          onClose={() => setShowUpload(false)}
          onUploaded={() => {
            setShowUpload(false)
            refresh()
          }}
        />
      )}
    </main>
  )
}

function Chip({
  active,
  onClick,
  color,
  label,
}: {
  active: boolean
  onClick: () => void
  color: string
  label: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        background: active ? `${color}26` : 'transparent',
        border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 999,
        color: active ? '#fff' : '#8e8eaf',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}

function VideoCard({
  entry,
  onDelete,
  adminKey,
}: {
  entry: VideoEntry
  onDelete: () => void
  adminKey: string
}) {
  const [hover, setHover] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const meta = INDUSTRIES.find((i) => i.value === entry.industry) || INDUSTRIES[INDUSTRIES.length - 1]

  return (
    <div
      onMouseEnter={() => {
        setHover(true)
        videoRef.current?.play().catch(() => {})
      }}
      onMouseLeave={() => {
        setHover(false)
        if (videoRef.current) {
          videoRef.current.pause()
          videoRef.current.currentTime = 0
        }
      }}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${hover ? meta.color : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 14,
        overflow: 'hidden',
        transition: 'border-color 0.15s',
      }}
    >
      <div
        style={{
          aspectRatio: '9/16',
          background: '#000',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <video
          ref={videoRef}
          src={entry.blobUrl}
          muted
          playsInline
          loop
          preload="metadata"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <span
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            padding: '4px 10px',
            background: `${meta.color}cc`,
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            borderRadius: 999,
          }}
        >
          {meta.label}
        </span>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>
          {entry.title || '(untitled)'}
        </div>
        {entry.hook && (
          <div style={{ fontSize: 12, color: '#8e8eaf', marginBottom: 8, lineHeight: 1.4 }}>
            {entry.hook}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11,
            color: '#6e6e93',
            marginBottom: 10,
          }}
        >
          <span>{(entry.sizeBytes / 1024 / 1024).toFixed(1)}MB</span>
          <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <a
            href={entry.blobUrl}
            target="_blank"
            rel="noreferrer"
            style={btnStyle()}
            onClick={(e) => e.stopPropagation()}
          >
            ↓ Download
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(entry.blobUrl)
              alert('URL copied!')
            }}
            style={btnStyle()}
          >
            📋 Link
          </button>
          <button onClick={onDelete} style={{ ...btnStyle(), color: '#fca5a5' }}>
            🗑
          </button>
        </div>
      </div>
    </div>
  )
}

function btnStyle(): React.CSSProperties {
  return {
    flex: 1,
    padding: '6px 10px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    color: '#c8c8e0',
    fontSize: 11,
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    fontWeight: 500,
  }
}

function UploadModal({
  adminKey,
  onClose,
  onUploaded,
}: {
  adminKey: string
  onClose: () => void
  onUploaded: () => void
}) {
  const [files, setFiles] = useState<File[]>([])
  const [title, setTitle] = useState('')
  const [hook, setHook] = useState('')
  const [industry, setIndustry] = useState('other')
  const [business, setBusiness] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<string>('')
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = (newFiles: FileList | File[] | null) => {
    if (!newFiles) return
    const arr = Array.from(newFiles).filter((f) => f.type.startsWith('video/'))
    setFiles(arr)
    if (arr.length === 1 && !title) {
      setTitle(arr[0].name.replace(/\.[^.]+$/, ''))
    }
  }

  const doUpload = async () => {
    if (!files.length) return
    setUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const f = files[i]
        const itemTitle = files.length > 1 ? f.name.replace(/\.[^.]+$/, '') : title || f.name
        setProgress(`Uploading ${i + 1}/${files.length}: ${itemTitle}…`)
        await upload(`videos/${Date.now()}-${f.name}`, f, {
          access: 'public',
          handleUploadUrl: `/api/admin/videos/upload${adminKey ? `?key=${adminKey}` : ''}`,
          clientPayload: JSON.stringify({
            title: itemTitle,
            hook,
            industry,
            business,
          }),
        })
      }
      setProgress('All uploaded ✓')
      setTimeout(() => onUploaded(), 600)
    } catch (e: any) {
      setProgress(`Error: ${e?.message || 'upload failed'}`)
      setUploading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#14142a',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14,
          padding: 28,
          width: '100%',
          maxWidth: 520,
          color: '#f0f0ff',
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 20 }}>Upload videos</h2>

        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            handleFiles(e.dataTransfer.files)
          }}
          style={{
            border: `2px dashed ${dragOver ? '#6c5ce7' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: 12,
            padding: 28,
            textAlign: 'center',
            background: dragOver ? 'rgba(108,92,231,0.08)' : 'transparent',
            cursor: 'pointer',
            marginBottom: 18,
          }}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept="video/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFiles(e.target.files)}
          />
          {files.length === 0 ? (
            <>
              <div style={{ fontSize: 14, color: '#8e8eaf', marginBottom: 6 }}>
                Drag & drop video files here
              </div>
              <div style={{ fontSize: 12, color: '#6e6e93' }}>or click to browse · MP4 / WebM up to 200MB</div>
            </>
          ) : (
            <div style={{ fontSize: 13, color: '#c8c8e0' }}>
              {files.length} file{files.length > 1 ? 's' : ''} selected
              <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none', fontSize: 11, color: '#8e8eaf' }}>
                {files.slice(0, 3).map((f, i) => (
                  <li key={i}>· {f.name} ({(f.size / 1024 / 1024).toFixed(1)}MB)</li>
                ))}
                {files.length > 3 && <li>... and {files.length - 3} more</li>}
              </ul>
            </div>
          )}
        </div>

        {files.length === 1 && (
          <Field label="Title" value={title} onChange={setTitle} placeholder="e.g. AI Receptionist · Henderson HVAC" />
        )}
        {files.length > 1 && (
          <div style={{ fontSize: 12, color: '#8e8eaf', marginBottom: 14 }}>
            Multiple files — title will be set from each filename. Hook + industry + business apply to all.
          </div>
        )}
        <Field label="Hook caption (optional)" value={hook} onChange={setHook} placeholder='e.g. "Your phone rings at 11pm. Watch what happens."' />
        <FieldSelect
          label="Industry"
          value={industry}
          onChange={setIndustry}
          options={INDUSTRIES.map((i) => ({ value: i.value, label: i.label }))}
        />
        <Field label="Fictional business (optional)" value={business} onChange={setBusiness} placeholder="e.g. Henderson HVAC" />

        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button onClick={onClose} disabled={uploading} style={cancelBtn}>
            Cancel
          </button>
          <button
            onClick={doUpload}
            disabled={uploading || files.length === 0}
            style={{
              ...primaryBtn,
              opacity: uploading || files.length === 0 ? 0.6 : 1,
              cursor: uploading || files.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            {uploading ? 'Uploading…' : `Upload ${files.length || ''}`}
          </button>
        </div>

        {progress && (
          <div style={{ marginTop: 14, fontSize: 12, color: '#a29bfe', textAlign: 'center' }}>{progress}</div>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={fieldLabel}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={fieldInput}
      />
    </div>
  )
}

function FieldSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={fieldLabel}>{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={fieldInput}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

const fieldLabel: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: 1,
  textTransform: 'uppercase',
  color: '#8e8eaf',
  marginBottom: 4,
  fontWeight: 600,
}
const fieldInput: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  color: '#f0f0ff',
  fontSize: 14,
  fontFamily: 'inherit',
}
const primaryBtn: React.CSSProperties = {
  flex: 1,
  padding: '10px 16px',
  background: 'linear-gradient(135deg,#6c5ce7,#00cec9)',
  border: 'none',
  borderRadius: 10,
  color: 'white',
  fontWeight: 600,
  fontSize: 14,
}
const cancelBtn: React.CSSProperties = {
  flex: 1,
  padding: '10px 16px',
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 10,
  color: '#c8c8e0',
  fontSize: 14,
  cursor: 'pointer',
}
