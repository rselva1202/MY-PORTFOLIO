/* ==========================================================================
   SELVAGANAPATHY R — PORTFOLIO 2026 · main.js
   Scroll-driven video background. No Three.js.

   01 SCENES config (customize here)   02 Site config    03 Env + helpers
   04 DOM build                        05 Clock          06 Smooth scroll
   07 Cursor + magnetics               08 Scene system   09 Choreography
   10 Progress meter                   11 Case overlay   12 Form + boot
   ========================================================================== */
(() => {
  'use strict';

  /* ==========================================================================
     01 · SCENES — CUSTOMIZE HERE
     One entry per section. `scene` is the clip basename in assets/video/;
     `source` documents where that clip was cut from (see prepare-assets.sh).

     overlay    scene-wide scrim alpha (brief: 0.35–0.55)
     textAlpha  heavier stop on the text side. These are NOT guesses: they are
                the minimum alpha that keeps headings >= 7:1 and body copy
                >= 4.5:1 against the measured p95 luma of each clip's text side
                (S1 196, S2 233, S3 219, S4 200, S5 198, S6 217, S7 218).
                Re-check with `node check-contrast.js`.
     ========================================================================== */
  const SCENES = {
    scrim: '#0b0806',
    accentWarm: '#ffc46b',
    accentCool: '#7fd8ea',
    rate: 0.8,          // default playbackRate
    // Seamless looping: each scene holds two identical clips. `loopFade` seconds
    // before the front clip ends, the back one starts from 0 and they crossfade.
    // The lead is measured in MEDIA seconds: 0.6 * playbackRate.
    loop: true,
    loopFade: 0.6,
    zoom: { from: 1.06, to: 1.14, parallax: 2 }, // scale 1.06 -> 1.14, ±2% y
    mobileBreakpoint: 768,

    sections: [
      { id: 'home', label: 'Home', scene: 's1', source: { start: 1.8, duration: 5.2 },
        textSide: 'left', overlay: 0.42, textAlpha: 0.89, accent: '#ffc46b', playbackRate: 0.8,
        objectPosition: { desktop: '75% center', mobile: '75% center' } },

      { id: 'work', label: 'Work', scene: 's2', source: { start: 8.8, duration: 4.0 },
        textSide: 'left', overlay: 0.48, textAlpha: 0.93, accent: '#ffc46b', playbackRate: 0.8,
        objectPosition: { desktop: '62% center', mobile: '58% center' } },

      { id: 'about', label: 'About', scene: 's3', source: { start: 13.2, duration: 4.0 },
        textSide: 'right', overlay: 0.50, textAlpha: 0.92, accent: '#7fd8ea', playbackRate: 0.8,
        objectPosition: { desktop: '30% center', mobile: '32% center' } },

      { id: 'skills', label: 'Skills', scene: 's5', source: { start: 24.0, duration: 5.2 },
        textSide: 'left', overlay: 0.44, textAlpha: 0.89, accent: '#ffc46b', playbackRate: 0.8,
        objectPosition: { desktop: '78% center', mobile: '80% center' } },

      { id: 'reviews', label: 'Reviews', scene: 's4', source: { start: 18.4, duration: 4.8 },
        textSide: 'bottom', overlay: 0.46, textAlpha: 0.90, accent: '#ffc46b', playbackRate: 0.8,
        objectPosition: { desktop: 'center center', mobile: 'center center' } },

      { id: 'contact', label: 'Contact', scene: 's6', source: { start: 30.6, duration: 1.2 },
        textSide: 'left', overlay: 0.52, textAlpha: 0.92, accent: '#ffc46b', playbackRate: 0.5,
        objectPosition: { desktop: '72% center', mobile: '70% center' } },

      { id: 'end', label: 'End', scene: 's7', source: { start: 33.5, duration: 3.8 },
        textSide: 'left', overlay: 0.50, textAlpha: 0.92, accent: '#ffc46b', playbackRate: 0.8,
        objectPosition: { desktop: '74% center', mobile: '72% center' } },
    ],
  };

  /* ==========================================================================
     02 · SITE CONFIG — copy and content
     ========================================================================== */
  const CONFIG = {
    name: 'Selvaganapathy R',
    role: 'Full-Stack Developer',
    timeZone: 'Asia/Kolkata',
    email: 'rselva1204@gmail.com',

    /* ---- Design switches (the only knobs for typography and cursor) ----
       fontPreset: 'A' | 'B' | 'C'   — see FONT_PRESETS below
       cursorStyle: 'shooting-star' (default) | 'glow-arrow' | 'ember-trail'
                    | 'minimal-arrow'
       'shooting-star' needs a live WebGL context and a real fine pointer; if
       either is missing, or the visitor asks for reduced motion, it steps down
       to 'glow-arrow' rather than leave the pointer with no cursor at all. */
    fontPreset: 'A',
    cursorStyle: 'shooting-star',

    about: {
      // Rendered as one <p> per entry. Keep this in the owner's own words.
      bio: [
        "I'm a Computer Science Engineering student passionate about software development, AI, and emerging technologies. I enjoy building practical projects that combine creativity, problem-solving, and technology.",
        'My interests include AI/ML, data science, web development, and intelligent automation. I\'m continuously learning, experimenting with new tools, and turning ideas into real-world projects.',
        'My goal is to grow as a software engineer and build impactful technology.',
      ],
      // Off until real figures exist — the stats row and the "what I care about"
      // list are never built while these are false, so no invented numbers ship.
      showStats: false,
      showCareAbout: false,
    },

    /* Each card is one object. Add a link and/or a screenshot by editing the
       object alone:
         title / description / tags  — the copy
         year                        — '' hides the year prefix
         image                       — a file in assets/projects/, or null
         panel                       — true renders the styled placeholder panel
                                      used when there is no screenshot yet
         link                        — null renders a non-navigating card that
                                      says "Links coming soon"                         */
    projects: [
      { title: 'Weather Information Dashboard', year: '', image: null, panel: false, link: null,
        description: 'A typed end-to-end city dashboard: live conditions, 7-day forecasts and history, served by an Express API that caches observations in MySQL.',
        tags: ['Web App', 'Dashboard'] },

      { title: 'WelfareX — Workers Welfare Smart Assistant', year: '', panel: false, icon: 'window',
        image: 'assets/projects/welfarex.png',
        description: 'A welfare assistant for registered workers, with eligibility analysis, renewal alerts, reminders, and case management.',
        tags: ['Web App', 'Dashboard'],
        link: 'https://nalavariyam-welfare-assistant-b8dp.onrender.com/' },

      { title: 'Aurelia Games', year: '', image: null, panel: true, icon: 'compass', link: null,
        description: 'A gaming download platform for open-source PC titles.',
        tags: ['Web App', 'Node.js'] },

      { title: 'JARVIS: 3D AI Assistant Interface', year: '', image: null, panel: true, icon: 'spark', link: null,
        description: 'An interactive 3D particle humanoid assistant interface.',
        tags: ['Web App', '3D'] },
    ],
    // TODO: add real screenshots and links for Aurelia Games and JARVIS

    /* Five groups, laid out as a bento. `span` is a 6-column track count at
       desktop: 2 + 2 + 2 on the first row, 4 + 2 on the second. */
    skillGroups: [
      { title: 'Programming', icon: 'code', span: 2,
        items: ['C', 'Python', 'Java', 'JavaScript / TypeScript'] },
      { title: 'Web Development', icon: 'window', span: 2,
        items: ['HTML & CSS', 'React', 'Vite', 'Flask', 'REST APIs'] },
      { title: 'AI & Data', icon: 'spark', span: 2,
        items: ['Artificial Intelligence', 'Generative AI', 'Data Science', 'Data Analysis', 'AI/ML Fundamentals', 'Prompt Engineering'] },
      { title: 'Tools & Technologies', icon: 'wrench', span: 4,
        items: ['Git & GitHub', 'Firebase / Firestore', 'SQLite', 'PostgreSQL', 'n8n', 'VS Code', 'OpenRouter', 'Google AI Studio'] },
      { title: 'Other', icon: 'compass', span: 2,
        items: ['Problem Solving', 'Data Structures & Algorithms', 'Automation', 'API Integration', 'Telegram Bot Development', 'Software Project Development'] },
    ],

    // Placeholder reviews — no real people are quoted here.
    quotes: [
      { text: 'Placeholder review — replace with a real quote before publishing.', who: 'Name — Role, Company' },
      { text: 'Placeholder review — the tone should stay specific, not flattering.', who: 'Name — Role, Company' },
      { text: 'Placeholder review — one concrete outcome beats three adjectives.', who: 'Name — Role, Company' },
    ],

    socials: [
      { label: 'GitHub', url: 'https://github.com/rselva1202' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/selva-ganapathy-r/' },
      { label: 'Telegram', url: 'https://t.me/Itz_Ragnar', handle: '@Itz_Ragnar' },
    ],
  };

  /* Minimal 20x20 line icons for the skill groups — no emoji anywhere. */
  const ICONS = {
    code: '<path d="M7 6 2.5 10 7 14"/><path d="M13 6l4.5 4L13 14"/><path d="M11.5 4 8.5 16"/>',
    window: '<rect x="2.5" y="3.5" width="15" height="13" rx="1.5"/><path d="M2.5 7.5h15"/><path d="M5 5.5h.01M7 5.5h.01"/>',
    spark: '<path d="M10 2.5 11.8 8 17.5 10 11.8 12 10 17.5 8.2 12 2.5 10 8.2 8Z"/><path d="M16 3v3M14.5 4.5h3"/>',
    wrench: '<path d="M13.2 2.6a4 4 0 0 0-4.6 5.5L3 13.7 6.3 17l5.6-5.6a4 4 0 0 0 5.5-4.6L14.7 9.4 12 6.7Z"/>',
    compass: '<circle cx="10" cy="10" r="7.5"/><path d="m12.8 7.2-1.6 4-4 1.6 1.6-4Z"/>',
  };
  const icon = (key) =>
    '<svg class="skill-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.3" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[key] || '') + '</svg>';

  /* ==========================================================================
     03 · ENV + HELPERS
     ========================================================================== */
  const APP = { lenis: null, scenes: null, overlay: null };
  const pad2 = (n) => String(n).padStart(2, '0');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const ENV = (() => {
    const mq = (q) => window.matchMedia(q).matches;
    const reduced = mq('(prefers-reduced-motion: reduce)');
    const fine = mq('(hover: hover) and (pointer: fine)');
    const conn = navigator.connection || {};
    const saveData = !!conn.saveData;
    const webm = (() => {
      try {
        return !!document.createElement('video').canPlayType('video/webm; codecs="vp9"');
      } catch (e) { return false; }
    })();
    return {
      reduced, fine, saveData, webm,
      motion: !reduced,
      // Posters only: no clip is fetched at all.
      postersOnly: reduced || saveData,
      mobile: window.innerWidth < SCENES.mobileBreakpoint,
    };
  })();

  const root = document.documentElement;
  const hexToRgb = (hex) => {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  };
  const mixHex = (a, b, t) => {
    const A = hexToRgb(a), B = hexToRgb(b);
    return `rgb(${Math.round(A[0] + (B[0] - A[0]) * t)}, ${Math.round(A[1] + (B[1] - A[1]) * t)}, ${Math.round(A[2] + (B[2] - A[2]) * t)})`;
  };
  const rgba = (hex, a) => {
    const [r, g, b] = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };
  // Scrim stops for a section: heavy on the text side, lighter on the subject.
  const scrimStops = (s) => {
    const base = s.overlay, heavy = s.textAlpha, light = +(base * 0.7).toFixed(3);
    return s.textSide === 'right'
      ? { l: light, m: base, r: heavy }
      : { l: heavy, m: base, r: light };
  };
  const applyScrim = (s) => {
    const k = scrimStops(s);
    root.style.setProperty('--sa-l', k.l);
    root.style.setProperty('--sa-m', k.m);
    root.style.setProperty('--sa-r', k.r);
  };

  /* ==========================================================================
     04 · DOM BUILD
     ========================================================================== */
  function buildCards() {
    const grid = document.getElementById('workGrid');
    grid.innerHTML = '';
    CONFIG.projects.forEach((p, i) => {
      const el = document.createElement('article');
      el.className = 'card' + (p.link ? ' is-linked' : '');

      // Media: a real screenshot, the styled placeholder panel, or nothing.
      let media = '';
      if (p.image) {
        media = `<div class="card-media"><img src="${p.image}" alt="${p.title} — screenshot" loading="lazy" decoding="async" /></div>`;
      } else if (p.panel) {
        media = '<div class="card-media card-media--placeholder" aria-hidden="true">' +
                '<span class="panel-mark"></span><span class="panel-glyph">' + icon(p.icon || 'compass') + '</span></div>';
      }

      const meta = [p.year, p.tags.join(' · ')].filter(Boolean).join(' · ');
      const tags = '<ul class="card-tags">' + p.tags.map((t) => `<li class="card-tag">${t}</li>`).join('') + '</ul>';

      // With a link the whole card is the anchor (new tab, no referrer leak).
      // Without one it is inert and says so, rather than pretending to be a link.
      const cta = p.link
        ? `<span class="card-cta">VIEW LIVE <span aria-hidden="true">↗</span></span>`
        : `<span class="card-cta card-cta--soon">Links coming soon</span>`;

      const inner =
        `  <span class="card-num" aria-hidden="true">${pad2(i + 1)}</span>` +
        media +
        `  <h3 class="card-title">${p.title}</h3>` +
        (meta ? `  <div class="card-meta">${meta}</div>` : '') +
        `  <p class="card-blurb">${p.description}</p>` +
        tags +
        cta;

      if (p.link) {
        el.innerHTML =
          `<a class="card-link" href="${p.link}" target="_blank" rel="noopener noreferrer" ` +
          `data-cursor="view" aria-label="${p.title} — open in a new tab">${inner}</a>`;
      } else {
        el.innerHTML = inner;
      }
      grid.appendChild(el);
    });
  }

  function buildAbout() {
    const host = document.getElementById('aboutCopy');
    host.innerHTML = '';
    CONFIG.about.bio.forEach((para) => {
      const p = document.createElement('p');
      p.className = 'about-para';
      p.textContent = para;
      host.appendChild(p);
    });
    // Both are behind CONFIG flags and currently off — no invented numbers ship.
    if (CONFIG.about.showStats) host.parentElement.appendChild(buildAboutStats());
    if (CONFIG.about.showCareAbout) host.parentElement.appendChild(buildCareAbout());
  }

  function buildAboutStats() {
    const dl = document.createElement('dl');
    dl.className = 'about-stats';
    dl.innerHTML = CONFIG.about.stats.map((s) =>
      `<div><dt class="mono-micro">${s.label}</dt><dd>${s.value}</dd></div>`).join('');
    return dl;
  }

  function buildCareAbout() {
    const ul = document.createElement('ul');
    ul.className = 'about-list';
    ul.innerHTML = CONFIG.about.careAbout.map((c) => `<li>${c}</li>`).join('');
    return ul;
  }

  function buildSkillGroups() {
    const wrap = document.getElementById('skillBento');
    wrap.innerHTML = '';
    CONFIG.skillGroups.forEach((g) => {
      const card = document.createElement('section');
      card.className = 'skill-card';
      card.style.setProperty('--span', g.span || 2);
      card.setAttribute('aria-label', g.title);
      card.innerHTML =
        `<header class="skill-head">${icon(g.icon)}<h3>${g.title}</h3></header>` +
        `<ul class="skill-chips">` +
        g.items.map((it) => `<li class="skill-chip">${it}</li>`).join('') +
        `</ul>`;
      wrap.appendChild(card);
    });
  }

  /* ---- FONT PRESETS -------------------------------------------------------
     Each preset pairs a display serif, a body sans and a mono, and requests
     only the weights actually used. `display=swap` means text paints in the
     fallback first and swaps when the webfont lands, so there is no invisible
     text. The <link> in index.html already points at Preset A, so the page is
     correct with JS off; applyFontPreset() rewrites it for B or C. */
  const FONT_PRESETS = {
    A: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..600&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
    B: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=IBM+Plex+Mono:wght@400;500&family=Manrope:wght@400;500;600;700&display=swap',
    C: 'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@500;600&display=swap',
  };

  function applyFontPreset() {
    const key = (String(CONFIG.fontPreset || 'A').toUpperCase());
    const preset = FONT_PRESETS[key] ? key : 'A';
    // The CSS variables for every preset already exist in §01; this only tells
    // the stylesheet which set to use.
    root.setAttribute('data-font', preset);
    const link = document.getElementById('fontLink');
    if (!link) return;
    const href = FONT_PRESETS[preset];
    if (link.href.indexOf(href) === -1) {
      link.href = href;
      // The fitted hero size depends on the real metrics, so refit once the
      // new faces have arrived.
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitName);
    }
  }

  /* The display name must never wrap and never cross into the subject's side
     of the frame, so it is fitted to the width of the text column on load,
     on resize and once the webfont has landed. */
  let fitting = false;
  function fitName() {
    if (fitting) return;                    // never re-enter from the observer
    const el = document.getElementById('displayName');
    if (!el) return;
    const inner = el.querySelector('.mask-inner');
    const host = el.closest('.panel-copy') || el.parentElement;
    const avail = host.clientWidth;
    if (!inner || !avail) return;
    fitting = true;
    const probe = 100;                      // measure at a known size, then scale
    el.style.fontSize = probe + 'px';
    let w = inner.getBoundingClientRect().width;
    if (w) {
      // Converge rather than scale once. The display face is a variable font
      // with an optical-size axis, so changing font-size does NOT change the
      // string width linearly — a single proportional step leaves the name
      // overflowing its column. Re-measure and correct until it fits.
      let size = probe * (avail / w);
      for (let i = 0; i < 12; i++) {
        el.style.fontSize = size.toFixed(2) + 'px';
        w = inner.getBoundingClientRect().width;
        if (!w) break;
        if (w <= avail + 0.5) break;
        size = size * (avail / w) * 0.995;   // 0.995 avoids oscillating
      }
      el.style.fontSize = clamp(size, 20, 170).toFixed(2) + 'px';
    }
    fitting = false;
  }

  /* A webfont swap (or a font-preset switch) reflows the name AFTER fonts.ready
     has already fired, and a variable optical-size axis can make the string
     wider than the fit computed against the fallback metrics. Watching the
     element's own box and refitting makes the fit self-correcting.

     fitName converges monotonically and writes the same size once it fits, so
     re-running it cannot oscillate or loop: an unchanged write produces no
     further resize. */
  function watchName() {
    const inner = document.querySelector('#displayNameText');
    const el = document.getElementById('displayName');
    if (!inner || !el || typeof ResizeObserver === 'undefined') return;
    let pending = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(pending);
      pending = setTimeout(fitName, 80);
    });
    // Observe BOTH: the inner catches a webfont swap, while the heading itself
    // catches the text column changing width. The inner alone is not enough —
    // when the column narrows, a nowrap span keeps its own width and simply
    // overflows, so no resize event would fire and the name would stay clipped.
    ro.observe(inner);
    ro.observe(el);
  }

  function buildSocials() {
    const ul = document.getElementById('socials');
    CONFIG.socials.forEach((s) => {
      const li = document.createElement('li');
      li.innerHTML = `<a class="social-link" data-magnetic href="${s.url}" target="_blank" rel="noopener noreferrer">` +
        `${s.label}${s.handle ? ' <span class="social-handle">' + s.handle + '</span>' : ''} <span aria-hidden="true">↗</span></a>`;
      ul.appendChild(li);
    });
  }

  function syncIdentity() {
    // The nav brand is the emblem image, not text, so nothing writes to it here
    // any more. Its accessible name lives in the markup (aria-label), which
    // means the wordmark still reads correctly to a screen reader.
    document.getElementById('heroRole').textContent = CONFIG.role.toUpperCase();
    // The hero name is set from CONFIG so it stays editable in one place, and
    // rendered as ONE unbroken run: roman display type throughout, no italic
    // mid-word, and a thin non-breaking space so the gap before the surname is
    // identical on every font without ever breaking the line.
    const nameEl = document.getElementById('displayNameText');
    if (nameEl) {
      const parts = CONFIG.name.trim().split(/\s+/);
      nameEl.textContent = parts.join(' ');
    }
    document.getElementById('emailBtn').href = 'mailto:' + CONFIG.email;
    const foot = document.getElementById('footCopy');
    if (foot) foot.textContent = '© ' + new Date().getFullYear() + ' ' + CONFIG.name.toUpperCase() + '.';
    root.style.setProperty('--accent', SCENES.sections[0].accent);
    applyScrim(SCENES.sections[0]);
  }

  function buildQuotes() {
    const wrap = document.getElementById('quotes');
    CONFIG.quotes.forEach((q) => {
      const f = document.createElement('figure');
      f.className = 'quote';
      f.innerHTML = `<blockquote>“${q.text}”</blockquote><figcaption>${q.who}</figcaption>`;
      wrap.appendChild(f);
    });
  }

  /* ==========================================================================
     05 · CLOCK
     ========================================================================== */
  function initClock() {
    const nav = document.getElementById('navClock');
    let fmt;
    const opts = { hour: '2-digit', minute: '2-digit', hour12: false };
    try { fmt = new Intl.DateTimeFormat('en-GB', { ...opts, timeZone: CONFIG.timeZone }); }
    catch (e) { fmt = new Intl.DateTimeFormat('en-GB', opts); }
    const update = () => { if (nav) nav.textContent = fmt.format(new Date()); };
    update();
    setInterval(update, 15000);
  }

  /* ==========================================================================
     06 · SMOOTH SCROLL
     ========================================================================== */
  function initSmoothScroll() {
    if (ENV.reduced || typeof window.Lenis === 'undefined') return null;
    const lenis = new window.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenis.on('scroll', window.ScrollTrigger.update);
    window.gsap.ticker.add((time) => lenis.raf(time * 1000));
    window.gsap.ticker.lagSmoothing(0);
    return lenis;
  }

  function scrollToTarget(target) {
    if (APP.lenis && ENV.motion) {
      APP.lenis.scrollTo(target, { duration: 1.3, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else {
      target.scrollIntoView({ behavior: ENV.reduced ? 'auto' : 'smooth' });
    }
  }

  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        scrollToTarget(target);
      });
    });
    const cue = document.getElementById('scrollCue');
    if (cue) cue.addEventListener('click', () => scrollToTarget(document.getElementById('work')));
  }

  /* ==========================================================================
     07 · CURSOR + MAGNETICS
     ========================================================================== */
