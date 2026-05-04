# STATUS — Zyph Labs v2 Repositioning

**Build date:** 2026-05-04  
**Branch:** v2-repositioning  
**Vercel preview:** https://zyphlabs-website-h8scbykxb-solar-devs-projects.vercel.app  
**Commit:** 75abd2196e18856f19a7be1d50b25c902144560a  

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
