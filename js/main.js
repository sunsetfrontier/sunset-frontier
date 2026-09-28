// =============================================
// Sunset Frontier — main.js
// GSAP + ScrollTrigger animations
// =============================================

gsap.registerPlugin(ScrollTrigger);

// ── NAV: scroll background ───────────────────────────────────────────────────
const nav = document.getElementById('nav');

if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// ── NAV: mobile menu ─────────────────────────────────────────────────────────
const hamburger    = document.getElementById('hamburger');
const overlay      = document.getElementById('nav-overlay');
const closeBtn     = document.getElementById('nav-overlay-close');

function openMenu() {
  overlay.classList.add('open');
  gsap.to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' });
}

function closeMenu() {
  gsap.to(overlay, {
    opacity: 0,
    duration: 0.2,
    ease: 'power2.in',
    onComplete: () => overlay.classList.remove('open')
  });
}

if (hamburger && overlay && closeBtn) {
  hamburger.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);

  // Close when clicking outside links
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeMenu();
  });
}

// ── LANDING: hero questions (page load, staggered delay) ─────────────────────
const q1 = document.getElementById('q1');
const q2 = document.getElementById('q2');
const q3 = document.getElementById('q3');
const q4 = document.getElementById('q4');
const q5 = document.getElementById('q5');
if (q1 && q2 && q3) {
  // fromTo ensures y starts at 20px regardless of CSS state
  const qParams = { opacity: 0, y: 20 };
  const qAnim   = (delay) => ({ opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay });
  gsap.fromTo(q1, qParams, qAnim(1.5));
  gsap.fromTo(q2, qParams, qAnim(2.3));
  gsap.fromTo(q3, qParams, qAnim(3.1));
  if (q4) gsap.fromTo(q4, qParams, qAnim(3.9));
  if (q5) gsap.fromTo(q5, qParams, qAnim(4.7));
}

// ── SCROLL-TRIGGERED FADE-INS (.fade-in) ─────────────────────────────────────
gsap.utils.toArray('.fade-in').forEach((el) => {
  gsap.fromTo(
    el,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        once: true,
      },
    }
  );
});

// ── SCROLL-TRIGGERED STAGGER GROUPS (.stagger-group) ─────────────────────────
// Used on: Retreats details rows, Writings entries
gsap.utils.toArray('.stagger-group').forEach((group) => {
  const items = group.children;
  gsap.fromTo(
    items,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: group,
        start: 'top 80%',
        once: true,
      },
    }
  );
});

// ── REVIEW SLIDER ([data-slider]) ────────────────────────────────────────────
// Swipe/scroll-snap track with arrows, dots, and a gentle auto-advance.
const AUTO_ADVANCE_MS = 7000;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('[data-slider]').forEach((slider) => {
  const track  = slider.querySelector('.slider-track');
  const slides = [...track.children];
  const dotBox = slider.querySelector('.slider-dots');
  let timer = null;
  let paused = false;

  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'slider-dot';
    dot.setAttribute('aria-label', `Show review ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); restart(); });
    dotBox.appendChild(dot);
    return dot;
  });

  const current = () => Math.round(track.scrollLeft / track.clientWidth);

  function goTo(i) {
    const n = (i + slides.length) % slides.length;
    track.scrollTo({ left: n * track.clientWidth });
  }

  function markDots() {
    const i = current();
    dots.forEach((d, j) => d.setAttribute('aria-current', String(i === j)));
    // Fit the track to the visible review so short reviews leave no gap
    if (slides[i]) track.style.height = `${slides[i].offsetHeight}px`;
  }

  function restart() {
    clearInterval(timer);
    if (reduceMotion) return;
    timer = setInterval(() => { if (!paused) goTo(current() + 1); }, AUTO_ADVANCE_MS);
  }

  slider.querySelector('.slider-prev').addEventListener('click', () => { goTo(current() - 1); restart(); });
  slider.querySelector('.slider-next').addEventListener('click', () => { goTo(current() + 1); restart(); });

  let ticking = false;
  track.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { markDots(); ticking = false; });
  });

  slider.addEventListener('mouseenter', () => { paused = true; });
  slider.addEventListener('mouseleave', () => { paused = false; });
  slider.addEventListener('focusin',    () => { paused = true; });
  slider.addEventListener('focusout',   () => { paused = false; });
  track.addEventListener('touchstart',  restart, { passive: true });

  window.addEventListener('resize', markDots);
  markDots();
  restart();
});