/* ==========================================================================
     07b · CURSOR
     A crisp arrow locked to the real pointer plus a scene-tinted glow.
     CONFIG.cursorStyle picks the treatment:
       'shooting-star' pointer becomes a WebGL particle trail    (default)
       'glow-arrow'    arrow + accent glow
       'ember-trail'   arrow + drifting ember particles
       'minimal-arrow' arrow only

     One rAF loop moves every layer with translate3d and nothing else — no
     top/left writes, no getBoundingClientRect, no layout reads. The native
     cursor is suppressed only after a genuine move on a fine pointer, so
     touch devices keep the platform behaviour and render nothing here.
     ========================================================================== */
  const CURSOR_STYLES = ['shooting-star', 'glow-arrow', 'ember-trail', 'minimal-arrow'];
  const EMBER_COUNT = 9;

  function initCursor() {
    let style = CURSOR_STYLES.indexOf(CONFIG.cursorStyle) > -1
      ? CONFIG.cursorStyle
      : 'glow-arrow';
    const el = document.getElementById('cursor');
    if (!el) return;

    // The star owns the pointer outright, so it is only allowed to take over
    // when it can actually draw. Reduced motion is the one case where the
    // trail itself is the problem — a moving pointer is the cursor, and the
    // visitor asked for it to stop moving.
    if (style === 'shooting-star' && (ENV.reduced || !ENV.fine)) style = 'glow-arrow';
    const star = style === 'shooting-star' ? initStarCursor() : null;
    if (!star) style = 'glow-arrow';

    const arrow = document.getElementById('curArrow');
    const glow = document.getElementById('curGlow');
    const pill = document.getElementById('curPill');
    const ripple = document.getElementById('curRipple');
    const emberWrap = document.getElementById('curEmbers');

    el.classList.add('mode-' + style);
    if (style !== 'ember-trail') emberWrap.style.display = 'none';

    // Ember particles are plain divs, not canvas: no sizing/clearing cost and
    // they inherit --accent, so the trail matches the scene for free.
    // Reduced motion drops the trail entirely (along with the lag and the
    // press ripple) — drifting particles are exactly the kind of incidental
    // motion that preference exists to suppress.
    const embers = [];
    if (style === 'ember-trail' && !ENV.reduced) {
      for (let i = 0; i < EMBER_COUNT; i++) {
        const d = document.createElement('span');
        d.className = 'cur-ember';
        emberWrap.appendChild(d);
        embers.push({ el: d, x: 0, y: 0, life: 0, size: 1 });
      }
    }

    // No custom cursor at all without a genuine fine pointer.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let mx = innerWidth / 2, my = innerHeight / 2;   // raw pointer
    let gx = mx, gy = my;                             // glow (lags behind)
    let started = false;
    let raf = 0;
    let last = 0;
    let rippleAt = 0;
    let emberHead = 0;
    let emberAcc = 0;
    let lastMX = mx;          // previous pointer position, for ember spawning
    let lastMY = my;

    // Frame-rate independent ease; the lag is removed under reduced motion.
    const ease = (from, to, t, dt) => from + (to - from) * (1 - Math.pow(1 - t, dt * 60));

    const setState = (state) => {
      el.classList.toggle('is-link', state === 'link');
      el.classList.toggle('is-view', state === 'view');
      el.classList.toggle('is-off', state === 'hidden' || state === 'field');
      // Over a text field the custom cursor steps aside and the native
      // caret comes back (see the .is-text-field rules in §05).
      root.classList.toggle('is-text-field', state === 'field');
    };

    // Nearest data-cursor ancestor wins; a text field anywhere under the
    // pointer hands control back to the native caret.
    const stateFor = (target) => {
      if (!target || !target.closest) return null;
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return 'field';
      const host = target.closest('[data-cursor]');
      if (host) {
        const v = host.getAttribute('data-cursor');
        if (v === 'view' || v === 'link' || v === 'hidden') return v;
      }
      if (target.closest('a, button, [role="button"]')) return 'link';
      return null;
    };

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (!started) {
        started = true;
        gx = mx; gy = my;
        // Only now is the native cursor suppressed.
        root.classList.add('cursor-ready');
        el.classList.remove('is-hidden');
      }
      setState(stateFor(e.target));
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    // Leaving the window hides the cursor; coming back restores it.
    document.addEventListener('mouseleave', () => el.classList.add('is-hidden'));
    document.addEventListener('mouseenter', () => { if (started) el.classList.remove('is-hidden'); });
    // Alt-tab never delivers mouseup and would strand is-link and the ripple.
    window.addEventListener('blur', () => { setState(null); el.classList.add('is-hidden'); });
    window.addEventListener('focus', () => { if (started) el.classList.remove('is-hidden'); });

    window.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      setState(stateFor(e.target));
      if (ENV.reduced) return;                 // no ripple under reduced motion
      rippleAt = performance.now();
    }, { passive: true });

    window.addEventListener('mouseup', (e) => setState(stateFor(e.target)), { passive: true });

    // The pointer can change target without moving (scroll under a fixed bar).
    document.addEventListener('mouseover', (e) => {
      if (started) setState(stateFor(e.target));
    });

    const tick = (time) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(0.05, (time - last) / 1000) : 1 / 60;
      last = time;

      const lag = ENV.reduced ? 1 : 0.12;
      gx = ease(gx, mx, lag, dt);
      gy = ease(gy, my, lag, dt);

      arrow.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      if (glow) glow.style.transform = 'translate3d(' + gx + 'px,' + gy + 'px,0)';
      if (pill) pill.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';

      // Ripple: one ring at the pointer, expanding and fading over 350ms.
      if (ripple) {
        const t = rippleAt ? (performance.now() - rippleAt) / 350 : 2;
        if (t >= 1) {
          ripple.style.opacity = '0';
        } else {
          const r = 6 + t * 34;
          ripple.style.opacity = String((1 - t) * 0.55);
          ripple.style.transform =
            'translate3d(' + (mx - r) + 'px,' + (my - r) + 'px,0) scale(' + (r / 6) + ')';
        }
      }

      // Embers spawn on movement and drift down slightly as they fade.
      if (embers.length) {
        if (started) {
          // Distance travelled since the last frame — measured against the
          // previous pointer position, not against a particle's spawn point.
          emberAcc += Math.hypot(mx - lastMX, my - lastMY);
          lastMX = mx; lastMY = my;
          if (emberAcc > 6) {
            emberAcc = 0;
            const p = embers[emberHead];
            emberHead = (emberHead + 1) % embers.length;
            p.x = mx; p.y = my; p.life = 600;
            p.size = 0.6 + Math.random() * 0.8;
          }
        }
        for (let i = 0; i < embers.length; i++) {
          const p = embers[i];
          if (p.life <= 0) { p.el.style.opacity = '0'; continue; }
          p.life -= dt * 1000;
          const k = Math.max(0, p.life) / 600;
          p.y += 0.35;
          const r = 5 * p.size * (0.4 + k * 0.6);
          p.el.style.opacity = String(k * 0.75);
          p.el.style.transform =
            'translate3d(' + (p.x - r) + 'px,' + (p.y - r) + 'px,0) scale(' + (r / 5) + ')';
        }
      }
    };
    raf = requestAnimationFrame(tick);

    APP.cursor = {
      style: style,
      destroy() {
        cancelAnimationFrame(raf);
        window.removeEventListener('mousemove', onMove);
        if (star) star.destroy();
      },
    };
    if (star) APP.star = star;
  }

  /* ==========================================================================
     07c · SHOOTING STAR CURSOR
     A port of "Shooting Star" by Ko.Yelie — https://codepen.io/ko-yelie/pen/LqXWWx
     (MIT; the licence travels with the project as LICENSE-shooting-star.txt).

     The pen is a Parcel bundle of THREE.js + dat.GUI: a full-viewport particle
     field with a scripted intro that flies a star across the title. Only the
     field survives here, and it runs on a bare WebGL context so the portfolio
     keeps its no-THREE.js setup. The particle maths is the author's, unchanged
     apart from the two shader edits listed at the shaders below.

     How it behaves: every pointer sample lays PER_SAMPLE particles along the
     segment travelled since the last sample, each with its own random depth,
     spread direction and birth stamp; the vertex shader flies them out along
     their front vector and the fragment shader flashes and fades them. The
     trail lives in a ring of SAMPLES slots — at `speed` 0.012 a particle dies
     in 1/0.012 ≈ 83ms, so 16 slots hold roughly 4x more history than is ever
     visible while the whole field stays at 12,800 points / 512KB.

     Two deliberate deviations from the author's source, both forced by the port:
       1. `baseColor` is replaced by a uColor uniform, so the trail is tinted by
          the live --accent (icy blue in S3, warm gold elsewhere) like the DOM
          glow it replaces, instead of a hard-coded brown-gold.
       2. gl_FragColor is premultiplied and blending is (ONE, ONE). The pen
          blended (SRC_ALPHA, ONE) into a THREE.js canvas; a standalone context
          needs the premultiplied form for the glow to composite over the page.

     Only the ring slot that changed is re-uploaded (bufferSubData over a
     subarray), the colour is eased toward the accent rather than snapped, and
     the loop parks itself the moment the newest sample has faded — a pointer
     sitting still costs nothing.
     ========================================================================== */
  const STAR = {
    PER_SAMPLE: 800,
    SAMPLES: 16,
    CAMERA_Z: 5000,
    // The author feeds the shader the raw distance travelled between samples,
    // so the trail only reaches full brightness on a fast flick and fades to
    // almost nothing during ordinary movement. That is fine for a scripted
    // intro; it is wrong for a cursor, which has to be there all the time. The
    // gain lifts a normal drag to the top of the ramp (35px per sample, about
    // 2100px/s at 60fps) and the floor keeps a slow, jittering pointer from
    // disappearing outright. Neither touches the geometry — only `mouse.w`.
    MOVE_GAIN: 2.9,
    MOVE_FLOOR: 6,
    // The author's `uniformData` — the pen's dat.GUI sliders at rest, then tuned
    // up for a cursor. Left at his values the trail is a whisper: size 0.05
    // with blur 1 draws 1-3px points, and maxDiff 100 only reaches full
    // brightness on a flick. These values keep his shape and timing and make
    // him legible at the size of a pointer.
    params: {
      size: 0.07, minSize: 1.5, speed: 0.012,
      fadeSpeed: 0.85, shortRangeFadeSpeed: 1.3, minFlashingSpeed: 0.1,
      spread: 8, maxSpread: 6, maxZ: 100, blur: 0.75,
      far: 14, maxDiff: 55, diffPow: 0.3,
    },
  };

  const STAR_VS = `precision highp float;
precision highp int;
#define GLSLIFY 1
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec4 mouse;
attribute vec2 aFront;
attribute float random;

uniform vec2 resolution;
uniform float pixelRatio;
uniform float timestamp;

uniform float size;
uniform float minSize;
uniform float speed;
uniform float far;
uniform float spread;
uniform float maxSpread;
uniform float maxZ;
uniform float maxDiff;
uniform float diffPow;

varying float vProgress;
varying float vRandom;
varying float vDiff;
varying float vSpreadLength;
varying float vPositionZ;

float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
}

const float PI = 3.1415926;
const float PI2 = PI * 2.;

void main () {
  float progress = clamp((timestamp - mouse.z) * speed, 0., 1.);
  progress *= step(0., mouse.x);

  float startX = mouse.x - resolution.x / 2.;
  float startY = mouse.y - resolution.y / 2.;
  vec3 startPosition = vec3(startX, startY, random);

  float diff = clamp(mouse.w / maxDiff, 0., 1.);
  diff = pow(diff, diffPow);

  vec3 cPosition = position * 2. - 1.;

  float radian = cPosition.x * PI2 - PI;
  vec2 xySpread = vec2(cos(radian), sin(radian)) * spread * mix(1., maxSpread, diff) * cPosition.y;

  vec3 endPosition = startPosition;
  endPosition.xy += xySpread;
  endPosition.xy -= aFront * far * random;
  endPosition.z += cPosition.z * maxZ * (pixelRatio > 1. ? 1.2 : 1.);

  float positionProgress = cubicOut(progress * random);
  vec3 currentPosition = mix(startPosition, endPosition, positionProgress);

  vProgress = progress;
  vRandom = random;
  vDiff = diff;
  vSpreadLength = cPosition.y;
  vPositionZ = position.z;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(currentPosition, 1.);
  gl_PointSize = max(currentPosition.z * size * diff * pixelRatio, minSize * (pixelRatio > 1. ? 1.3 : 1.));
}`;

  const STAR_FS = `precision highp float;
precision highp int;
#define GLSLIFY 1

uniform float fadeSpeed;
uniform float shortRangeFadeSpeed;
uniform float minFlashingSpeed;
uniform float blur;
uniform vec3 uColor;

varying float vProgress;
varying float vRandom;
varying float vDiff;
varying float vSpreadLength;
varying float vPositionZ;

highp float random(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

float quadraticIn(float t) {
  return t * t;
}

#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#endif

float sineOut(float t) {
  return sin(t * HALF_PI);
}

void main(){
  vec2 p = gl_PointCoord * 2. - 1.;
  float len = length(p);

  float cRandom = random(vec2(vProgress * mix(minFlashingSpeed, 1., vRandom)));
  cRandom = mix(0.3, 2., cRandom);

  float cBlur = blur * mix(1., 0.3, vPositionZ);
  float shape = smoothstep(1. - cBlur, 1. + cBlur, (1. - cBlur) / len);
  shape *= mix(0.5, 1., vRandom);

  if (shape == 0.) discard;

  float darkness = mix(0.1, 1., vPositionZ);

  float alphaProgress = vProgress * fadeSpeed * mix(2.5, 1., pow(vDiff, 0.6));
  alphaProgress *= mix(shortRangeFadeSpeed, 1., sineOut(vSpreadLength) * quadraticIn(vDiff));
  float alpha = 1. - min(alphaProgress, 1.);
  alpha *= cRandom * vDiff;

  // Premultiplied (see the note above the shaders) so the additive trail
  // composites over the page instead of over an opaque canvas.
  gl_FragColor = vec4(uColor * darkness * cRandom * shape * alpha, shape * alpha);
}`;

  function initStarCursor() {
    const canvas = document.getElementById('starCursor');
    const cursorEl = document.getElementById('cursor');
    if (!canvas || !cursorEl || !ENV.fine) return null;

    const gl = canvas.getContext('webgl', {
      alpha: true, depth: false, stencil: false, antialias: false,
      premultipliedAlpha: true, powerPreference: 'high-performance',
    });
    if (!gl) return null;

    const compile = (type, src, label) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn('[star cursor] ' + label + ' failed:', gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, STAR_VS, 'vertex shader');
    const fs = compile(gl.FRAGMENT_SHADER, STAR_FS, 'fragment shader');
    if (!vs || !fs) return null;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('[star cursor] link failed:', gl.getProgramInfoLog(prog));
      return null;
    }
    gl.useProgram(prog);

    const U = {};
    [
      'resolution', 'pixelRatio', 'timestamp', 'uColor', 'size', 'minSize', 'speed',
      'fadeSpeed', 'shortRangeFadeSpeed', 'minFlashingSpeed', 'spread', 'maxSpread',
      'maxZ', 'blur', 'far', 'maxDiff', 'diffPow', 'modelViewMatrix', 'projectionMatrix',
    ].forEach((n) => { U[n] = gl.getUniformLocation(prog, n); });

    /* --- geometry ---------------------------------------------------------------
       position (vec3) drives the particle's place inside its own star: x is the
       angle around the front vector, y the distance along it, z the depth.
       mouse (vec4) is rewritten every sample — x/y the birth point in the
       shader's origin-at-centre space, z the birth stamp, w the pointer speed
       that scales brightness and spread. */
    const P = STAR.PER_SAMPLE, SLOTS = STAR.SAMPLES, N = P * SLOTS;
    const pos = new Float32Array(N * 3);
    const mouse = new Float32Array(N * 4);
    const front = new Float32Array(N * 2);
    const rand = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = Math.random();
      pos[i * 3 + 1] = Math.random();
      pos[i * 3 + 2] = Math.random();
      mouse[i * 4] = -1;        // x < 0 until first use — the shader hides it
      rand[i] = Math.random();
    }

    const buffer = (data, usage) => {
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, usage || gl.STATIC_DRAW);
      return b;
    };
    const bPos = buffer(pos);
    const bMouse = buffer(mouse, gl.DYNAMIC_DRAW);
    const bFront = buffer(front, gl.DYNAMIC_DRAW);
    const bRand = buffer(rand);

    const attr = (b, name, size) => {
      const loc = gl.getAttribLocation(prog, name);
      if (loc < 0) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    attr(bPos, 'position', 3);
    attr(bMouse, 'mouse', 4);
    attr(bFront, 'aFront', 2);
    attr(bRand, 'random', 1);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.clearColor(0, 0, 0, 0);
    // The field is unrotated and unscaled, so the camera's matrix is the pure
    // translation that puts it at z = CAMERA_Z looking down -Z (what THREE would
    // have built). Leaving it at identity would put the particles in the camera
    // plane, where w collapses to zero and nothing rasterises.
    if (U.modelViewMatrix) {
      gl.uniformMatrix4fv(U.modelViewMatrix, false, new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, -STAR.CAMERA_Z, 1,
      ]));
    }

    /* --- sizing -----------------------------------------------------------------
       The pen's fov is atan(H/2/CAMERA_Z)*2, so tan(fov/2) = (H/2)/CAMERA_Z and
       the vertical scale collapses to 2*CAMERA_Z/H. `rate` is the author's
       setSize(): after a resize the field keeps the scale it had at load rather
       than stretching with the viewport. */
    const w0 = canvas.clientWidth || window.innerWidth;
    const h0 = canvas.clientHeight || window.innerHeight;
    const proj = new Float32Array(16);
    let W = w0, H = h0, halfW = w0 / 2, halfH = h0 / 2, rate = 1;
    // `speed` is progress per millisecond, so a particle reaches progress 1 after
    // 1/speed ms — 83ms at the author's 0.012. Not 1000/speed: that would keep
    // the loop spinning for a minute and a half after the pointer stops.
    const LIFE = 1 / STAR.params.speed;

    function resize() {
      W = canvas.clientWidth || window.innerWidth;
      H = canvas.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const bw = Math.max(1, Math.round(W * dpr));
      const bh = Math.max(1, Math.round(H * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      halfW = W / 2;
      halfH = H / 2;
      rate = Math.min(W / H > 1 ? H / h0 : W / w0, 1) * (1 / (H / h0));

      const f = (2 * STAR.CAMERA_Z) / H;
      const near = 0.1, far = STAR.CAMERA_Z;
      proj.fill(0);
      proj[0] = f / (W / H);
      proj[5] = f;
      proj[10] = (far + near) / (near - far);
      proj[11] = -1;
      proj[14] = (2 * far * near) / (near - far);
      if (U.projectionMatrix) gl.uniformMatrix4fv(U.projectionMatrix, false, proj);

      gl.viewport(0, 0, bw, bh);
      if (U.pixelRatio) gl.uniform1f(U.pixelRatio, dpr);
      if (U.resolution) gl.uniform2f(U.resolution, W, H);
    }
    resize();

    Object.keys(STAR.params).forEach((k) => {
      if (U[k]) gl.uniform1f(U[k], STAR.params[k]);
    });
    // Pushed again every frame below, so editing STAR.params at runtime (the
    // pen's own suggestion) actually takes effect.

    /* --- trail state ------------------------------------------------------------ */
    let head = 0, oldX = 0, oldY = 0, seeded = false;
    let ts = 0, lastSample = -1e9, raf = 0, frameNo = 0;

    function sample(clientX, clientY) {
      const x = (clientX - halfW) * rate + halfW;
      const y = H - ((clientY - halfH) * rate + halfH);
      const dx = seeded ? x - oldX : 0;
      const dy = seeded ? y - oldY : 0;
      const raw = Math.sqrt(dx * dx + dy * dy);
      const len = Math.max(STAR.MOVE_FLOOR, raw * STAR.MOVE_GAIN);
      // Normalised on the true distance, not the gained one — the gain is a
      // brightness/spread signal only, and must not shorten the tail.
      const fx = raw > 0.001 ? dx / raw : 0;
      const fy = raw > 0.001 ? dy / raw : 0;
      const base = head * P * 4;
      const baseF = head * P * 2;
      for (let i = 0; i < P; i++) {
        const k = i / P;
        const o = base + i * 4;
        mouse[o] = seeded ? oldX + dx * k : x;
        mouse[o + 1] = seeded ? oldY + dy * k : y;
        mouse[o + 2] = ts;
        mouse[o + 3] = len;
        front[baseF + i * 2] = fx;
        front[baseF + i * 2 + 1] = fy;
      }
      seeded = true;
      oldX = x;
      oldY = y;
      lastSample = ts;
      head = (head + 1) % SLOTS;
      // One slot changed — re-upload only that slot instead of all 512KB.
      gl.bindBuffer(gl.ARRAY_BUFFER, bMouse);
      gl.bufferSubData(gl.ARRAY_BUFFER, base * 4, mouse.subarray(base, base + P * 4));
      gl.bindBuffer(gl.ARRAY_BUFFER, bFront);
      gl.bufferSubData(gl.ARRAY_BUFFER, baseF * 4, front.subarray(baseF, baseF + P * 2));
    }

    /* --- accent tint ------------------------------------------------------------
       --accent is written to <html> inline (a hex at boot, an rgb() during a
       scene morph), so reading it back costs a style read, not a recalc. Sampled
       a few times a second and eased, which is all a colour morph can show. */
    const tint = new Float32Array([1, 0.769, 0.42]);   // the site's warm gold
    const goal = new Float32Array([1, 0.769, 0.42]);

    function readAccent() {
      const raw = (root.style.getPropertyValue('--accent') || '').trim();
      if (!raw) return;
      let r, g, b;
      if (raw.charAt(0) === '#') {
        const h = raw.length === 4
          ? raw.slice(1).split('').map((c) => c + c).join('')
          : raw.slice(1);
        r = parseInt(h.slice(0, 2), 16);
        g = parseInt(h.slice(2, 4), 16);
        b = parseInt(h.slice(4, 6), 16);
      } else {
        const n = raw.match(/-?[\d.]+/g);
        if (!n || n.length < 3) return;
        r = +n[0]; g = +n[1]; b = +n[2];
      }
      if (!isFinite(r) || !isFinite(g) || !isFinite(b)) return;
      goal[0] = r / 255;
      goal[1] = g / 255;
      goal[2] = b / 255;
    }
    readAccent();

    /* --- frame loop -------------------------------------------------------------
       Parks itself once the trail is gone and restarts on the next move. */
    function frame(now) {
      // This listener is registered before initCursor's own mousemove handler,
      // so at the moment the event fires the suppression classes still describe
      // the PREVIOUS event. Deciding here instead means every listener for the
      // event has already run: entering a text field no longer flashes one
      // frame of trail over the caret, and leaving one no longer drops the
      // first move.
      if (hasPending) {
        hasPending = false;
        if (!suppressed()) {
          ts = Math.max(ts, now);
          sample(pendingX, pendingY);
        }
      }
      if (now - lastSample > LIFE + 40) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
      ts = Math.max(ts, now);

      const hidden = cursorEl.classList.contains('is-hidden');
      canvas.classList.toggle('is-hidden', hidden);
      canvas.classList.toggle('is-off',
        hidden || root.classList.contains('is-text-field') || cursorEl.classList.contains('is-off'));

      if (++frameNo % 5 === 0) readAccent();
      for (let i = 0; i < 3; i++) tint[i] += (goal[i] - tint[i]) * 0.14;
      for (const k in STAR.params) if (U[k]) gl.uniform1f(U[k], STAR.params[k]);

      gl.clear(gl.COLOR_BUFFER_BIT);
      if (U.uColor) gl.uniform3f(U.uColor, tint[0], tint[1], tint[2]);
      if (U.timestamp) gl.uniform1f(U.timestamp, ts);
      gl.drawArrays(gl.POINTS, 0, N);
    }

    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

    // The star does not sample while the pointer is somewhere the native cursor
    // is in charge — over a text field, or over the element marked hidden —
    // otherwise the trail would smear across the caret it is meant to reveal.
    const suppressed = () => root.classList.contains('is-text-field')
      || cursorEl.classList.contains('is-off')
      || cursorEl.classList.contains('is-hidden');

    // Only the coordinates are latched here. Suppression is judged in frame(),
    // where the classes are current.
    let pendingX = 0, pendingY = 0, hasPending = false;

    const onMove = (e) => {
      // Cursor-ready is set by initCursor on the first genuine move, which is
      // also the moment the native cursor is suppressed: before it, both show.
      if (!root.classList.contains('cursor-ready')) return;
      pendingX = e.clientX;
      pendingY = e.clientY;
      hasPending = true;
      kick();
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 100);
    };
    window.addEventListener('resize', onResize);

    // A lost context would otherwise leave the pointer with no cursor at all,
    // since the native one is already suppressed: hand it back instead.
    const onLost = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      canvas.classList.add('is-dead');
      root.classList.remove('cursor-ready');
    };
    canvas.addEventListener('webglcontextlost', onLost);

    return {
      style: 'shooting-star',
      particles: N,
      params: STAR.params,   // live: edits are uploaded on the next frame
      destroy() {
        cancelAnimationFrame(raf);
        clearTimeout(resizeTimer);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('resize', onResize);
        canvas.removeEventListener('webglcontextlost', onLost);
        const lose = gl.getExtension('WEBGL_lose_context');
        if (lose) lose.loseContext();
        canvas.classList.add('is-dead');
      },
    };
  }

  /* Magnetic pull for primary buttons and the Email me circle: a capped
     distance in px rather than a fraction of the gap, so the pull feels the
     same on a small button and a large circle. */
  function initMagnetics() {
    if (!ENV.fine || !ENV.motion) return;
    const PULL = 12;   // px maximum, per the type/cursor spec (8-12px range)
    const movers = Array.from(document.querySelectorAll('[data-magnetic]')).map((el) => ({
      el,
      rect: null,
      rectAt: 0,
      xTo: window.gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' }),
      yTo: window.gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' }),
    }));
    window.addEventListener('mousemove', (e) => {
      const now = performance.now();
      for (const m of movers) {
        // Cache the rect: reading layout per pointer event is the expensive
        // part, and these elements only really move on resize or scroll.
        if (!m.rect || now - m.rectAt > 200) { m.rect = m.el.getBoundingClientRect(); m.rectAt = now; }
        const r = m.rect;
        if (!r || !r.width) continue;
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        if (Math.hypot(dx, dy) > Math.max(r.width, r.height) * 0.75 + 28) { m.xTo(0); m.yTo(0); continue; }
        const d = Math.hypot(dx, dy) || 1;
        const pull = Math.min(PULL, d * 0.3);
        m.xTo((dx / d) * pull);
        m.yTo((dy / d) * pull);
      }
    }, { passive: true });
  }

