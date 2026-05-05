'use client'

import { useEffect } from 'react'

export default function GlobalReveal() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-revealed', '')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    document.querySelectorAll('[data-reveal]').forEach((el) => {
      if (mq.matches) {
        el.setAttribute('data-revealed', '')
      } else {
        observer.observe(el)
      }
    })

    return () => observer.disconnect()
  }, [])

  return null
}
