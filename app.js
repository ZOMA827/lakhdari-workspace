/* ============================================================
   THE LAKHDARI WORKSPACE v3.0 — app.js
   Router · Studio Guard · Admin Auth · Projects CRUD
   Language + Firebase integrated
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────
   GLOBAL HELPERS (Clicks Sync)
   ────────────────────────────────────────────── */
window.registerClickAndSync = function(projectId) {
  if (typeof ProjectsDB !== 'undefined') {
    ProjectsDB.registerClick(projectId);
  }
  if (typeof FirebaseCore !== 'undefined' && FirebaseCore.isReady()) {
    FirebaseCore.registerClickCloud(projectId);
  }
};

/* ──────────────────────────────────────────────
   ROUTER — Sliding Windows System
   Exposed globally so ai.js FAB can call it
   ────────────────────────────────────────────── */
const views   = document.querySelectorAll('.view');
const navBtns = document.querySelectorAll('.nav-btn[data-view]');
let currentView     = 'home';
let isTransitioning = false;

function navigateTo(viewId) {
  if (viewId === currentView || isTransitioning) return;

  /* Block non-admins from reaching Studio */
  if (viewId === 'studio' && !_isAdmin) {
    openLoginModal();
    return;
  }

  isTransitioning = true;

  const outView = document.getElementById(`view-${currentView}`);
  const inView  = document.getElementById(`view-${viewId}`);
  if (!outView || !inView) { isTransitioning = false; return; }

  outView.classList.remove('active');
  outView.classList.add('slide-out');

  requestAnimationFrame(() => {
    setTimeout(() => {
      outView.classList.remove('slide-out');
      inView.classList.add('active');
      currentView     = viewId;
      isTransitioning = false;
      if (viewId === 'gaming') animatePerfBars();
      if (viewId === 'studio') renderStudioList();
    }, 60);
  });

  navBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.view === viewId));
}

window.navigateTo = navigateTo;

/* ──────────────────────────────────────────────
   MOBILE SIDEBAR TOGGLE
   ────────────────────────────────────────────── */
const mobileMenuBtn  = document.getElementById('mobile-menu-btn');
const sidebar        = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('mobile-sidebar-overlay');

function toggleSidebar() {
  if (window.innerWidth > 768) return; 
  
  sidebar.classList.toggle('open');
  sidebarOverlay.classList.toggle('open');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.classList.toggle('hidden');
  }
}

mobileMenuBtn?.addEventListener('click', toggleSidebar);
sidebarOverlay?.addEventListener('click', toggleSidebar);

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) toggleSidebar();
  });
});
navBtns.forEach(btn => btn.addEventListener('click', () => navigateTo(btn.dataset.view)));
document.querySelectorAll('.cta-primary, .cta-secondary').forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.view));
});

/* ──────────────────────────────────────────────
   ADMIN AUTH STATE
   Controls studio button visibility + badge
   ────────────────────────────────────────────── */
let _isAdmin = false;

function setAdminMode(active) {
  _isAdmin = active;
  const studioBtn  = document.querySelector('.studio-nav-btn');
  const adminBadge = document.getElementById('admin-badge');
  const logoutBtn  = document.getElementById('admin-logout-btn');
  // في ملف app.js داخل دالة setAdminMode أو عند نجاح تسجيل الدخول:
if (isAdmin) {
  createNotification('Welcome, Admin!', 'Workspace sync is active. System is monitoring.', 'admin');
}
  if (studioBtn) studioBtn.style.display = active ? 'flex' : 'none';
  if (adminBadge) adminBadge.style.display = active ? 'flex' : 'none';
  if (logoutBtn) logoutBtn.style.display = active ? 'inline-flex' : 'none';
  
  if (!active && currentView === 'studio') {
    navigateTo('home');
  }
}

/* ──────────────────────────────────────────────
   ADMIN LOGIN MODAL
   ────────────────────────────────────────────── */
const loginOverlay = document.getElementById('login-overlay');
const loginModal   = document.getElementById('login-modal');

function openLoginModal() {
  if (!loginOverlay) return;
  loginOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('login-email-input')?.focus();
  document.getElementById('login-error').textContent = '';
}

