// Stateless report URLs: the entire AssessmentAnswers object is base64-encoded
// into the URL's ?data= param. No database required — the report is reconstructed
// deterministically on every request via generateReport().

import type { AssessmentAnswers } from './types'

// Base64url encode (URL-safe — no padding, no + / = in output)
export function encodeAnswers(a: AssessmentAnswers): string {
  const json = JSON.stringify(a)
  const utf8 = new TextEncoder().encode(json)
  let binary = ''
  for (let i = 0; i < utf8.length; i++) binary += String.fromCharCode(utf8[i])
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function decodeAnswers(encoded: string): AssessmentAnswers | null {
  try {
    let b64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    while (b64.length % 4) b64 += '='
    const binary = atob(b64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    const json = new TextDecoder().decode(bytes)
    return JSON.parse(json) as AssessmentAnswers
  } catch {
    return null
  }
}
