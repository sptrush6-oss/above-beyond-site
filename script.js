// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Header elevation on scroll
const header = document.querySelector('[data-elevate]');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY || document.documentElement.scrollTop;
  header && header.classList.toggle('scrolled', y > 6 && y > lastY);
  lastY = y;
});

// Reveal on scroll
const revealEls = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('reveal-in'));
}

// Simple accordion
document.querySelectorAll('.accordion [aria-expanded]')
  .forEach(btn => btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    const panel = btn.nextElementSibling;
    if (panel) panel.style.display = expanded ? 'none' : 'block';
  }));

// Footer year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Form progressive enhancement (works with Netlify; falls back to fetch)
const form = document.querySelector('form[name="contact"]');
const status = document.querySelector('.form-status');

if (form) {
  form.addEventListener('submit', async (e) => {
    if (!window.fetch) return; // Let browser handle normal POST
    e.preventDefault();
    status.textContent = 'Sending…';

    try {
      const data = new FormData(form);
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Accept': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams(data).toString()
      });
      if (res.ok) {
        form.reset();
        status.textContent = 'Thanks! We’ll be in touch shortly.';
      } else {
        status.textContent = 'Hmm, something went wrong. Try again.';
      }
    } catch {
      status.textContent = 'Network error. Please try again.';
    }
  });
}
