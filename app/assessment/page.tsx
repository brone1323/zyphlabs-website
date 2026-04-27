// @ts-nocheck
'use client';

import { useEffect } from 'react';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');

.zyph-narrative-root {
  --bg: #0a0a0f;
  --bg-2: #11121a;
  --text: #f4f5f7;
  --muted: #8a8fa3;
  --accent: #6b8eff;
  --accent-2: #8b5cf6;
  --empty: #1c1d27;
  --line: rgba(255,255,255,0.08);
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 300;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}
.zyph-narrative-root *, .zyph-narrative-root *::before, .zyph-narrative-root *::after { box-sizing: border-box; }
.zyph-narrative-root::before {
  content: '';
  position: fixed; inset: 0;
  background:
    radial-gradient(800px 500px at 80% -10%, rgba(107,142,255,0.08), transparent 60%),
    radial-gradient(600px 400px at 0% 100%, rgba(139,92,246,0.06), transparent 60%);
  pointer-events: none; z-index: 0;
}
.zyph-narrative-root .stage { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; padding: 48px 32px 120px; }
.zyph-narrative-root .brand { font-family: 'Instrument Serif', serif; font-size: 22px; letter-spacing: 0.3px; opacity: 0.85; }
.zyph-narrative-root .brand span { color: var(--accent); }
.zyph-narrative-root .progress { display: flex; gap: 6px; margin: 28px 0 56px; }
.zyph-narrative-root .progress i { flex: 1; height: 2px; background: var(--line); border-radius: 1px; transition: background 0.6s ease; }
.zyph-narrative-root .progress i.on { background: linear-gradient(90deg, var(--accent), var(--accent-2)); }
.zyph-narrative-root section.step { display: none; animation: zyph-fadein 0.6s ease both; }
.zyph-narrative-root section.step.active { display: block; }
@keyframes zyph-fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.zyph-narrative-root h1 { font-family: 'Instrument Serif', serif; font-size: clamp(34px, 5vw, 56px); line-height: 1.05; font-weight: 400; letter-spacing: -0.5px; margin-bottom: 18px; margin-top: 0; }
.zyph-narrative-root h1 em { font-style: italic; color: var(--accent); }
.zyph-narrative-root h2 { font-family: 'Instrument Serif', serif; font-size: clamp(26px, 3.6vw, 38px); font-weight: 400; line-height: 1.15; margin-bottom: 24px; letter-spacing: -0.3px; }
.zyph-narrative-root p.lead { color: var(--muted); font-size: 18px; max-width: 620px; margin-bottom: 36px; }
.zyph-narrative-root .industry-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-top: 28px; }
.zyph-narrative-root .industry-card { background: var(--bg-2); border: 1px solid var(--line); border-radius: 14px; padding: 22px 20px; text-align: left; color: var(--text); cursor: pointer; font-family: inherit; font-size: 15px; font-weight: 400; transition: border-color 0.25s ease, transform 0.25s ease, background 0.25s ease; }
.zyph-narrative-root .industry-card:hover { border-color: var(--accent); transform: translateY(-2px); background: #161825; }
.zyph-narrative-root .industry-card .ic-title { font-size: 17px; font-weight: 500; margin-bottom: 4px; }
.zyph-narrative-root .industry-card .ic-sub { color: var(--muted); font-size: 13px; line-height: 1.45; }
.zyph-narrative-root .counters { display: flex; gap: 24px; flex-wrap: wrap; margin: 8px 0 36px; }
.zyph-narrative-root .counter { background: var(--bg-2); border: 1px solid var(--line); border-radius: 14px; padding: 22px 24px; min-width: 240px; }
.zyph-narrative-root .counter .clabel { color: var(--muted); font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }
.zyph-narrative-root .counter .crow { display: flex; align-items: center; gap: 14px; }
.zyph-narrative-root .counter .cval { font-family: 'Instrument Serif', serif; font-size: 44px; min-width: 64px; text-align: center; }
.zyph-narrative-root .counter button { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--line); background: transparent; color: var(--text); font-size: 20px; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
.zyph-narrative-root .counter button:hover { border-color: var(--accent); background: rgba(107,142,255,0.08); }
.zyph-narrative-root .btn-primary { background: linear-gradient(135deg, var(--accent), var(--accent-2)); color: white; border: none; padding: 16px 28px; border-radius: 999px; font-family: inherit; font-size: 15px; font-weight: 500; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; box-shadow: 0 8px 24px rgba(107,142,255,0.25); text-decoration: none; display: inline-block; }
.zyph-narrative-root .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(107,142,255,0.32); }
.zyph-narrative-root .silhouette-stage { display: flex; flex-wrap: wrap; gap: 6px; padding: 28px 0; margin: 8px 0 32px; align-items: flex-end; }
.zyph-narrative-root .sil-group { display: flex; flex-wrap: wrap; gap: 6px; padding: 16px 18px; border-radius: 14px; background: rgba(255,255,255,0.015); border: 1px solid var(--line); }
.zyph-narrative-root .sil-group + .sil-group { margin-left: 18px; }
.zyph-narrative-root .sil-group .sg-label { width: 100%; color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: 1.8px; margin-bottom: 10px; }
.zyph-narrative-root .sil { width: 38px; height: 64px; position: relative; --fill: 100%; transition: opacity 0.6s ease; }
.zyph-narrative-root .sil svg { width: 100%; height: 100%; display: block; }
.zyph-narrative-root .sil .sil-base, .zyph-narrative-root .sil .sil-fill { position: absolute; inset: 0; }
.zyph-narrative-root .sil .sil-base path, .zyph-narrative-root .sil .sil-base circle, .zyph-narrative-root .sil .sil-base rect { fill: var(--empty); }
.zyph-narrative-root .sil .sil-fill { -webkit-mask-image: linear-gradient(to bottom, transparent 0%, transparent calc(100% - var(--fill)), black calc(100% - var(--fill)), black 100%); mask-image: linear-gradient(to bottom, transparent 0%, transparent calc(100% - var(--fill)), black calc(100% - var(--fill)), black 100%); transition: -webkit-mask-image 1.6s cubic-bezier(0.65, 0, 0.35, 1), mask-image 1.6s cubic-bezier(0.65, 0, 0.35, 1); }
.zyph-narrative-root .sil .sil-fill path, .zyph-narrative-root .sil .sil-fill circle, .zyph-narrative-root .sil .sil-fill rect { fill: url(#zyphSilGrad); }
.zyph-narrative-root .silhouette-stage.empty .sil { --fill: 70%; }
.zyph-narrative-root .narrative { max-width: 720px; font-size: 19px; line-height: 1.75; color: var(--text); }
.zyph-narrative-root .narrative p { margin-bottom: 18px; min-height: 1.75em; }
.zyph-narrative-root .narrative p.muted { color: var(--muted); font-size: 17px; }
.zyph-narrative-root .narrative .cursor { display: inline-block; width: 8px; background: var(--accent); margin-left: 2px; animation: zyph-blink 0.9s steps(2) infinite; }
@keyframes zyph-blink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
.zyph-narrative-root .narrative h3 { font-family: 'Instrument Serif', serif; font-size: 28px; font-weight: 400; margin: 32px 0 16px; line-height: 1.2; color: var(--text); }
.zyph-narrative-root .narrative .pillars { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin: 12px 0 24px; }
.zyph-narrative-root .narrative .pillar { padding: 16px 18px; background: var(--bg-2); border: 1px solid var(--line); border-radius: 12px; opacity: 0; transform: translateY(8px); transition: opacity 0.5s ease, transform 0.5s ease; }
.zyph-narrative-root .narrative .pillar.on { opacity: 1; transform: none; }
.zyph-narrative-root .narrative .pillar .pt { font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--accent); margin-bottom: 4px; }
.zyph-narrative-root .narrative .pillar .pd { font-size: 14px; color: var(--muted); line-height: 1.5; }
.zyph-narrative-root .stat-tag { display: inline-flex; align-items: center; gap: 10px; padding: 8px 14px; border-radius: 999px; background: rgba(107,142,255,0.1); color: var(--accent); font-size: 14px; font-weight: 500; margin: 8px 0 16px; border: 1px solid rgba(107,142,255,0.2); }
.zyph-narrative-root .stat-tag .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
.zyph-narrative-root .cta-block { margin-top: 40px; padding: 32px; background: var(--bg-2); border: 1px solid var(--line); border-radius: 16px; }
.zyph-narrative-root .cta-block h3 { font-family: 'Instrument Serif', serif; font-size: 28px; font-weight: 400; margin-bottom: 8px; }
.zyph-narrative-root .cta-block p { color: var(--muted); margin-bottom: 20px; }
.zyph-narrative-root .continue-prompt { display: flex; align-items: center; gap: 12px; margin-top: 8px; opacity: 0; transition: opacity 0.6s ease; }
.zyph-narrative-root .continue-prompt.on { opacity: 1; }
.zyph-narrative-root .continue-prompt button { background: none; border: 1px solid var(--accent); color: var(--accent); padding: 10px 20px; border-radius: 999px; font-family: inherit; font-size: 14px; cursor: pointer; transition: background 0.2s, color 0.2s; }
.zyph-narrative-root .continue-prompt button:hover { background: var(--accent); color: white; }
.zyph-narrative-root .skip-hint { color: var(--muted); font-size: 12px; opacity: 0.6; }
@media (max-width: 600px) {
  .zyph-narrative-root .stage { padding: 28px 20px 80px; }
  .zyph-narrative-root .sil { width: 28px; height: 50px; }
  .zyph-narrative-root .sil-group { padding: 12px; }
  .zyph-narrative-root .sil-group + .sil-group { margin-left: 12px; }
}
`;

const SCRIPT = `
(function() {
  if (window.__zyphNarrativeInit) return;
  window.__zyphNarrativeInit = true;

  const root = document.querySelector('.zyph-narrative-root');
  if (!root) return;
  const $ = (sel) => root.querySelector(sel);
  const $$ = (sel) => Array.from(root.querySelectorAll(sel));

  const INDUSTRIES = [
    { id: 'trades',         shape: 'office-field', title: 'Trades & Construction',     sub: 'Plumbing, electrical, roofing, HVAC, GCs, landscaping' },
    { id: 'field-services', shape: 'office-field', title: 'Field Services / Mobile',   sub: 'Service technicians, mobile pros, route-based work' },
    { id: 'professional',   shape: 'office',       title: 'Professional Services',     sub: 'Law, accounting, consulting, advisory, financial' },
    { id: 'creative',       shape: 'office',       title: 'Creative & Agency',         sub: 'Design, video, marketing, branding, content studios' },
    { id: 'ecommerce',      shape: 'office',       title: 'Ecommerce & DTC',           sub: 'Shopify, Amazon, subscription brands, online retail' },
    { id: 'clinic',         shape: 'office',       title: 'Clinics & Appointments',    sub: 'Medical, dental, salon, fitness, therapy' },
    { id: 'retail',         shape: 'floor-back',   title: 'Retail Shop',               sub: 'Brick-and-mortar stores, boutiques, specialty retail' },
    { id: 'hospitality',    shape: 'floor-back',   title: 'Restaurants & Hospitality', sub: 'Cafes, restaurants, hotels, catering, events' },
  ];

  const SHAPE_HEADCOUNT = {
    'office-field': {
      q: 'How does your team break down?',
      sub: 'Office staff handle scheduling, dispatch, customer comms, books. Field crew is on jobs.',
      counters: [
        { id: 'office', label: 'Office staff', start: 2, type: 'office' },
        { id: 'field',  label: 'Field crew',   start: 4, type: 'field'  },
      ],
    },
    'office': {
      q: 'How many people work in your office?',
      sub: 'Everyone who logs into a computer to do their job — full-time and part-time count the same here.',
      counters: [
        { id: 'office', label: 'Team members', start: 4, type: 'office' },
      ],
    },
    'floor-back': {
      q: 'How does your team break down?',
      sub: 'Back-of-house = the people running schedules, ordering, books, marketing. Floor = customer-facing staff.',
      counters: [
        { id: 'office', label: 'Back-office team',  start: 2, type: 'office' },
        { id: 'field',  label: 'Floor / customer-facing', start: 6, type: 'floor' },
      ],
    },
  };

  const SVG = {
    office: '<svg viewBox="0 0 60 100" preserveAspectRatio="xMidYMax meet"><circle cx="30" cy="22" r="11"/><path d="M10 62 Q10 40 30 40 Q50 40 50 62 L50 84 L10 84 Z"/><rect x="2" y="84" width="56" height="14" rx="2"/></svg>',
    field:  '<svg viewBox="0 0 60 100" preserveAspectRatio="xMidYMax meet"><path d="M14 22 Q14 8 30 8 Q46 8 46 22 L50 26 L10 26 Z"/><circle cx="30" cy="34" r="10"/><path d="M10 76 Q10 50 30 50 Q50 50 50 76 L50 100 L10 100 Z"/></svg>',
    floor:  '<svg viewBox="0 0 60 100" preserveAspectRatio="xMidYMax meet"><circle cx="30" cy="22" r="11"/><path d="M10 70 Q10 42 30 42 Q50 42 50 70 L50 100 L10 100 Z"/><path d="M22 50 L38 50 L42 96 L18 96 Z" opacity="0.35" fill="white"/></svg>',
  };

  function silhouetteEl(type) {
    const wrap = document.createElement('div');
    wrap.className = 'sil';
    wrap.style.setProperty('--fill', '100%');
    wrap.innerHTML = '<div class="sil-base">' + SVG[type] + '</div><div class="sil-fill">' + SVG[type] + '</div>';
    return wrap;
  }

  function buildSilhouetteStage(stageEl, counters, state) {
    stageEl.innerHTML = '';
    counters.forEach(c => {
      const count = state[c.id] || 0;
      if (count <= 0) return;
      const group = document.createElement('div');
      group.className = 'sil-group';
      const label = document.createElement('div');
      label.className = 'sg-label';
      label.textContent = c.label + ' · ' + count;
      group.appendChild(label);
      for (let i = 0; i < count; i++) {
        group.appendChild(silhouetteEl(c.type));
      }
      stageEl.appendChild(group);
    });
  }

  const state = { industry: null, shape: null, counts: {} };
  const stepEls = $$('.step');
  const progEls = $$('.progress i');

  function goto(n) {
    stepEls.forEach((s, i) => s.classList.toggle('active', i === n - 1));
    progEls.forEach((p, i) => p.classList.toggle('on', i < n));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Industry select
  const grid = $('#industry-grid');
  INDUSTRIES.forEach(ind => {
    const b = document.createElement('button');
    b.className = 'industry-card';
    b.innerHTML = '<div class="ic-title">' + ind.title + '</div><div class="ic-sub">' + ind.sub + '</div>';
    b.addEventListener('click', () => {
      state.industry = ind.id;
      state.shape = ind.shape;
      setupHeadcount();
      goto(2);
    });
    grid.appendChild(b);
  });

  function setupHeadcount() {
    const cfg = SHAPE_HEADCOUNT[state.shape];
    $('#headcount-q').textContent = cfg.q;
    $('#headcount-sub').textContent = cfg.sub;
    const wrap = $('#counters');
    wrap.innerHTML = '';
    state.counts = {};
    cfg.counters.forEach(c => {
      state.counts[c.id] = c.start;
      const el = document.createElement('div');
      el.className = 'counter';
      el.innerHTML = '<div class="clabel">' + c.label + '</div><div class="crow"><button data-act="dec">−</button><span class="cval">' + c.start + '</span><button data-act="inc">+</button></div>';
      const valEl = el.querySelector('.cval');
      el.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          const cur = state.counts[c.id];
          const next = btn.dataset.act === 'inc' ? cur + 1 : Math.max(0, cur - 1);
          state.counts[c.id] = next;
          valEl.textContent = next;
        });
      });
      wrap.appendChild(el);
    });
  }

  $('#headcount-next').addEventListener('click', () => {
    setupNarrative();
    goto(3);
  });

  // Typewriter + autoscroll
  let typingState = { active: false, skip: false };
  let activeCursor = null;
  let lastUserScrollAt = 0;

  function autoFollowLoop() {
    const idleSinceUserScroll = Date.now() - lastUserScrollAt > 1800;
    if (activeCursor && activeCursor.isConnected && idleSinceUserScroll) {
      const rect = activeCursor.getBoundingClientRect();
      const target = window.innerHeight * 0.55;
      const overshoot = rect.top - target;
      if (overshoot > 1) {
        window.scrollBy(0, Math.min(overshoot, 1.4));
      }
    }
    requestAnimationFrame(autoFollowLoop);
  }
  requestAnimationFrame(autoFollowLoop);

  ['wheel', 'touchmove', 'keydown'].forEach(evt => {
    window.addEventListener(evt, (e) => {
      if (evt === 'keydown' && !['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key)) return;
      lastUserScrollAt = Date.now();
    }, { passive: true });
  });

  function typeText(el, text, speed) {
    speed = speed || 32;
    return new Promise(resolve => {
      typingState = { active: true, skip: false };
      el.textContent = '';
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      cursor.innerHTML = '&nbsp;';
      el.appendChild(cursor);
      activeCursor = cursor;
      let i = 0;
      function tick() {
        if (typingState.skip) {
          cursor.remove();
          el.textContent = text;
          typingState.active = false;
          activeCursor = null;
          return resolve();
        }
        if (i >= text.length) {
          cursor.remove();
          typingState.active = false;
          activeCursor = null;
          return resolve();
        }
        cursor.insertAdjacentText('beforebegin', text[i]);
        i++;
        const ch = text[i - 1];
        let delay = speed;
        if (ch === '.' || ch === '?' || ch === '!') delay = 380;
        else if (ch === ',' || ch === ';' || ch === '—') delay = 180;
        setTimeout(tick, delay);
      }
      tick();
    });
  }

  root.addEventListener('click', (e) => {
    if (typingState.active && !e.target.closest('button, a')) {
      typingState.skip = true;
    }
  });

  function appendP(container, cls) {
    const p = document.createElement('p');
    if (cls) p.className = cls;
    container.appendChild(p);
    return p;
  }
  function appendH3(container, text) {
    const h = document.createElement('h3');
    h.textContent = text;
    container.appendChild(h);
    return h;
  }
  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  function introText(state) {
    const office = state.counts.office || 0;
    const field  = state.counts.field  || 0;
    if (state.shape === 'office') {
      return "Here's your team — " + office + ' ' + (office === 1 ? 'person' : 'people') + ' working through their day. Computers, calls, emails, documents, decisions.';
    }
    if (state.shape === 'office-field') {
      return "Here's your business — " + office + ' in the office, ' + field + ' in the field. The office runs the schedule, dispatches the work, talks to customers, handles the paperwork. The field gets the work done.';
    }
    return "Here's your business — " + office + ' running back-of-house, ' + field + ' on the floor. Back-of-house schedules the staff, orders the inventory, books the deposits, runs the marketing. The floor is where your customers actually feel your brand.';
  }

  const COMMON_PILLARS = [
    { t: 'Communicate', d: 'Customers, staff, suppliers, partners — calls, emails, messages, meetings.' },
    { t: 'Process',     d: 'Organize, analyze, find, present information so decisions can be made.' },
    { t: 'Produce',     d: 'Documents, plans, quotes, reports, schedules, decisions.' },
    { t: 'Comply',      d: 'Records, signatures, filings, audit trails, regulatory paperwork.' },
  ];

  const VALUE_QUESTIONS = {
    'office-field': [
      'If your office team got 30% of their week back —',
      'And you had clear visibility of task management, employee performance, cash forecasting, and project schedules — invoices going out faster, follow-ups handled automatically so you get paid sooner and earn more positive reviews —',
      'Could you pursue more business without adding overhead?',
      'Could you reduce headcount, if you chose to?',
      'Could the team do their work at higher quality, with fewer dropped balls?',
      'Could they support the field crew with sharper planning, better dispatch, faster answers?',
      'When your competitors implement AI tools — and they will — can you compete with them if you don’t?',
      'And could you make better decisions, every day, to actually run your business?',
    ],
    'office': [
      'If your team got 30% of their week back —',
      'And you had clear visibility of task management, employee performance, cash forecasting, and project schedules — invoices going out faster, follow-ups handled automatically so you get paid sooner and earn more positive reviews —',
      'Could you pursue more business without adding overhead?',
      'Could you reduce headcount, if you chose to?',
      'Could the team do their work at higher quality, with more thinking and less typing?',
      'When your competitors implement AI tools — and they will — can you compete with them if you don’t?',
      'And could you make better decisions, every day, to actually run your business?',
    ],
    'floor-back': [
      'If your back-office got 30% of their week back —',
      'And you had clear visibility of labor cost, sales by hour, inventory levels, and customer satisfaction — orders placed on time, shifts staffed right, follow-ups handled automatically so you earn more positive reviews and bring people back —',
      'Could you grow without burning your team out?',
      'Could you cut overtime, over-staffing, and waste?',
      'Could the back office support the floor with sharper forecasting, smarter inventory, and a customer experience that feels personal?',
      'When the chain across the street implements AI tools — and they will — can you still compete if you don’t?',
      'And could you make better decisions, every day, to actually run your business?',
    ],
  };

  async function setupNarrative() {
    const cfg = SHAPE_HEADCOUNT[state.shape];
    buildSilhouetteStage($('#silhouettes-1'), cfg.counters, state.counts);
    const n = $('#narrative-1');
    n.innerHTML = '';
    const cont = $('#continue-1');
    cont.classList.remove('on');

    await wait(700);
    const p1 = appendP(n);
    await typeText(p1, introText(state));

    await wait(500);
    appendH3(n, 'Every office runs on the same four activities.');

    const pillarsWrap = document.createElement('div');
    pillarsWrap.className = 'pillars';
    COMMON_PILLARS.forEach((p, i) => {
      const el = document.createElement('div');
      el.className = 'pillar';
      el.innerHTML = '<div class="pt">' + p.t + '</div><div class="pd">' + p.d + '</div>';
      pillarsWrap.appendChild(el);
      setTimeout(() => el.classList.add('on'), 400 + i * 220);
    });
    n.appendChild(pillarsWrap);
    await wait(1400);

    const p2 = appendP(n, 'muted');
    await typeText(p2, 'Most of this work runs through computers and software. But the underlying purpose — communicate, process, produce, comply — is what every office actually does.');

    await wait(500);
    const p3 = appendP(n);
    await typeText(p3, 'We make systems talk. We organize information with an AI backend that knows your business — your customers, your team, your numbers, your voice.');

    await wait(400);
    const p4 = appendP(n);
    await typeText(p4, 'And we know — at the conservative low end — we can save your team 30% of their time.');

    cont.classList.add('on');
  }

  $('#continue-1-btn').addEventListener('click', () => {
    setupCTA();
    goto(4);
  });

  async function setupCTA() {
    const cfg = SHAPE_HEADCOUNT[state.shape];
    const stage2 = $('#silhouettes-2');
    buildSilhouetteStage(stage2, cfg.counters, state.counts);
    stage2.querySelectorAll('.sil').forEach(s => s.style.setProperty('--fill', '100%'));

    const total = (state.counts.office || 0) + (state.counts.field || 0);
    const eq = Math.max(1, Math.round(total * 0.3));
    const tag = $('#stat-tag');
    const tagText = $('#stat-tag-text');
    tagText.textContent = '30% of ' + total + ' ≈ ' + eq + ' ' + (eq === 1 ? 'person' : 'people') + ' worth of time, every week';
    tag.style.display = 'inline-flex';

    await wait(800);
    stage2.querySelectorAll('.sil').forEach(s => s.style.setProperty('--fill', '70%'));

    const n = $('#narrative-2');
    n.innerHTML = '';
    await wait(1400);

    const lines = VALUE_QUESTIONS[state.shape];
    for (let i = 0; i < lines.length; i++) {
      const p = appendP(n, i < 2 ? 'muted' : '');
      await typeText(p, lines[i], 30);
      await wait(i === 1 ? 900 : 550);
    }

    await wait(500);
    $('#cta-block').style.display = 'block';
  }
})();
`;

export default function AssessmentPage() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const script = document.createElement('script');
    script.textContent = SCRIPT;
    document.body.appendChild(script);
    return () => {
      try { document.body.removeChild(script); } catch {}
      // Reset init flag so HMR / navigation re-runs cleanly
      try { delete (window as any).__zyphNarrativeInit; } catch {}
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="zyph-narrative-root">
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="zyphSilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7ea0ff" />
              <stop offset="100%" stopColor="#6b46f1" />
            </linearGradient>
          </defs>
        </svg>

        <div className="stage">
          <div className="brand">Zyph <span>Labs</span></div>
          <div className="progress">
            <i className="p1 on"></i><i className="p2"></i><i className="p3"></i><i className="p4"></i>
          </div>

          <section className="step active" id="step-1">
            <h1>Let&apos;s see what AI <em>actually</em> does for your business.</h1>
            <p className="lead">Two minutes. No form to fill out. We&apos;ll show you, then you decide if it&apos;s worth a 15-minute strategy session.</p>
            <h2>First — what industry are you in?</h2>
            <div className="industry-grid" id="industry-grid"></div>
          </section>

          <section className="step" id="step-2">
            <h2 id="headcount-q">How many people do you employ?</h2>
            <p className="lead" id="headcount-sub">Just a rough count is fine — we&apos;ll use this to model the impact for your specific size.</p>
            <div className="counters" id="counters"></div>
            <button className="btn-primary" id="headcount-next">Continue →</button>
          </section>

          <section className="step" id="step-3">
            <div className="silhouette-stage" id="silhouettes-1"></div>
            <div className="narrative" id="narrative-1"></div>
            <div className="continue-prompt" id="continue-1">
              <button id="continue-1-btn">Show me the impact →</button>
              <span className="skip-hint">tip: click anywhere to skip ahead</span>
            </div>
          </section>

          <section className="step" id="step-4">
            <div className="stat-tag" id="stat-tag" style={{ display: 'none' }}>
              <span className="dot"></span><span id="stat-tag-text"></span>
            </div>
            <div className="silhouette-stage empty" id="silhouettes-2"></div>
            <div className="narrative" id="narrative-2"></div>
            <div className="cta-block" id="cta-block" style={{ display: 'none' }}>
              <h3>Let&apos;s book your strategy session.</h3>
              <p>15 minutes. We&apos;ll map exactly which of your workflows AI can take over, what the build looks like, and what the ROI is. No pressure, no slide deck.</p>
              <a href="https://calendly.com/zyphlabs/strategy" target="_blank" rel="noopener noreferrer" className="btn-primary">Pick a time →</a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
