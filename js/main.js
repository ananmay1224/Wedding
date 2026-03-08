// Detect home page
function isHome() {
  const p = window.location.pathname;
  return p === '/' || p.endsWith('/index.html') || p === '';
}

// Scroll handler — transparent on home hero, solid everywhere else
function updateNav() {
  const nav = document.getElementById('mainNav');
  const scrolled = window.scrollY > 60;
  if (scrolled || !isHome()) {
    nav.style.background = 'rgba(75,14,26,0.97)';
    nav.style.padding = '12px 0';
    nav.style.borderBottom = '1px solid rgba(201,168,76,0.15)';
  } else {
    nav.style.background = 'rgba(75,14,26,0.2)';
    nav.style.padding = '20px 0';
    nav.style.borderBottom = 'none';
  }
}
window.addEventListener('scroll', updateNav);

// Mobile menu
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// Intersection observer for scroll reveals
function initReveals() {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); }
    }, { threshold: 0.15 });
    obs.observe(el);
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  initReveals();
  updateNav();
});
