'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="hidden md:inline text-slate-500 hover:text-slate-900 transition-colors text-sm"
    >
      Print / PDF
    </button>
  )
}
