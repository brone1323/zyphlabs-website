import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Project Runner — Zyph Labs',
  description:
    'Project Runner — quit typing, just run these projects. A live demo of the Zyph Labs Company Brain workspace.',
}

export default function ProjectRunnerPage() {
  return (
    <div
      style={{
        width: '100%',
        height: 'calc(100vh - 64px)',
        minHeight: 720,
        background: '#0b1220',
      }}
    >
      <iframe
        src="/project-runner.html"
        title="Project Runner — Zyph Labs Company Brain"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
          background: '#0b1220',
        }}
        loading="eager"
      />
    </div>
  )
}
