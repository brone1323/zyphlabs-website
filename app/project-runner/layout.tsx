export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`html, body { overflow: hidden; }`}</style>
      {children}
    </>
  )
}
