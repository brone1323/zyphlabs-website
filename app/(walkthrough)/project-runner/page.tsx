export const metadata = {
  title: 'Project Runner — Quit typing. Run the work. | Zyph Labs',
  description: 'AI Project Runner walkthrough — propose, schedule, invoice without lifting a finger.',
}

export default function PRPage() {
  return (
    <iframe
      src="https://project-runner-tau.vercel.app/demo/walkthrough"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        border: 0,
        display: 'block',
      }}
      title="Project Runner walkthrough"
    />
  )
}
