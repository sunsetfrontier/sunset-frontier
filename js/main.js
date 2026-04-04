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
