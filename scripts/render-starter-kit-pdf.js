#!/usr/bin/env node
/**
 * render-starter-kit-pdf.js
 *
 * Launches headless Chromium via Playwright, loads /starter-kit-pdf,
 * and renders it to public/zero-payroll-starter-kit.pdf
 *
 * Usage:
 *   node scripts/render-starter-kit-pdf.js [url]
 *
 * Defaults to https://www.zyphlabs.com/starter-kit-pdf
 * Pass http://localhost:3000/starter-kit-pdf to render against local dev server.
 */

const { chromium } = require('playwright')
const path = require('path')

const TARGET_URL = process.argv[2] || 'https://www.zyphlabs.com/starter-kit-pdf'
const OUTPUT_PATH = path.resolve(__dirname, '../public/zero-payroll-starter-kit.pdf')

async function main() {
  console.log(`[render-pdf] Target URL: ${TARGET_URL}`)
  console.log(`[render-pdf] Output:     ${OUTPUT_PATH}`)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  // Letter = 8.5 x 11 inches at 96dpi → 816 x 1056px
  await page.setViewportSize({ width: 816, height: 1056 })

  console.log('[render-pdf] Loading page...')
  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60_000 })

  // Give fonts and styles a moment to settle
  await page.waitForTimeout(2000)

  console.log('[render-pdf] Rendering PDF...')
  await page.pdf({
    path: OUTPUT_PATH,
    format: 'Letter',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  })

  await browser.close()
  console.log(`[render-pdf] Done. PDF saved to: ${OUTPUT_PATH}`)
}

main().catch((err) => {
  console.error('[render-pdf] Error:', err)
  process.exit(1)
})
