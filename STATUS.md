# STATUS — Zyph Labs v2 Repositioning

**Build date:** 2026-05-05 (Round 5 — CTA Collapse + Chat Widget)
**Branch:** v2-repositioning
**Commit:** ecb482a
**Vercel preview:** https://zyphlabs-website-gtmc4vcsh-solar-devs-projects.vercel.app
**Build:** TS clean, 28 pages (signup/questionnaire/portfolio removed), Vercel green

---

## Round 5 — CTA Collapse + Chat Widget (2026-05-05)

### CHANGE 1 — Contact form simplified
- Removed **Subject** field. Form is now: Name / Email / Message.
- Message placeholder: `"What are you trying to fix? We'll get back fast."`
- After successful submit: **"Want answers right now? Chat with Zyph →"** opens the chat widget.

### CHANGE 2 — All CTAs collapsed to Chat widget | Contact modal
Every "Get Started" / "Apply" / "Talk to Us" CTA that previously routed to `/signup` or `/questionnaire` now opens the chat widget (primary) or contact modal (secondary).

Surfaces updated: Hero, Navbar (desktop + mobile), Footer, Pricing tier cards (all 4 + bottom CTA), Services capability pillars (all 4 + bottom CTA), Homepage pricing teaser + final CTA.

**Redirects added to `next.config.js` (302):**
- `/signup` → `/`
- `/signup/:path*` → `/`
- `/questionnaire` → `/`
- `/questionnaire/:path*` → `/`
- `/portfolio` → `/`
- `/portfolio/:path*` → `/`

Pages `app/signup/`, `app/questionnaire/`, `app/portfolio/` deleted.

### CHANGE 3 — Chat widget
New floating chat button (bottom-right, every page). Opens a 400×560 branded panel powered by Claude.

| File | Purpose |
|---|---|
| `components/ChatWidgetProvider.tsx` | Context — `open`, `tier`, `openWidget(tier?)`, `closeWidget()` |
| `components/ChatWidget.tsx` | Floating button + slide-up panel |
| `components/OpenChatButton.tsx` | Client button for use in server components |
| `app/api/chat/route.ts` | POST `/api/chat` — Anthropic API call, 5 msg/IP/60s rate limit, honeypot |
| `app/api/chat/system-prompt.md` | **Editable prompt** — change without redeploy (read at request time) |

**Tier-specific greetings:** clicking a Pricing tier card opens widget pre-contextualized for that tier.

**`ANTHROPIC_API_KEY` setup (BRIAN-FOLLOWUP):**
Vercel → Project → Settings → Environment Variables:
```
Name:  ANTHROPIC_API_KEY
Value: sk-ant-... (your key from console.anthropic.com)
Env:   Production + Preview
```
Until set, widget shows: `"Chat is being set up — please use the contact form below for now."` + Contact button.

**To iterate on the system prompt:** edit `app/api/chat/system-prompt.md` and push — no other code changes needed.

### CHANGE 4 — Portfolio removed
- Navbar: Portfolio link removed.
- Footer: Portfolio link removed.
- `app/portfolio/` deleted.

---

---

## Round 4 — Contact-form modal + pricing bullets + Talk-to-Us reroute (2026-05-05)

### Changes

**CHANGE 1 — Pricing tier bullets** — All 4 tiers (Starter/Pro/Operator/Command) now show 3–4 bullet descriptions on both `/pricing` and homepage pricing section. No `[BRIAN-FOLLOWUP]` placeholders remain for these tiers.

**CHANGE 2 — "Talk to Us" reroute** — Footer "Talk to Us" button, Services capability "Talk to Us →" links (all 4 pillars), Services bottom CTA, Pricing bottom CTA, and self-serve "Need help picking? Talk to us" helpers all open the contact-form modal. Operator + Command tier CTAs (`/questionnaire?tier=operator` / `?tier=command`) **left untouched**.

**CHANGE 3 — Contact-form modal** — `ContactModal` + `ContactModalProvider` added to root layout. Nav gets a "Contact" secondary button. Footer Company column gets "Contact" + "Talk to Us" buttons (mailto kept in bottom bar). Modal: Name/Email/Subject/Message, honeypot, 30s/IP rate-limit, Esc/backdrop/X dismiss, loading state, success auto-close 3s, inline error.

