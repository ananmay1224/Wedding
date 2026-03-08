// Page navigation
let currentPage = 'home';
function goTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  currentPage = page;
  window.scrollTo({top:0, behavior:'smooth'});
  // Update nav active states
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });
  // Update nav background
  updateNav();
  // Close mobile menu
  document.getElementById('mobileMenu').classList.remove('open');
  // Re-trigger reveals
  setTimeout(initReveals, 100);
  // Build dynamic content
  if (page === 'events') buildEvents();
  if (page === 'our-story') buildStory();
}

// Scroll handler
function updateNav() {
  const nav = document.getElementById('mainNav');
  const scrolled = window.scrollY > 60;
  if (scrolled || currentPage !== 'home') {
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

// RSVP
function toggleGuestFields() {
  document.getElementById('guestFields').style.display =
    document.getElementById('attendSelect').value === 'yes' ? 'block' : 'none';
}
function submitRSVP(e) {
  e.preventDefault();
  document.getElementById('rsvpForm').style.display = 'none';
  document.getElementById('rsvpThanks').style.display = 'block';
}

// Intersection observer for reveals
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