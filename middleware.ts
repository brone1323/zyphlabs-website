import { NextRequest, NextResponse } from 'next/server'

const WALKTHROUGH_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Project Runner — Quit typing. Run the work. | Zyph Labs</title>
<meta name="description" content="AI Project Runner walkthrough — propose, schedule, invoice without lifting a finger."/>
<style>html,body{margin:0;padding:0;background:#0a0a0a;height:100%}</style>
</head>
<body>
<iframe
  src="https://project-runner-tau.vercel.app/demo/walkthrough"
  style="position:fixed;inset:0;width:100vw;height:100vh;border:0;display:block"
  title="Project Runner walkthrough"
></iframe>
</body>
</html>`

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/project-runner') {
    return new NextResponse(WALKTHROUGH_HTML, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    })
  }
}

export const config = {
  matcher: ['/project-runner'],
}
