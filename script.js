/* ============================================
   ACTUAL POWER NUTRITION — script.js
============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initSlider();
  initNavbar();
  initHamburger();
  initReveal();
  initBackToTop();
  initFlavorTabs();
  initFilterTabs();
  initCounters();
});

// ---- Particles ----
function initParticles() {
  const wrap = document.getElementById('hero-particles');
  if (!wrap) return;
  const colors = ['#00A3FF', '#38BDF8', '#FF1E76', '#FF599A', '#ffffff'];
  for (let i = 0; i < 24; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const dur = (Math.random() * 10 + 7).toFixed(1);
    const delay = (Math.random() * 10).toFixed(1);
    const tx = ((Math.random() - 0.5) * 300).toFixed(0);
    const op = (Math.random() * 0.4 + 0.15).toFixed(2);
    p.style.cssText = `
      width:${size}px; height:${size}px;
      background:${color};
      left:${Math.random() * 100}%;
      bottom:0;
      --tx:${tx}px;
      --dur:${dur}s;
      --delay:${delay}s;
      --op:${op};
      animation-delay:${delay}s;
    `;
    wrap.appendChild(p);
  }
}

// ---- Hero Slider ----
let currentSlide = 0;
let autoTimer = null;
const SLIDE_MS = 5500;

function initSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.sdot');
  const prev   = document.getElementById('prev-btn');
  const next   = document.getElementById('next-btn');
  if (!slides.length) return;

  function goTo(idx) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (idx + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function start() { autoTimer = setInterval(() => goTo(currentSlide + 1), SLIDE_MS); }
  function reset() { clearInterval(autoTimer); start(); }

  if (prev) prev.addEventListener('click', () => { goTo(currentSlide - 1); reset(); });
  if (next) next.addEventListener('click', () => { goTo(currentSlide + 1); reset(); });

  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); reset(); }));

  // Touch swipe
  let sx = 0;
  const slider = document.getElementById('hero-slider');
  if (slider) {
    slider.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      const diff = sx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 45) { diff > 0 ? goTo(currentSlide + 1) : goTo(currentSlide - 1); reset(); }
    });
  }
  start();
}

// ---- Navbar Scroll ----
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---- Hamburger ----
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  });

  menu.querySelectorAll('.mob-link').forEach(l => {
    l.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---- Scroll Reveal ----
function initReveal() {
  const revealEls = [
    '.pcard', '.why-card', '.tcard', '.trust-pill',
    '.sstat', '.cinfo-card', '.about-p', '.af-item',
    '.section-label', '.section-h2', '.section-p', '.nl-h2',
    '.filter-tabs', '.hero-eyebrow'
  ];

  revealEls.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${Math.min(i * 0.06, 0.4)}s`;
    });
  });

  document.querySelectorAll('.about-visual-col').forEach(el => el.classList.add('reveal-left'));
  document.querySelectorAll('.about-text-col').forEach(el => el.classList.add('reveal-right'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));
}

// ---- Back to Top ----
function initBackToTop() {
  const btn = document.getElementById('btt');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 600), { passive: true });
}

// ---- Flavor Selection ----
function initFlavorTabs() {
  document.querySelectorAll('.pcard-flavors').forEach(wrap => {
    wrap.querySelectorAll('.pflavor').forEach(f => {
      f.addEventListener('click', () => {
        wrap.querySelectorAll('.pflavor').forEach(x => x.classList.remove('active'));
        f.classList.add('active');
      });
    });
  });
}

// ---- Product Filter Tabs ----
function initFilterTabs() {
  const tabs  = document.querySelectorAll('.ftab');
  const cards = document.querySelectorAll('.pcard');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (match) {
          card.style.display = '';
          requestAnimationFrame(() => { card.style.opacity = '1'; card.style.transform = ''; });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { if (tab.classList.contains('active') || filter !== tab.dataset.filter) card.style.display = 'none'; }, 280);
        }
      });
    });
  });
}

// ---- Stats Counters ----
function initCounters() {
  const stats = document.querySelectorAll('.snum');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateNum(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => io.observe(s));
}

function animateNum(el) {
  const target  = parseInt(el.dataset.target, 10);
  const dur     = 1600;
  const start   = performance.now();

  function tick(now) {
    const t = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target).toLocaleString('en-IN');
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ---- Cart ----
let cartCount = 0;

function addToCart(name, price) {
  cartCount++;
  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.textContent = cartCount;
    badge.style.transform = 'scale(1.6)';
    setTimeout(() => badge.style.transform = 'scale(1)', 250);
  }
  showToast(name);
}

function showToast(name) {
  const toast = document.getElementById('cart-toast');
  const txt   = document.getElementById('ct-text');
  if (!toast) return;
  if (txt) txt.textContent = `"${name}" added to cart!`;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ---- Newsletter ----
function handleNewsletter(e) {
  e.preventDefault();
  const btn   = document.getElementById('nl-submit');
  const input = document.getElementById('nl-email');
  if (!btn) return;
  btn.textContent = 'Subscribing…';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ Subscribed!';
    btn.style.background = '#4caf50';
    if (input) input.value = '';
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }, 1200);
}

// ---- Contact ----
function handleContact(e) {
  e.preventDefault();
  const btn = document.getElementById('cf-submit');
  if (!btn) return;
  const orig = btn.textContent;
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ Message Sent!';
    btn.style.background = '#4caf50';
    document.getElementById('contact-form').reset();
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }, 1400);
}

// ---- Active nav link on scroll ----
const navSections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const y = window.scrollY + 120;
  navSections.forEach(sec => {
    if (sec.offsetTop <= y && sec.offsetTop + sec.offsetHeight > y) {
      document.querySelectorAll('.nav-link').forEach(a => {
        a.classList.toggle('active-link', a.getAttribute('href') === `#${sec.id}`);
      });
    }
  });
}, { passive: true });

// ---- Subtle product card 3D tilt ----
document.querySelectorAll('.pcard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-10px) perspective(800px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

console.log('%c⚡ ACTUAL POWER NUTRITION', 'font-size:16px;background:linear-gradient(135deg,#00A3FF,#FF1E76);color:#fff;padding:4px 10px;border-radius:4px;font-weight:bold;font-family:sans-serif;');
console.log('%cFuel Your Potential · Jet Black, Cerulean & Neon Rose Edition', 'font-size:11px;color:#38BDF8;font-family:sans-serif;');