**`/api/contact`** — POST, server-side validation, HTML-escaped Telegram delivery; fallback log+200 when env vars absent so preview works immediately.

### Files changed

- `app/api/contact/route.ts` — new
- `app/layout.tsx` — ContactModalProvider + ContactModal
- `app/page.tsx` — pricing bullets + modal CTAs
- `app/pricing/page.tsx` — pricing bullets + modal CTAs
- `app/services/page.tsx` — modal CTAs
- `components/ContactModal.tsx` — new
- `components/ContactModalProvider.tsx` — new
- `components/OpenContactButton.tsx` — new
- `components/Navbar.tsx` — Contact button
- `components/Footer.tsx` — modal buttons

### BRIAN-FOLLOWUP — Contact form Telegram setup

Form works in preview right now (submissions log to server console). To activate Telegram delivery, Brian needs to:

**Step 1 — Create bot via BotFather**
1. Telegram → search `@BotFather` → `/newbot`
2. Name: e.g. `Zyph Contact Bot`, username: e.g. `ZyphContactBot`
3. BotFather gives a token: `123456789:ABC-DEF...` → that is `TELEGRAM_BOT_TOKEN`

**Step 2 — Get your Chat ID**
1. Send any message to the new bot
2. Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Find `"chat":{"id":XXXXXXXX}` → that number is `TELEGRAM_CHAT_ID`

**Step 3 — Set Vercel env vars**
In Vercel dashboard → Settings → Environment Variables:

| Variable | Example |
|---|---|
| `TELEGRAM_BOT_TOKEN` | `123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11` |
| `TELEGRAM_CHAT_ID` | `987654321` (your personal or group ID) |

Set both on All Environments (or Production + Preview minimum).

**What the message looks like:**
```
📨 New Zyph contact-form submission

From: Jane Smith <jane@example.com>
Subject: Interested in OpenClaw Operator

Hi, I run a 10-person plumbing company and want to learn more...
```

---

## Previous builds

**Build date:** 2026-05-04  
**Branch:** v2-repositioning  
**Vercel preview:** https://zyphlabs-website-h8scbykxb-solar-devs-projects.vercel.app  
**Commit:** 75abd2196e18856f19a7be1d50b25c902144560a  

---

## Round 2 (2026-05-04)

**Preview:** https://zyphlabs-website-ew2k2qbqh-solar-devs-projects.vercel.app  
**Commit:** 5ba94d9 — Revise round 1: hero copy, 9-role two-column org chart, status badge cleanup, Content Creator/Bespoke Agent removal

### Blockers addressed

1. **HERO COPY** — H1 replaced verbatim: "Run your business on an AI Company." Subhead: "An executive team to decide. An office team to do the work. You run the company." Eyebrow was already correct. Price anchor "Starts at $129/mo." added. CTA labels untouched.

2. **MEET YOUR AI COMPANY SECTION** — Restructured from 6-role flat grid to 9-role two-column split. Executive Team (PROJECT RUNNER/COO, STRATEGIST/CSO, FINANCIAL ANALYST/CFO, KNOWLEDGE EXPERT/CKO) on left with header "EXECUTIVE TEAM — they decide". Office Team (EMAIL OFFICER, CRM OPERATOR, BOOKKEEPER, RECRUITER, CUSTOMER SUPPORT) on right with header "OFFICE TEAM — they do the work". Content Creator and Bespoke Agent removed from homepage org chart, services examples, and pricing comparison table. No status badges on org-chart cards.

3. **STATUS COPY** — "Launching this week" removed from Project Runner homepage Feature Callout section and from /project-runner page hero. "Free Tool · Launching This Week" retained on Proposal Drafter callout card. Audit complete — no other status badges found on role/agent cards.

4. **KILL-SHOT** — Verified present verbatim in FAQ section of /project-runner. Current text includes the locked string plus construction-specific context from the locked plan. No change needed.

**Build:** ✓ 0 TS errors, 36 pages, Vercel build success.  
**Hold for Brian re-approval before promoting to production.**

---

## DONE

