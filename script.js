/* ═══════════════════════════════════════════
   RAÚL REVIDIEGO PORTFOLIO — script.js
   1. Boot screen sequence
   2. Hero terminal typewriter
   3. Scroll-triggered animations (bars + cards)
   4. Active nav link on scroll
   5. Project filter buttons
   6. Konami code easter egg
═══════════════════════════════════════════ */

// ── FADE STYLES (injected so they don't flash on load) ──
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
  .fade-target {
    opacity: 0; transform: translateY(16px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .fade-target.visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(fadeStyle);


// ── 1. BOOT SCREEN ──────────────────────────
const bootLines  = document.querySelectorAll('.boot-line');
const enterBtn   = document.getElementById('enter-btn');
const bootScreen = document.getElementById('boot-screen');
const main       = document.getElementById('main');

bootLines.forEach((line, i) => {
  setTimeout(() => {
    line.classList.add('show');
    if (i === bootLines.length - 1) {
      setTimeout(() => {
        enterBtn.style.display  = 'block';
        enterBtn.style.opacity  = '0';
        enterBtn.style.transition = 'opacity 0.5s';
        requestAnimationFrame(() => { enterBtn.style.opacity = '1'; });
      }, 400);
    }
  }, i * 550);
});

enterBtn.addEventListener('click', () => {
  bootScreen.classList.add('fade-out');
  main.classList.remove('hidden');
  setTimeout(() => {
    bootScreen.style.display = 'none';
    startTerminal();
    initScrollObserver();
    initFilters();
  }, 650);
});


// ── 2. HERO TERMINAL ────────────────────────
const terminalLines = [
  '> whoami',
  'raul_revidiego — data_analyst · ml_engineer',
  '',
  '> ls ./projects',
  'microservices-monitor/  RAG-engine/',
  'old_art/  RRHH/  heart-attack/  ...',
  '',
  '> python rag_engine.py',
  'Loading Llama-3.1-70B via NVIDIA NIM...',
  'ChromaDB vector store: ready',
  'Embedding model: nv-embedqa-e5-v5',
  'RAG pipeline: ONLINE ✓',
  '',
  '> uvicorn monitor.main:app --reload',
  'WebSocket server started',
  'Collecting metrics: CPU · RAM · procs',
  'Alert engine: active ✓',
  '',
  '> echo "Disponible para colaborar"',
  'Disponible para colaborar',
  '',
  '█',
];

function startTerminal() {
  const body = document.getElementById('terminal-body');
  if (!body) return;
  let lineIdx = 0, charIdx = 0, content = '';

  function typeChar() {
    if (lineIdx >= terminalLines.length) return;
    const line = terminalLines[lineIdx];
    if (charIdx < line.length) {
      content += line[charIdx];
      body.textContent = content;
      charIdx++;
      setTimeout(typeChar, line.startsWith('>') ? 50 : 20);
    } else {
      content += '\n';
      body.textContent = content;
      lineIdx++; charIdx = 0;
      setTimeout(typeChar, line === '' ? 70 : 200);
    }
  }
  typeChar();
}


// ── 3. SCROLL OBSERVER ──────────────────────
function initScrollObserver() {
  // Skill bars
  const bars = document.querySelectorAll('.bar-fill');
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = e.target.getAttribute('data-width');
        if (target) e.target.style.setProperty('width', target, 'important');
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(bar => {
    bar.setAttribute('data-width', bar.style.width);
    bar.style.setProperty('width', '0', 'important');
    barObs.observe(bar);
  });

  // Fade-in elements
  const els = document.querySelectorAll('.section, .proj-card, .skill-card, .edu-item, .cert-card');
  const fadeObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  els.forEach(el => { el.classList.add('fade-target'); fadeObs.observe(el); });
}


// ── 4. ACTIVE NAV ───────────────────────────
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  navLinks.forEach(link => {
    const id = link.getAttribute('href').slice(1);
    const sec = document.getElementById(id);
    if (!sec) return;
    const top = sec.offsetTop - 110;
    const bot = top + sec.offsetHeight;
    link.style.color = (scrollY >= top && scrollY < bot) ? 'var(--cyan)' : '';
  });
}, { passive: true });


// ── 5. PROJECT FILTERS ──────────────────────
function initFilters() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.proj-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden-card');
        } else {
          card.classList.add('hidden-card');
        }
      });
    });
  });
}


// ── 6. KONAMI EASTER EGG ────────────────────
const KONAMI = [38,38,40,40,37,39,37,39,66,65];
let kp = 0;
document.addEventListener('keydown', e => {
  kp = (e.keyCode === KONAMI[kp]) ? kp + 1 : 0;
  if (kp === KONAMI.length) {
    kp = 0;
    const msg = document.createElement('div');
    msg.style.cssText = `
      position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);
      background:#0a0f1e;border:1px solid #ff2d78;color:#ff2d78;
      font-family:'VT323',monospace;font-size:1.35rem;
      padding:1rem 2rem;z-index:9998;letter-spacing:0.1em;
      box-shadow:0 0 30px rgba(255,45,120,0.4);
    `;
    msg.textContent = '// MODO HACKER ACTIVADO — RAÚL REVIDIEGO IS ONLINE ✓';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3500);
  }
});