/* ==========================================================================
     07c · PRELOADER
     Progress is driven by real readiness signals — webfonts, the GSAP CDN,
     and the first decoded frame of scene one. rAF only SMOOTHS the bar; the
     exit itself is driven by complete(), which fires on real completion and
     from a hard guard, so a starved frame loop can never trap the visitor.
     ========================================================================== */
  const Loader = {
    el: null, fill: null, pct: null, status: null,
    shown: 0, target: 0, done: false, floorAt: 0, lastPaint: 0, guard: 0,

    init() {
      this.el = document.getElementById('loader');
      if (!this.el) return;
      this.fill = document.getElementById('loaderFill');
      this.pct = document.getElementById('loaderPct');
      this.status = document.getElementById('loaderStatus');

      // Minimum on-screen time, so a warm cache does not flash the loader.
      this.floorAt = performance.now() + (ENV.reduced ? 0 : 620);

      // Scroll is locked by the `is-loading` class in the markup, not here,
      // so it is already in force before this script runs.
      this.lastPaint = performance.now();
      requestAnimationFrame(() => this.tick());
      this.guard = setTimeout(() => this.complete(), 7000);
    },

    step(pct, text) {
      if (this.done) return;
      this.target = Math.max(this.target, pct);
      if (text && this.status) this.status.textContent = text;
      if (this.target >= 100) this.complete();
    },

    tick() {
      if (this.done) return;
      const now = performance.now();
      const dt = Math.min(0.1, (now - this.lastPaint) / 1000);
      this.lastPaint = now;
      this.shown += (this.target - this.shown) * (1 - Math.pow(0.02, dt));
      if (this.target - this.shown < 0.4) this.shown = this.target;
      this.paint();
      requestAnimationFrame(() => this.tick());
    },

    paint() {
      if (this.fill) this.fill.style.transform = 'scaleX(' + this.shown / 100 + ')';
      if (this.pct) this.pct.textContent = String(Math.round(this.shown)).padStart(3, '0');
    },

    /* Snap to full and release the page. Called on real completion AND by the
       guard timer, so a starved rAF can never leave the visitor locked out. */
    complete() {
      if (this.done) return;
      this.done = true;
      clearTimeout(this.guard);
      if (window.__loaderFailsafe) { clearTimeout(window.__loaderFailsafe); window.__loaderFailsafe = 0; }
      this.shown = 100;
      this.target = 100;
      this.paint();
      if (this.status) this.status.textContent = 'READY';

      const wait = Math.max(0, this.floorAt - performance.now());
      setTimeout(() => {
        root.classList.remove('is-loading');
        root.classList.add('is-ready');
        setTimeout(() => { if (this.el) this.el.remove(); }, ENV.reduced ? 0 : 900);
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      }, wait);
    },

    /* Resolves once scene one has a decoded frame to show, or immediately if
       there will never be one (poster-only mode, or a blocked play()). */
    firstFrame(scene) {
      return new Promise((resolve) => {
        const v = scene && scene.front;
        if (!v || ENV.postersOnly || !v.currentSrc) return resolve();
        let settled = false;
        const done = () => {
          if (settled) return;
          settled = true;
          v.removeEventListener('loadeddata', done);
          v.removeEventListener('canplay', done);
          clearTimeout(timer);
          resolve();
        };
        const timer = setTimeout(done, 2600);
        // HAVE_CURRENT_DATA (2) or better means `loadeddata` ALREADY fired and
        // never will again, so waiting for it would always stall to the
        // timeout. Check state first, then listen for a clip still arriving.
        if (v.readyState >= 2) return done();
        v.addEventListener('loadeddata', done);
        v.addEventListener('canplay', done);
      });
    },
  };

  /* ==========================================================================
     08 · SCENE SYSTEM
     Seven .scene wrappers, each holding an A/B <video> pair that crossfades
     into itself for a seamless loop. Scrubbed wrapper crossfades, zoom +
     parallax, per-scene scrim and accent.
     ========================================================================== */
  const SceneSystem = {
    scenes: [],
    sections: [],
    activeIndex: 0,
    paused: false,
    booted: false,

    init() {
      const layer = document.getElementById('sceneLayer');
      this.sections = SCENES.sections.map((s) => document.getElementById(s.id)).filter(Boolean);

      SCENES.sections.forEach((s, i) => {
        const wrap = document.createElement('div');
        wrap.className = 'scene' + (i === 0 ? ' is-active' : '');
        wrap.setAttribute('aria-hidden', 'true');

        // Two identical clips per scene. Neither element loops; the A/B
        // crossfade below is what makes the loop seamless.
        const mk = (isFront) => {
          const v = document.createElement('video');
          v.muted = true;            // muted is what makes autoplay legal
          v.playsInline = true;
          v.loop = false;            // looping is driven by the A/B swap, not the element
          v.preload = i === 0 ? 'auto' : 'metadata';
          v.setAttribute('poster', `assets/posters/${s.scene}.jpg`);
          v.style.objectPosition = (ENV.mobile ? s.objectPosition.mobile : s.objectPosition.desktop);
          v.style.opacity = isFront ? '1' : '0';
          if (!ENV.postersOnly) v.src = this.sourceFor(s);
          return v;
        };

        const a = mk(true), b = mk(false);
        wrap.appendChild(a);
        wrap.appendChild(b);
        layer.appendChild(wrap);

        this.scenes.push({
          wrap, a, b, front: a, back: b,
          rate: s.playbackRate || SCENES.rate,
          fading: false, raf: 0, tweenFront: null, tweenBack: null,
        });
      });

      if (ENV.postersOnly) {
        document.body.classList.add('is-poster-only');
        return; // posters only: no clips fetched, crossfades still handled below
      }
      this.wirePlayback();
    },

    sourceFor(s) {
      const base = 'assets/video/';
      if (ENV.mobile) return base + s.scene + '-m.mp4';      // portrait: 720p
      if (ENV.webm) return base + s.scene + '.webm';        // webm first where supported
      return base + s.scene + '.mp4';
    },

    /* Drive playback from scroll position (the brief's ">50% in view" rule)
       rather than an IntersectionObserver, whose callbacks can be throttled and
       leave a section silently unplayed. */
    wirePlayback() {
      this.evaluateActive();
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.scenes.forEach((sc) => this.halt(sc));
        } else if (!this.paused) {
          this.start(this.activeIndex);
        }
      });
    },

    /* The scene whose box contains the viewport midpoint is the active one. */
    evaluateActive() {
      const mid = window.innerHeight / 2;
      let idx = this.activeIndex;
      for (let i = 0; i < this.sections.length; i++) {
        const r = this.sections[i].getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) { idx = i; break; }
        if (r.top > mid) { idx = i; break; }
      }
      if (idx !== this.activeIndex || !this.booted) {
        // `booted` forces the first activation: on load idx already equals
        // activeIndex (0), which would otherwise skip the loop start entirely.
        this.booted = true;
        this.leave(this.activeIndex);
        this.enter(idx);
      }
    },

    enter(i) {
      this.activeIndex = i;
      this.start(i);
      this.budget(i);
      this.setMeter(i);
    },
    leave(i) { const sc = this.scenes[i]; if (sc) this.halt(sc); },

    /* ---- seamless A/B loop --------------------------------------------- */
    start(i) {
      const sc = this.scenes[i];
      if (!sc || this.paused || ENV.postersOnly) return;
      // Re-arm from whatever roles the previous fade left behind.
      sc.tweenFront && sc.tweenFront.kill();
      sc.tweenBack && sc.tweenBack.kill();
      window.gsap.set(sc.front, { opacity: 1 });
      window.gsap.set(sc.back, { opacity: 0 });
      sc.fading = false;
      sc.front.playbackRate = sc.rate;
      try { sc.front.currentTime = 0; } catch (e) { /* not seekable yet */ }
      sc.back.pause();
      this.safePlay(sc.front);
      if (SCENES.loop) this.pump(sc);
    },

    /* Stop the loop: cancel the frame, kill any in-flight fade, pause both. */
    halt(sc) {
      if (!sc) return;
      if (sc.raf) cancelAnimationFrame(sc.raf);
      sc.raf = 0;
      sc.tweenFront && sc.tweenFront.kill();
      sc.tweenBack && sc.tweenBack.kill();
      sc.tweenFront = sc.tweenBack = null;
      sc.a.pause();
      sc.b.pause();
      sc.fading = false;
    },

    /* rAF loop: when the front clip enters its lead window, start the swap. */
    pump(sc) {
      const step = () => {
        sc.raf = requestAnimationFrame(step);
        if (this.paused || document.hidden) return;
        const v = sc.front;
        const rate = v.playbackRate || sc.rate;
        // Lead in MEDIA seconds: a 0.5x scene (S6) starts its swap earlier in
        // wall-clock terms than a 0.8x one, so the seam lands at the same frame.
        const lead = SCENES.loopFade * rate;
        if (!sc.fading && v.duration && (v.duration - v.currentTime) <= lead) this.crossfade(sc, rate);
      };
      sc.raf = requestAnimationFrame(step);
    },

    crossfade(sc, rate) {
      sc.fading = true;
      const front = sc.front, back = sc.back;
      try { back.currentTime = 0; } catch (e) { /* not seekable yet */ }
      back.playbackRate = rate;
      this.safePlay(back);

      const d = SCENES.loopFade;
      sc.tweenBack = window.gsap.to(back, { opacity: 1, duration: d, ease: 'none' });
      sc.tweenFront = window.gsap.to(front, {
        opacity: 0, duration: d, ease: 'none',
        onComplete: () => {
          front.pause();
          front.style.opacity = '0';
          const t = sc.front;
          sc.front = sc.back;   // swap roles for the next pass
          sc.back = t;
          sc.tweenFront = sc.tweenBack = null;
          sc.fading = false;
        },
      });
    },

    safePlay(v) {
      const p = v.play();
      if (p && typeof p.catch === 'function') {
        p.catch((err) => {
          const name = err && err.name;
          // AbortError = a play interrupted by pause()/seek, i.e. normal while
          // looping or scrolling. ONLY a policy block means "no video".
          if (name === 'NotAllowedError') this.fallbackToPosters();
          else if (name !== 'AbortError') console.warn('Scene play() failed:', name);
        });
      }
    },

    /* Only the active scene and the next one may decode (both clips each). */
    budget(active) {
      this.scenes.forEach((sc, i) => {
        const near = i === active || i === active + 1;
        sc.a.preload = sc.b.preload = near ? 'auto' : 'metadata';
        if (!near) { sc.a.pause(); sc.b.pause(); }
      });
    },

    /* Autoplay refused (strict policy, no user gesture yet): stop decoding, show posters. */
    fallbackToPosters() {
      if (document.body.classList.contains('is-poster-only')) return;
      document.body.classList.add('is-poster-only');
      this.scenes.forEach((sc) => {
        this.halt(sc);
        [sc.a, sc.b].forEach((v) => { v.removeAttribute('src'); v.load(); });
      });
      console.warn('Scene autoplay blocked — falling back to poster images.');
    },

    setMeter(i) {
      document.querySelectorAll('#meterList .meter-item').forEach((el, n) => {
        if (n === i) el.setAttribute('aria-current', 'true');
        else el.removeAttribute('aria-current');
      });
    },

    /* ---- scroll-linked motion, built once triggers exist ---- */
    choreograph(gsap, ScrollTrigger) {
      const { from: zf, to: zt, parallax } = SCENES.zoom;

      // Crossfades: opacity is scrubbed across each section boundary, so the
      // transition follows the scrollbar and reverses when scrolling up.
      //
      // Each WRAPPER belongs to TWO boundaries (incoming for one, outgoing for
      // the next), so tweening opacity directly would make their `from` values
      // fight. Instead one scrubbed proxy per boundary writes BOTH wrappers from
      // a single progress value, and nothing renders while the boundary is
      // inactive — so the resting state stays whatever CSS gave us.
      // (The A/B clips inside keep their own opacity: that pair is the loop.)
      const boundaryVars = (i) => ({
        trigger: this.sections[i], start: 'top 80%', end: 'top 30%', scrub: 0.35,
      });
      for (let i = 0; i < this.scenes.length - 1; i++) {
        const out = this.scenes[i].wrap, into = this.scenes[i + 1].wrap;
        const fade = { p: 0 };
        gsap.to(fade, {
          p: 1, ease: 'none', immediateRender: false,
          onUpdate: () => {
            out.style.opacity = String(1 - fade.p);
            into.style.opacity = String(fade.p);
          },
          scrollTrigger: boundaryVars(i + 1),
        });

        // Scrim + accent morph across the same boundary.
        const a = SCENES.sections[i], b = SCENES.sections[i + 1];
        const sa = scrimStops(a), sb = scrimStops(b);
        const morph = { t: 0 };
        gsap.to(morph, {
          t: 1, ease: 'none', immediateRender: false,
          onUpdate: () => {
            root.style.setProperty('--sa-l', sa.l + (sb.l - sa.l) * morph.t);
            root.style.setProperty('--sa-m', sa.m + (sb.m - sa.m) * morph.t);
            root.style.setProperty('--sa-r', sa.r + (sb.r - sa.r) * morph.t);
            root.style.setProperty('--accent', mixHex(a.accent, b.accent, morph.t));
          },
          scrollTrigger: boundaryVars(i + 1),
        });
      }

      // Slow zoom + vertical parallax so the footage never looks frozen.
      // Applied to the wrapper so both A/B clips move together.
      // Skipped in poster-only mode: the CSS slow zoom owns the transform there.
      if (!ENV.postersOnly) {
        this.scenes.forEach((sc, i) => {
          gsap.fromTo(sc.wrap,
            { scale: zf, yPercent: -parallax },
            { scale: zt, yPercent: parallax, ease: 'none',
              scrollTrigger: { trigger: this.sections[i], start: 'top bottom', end: 'bottom top', scrub: true } });
        });
      }

      // Meter active state + first-section defaults, plus the scroll-driven
      // playback watcher.
      this.sections.forEach((sec, i) => {
        ScrollTrigger.create({
          trigger: sec, start: 'top 55%', end: 'bottom 45%',
          onToggle: (self) => { if (self.isActive) this.setMeter(i); },
        });
      });
      ScrollTrigger.create({
        trigger: document.body, start: 'top top', end: 'bottom bottom',
        onUpdate: () => this.evaluateActive(),
        onRefresh: () => this.evaluateActive(),
      });
      this.setMeter(0);
    },
  };

  /* ==========================================================================
     09 · CHOREOGRAPHY — text reveals, built per breakpoint
     ========================================================================== */
  function setupChoreography() {
    const gsap = window.gsap;
    const mm = gsap.matchMedia();

    mm.add({
      desktop: '(min-width: 769px) and (prefers-reduced-motion: no-preference)',
      compact: '(max-width: 768px), (hover: none), (pointer: coarse)',
      reduced: '(prefers-reduced-motion: reduce)',
    }, (ctx) => {
      const { desktop, reduced } = ctx.conditions;
      if (reduced) return;   // nothing hidden, nothing scrubbed — content is simply there

      const navOn = { start: 80, end: 'max', toggleClass: { targets: '#siteNav', className: 'is-scrolled' } };
      window.ScrollTrigger.create(navOn);

      // Masked headline reveals, one per panel.
      gsap.utils.toArray('.panel .mask-inner').forEach((el) => {
        gsap.from(el, {
          yPercent: 118, duration: desktop ? 1.25 : 1, ease: 'expo.out',
          scrollTrigger: { trigger: el.closest('.panel, section') || el, start: 'top 82%' },
        });
      });

      const rise = (sel, triggerSel, extra = {}) => {
        gsap.from(sel, {
          y: 40, autoAlpha: 0, duration: desktop ? 1.1 : 0.9, ease: 'expo.out',
          stagger: desktop ? 0.09 : 0.06, scrollTrigger: { trigger: triggerSel, start: 'top 82%' },
          ...extra,
        });
      };

      rise('.sec-label', '.sec-head');
      rise('.lead, .lead-sub, .panel-foot', '#home');
      rise('.about-copy', '#about');
      rise('.quote', '#quotes', { stagger: 0.1 });
      rise('#contact .sec-label, .contact-form, .btn-magnetic, .social-link', '#contact');
      rise('.closing-line, #siteFoot', '#end');

      // Skill groups: cards rise, then each card's chips stagger in sequence
      // so the reveal reads as five groups rather than one flat wall of chips.
      gsap.from('.skill-card', {
        y: 40, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.09,
        scrollTrigger: { trigger: '#skillBento', start: 'top 84%' },
      });
      gsap.from('.skill-chip', {
        y: 10, autoAlpha: 0, duration: 0.5, ease: 'power2.out',
        delay: (i, el) => {
          const card = el.closest('.skill-card');
          const cards = Array.from(document.querySelectorAll('.skill-card'));
          const c = cards.indexOf(card);
          const k = Array.from(card.querySelectorAll('.skill-chip')).indexOf(el);
          return c * 0.09 + k * 0.035;
        },
        scrollTrigger: { trigger: '#skillBento', start: 'top 84%' },
      });

      // Cards: stagger + count-in numerals
      gsap.utils.toArray('#workGrid .card').forEach((card, i) => {
        const num = card.querySelector('.card-num');
        const obj = { v: 0 };
        gsap.to(obj, {
          v: parseInt(num.textContent, 10) || i + 1, duration: 1.4, ease: 'expo.out',
          onUpdate: () => { num.textContent = pad2(Math.round(obj.v)); },
          scrollTrigger: { trigger: card, start: 'top 88%' },
        });
        gsap.from(card, {
          y: 46, autoAlpha: 0, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: card, start: 'top 88%' },
        });
      });

      if (desktop) {
        // Gentle section drift so long panels feel alive.
        gsap.utils.toArray('.sec-title').forEach((t) => {
          gsap.fromTo(t, { xPercent: -2 }, { xPercent: 2, ease: 'none',
            scrollTrigger: { trigger: t.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } });
        });
      }
    });
  }

  /* ==========================================================================
     10 · PROGRESS METER + BACKGROUND TOGGLE
     ========================================================================== */
  function initMeter() {
    const list = document.getElementById('meterList');
    SCENES.sections.forEach((s, i) => {
      const li = document.createElement('li');
      li.className = 'meter-item';
      li.innerHTML = `<button class="meter-dot-btn" data-target="${s.id}" aria-label="Go to ${s.label} section"><span class="meter-label">${s.label}</span><span class="meter-dot" aria-hidden="true"></span></button>`;
      list.appendChild(li);
    });
    list.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-target]');
      if (!btn) return;
      const target = document.getElementById(btn.getAttribute('data-target'));
      if (target) scrollToTarget(target);
    });
  }

  function initBackToTop() {
    const btn = document.getElementById('backTop');
    if (btn) btn.addEventListener('click', () => scrollToTarget(document.getElementById('home')));
  }

  /* ==========================================================================
     11 · CASE-STUDY OVERLAY (FLIP from the card, Esc + back-button aware)
     ========================================================================== */
  function initOverlay() {
    const el = document.getElementById('caseOverlay');
    const backdrop = document.getElementById('caseBackdrop');
    const scrollBox = document.getElementById('caseScroll');
    const mediaBox = document.getElementById('caseMediaBox');
    const img = document.getElementById('caseImg');
    const body = document.getElementById('caseBody');
    const closeBtn = document.getElementById('caseClose');
    const cardArt = (i) => `assets/posters/${SCENES.sections[i] ? SCENES.sections[i].scene : 's1'}.jpg`;

    const O = { el, isOpen: false, busy: false, pushed: false, activeIndex: -1, lastFocus: null };

    const lockScroll = (lock) => {
      if (APP.lenis) lock ? APP.lenis.stop() : APP.lenis.start();
      root.classList.toggle('has-overlay', lock);
    };
    const finishClose = () => {
      el.hidden = true;
      window.gsap.set([backdrop, body], { clearProps: 'opacity' });
      window.gsap.set(body.children, { clearProps: 'transform,opacity' });
      window.gsap.set(mediaBox, { clearProps: 'transform' });
      lockScroll(false);
      O.busy = false;
      if (O.lastFocus) O.lastFocus.focus();
    };

    O.open = (i, opts = {}) => {
      if (O.isOpen || O.busy) return;
      const p = CONFIG.projects[i];
      if (!p) return;
      O.isOpen = true; O.activeIndex = i;
      O.lastFocus = (document.activeElement && document.activeElement !== document.body)
        ? document.activeElement
        : document.querySelector('.card-link[data-case="' + i + '"]');

      document.getElementById('caseIndex').textContent = pad2(i + 1) + ' / ' + pad2(CONFIG.projects.length);
      document.getElementById('caseTitle').textContent = p.title;
      document.getElementById('caseProblem').textContent = p.problem;
      document.getElementById('caseStack').textContent = p.stack.join('  ·  ');
      document.getElementById('caseRole').textContent = p.role;
      document.getElementById('caseOutcome').textContent = p.outcome;
      document.getElementById('caseLinkLive').href = p.link || '#';
      document.getElementById('caseLinkRepo').href = p.repo || '#';
      img.src = cardArt(i);
      img.alt = p.title + ' — case study image';

      scrollBox.scrollTop = 0;
      el.hidden = false;
      lockScroll(true);

      const mode = opts.mode || 'push';
      if (mode === 'push') { history.pushState({ case: i }, '', '#case-' + p.slug); O.pushed = true; }
      else O.pushed = false;

      if (ENV.motion && !opts.instant) {
        O.busy = true;
        const gsap = window.gsap;
        const tl = gsap.timeline({ onComplete: () => { O.busy = false; } });
        tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out' }, 0)
          .fromTo(body.children, { y: 34, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.06 }, 0.15);
        setTimeout(() => closeBtn.focus(), 500);
      } else {
        window.gsap.set(backdrop, { opacity: 1 });
        closeBtn.focus();
      }
    };

    O.close = (opts = {}) => {
      if (!O.isOpen || O.busy) return;
      if (!opts.fromPop && O.pushed) { O.pushed = false; history.back(); return; }
      O.isOpen = false;
      if (ENV.motion && !opts.instant) {
        O.busy = true;
        const gsap = window.gsap;
        gsap.timeline({ onComplete: finishClose })
          .to(body.children, { y: -22, opacity: 0, duration: 0.3, ease: 'power2.in', stagger: 0.03 }, 0)
          .to(backdrop, { opacity: 0, duration: 0.35, ease: 'power2.out' }, 0.12);
      } else finishClose();
    };

    // Scoped to case links only: cards that point at a real site are plain
    // external anchors and must not be swallowed by the overlay handler.
    document.querySelectorAll('.card-link[data-case]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        O.open(parseInt(a.dataset.case, 10));
      });
    });
    closeBtn.addEventListener('click', () => O.close());

    document.addEventListener('keydown', (e) => {
      if (!O.isOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); O.close(); return; }
      if (e.key === 'Tab') {
        const f = Array.from(el.querySelectorAll('a[href], button:not([disabled])')).filter((n) => n.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    window.addEventListener('popstate', (e) => {
      const st = e.state;
      if (st && typeof st.case === 'number') { if (!O.isOpen) O.open(st.case, { mode: 'none' }); }
      else if (O.isOpen) O.close({ fromPop: true });
    });

    APP.overlay = O;
    return O;
  }

  /* ==========================================================================
     12 · FORM + BOOT
     ========================================================================== */
  function initForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.cName.value.trim();
      const email = form.cEmail.value.trim();
      const msg = form.cMsg.value.trim();
      if (!name || !email || !msg) { status.textContent = 'Add a name, an email and a line about the work.'; return; }      // No backend: hand the message to the visitor's mail app, prefilled.
      const subject = encodeURIComponent('Portfolio enquiry from ' + name);
      const body = encodeURIComponent(msg + '\n\n—\n' + name + '\n' + email);
      window.location.href = 'mailto:' + CONFIG.email + '?subject=' + subject + '&body=' + body;
      status.textContent = 'Opening your mail app…';
    });
  }

  function boot() {
    root.classList.remove('no-js');
    root.classList.add('js');
    Loader.init();
    applyFontPreset();

    syncIdentity();
    buildCards();
    buildAbout();
    buildSkillGroups();
    buildQuotes();
    buildSocials();
    initClock();
    fitName();
    initBackToTop();

    // The webfont changes the measured width, so refit once it has landed.
    // Fonts are also a real preloader milestone — 30% of the bar.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { Loader.step(30, 'LAYOUT'); fitName(); });
    } else {
      Loader.step(30, 'LAYOUT');
    }
    let refit;
    window.addEventListener('resize', () => {
      clearTimeout(refit);
      refit = setTimeout(fitName, 120);
    });
    watchName();

    // Content is built before the library check so a dead CDN still reads.
    if (!window.gsap || !window.ScrollTrigger) {
      const m = document.getElementById('sceneLayer');
      if (m) m.style.background = SCENES.scrim;
      Loader.step(100, 'READY');
      return;
    }
    window.gsap.registerPlugin(window.ScrollTrigger);

    initCursor();
    initMagnetics();
    APP.lenis = initSmoothScroll();
    initAnchors();
    initMeter();
    
    initOverlay();
    initForm();

    Loader.step(60, 'SCENES');
    SceneSystem.init();
    setupChoreography();
    SceneSystem.choreograph(window.gsap, window.ScrollTrigger);
    window.ScrollTrigger.refresh();

    // Last milestone is the first real frame of the hero clip, so the wipe
    // never reveals an empty scene layer.
    Loader.firstFrame(SceneSystem.scenes[0]).then(() => Loader.step(100, 'READY'));

    // Test/debug handle — harmless in production.
    window.__folio = { SCENES, CONFIG, ENV, APP, SceneSystem, Loader };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();