function closeLoginModal() {
  if (!loginOverlay) return;
  loginOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('login-cancel-btn')?.addEventListener('click', closeLoginModal);
loginOverlay?.addEventListener('click', e => { if (e.target === loginOverlay) closeLoginModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && loginOverlay?.classList.contains('open')) closeLoginModal();
});

document.getElementById('login-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const email    = document.getElementById('login-email-input').value.trim();
  const password = document.getElementById('login-pass-input').value;
  const submitBtn = document.getElementById('login-submit-btn');
  const errorEl   = document.getElementById('login-error');

  if (!email || !password) {
    errorEl.textContent = 'Please fill in both fields.';
    return;
  }

  submitBtn.disabled    = true;
  submitBtn.textContent = '...';
  errorEl.textContent   = '';

  if (typeof FirebaseCore !== 'undefined' && FirebaseCore.isReady()) {
    const result = await FirebaseCore.login(email, password);
    if (result.success) {
      closeLoginModal();
      setAdminMode(true); 
      navigateTo('studio');
      showStudioToast('✓ Logged in. Welcome back, Admin!');
    } else {
      errorEl.textContent = result.error;
    }
  } else {
    errorEl.textContent = 'Firebase not configured. See firebase-config.js for setup.';
  }

  submitBtn.disabled    = false;
  submitBtn.textContent = typeof LangSystem !== 'undefined' ? LangSystem.t('login_btn') : 'Login';
});

document.getElementById('admin-logout-btn')?.addEventListener('click', async () => {
  if (typeof FirebaseCore !== 'undefined') {
    await FirebaseCore.logout();
  } else {
    setAdminMode(false);
  }
  showStudioToast('Logged out.');
});

/* Secret triggers */
(function attachAvatarLongPress() {
  const ring = document.getElementById('avatar-ring');
  if (!ring) return;
  let pressTimer = null;
  const trigger = () => { if (!_isAdmin) openLoginModal(); };

  ring.addEventListener('mousedown', () => { pressTimer = setTimeout(trigger, 500); });
  ring.addEventListener('mouseup',   () => clearTimeout(pressTimer));
  ring.addEventListener('mouseleave',() => clearTimeout(pressTimer));
  ring.addEventListener('touchstart', () => { pressTimer = setTimeout(trigger, 500); }, { passive: true });
  ring.addEventListener('touchend',  () => clearTimeout(pressTimer));
})();

if (window.location.hash === '#admin-login') {
  window.addEventListener('load', openLoginModal);
}

/* ──────────────────────────────────────────────
   LANGUAGE TOGGLE
   ────────────────────────────────────────────── */
document.getElementById('lang-toggle-btn')?.addEventListener('click', () => {
  if (typeof LangSystem !== 'undefined') LangSystem.toggle();
});

/* ──────────────────────────────────────────────
   PROJECTS GRID
   ────────────────────────────────────────────── */
function renderProjectsGrid() {
  const grid   = document.getElementById('projects-grid');
  const filter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  if (!grid) return;

  const projects = typeof ProjectsDB !== 'undefined' ? ProjectsDB.getAll() : [];
  grid.innerHTML = '';

  projects.forEach(p => {
    if (filter !== 'all' && p.category !== filter) return;
    grid.appendChild(buildProjectCard(p, p.featured));
  });

  attachFilterListeners();

  const liveEl = document.getElementById('stat-live-projects');
  if (liveEl) liveEl.textContent = projects.length;
}