- **Homepage `/`** — Hero repositioned to "AI executive team" framing (verbatim copy from brief). New sections: Meet Your AI Executive Team (6 role cards), Project Runner callout, Pricing Teaser (4 tiers, "Contact for pricing"), free tool callout, new final CTA. Primary CTA = "Start My Free Assessment" → /questionnaire. Secondary CTAs: "See Project Runner" and "View Pricing".
- **`/project-runner`** — New page. Hero with tagline "quit typing and run these projects", 6 feature blocks, 2-tier pricing cards (both "Contact for pricing"), FAQ (4 questions, [BRIAN-CONFIRM] on kill shot), CTA. Previously 404.
- **`/project_runner`** — 308 redirect to `/project-runner` via next.config.js.
- **`/pricing`** — New page. 4 tier cards with feature lists, comparison table, "Contact for pricing" on all tiers, [BRIAN-CONFIRM] notes, bottom CTA.
- **`/tools/proposal-drafter`** — Placeholder page. Email waitlist capture form, "Launching this week" badge, how-it-works preview, Project Runner connection callout.
- **`/api/waitlist/proposal-drafter`** — POST endpoint. Lazy Resend init (graceful degradation without RESEND_API_KEY). Needs `RESEND_AUDIENCE_ID_PROPOSAL_DRAFTER` env var in Vercel settings when Brian is ready to activate.
- **`/services`** — New index page. 4 capability pillars reframed as executive team roles (AI Agents = Communicators, Workflow Automation = Operations Engine, Digital Workers = Always-on Contributors, Bespoke AI = Built for One Job). Industry niche grid preserved.
- **Navbar** — Updated: Project Runner, Pricing, Services, How It Works, Portfolio. CTA = "Free Assessment" → /questionnaire.
- **Footer** — Updated: Products column (Project Runner, Pricing, Proposal Drafter, Services). Company column (How It Works, Portfolio, Free Assessment, Contact).
- **Build** — TypeScript: 0 errors. All 35 pages compiled. Vercel build: ✅ success.
- **No regressions** — /admin, /checkout, /api/* (existing), /questionnaire, all service niche pages untouched.

## PARTIAL

- **Resend email capture** — API route exists and returns 200, but actual Resend contact creation requires `RESEND_API_KEY` and `RESEND_AUDIENCE_ID_PROPOSAL_DRAFTER` to be set in Vercel env vars. The list `proposal-drafter-waitlist` needs to be created in Resend dashboard first.

## FAKED

- Nothing faked — all placeholders are honest "Contact for pricing" and [BRIAN-CONFIRM] markers.

## [BRIAN-CONFIRM] ITEMS (needed before go-live)

1. **Pricing numbers** — All 4 tiers show "Contact for pricing". Lock at 8 AM meeting.
2. **Agent roster status** — Homepage team section has a disclaimer: "which agents are actually shippable today vs. aspirational needs a truth pass." EMAIL OFFICER, CRM OPERATOR, STRATEGIST, CONTENT CREATOR all show "Available now" — confirm this.
3. **Project Runner kill shot** — FAQ item "How is this different from Buildertrend/Jobber/Procore?" shows placeholder text. Brian to provide the single-line differentiator.
4. **Hero copy** — Using the primary copy ("Your business deserves an executive team. Now you can afford one."). If Brian prefers backup ("Stop hiring staff. Deploy an AI executive team."), swap the Hero component.

## NEXT

- Swap in final pricing numbers once locked
- Wire up Resend audience (create `proposal-drafter-waitlist` in Resend, add env vars to Vercel)
- Add Project Runner kill shot to FAQ
- Full proposal drafter tool (separate build plan, ~2-5 days)
- Partner program page for fractional CFOs (D4 from decision log)

## GOTCHAS

- Local `npm run build` hits OOM during "Collecting build traces" on Brian's Windows machine. Fixed by adding `cross-env NODE_OPTIONS=--max-old-space-size=4096` to build script. Vercel builds fine (they have more memory). Don't remove cross-env from package.json.
- Resend v6 instantiates at module load — must use lazy `await import('resend')` inside the request handler, not at top level, or it crashes the build without an API key.
- The `/services` route had no index page before this PR (existing nav never linked to `/services` directly — only to `/services/<niche>`). The new page is additive; existing niche pages untouched.
- Local `npm run lint` is interactive (asks for ESLint setup) — hasn't been configured. Vercel ran its own type check which passed.
