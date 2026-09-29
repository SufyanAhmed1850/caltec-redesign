import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

declare global {
  interface Window {
    lenis?: Lenis;
    caltecReady: Promise<void>;
    __caltecResolve?: () => void;
  }
}

// The promise is created by an inline <head> script so component scripts can await it regardless of load order.
if (!window.caltecReady) window.caltecReady = new Promise((r) => (window.__caltecResolve = r));
const resolveReady = () => window.__caltecResolve?.();

/* ---------------------------------------------------------------- Lenis */
function initLenis() {
  if (reduced) return;
  const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  window.lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -80 });
    });
  });
}

/* ---------------------------------------------------------------- Split text reveals */
function initSplits() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const type = el.dataset.split || 'lines';
    const immediate = el.hasAttribute('data-split-immediate');
    const delay = parseFloat(el.dataset.delay || '0');

    if (reduced) {
      el.style.visibility = 'visible';
      return;
    }

    const split = SplitText.create(el, {
      type: type === 'chars' ? 'lines,chars' : type === 'words' ? 'lines,words' : 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        const targets = type === 'chars' ? self.chars : type === 'words' ? self.words : self.lines;
        gsap.set(el, { visibility: 'visible' });
        const tween = gsap.from(targets, {
          yPercent: 115,
          rotate: type === 'chars' ? 6 : 2,
          duration: type === 'chars' ? 1.3 : 1.2,
          ease: 'expo.out',
          stagger: type === 'chars' ? 0.028 : type === 'words' ? 0.04 : 0.09,
          delay,
          paused: true,
        });
        if (immediate) {
          window.caltecReady.then(() => tween.play());
        } else {
          ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => tween.play() });
        }
        return tween;
      },
    });
    void split;
  });
}

/* ---------------------------------------------------------------- Generic reveals */
function initReveals() {
  const els = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  els.forEach((el) => {
    const kind = el.dataset.reveal || 'up';
    const delay = parseFloat(el.dataset.delay || '0');
    const immediate = el.hasAttribute('data-reveal-immediate');
    const from: gsap.TweenVars =
      kind === 'fade' ? { opacity: 0 } : kind === 'scale' ? { opacity: 0, scale: 0.94 } : kind === 'left' ? { opacity: 0, x: -40 } : { opacity: 0, y: 48 };
    const tween = gsap.fromTo(el, from, { opacity: 1, x: 0, y: 0, scale: 1, duration: 1.3, ease: 'expo.out', delay, paused: true });
    if (reduced) return tween.progress(1);
    if (immediate) window.caltecReady.then(() => tween.play());
    else ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => tween.play() });
  });

  // Staggered groups
  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>(':scope > *');
    if (reduced) return;
    gsap.set(items, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: group,
      start: 'top 88%',
      once: true,
      onEnter: () => gsap.to(items, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: parseFloat(group.dataset.stagger || '0.08') }),
    });
  });

  // Image clip reveals
  document.querySelectorAll<HTMLElement>('[data-img-reveal]').forEach((el) => {
    if (reduced) return;
    const img = el.querySelector('img');
    gsap.set(el, { clipPath: 'inset(100% 0% 0% 0%)' });
    const tl = gsap.timeline({ paused: true });
    tl.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' });
    if (img) tl.from(img, { scale: 1.35, duration: 1.8, ease: 'expo.out' }, 0.1);
    if (el.hasAttribute('data-reveal-immediate')) window.caltecReady.then(() => tl.play());
    else ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => tl.play() });
  });
}