function buildProjectCard(p, featured = false) {
  const card = document.createElement('div');
  card.className = `project-card${featured ? ' featured-card' : ''}`;
  card.dataset.category = p.category;
  card.dataset.project  = p.id;

  const stars = '★'.repeat(p.stars) + '☆'.repeat(5 - p.stars);

  card.innerHTML = `
    ${featured ? '<div class="featured-badge">⭐ Project of the Month</div>' : ''}
    <div class="project-top">
      <div class="project-icon ${p.iconClass}">${p.icon}</div>
      <div class="project-meta">
        <span class="project-category">${p.tagline || p.category}</span>
        <div class="project-stars">${stars}</div>
      </div>
    </div>
    <h3 class="project-name">${p.name}</h3>
    <p class="project-desc">${p.shortDesc}</p>
    <div class="project-footer">
      <span class="project-downloads">↓ ${p.downloads}</span>
      <div class="project-btn-row">
        ${p.downloadLink && p.downloadLink !== '#' ? `<a href="${p.downloadLink}" target="_blank" class="project-dl-btn" data-project-id="${p.id}">↓ APK</a>` : ''}
        ${p.liveLink && p.liveLink !== '#' ? `<a href="${p.liveLink}" target="_blank" class="project-live-btn" data-project-id="${p.id}">↗ Live</a>` : ''}
        <button class="project-detail-btn" data-project="${p.id}">Details</button>
      </div>
    </div>
  `;

  card.querySelector('.project-detail-btn').addEventListener('click', e => {
    e.stopPropagation();
    openModal(p.id);
  });

  /* Cloud Sync Click Listeners */
  card.querySelectorAll('.project-dl-btn, .project-live-btn').forEach(el =>
    el.addEventListener('click', () => window.registerClickAndSync(p.id))
  );

  return card;
}

function attachFilterListeners() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjectsGrid();
    });
  });
}

/* ──────────────────────────────────────────────
   PROJECT MODAL
   ────────────────────────────────────────────── */
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalClose   = document.getElementById('modal-close');

function openModal(projectId) {
  if (typeof ProjectsDB === 'undefined') return;
  const p = ProjectsDB.getById(projectId);
  if (!p) return;

  const stars     = '★'.repeat(p.stars) + '☆'.repeat(5 - p.stars);
  const hasImages = p.images && p.images.length > 0;

  modalContent.innerHTML = `
    ${hasImages ? buildCarousel(p.images, p.category) : buildModalPlaceholder(p)}
    <div class="modal-project-icon ${p.iconClass}">${p.icon}</div>
    <div class="modal-project-name">${p.name}</div>
    <div class="modal-project-tagline">${p.tagline}</div>
    <div class="modal-stars">${stars}</div>
    <p class="modal-project-desc">${p.desc}</p>
    <div class="modal-tech-list">${p.tech.map(t => `<span>${t}</span>`).join('')}</div>
    <div class="modal-highlights">${p.highlights.map(h => `<div>${h}</div>`).join('')}</div>
    <div class="modal-link-row">
      ${p.downloadLink && p.downloadLink !== '#'
        ? `<a href="${p.downloadLink}" target="_blank" class="modal-dl-btn"
             onclick="window.registerClickAndSync('${p.id}')">↓ Download APK</a>`
        : ''}
      ${p.liveLink && p.liveLink !== '#'
        ? `<a href="${p.liveLink}" target="_blank" class="modal-live-btn"
             onclick="window.registerClickAndSync('${p.id}')">↗ Visit Live Site</a>`
        : ''}
    </div>
  `;

  if (hasImages) initCarousel();

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function buildModalPlaceholder(p) {
  const gradients = {
    flutter: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
    web:     'linear-gradient(135deg, #059669 0%, #2563eb 100%)',
    ai:      'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
    other:   'linear-gradient(135deg, #d97706 0%, #dc2626 100%)',
  };
  const grad = gradients[p.category] || gradients.other;
  return `
    <div class="modal-placeholder" style="background:${grad}">
      <span class="modal-placeholder-icon">${p.icon}</span>
      <span class="modal-placeholder-label">${p.name}</span>
    </div>
  `;
}

function buildCarousel(images, category) {
  return `
    <div class="img-carousel" id="img-carousel">
      <div class="carousel-track" id="carousel-track">
        ${images.map((src, i) =>
          `<img src="${src}" alt="Screenshot ${i+1}" class="carousel-img" loading="lazy"
           onerror="this.parentElement.parentElement.classList.add('carousel-img-error')" />`
        ).join('')}
      </div>
      ${images.length > 1 ? `
        <button class="carousel-btn prev" id="carousel-prev">‹</button>
        <button class="carousel-btn next" id="carousel-next">›</button>
        <div class="carousel-dots" id="carousel-dots">
          ${images.map((_, i) =>
            `<span class="c-dot${i === 0 ? ' active' : ''}" data-idx="${i}"></span>`
          ).join('')}
        </div>` : ''}
    </div>
  `;
}

function initCarousel() {
  const track = document.getElementById('carousel-track');
  const prev  = document.getElementById('carousel-prev');
  const next  = document.getElementById('carousel-next');
  const dots  = document.querySelectorAll('.c-dot');
  if (!track) return;

  let current = 0;
  const total = track.children.length;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prev?.addEventListener('click', () => goTo(current - 1));
  next?.addEventListener('click', () => goTo(current + 1));
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.idx)));
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (modalOverlay?.classList.contains('open')) closeModal();
    if (loginOverlay?.classList.contains('open')) closeLoginModal();
  }
});

