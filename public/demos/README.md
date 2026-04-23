# Zyph Labs — AI Tool Demos

45 animated pipeline demos across 6 industries, each visualizing how a specific AI tool or the full "Brain" system works. Built to be displayed inside the post-assessment results flow as clickable buttons/modals that reveal the animation.

## What's in here

```
zyph-demos/
├── field-services/          (10 files: 9 tools + The Brain)
├── appointment/             (7 files: 6 tools + The Brain)
├── retail/                  (7 files: 6 tools + The Brain)
├── ecommerce/               (7 files: 6 tools + The Brain)
├── professional-services/   (7 files: 6 tools + The Brain)
└── creative/                (7 files: 6 tools + The Brain)
```

**45 files total.** Each is a self-contained HTML file — no external dependencies, no CDN, no fonts to load, no JS libraries. Just HTML + inline CSS + inline SVG. Drop them anywhere.

## File naming pattern

`{industry}-{number}-{tool-name}.html`

- `1` through `6` (or `9` for field-services): individual AI tool demos
- Last number (`7` for most, `10` for field-services): "The Brain" — the full Tier 3 system visualization

Examples:
- `appt-1-booking-concierge.html` → AI Booking Concierge (Appointment-based, Tier 2)
- `appt-7-the-brain.html` → The Brain (Appointment-based, Tier 3)
- `field-10-the-brain.html` → The Brain (Field Services, Tier 3)

## Integration options

### Option 1: Modal / popup on button click (recommended)

When the assessment finishes and you show the Tier 2 menu and Tier 3 card, each card has a "See how it works" button. Clicking it opens a modal/lightbox with the demo inside an iframe.

```html
<button onclick="openDemoModal('/demos/field-services/field-1-task-tracker.html')">
  See how it works
</button>

<!-- Modal markup -->
<div id="demoModal" class="modal">
  <iframe id="demoFrame" src="" frameborder="0"></iframe>
  <button onclick="closeDemoModal()">Close</button>
</div>
```

### Option 2: Inline expansion

The tool card expands inline and embeds the demo via iframe.

### Option 3: Standalone pages

Each demo lives at its own URL (e.g., `zyphlabs.com/demos/field-services/task-tracker`) and the assessment results link out to them. Simplest for SEO but breaks the assessment flow.

**Recommended: Option 1.** Keeps the buyer in the results flow while letting them explore each tool visually.

## Technical notes

- Each file is ~10-20KB, loads instantly
- Animations are pure CSS + SVG, hardware-accelerated
- Works on all modern browsers (Safari, Chrome, Firefox, Edge)
- Mobile-responsive — the Brain demos stack their scenarios in a single column on narrow screens
- **No external resources** — safe to serve from any static host (S3, Cloudflare Pages, Vercel, WordPress uploads folder, etc.)

## Mapping assessment → demos

The intended logic after an assessment:

1. Determine the buyer's industry (one of 6).
2. Load the Tier 2 menu of 6 tools (or 9 for field-services), filtered down to 2-4 most relevant based on assessment pain signals.
3. Each relevant tool card has a "See how it works" button → opens that industry's demo file.
4. The "Full System" / Tier 3 card has the same button → opens that industry's Brain demo.

## Consistency across all demos

Every file carries the same brand line in the header:
> *Automated information transfer — so your people can be far more effective.*

Every tool demo uses the same pipeline structure (inputs → AI core → outputs) with flowing animated packets. The Brain demos are larger, showing the full ecosystem with tools, roles, and 4 animated real-world scenarios.

## Things worth customizing before launch

1. **Live conversation dialogue** on tools that talk to callers/clients (Receptionist, Dispatch Triage, Booking Concierge, Customer Concierge, Intake + Qualification, Inquiry + Proposal). These have sample dialogue as placeholder — consider swapping for brand-specific examples.
2. **Brain scenario numbers** (revenue figures, percentages) are illustrative — consider pulling real average figures from your client base.
3. **Person/role labels** in Brain diagrams — verify they match the titles your buyers actually use in their businesses.

## Questions

For anything about what a specific demo is trying to say, reference the original offerings doc: `Zyph-Offerings-Review.docx`.