/* ---------------------------------------------------------------- Scroll-linked effects */
function initScrub() {
  if (reduced) return;

  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const amt = parseFloat(el.dataset.parallax || '0.2');
    gsap.fromTo(
      el,
      { yPercent: -amt * 50 },
      { yPercent: amt * 50, ease: 'none', scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });

  // Words light up as you read
  document.querySelectorAll<HTMLElement>('[data-scrub-words]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words' });
    gsap.fromTo(
      split.words,
      { opacity: 0.12 },
      { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } },
    );
  });

  // SVG strokes draw with scroll
  document.querySelectorAll<SVGPathElement>('[data-draw]').forEach((path) => {
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: { trigger: (path.closest('[data-draw-trigger]') as HTMLElement) || path, start: 'top 75%', end: 'bottom 60%', scrub: 1 },
    });
  });

  // Horizontal drift for oversized type
  document.querySelectorAll<HTMLElement>('[data-drift]').forEach((el) => {
    const amt = parseFloat(el.dataset.drift || '-20');
    gsap.to(el, { xPercent: amt, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* ---------------------------------------------------------------- Counters */
function initCounters() {
  document.querySelectorAll<HTMLElement>('[data-counter]').forEach((el) => {
    const end = parseFloat(el.dataset.counter || '0');
    const start = parseFloat(el.dataset.from || '0');
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const pad = parseInt(el.dataset.pad || '0', 10);
    const fmt = (v: number) => {
      const s = v.toFixed(decimals);
      return pad ? s.padStart(pad, '0') : s;
    };
    if (reduced) {
      el.textContent = fmt(end);
      return;
    }
    const o = { v: start };
    el.textContent = fmt(start);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 98%',
      once: true,
      onEnter: () =>
        gsap.to(o, { v: end, duration: 2.2, ease: 'expo.out', onUpdate: () => (el.textContent = fmt(o.v)) }),
    });
  });
}

/* ---------------------------------------------------------------- Marquees react to scroll velocity */
function initMarquees() {
  const tracks = gsap.utils.toArray<HTMLElement>('[data-marquee]');
  if (!tracks.length || reduced) return;
  const tweens = tracks.map((track) => {
    const dir = track.dataset.marquee === 'reverse' ? 1 : -1;
    const speed = parseFloat(track.dataset.speed || '40');
    const w = track.scrollWidth / 2;
    gsap.set(track, { x: dir === 1 ? -w : 0 });
    return gsap.to(track, {
      x: dir === 1 ? 0 : -w,
      duration: w / speed,
      ease: 'none',
      repeat: -1,
    });
  });
  let boost = 1;
  ScrollTrigger.create({
    onUpdate(self) {
      const v = Math.min(Math.abs(self.getVelocity()) / 400, 5);
      boost = 1 + v;
      tweens.forEach((t) => gsap.to(t, { timeScale: boost, duration: 0.2, overwrite: true }));
      gsap.delayedCall(0.25, () => tweens.forEach((t) => gsap.to(t, { timeScale: 1, duration: 1.2, overwrite: true })));
    },
  });
}

/* ---------------------------------------------------------------- Cursor */
function initCursor() {
  if (!finePointer || reduced) return;
  const cursor = document.querySelector<HTMLElement>('#cursor');
  const label = cursor?.querySelector<HTMLElement>('[data-cursor-label]');
  if (!cursor || !label) return;
  document.documentElement.classList.add('has-cursor');
  gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3' });
  let shown = false;
  window.addEventListener('pointermove', (e) => {
    if (!shown) {
      gsap.to(cursor, { opacity: 1, duration: 0.3 });
      gsap.set(cursor, { x: e.clientX, y: e.clientY });
      shown = true;
    }
    xTo(e.clientX);
    yTo(e.clientY);
  });
  document.addEventListener('pointerleave', () => {
    gsap.to(cursor, { opacity: 0, duration: 0.3 });
    shown = false;
  });

  const setState = (state: string, text = '') => {
    cursor.dataset.state = state;
    label.textContent = text;
  };
  document.addEventListener('pointerover', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button, input, textarea, select, label');
    if (!t) return setState('default');
    if (t.dataset.cursor) return setState('label', t.dataset.cursor);
    if (t.matches('input, textarea, select')) return setState('text');
    setState('hover');
  });
  window.addEventListener('pointerdown', () => gsap.to(cursor, { scale: 0.8, duration: 0.15 }));
  window.addEventListener('pointerup', () => gsap.to(cursor, { scale: 1, duration: 0.3 }));
}

/* ---------------------------------------------------------------- Magnetic */
function initMagnetic() {
  if (!finePointer || reduced) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || '0.35');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.35)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.35)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

/* ---------------------------------------------------------------- Header behaviour */
function initHeader() {
  const header = document.querySelector<HTMLElement>('#site-header');
  if (!header) return;
  let last = 0;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      const y = self.scroll();
      header.dataset.scrolled = y > 40 ? 'true' : 'false';
      if (document.documentElement.dataset.menu === 'open') return;
      const hide = y > 400 && y > last;
      header.style.transform = hide ? 'translateY(-110%)' : 'translateY(0)';
      last = y;
    },
  });

  // Scroll progress hairline
  const bar = document.querySelector<HTMLElement>('#scroll-progress');
  if (bar) gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
}