/* ──────────────────────────────────────────────
   GAMING — Animate Performance Bars
   ────────────────────────────────────────────── */
function animatePerfBars() {
  document.querySelectorAll('.perf-fill').forEach(fill => {
    const target = fill.style.width;
    fill.style.width = '0%';
    setTimeout(() => { fill.style.width = target; }, 100);
  });
}

/* ──────────────────────────────────────────────
   CV DOWNLOAD
   ────────────────────────────────────────────── */
const cvBtn      = document.getElementById('cv-download');
const cvLoading  = document.getElementById('cv-loading');
const cvProgress = document.getElementById('cv-progress');

cvBtn?.addEventListener('click', () => {
  cvBtn.disabled      = true;
  cvBtn.style.opacity = '0.6';
  cvLoading.classList.add('active');

  const steps = [
    { label: 'Connecting to CareerCraft...', progress: 15,  delay: 0    },
    { label: 'Fetching latest profile data...', progress: 40, delay: 700  },
    { label: 'Rendering PDF template...',    progress: 70,  delay: 1500 },
    { label: 'Finalizing export...',         progress: 92,  delay: 2400 },
    { label: 'Done! 🎉',                     progress: 100, delay: 3000 },
  ];
  const loadingText = cvLoading.querySelector('.cv-loading-text');
  steps.forEach(s => setTimeout(() => {
    loadingText.textContent = s.label;
    cvProgress.style.width  = `${s.progress}%`;
  }, s.delay));

  setTimeout(() => {
    generateAndDownloadCV();
    cvBtn.disabled      = false;
    cvBtn.style.opacity = '1';
    cvLoading.classList.remove('active');
    cvProgress.style.width = '0%';
  }, 3600);
});

