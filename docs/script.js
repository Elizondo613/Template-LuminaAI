/* ═══════════════════════════════════
   LUMINA AI — script.js
═══════════════════════════════════ */

// ── AOS ──
AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hamburger ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
window.addEventListener('resize', () => { if (window.innerWidth > 900) mobileMenu.classList.remove('open'); });

// ── Counter animation ──
function animateCount(el, end, duration = 1800) {
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = end * ease;

    if (end >= 1000000000) {
      el.textContent = (current / 1000000000).toFixed(1) + 'B';
    } else if (end >= 1000000) {
      el.textContent = (current / 1000000).toFixed(1) + 'M';
    } else if (end >= 1000) {
      el.textContent = Math.floor(current).toLocaleString();
    } else if (end % 1 !== 0) {
      el.textContent = current.toFixed(2);
    } else {
      el.textContent = Math.floor(current);
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      if (end >= 1000000000) el.textContent = (end / 1000000000).toFixed(1) + 'B';
      else if (end >= 1000000) el.textContent = (end / 1000000).toFixed(1) + 'M';
      else if (end % 1 !== 0) el.textContent = end.toFixed(2);
      else el.textContent = end.toLocaleString();
    }
  }
  requestAnimationFrame(update);
}

const spVals = document.querySelectorAll('.sp-val');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.done) {
      entry.target.dataset.done = '1';
      animateCount(entry.target, parseFloat(entry.target.dataset.count));
    }
  });
}, { threshold: 0.4 });
spVals.forEach(el => counterObserver.observe(el));

// ── Pricing toggle ──
const billingToggle = document.getElementById('billingToggle');
const amountEls = document.querySelectorAll('.plan-amount');

billingToggle.addEventListener('change', () => {
  const annual = billingToggle.checked;
  amountEls.forEach(el => {
    const target = parseInt(annual ? el.dataset.annual : el.dataset.monthly);
    animateCount(el, target, 400);
  });
  document.getElementById('lbl-monthly').style.color = annual ? 'var(--text-muted)' : 'var(--text)';
  document.getElementById('lbl-annual').style.color = annual ? 'var(--text)' : 'var(--text-muted)';
});

// ── FAQ accordion ──
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  // Open clicked if it wasn't open
  if (!isOpen) item.classList.add('open');
}

// ── Insight bar animation ──
const fills = document.querySelectorAll('.ib-fill');
const fillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.transition = 'width 1.2s ease';
      fillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
fills.forEach(f => {
  const orig = f.style.width;
  f.style.width = '0';
  setTimeout(() => { fillObserver.observe(f); f.style.width = orig; }, 200);
});

// ── Typing animation for prompt text ──
const promptText = document.querySelector('.prompt-text.typing');
if (promptText) {
  const fullText = promptText.textContent;
  promptText.textContent = '';
  let charIndex = 0;

  const typingObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      const interval = setInterval(() => {
        promptText.textContent = fullText.slice(0, ++charIndex);
        if (charIndex >= fullText.length) clearInterval(interval);
      }, 28);
      typingObserver.disconnect();
    }
  }, { threshold: 0.5 });
  typingObserver.observe(promptText);
}