/* ---------------------------------------------------------------- Preloader */
function runPreloader(): Promise<void> {
  const el = document.querySelector<HTMLElement>('#preloader');
  let seen = false;
  try {
    seen = sessionStorage.getItem('caltec:loaded') === '1';
  } catch {}
  if (!el) return Promise.resolve();
  if (seen || reduced) {
    el.remove();
    return Promise.resolve();
  }
  el.style.display = 'flex';
  return new Promise((resolve) => {
    const num = el.querySelector<HTMLElement>('[data-pre-num]')!;
    const needle = el.querySelector<SVGElement>('[data-pre-needle]')!;
    const arc = el.querySelector<SVGPathElement>('[data-pre-arc]')!;
    const status = el.querySelector<HTMLElement>('[data-pre-status]')!;
    const len = arc.getTotalLength();
    gsap.set(arc, { strokeDasharray: len, strokeDashoffset: len });
    const o = { v: 0 };
    const steps = ['Zeroing reference', 'Sweeping range', 'Verifying tolerance', 'Certified'];
    const tl = gsap.timeline({
      onComplete: () => {
        try {
          sessionStorage.setItem('caltec:loaded', '1');
        } catch {}
        el.remove();
        resolve();
      },
    });
    tl.from(el.querySelectorAll('[data-pre-in]'), { opacity: 0, y: 20, stagger: 0.08, duration: 0.8, ease: 'expo.out' })
      .to(
        o,
        {
          v: 100,
          duration: 2.2,
          ease: 'power2.inOut',
          onUpdate: () => {
            num.textContent = o.v.toFixed(1).padStart(5, '0');
            status.textContent = steps[Math.min(steps.length - 1, Math.floor(o.v / 26))];
          },
        },
        0.2,
      )
      .to(arc, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' }, 0.2)
      .fromTo(needle, { rotate: -120 }, { rotate: 120, duration: 2.2, ease: 'power2.inOut', svgOrigin: '100 100' }, 0.2)
      .to(needle, { rotate: 116, duration: 0.12, yoyo: true, repeat: 3, ease: 'sine.inOut', svgOrigin: '100 100' })
      .to(el.querySelectorAll('[data-pre-in]'), { opacity: 0, y: -20, stagger: 0.04, duration: 0.5, ease: 'power3.in' }, '+=0.1')
      .to(el.querySelectorAll('[data-pre-panel]'), { yPercent: -100, duration: 1.1, stagger: 0.06, ease: 'expo.inOut' }, '-=0.15');
  });
}

/* ---------------------------------------------------------------- Page transitions */
function initTransitions() {
  const curtain = document.querySelector<HTMLElement>('#curtain');
  if (!curtain) return;
  const panels = curtain.querySelectorAll('[data-curtain-panel]');
  const title = curtain.querySelector<HTMLElement>('[data-curtain-title]');

  let entering = false;
  try {
    entering = sessionStorage.getItem('caltec:transition') === '1';
    sessionStorage.removeItem('caltec:transition');
  } catch {}

  if (entering && !reduced) {
    gsap.set(curtain, { visibility: 'visible' });
    gsap.set(panels, { yPercent: 0 });
    gsap.to(panels, {
      yPercent: -100,
      duration: 1,
      ease: 'expo.inOut',
      stagger: 0.05,
      delay: 0.1,
      onComplete: () => gsap.set(curtain, { visibility: 'hidden' }),
    });
  }

  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a');
    if (!a || reduced) return;
    const href = a.getAttribute('href');
    if (!href || a.target === '_blank' || a.hasAttribute('download') || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || href.startsWith('#') || /\.(pdf|jpg|png)$/i.test(url.pathname)) return;
    if (url.pathname === location.pathname && url.hash) return;
    e.preventDefault();
    try {
      sessionStorage.setItem('caltec:transition', '1');
    } catch {}
    if (title) title.textContent = a.dataset.label || a.textContent?.trim().slice(0, 40) || '';
    gsap.set(curtain, { visibility: 'visible' });
    gsap.set(panels, { yPercent: 100 });
    gsap.timeline({ onComplete: () => (location.href = url.href) })
      .to(panels, { yPercent: 0, duration: 0.8, ease: 'expo.inOut', stagger: 0.05 })
      .fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out' }, 0.45);
  });

  // bfcache restore: make sure curtain isn't stuck
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      gsap.set(panels, { yPercent: -100 });
      gsap.set(curtain, { visibility: 'hidden' });
    }
  });
}

/* ---------------------------------------------------------------- Clock readouts */
function initClock() {
  const els = document.querySelectorAll<HTMLElement>('[data-clock]');
  if (!els.length) return;
  const tick = () => {
    const t = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Karachi', hour12: false });
    els.forEach((el) => (el.textContent = t));
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------------------------------------------------------------- Boot */
async function boot() {
  document.documentElement.classList.add('js');
  initLenis();
  initTransitions();
  initCursor();
  initMagnetic();
  initHeader();
  initClock();
  await document.fonts?.ready;
  initSplits();
  initReveals();
  initScrub();
  initCounters();
  initMarquees();
  await runPreloader();
  resolveReady();
  ScrollTrigger.refresh();
}

boot();

export { gsap, ScrollTrigger, SplitText, reduced, finePointer };