function generateAndDownloadCV() {
  const projects  = typeof ProjectsDB !== 'undefined' ? ProjectsDB.getAll() : [];
  const projLines = projects.map(p =>
    `▸ ${p.name} — ${(p.tech||[]).slice(0, 3).join(' · ')}\n  ${p.shortDesc}`
  ).join('\n\n');

  const content = `ILYES LAKHDARI
Flutter Developer · AI Engineer · Full-Stack Dev
Constantine, Algeria  |  github.com/ilyes  |  linkedin.com/in/ilyes-lakhdari

─────────────────────────────────────────────
EDUCATION
─────────────────────────────────────────────
Licence in Computer Science
Batna 2 University — 2024
Graduation Project: Healthmate (AI-powered health ecosystem)

─────────────────────────────────────────────
PROJECTS
─────────────────────────────────────────────
${projLines}

─────────────────────────────────────────────
SKILLS
─────────────────────────────────────────────
Languages:   Dart, JavaScript, Python, HTML/CSS
Frameworks:  Flutter, Node.js
Backend:     Firebase, Firestore, REST APIs
AI/ML:       Ollama, Llama 3, Gemini API, LLM integration
Tools:       Git, scrcpy, ADB, Linux CLI
Hardware:    Electronics tinkering, performance optimization

─────────────────────────────────────────────
SETUP
─────────────────────────────────────────────
ThinkPad L14 Gen 2  |  AMD Ryzen 5 PRO 5650U  |  16GB RAM
Running local LLMs via Ollama · Linux/Windows dual boot

─────────────────────────────────────────────
Generated by CareerCraft · The Lakhdari Workspace v3.0
─────────────────────────────────────────────
`;
  const blob = new Blob([content], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'Ilyes_Lakhdari_CV.txt';
  a.click();
  URL.revokeObjectURL(url);
}

/* ──────────────────────────────────────────────
   THE LAKHDARI STUDIO — CRUD Panel (CLOUD CONNECTED)
   ────────────────────────────────────────────── */
let studioEditingId = null;

window.renderStudioList = function() {
  const list   = document.getElementById('studio-project-list');
  if (!list || typeof ProjectsDB === 'undefined') return;

  const projects = ProjectsDB.getAll();
  const clicks   = ProjectsDB.getClicks();
  list.innerHTML = '';

  if (projects.length === 0) {
    list.innerHTML = '<p class="studio-empty">No projects yet. Add one above!</p>';
    renderStudioAnalytics();
    return;
  }

  /* Stats overview */
  const statsRow = document.getElementById('studio-stats-row');
  if (statsRow) {
    const totalClicks = Object.values(clicks).reduce((a, b) => a + b, 0);
    const isCloudReady = typeof FirebaseCore !== 'undefined' && FirebaseCore.isReady();
    statsRow.innerHTML = `
      <div class="studio-stat-card"><span>${projects.length}</span><small>Projects</small></div>
      <div class="studio-stat-card"><span>${totalClicks}</span><small>Total Clicks</small></div>
      <div class="studio-stat-card"><span>${projects.filter(p => p.featured).length}</span><small>Featured</small></div>
      <div class="studio-stat-card"><span>${isCloudReady ? '☁' : '⚠'}</span><small>${isCloudReady ? 'Cloud On' : 'Local Only'}</small></div>
    `;
  }

  projects.forEach(p => {
    const row = document.createElement('div');
    row.className = `studio-row${p.featured ? ' studio-featured' : ''}`;
    row.innerHTML = `
      <div class="studio-row-info">
        <span class="studio-row-icon ${p.iconClass}">${p.icon}</span>
        <div>
          <span class="studio-row-name">${p.name}</span>
          <span class="studio-row-cat">${p.category}</span>
        </div>
        ${p.featured ? '<span class="studio-feat-tag">⭐ Featured</span>' : ''}
        <span class="studio-clicks-tag">↓ ${p.clicks || clicks[p.id] || 0} clicks</span>
      </div>
      <div class="studio-row-actions">
        <button class="studio-btn-feat" data-id="${p.id}" title="Set as featured">⭐</button>
        <button class="studio-btn-edit" data-id="${p.id}" title="Edit">✎</button>
        <button class="studio-btn-del"  data-id="${p.id}" title="Delete">✕</button>
      </div>
    `;
    list.appendChild(row);
  });

  list.querySelectorAll('.studio-btn-feat').forEach(btn =>
    btn.addEventListener('click', async () => {
      ProjectsDB.setFeatured(btn.dataset.id);
      if (_isAdmin && typeof FirebaseCore !== 'undefined' && FirebaseCore.isReady()) {
        const updated = ProjectsDB.getById(btn.dataset.id);
        await FirebaseCore.saveProjectCloud(updated);
      }
      renderStudioList();
      renderProjectsGrid();
    })
  );

  list.querySelectorAll('.studio-btn-edit').forEach(btn =>
    btn.addEventListener('click', () => populateStudioForm(btn.dataset.id))
  );

  list.querySelectorAll('.studio-btn-del').forEach(btn =>
    btn.addEventListener('click', async () => {
      if (confirm(`Delete "${ProjectsDB.getById(btn.dataset.id)?.name}"?`)) {
        ProjectsDB.delete(btn.dataset.id);
        if (_isAdmin && typeof FirebaseCore !== 'undefined' && FirebaseCore.isReady()) {
          await FirebaseCore.deleteProjectCloud(btn.dataset.id);
        }
        showStudioToast('✕ Project deleted.');
        renderStudioList();
        renderProjectsGrid();
      }
    })
  );

  renderStudioAnalytics();
};

function populateStudioForm(id) {
  const p = ProjectsDB.getById(id);
  if (!p) return;
  studioEditingId = id;

  document.getElementById('sf-name').value        = p.name        || '';
  document.getElementById('sf-icon').value        = p.icon        || '';
  document.getElementById('sf-icon-class').value  = p.iconClass   || 'cc-icon';
  document.getElementById('sf-category').value    = p.category    || 'flutter';
  document.getElementById('sf-tagline').value     = p.tagline     || '';
  document.getElementById('sf-short-desc').value  = p.shortDesc   || '';
  document.getElementById('sf-desc').value        = p.desc        || '';
  document.getElementById('sf-tech').value        = (p.tech || []).join(', ');
  document.getElementById('sf-highlights').value  = (p.highlights || []).join('\n');
  document.getElementById('sf-stars').value       = p.stars       || 5;
  document.getElementById('sf-downloads').value   = p.downloads   || '';
  document.getElementById('sf-dl-link').value     = p.downloadLink || '';
  document.getElementById('sf-live-link').value   = p.liveLink    || '';
  document.getElementById('sf-images').value      = (p.images || []).join('\n');

  document.getElementById('studio-form-title').textContent = `Edit: ${p.name}`;
  document.getElementById('studio-submit-btn').textContent = 'Save Changes';
  document.getElementById('studio-cancel-btn').style.display = 'inline-flex';
  document.getElementById('studio-form-section').scrollIntoView({ behavior: 'smooth' });
}

function resetStudioForm() {
  studioEditingId = null;
  document.getElementById('studio-project-form').reset();
  document.getElementById('studio-form-title').textContent  = 'Add New Project';
  document.getElementById('studio-submit-btn').textContent  = 'Add Project';
  document.getElementById('studio-cancel-btn').style.display = 'none';
}

document.getElementById('studio-project-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const fd = e.target;
  const project = {
    id:           studioEditingId || ('proj_' + Date.now()),
    name:         fd['sf-name'].value.trim(),
    icon:         fd['sf-icon'].value.trim() || '◈',
    iconClass:    fd['sf-icon-class'].value,
    category:     fd['sf-category'].value,
    tagline:      fd['sf-tagline'].value.trim(),
    shortDesc:    fd['sf-short-desc'].value.trim(),
    desc:         fd['sf-desc'].value.trim(),
    tech:         fd['sf-tech'].value.split(',').map(s => s.trim()).filter(Boolean),
    highlights:   fd['sf-highlights'].value.split('\n').map(s => s.trim()).filter(Boolean),
    stars:        parseInt(fd['sf-stars'].value) || 5,
    downloads:    fd['sf-downloads'].value.trim(),
    downloadLink: fd['sf-dl-link'].value.trim(),
    liveLink:     fd['sf-live-link'].value.trim(),
    images:       fd['sf-images'].value.split('\n').map(s => s.trim()).filter(Boolean),
    featured:     studioEditingId ? (ProjectsDB.getById(studioEditingId)?.featured || false) : false,
    clicks:       studioEditingId ? (ProjectsDB.getById(studioEditingId)?.clicks || 0)   : 0,
    createdAt:    studioEditingId ? (ProjectsDB.getById(studioEditingId)?.createdAt || Date.now()) : Date.now(),
  };

  if (studioEditingId) {
    ProjectsDB.update(studioEditingId, project);
    if (_isAdmin && typeof FirebaseCore !== 'undefined' && FirebaseCore.isReady()) {
      await FirebaseCore.saveProjectCloud(project);
    }
    showStudioToast('✓ Project updated!');
  } else {
    ProjectsDB.add(project);
    if (_isAdmin && typeof FirebaseCore !== 'undefined' && FirebaseCore.isReady()) {
      await FirebaseCore.saveProjectCloud(project);
    }
    showStudioToast('✓ Project added!');
  }

  resetStudioForm();
  renderStudioList();
  renderProjectsGrid();
});

document.getElementById('studio-cancel-btn')?.addEventListener('click', resetStudioForm);

document.getElementById('studio-reset-btn')?.addEventListener('click', async () => {
  if (confirm('Reset ALL projects to defaults? This cannot be undone.')) {
    ProjectsDB.reset();
    if (_isAdmin && typeof FirebaseCore !== 'undefined' && FirebaseCore.isReady()) {
       await FirebaseCore.syncLocalToCloud(ProjectsDB.getAll());
    }
    renderStudioList();
    renderProjectsGrid();
    showStudioToast('Projects reset to defaults.');
  }
});

function showStudioToast(msg) {
  let toast = document.getElementById('studio-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'studio-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ──────────────────────────────────────────────
   STUDIO ANALYTICS
   ────────────────────────────────────────────── */
function renderStudioAnalytics() {
  const el = document.getElementById('studio-analytics');
  if (!el || typeof ProjectsDB === 'undefined') return;
  const projects = ProjectsDB.getAll();

  if (projects.length === 0) {
    el.innerHTML = '<p class="studio-empty">No projects to track yet.</p>';
    return;
  }

  const sorted    = [...projects].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
  const maxClicks = Math.max(...sorted.map(p => p.clicks || 0), 1);

  el.innerHTML = sorted.map(p => {
    const c   = p.clicks || 0;
    const pct = Math.round((c / maxClicks) * 100);
    return `
      <div class="analytics-row">
        <span class="analytics-icon ${p.iconClass}">${p.icon}</span>
        <div class="analytics-info">
          <span class="analytics-name">${p.name}</span>
          <div class="analytics-bar-wrap">
            <div class="analytics-bar-fill" style="width:${pct}%"></div>
          </div>
        </div>
        <span class="analytics-count">${c} click${c !== 1 ? 's' : ''}</span>
      </div>
    `;
  }).join('');
}

/* ──────────────────────────────────────────────
   INITIAL LOAD & CLOUD INTEGRATION
   ────────────────────────────────────────────── */
window.addEventListener('load', () => {
  if (typeof FirebaseCore !== 'undefined') {
    FirebaseCore.init();

    FirebaseCore.subscribeToProjects((cloudProjects) => {
      if (cloudProjects && cloudProjects.length > 0) {
        localStorage.setItem('lakhdari_projects_v2', JSON.stringify(cloudProjects)); 
        renderProjectsGrid();
        if (currentView === 'studio') renderStudioList();
      } else {
        console.info('[Workspace] Cloud database empty. Seeding defaults...');
        if (typeof ProjectsDB !== 'undefined') {
          FirebaseCore.syncLocalToCloud(ProjectsDB.getAll());
        }
      }
    });

    FirebaseCore.onAuthChange((user) => {
      setAdminMode(!!user); 
      if (user) console.info('[Auth] Admin logged in. Studio unlocked.');
      else console.info('[Auth] Visitor mode active.');
    });
  } else {
    renderProjectsGrid();
  }

  if (typeof initAIChat === 'function') initAIChat();
  if (typeof initFloatingAI === 'function') initFloatingAI();
  if (typeof LangSystem !== 'undefined') LangSystem.apply(LangSystem.current);

  document.querySelectorAll('.stat-card').forEach((card, i) => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(16px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      card.style.opacity    = '1';
      card.style.transform  = 'translateY(0)';
    }, 200 + i * 80);
  });
});
/* ──────────────────────────────────────────────
   SYSTEM NOTIFICATION ENGINE
   ────────────────────────────────────────────── */
function createNotification(title, message, type = 'info') {
  const container = document.querySelector('.notification-container') || (() => {
    const div = document.createElement('div');
    div.className = 'notification-container';
    document.body.appendChild(div);
    return div;
  })();

  const icons = { info: '💡', success: '✅', admin: '👑' };
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.innerHTML = `
    <div class="notif-icon">${icons[type]}</div>
    <div class="notif-content">
      <h4>${title}</h4>
      <p>${message}</p>
    </div>
  `;
  container.appendChild(notif);

  // عرض التنبيه بعد جزء من الثانية ليعمل تأثير الانزلاق
  setTimeout(() => notif.classList.add('show'), 100);

  // حذف التنبيه بعد 5 ثواني
  setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 400);
  }, 5000);
}