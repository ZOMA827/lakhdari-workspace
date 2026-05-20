/* ============================================================
   THE LAKHDARI WORKSPACE v2.0 — projects-data.js
   Standalone Projects Database · Edit freely · CRUD-ready
   ============================================================ */

'use strict';

const DEFAULT_PROJECTS = [
  {
    id: 'healthmate',
    name: 'Healthmate',
    icon: '♥',
    iconClass: 'hm-icon',
    category: 'flutter',
    tagline: 'Graduation Project · Batna 2 University',
    shortDesc: 'Integrated health ecosystem with AI-powered medical assistant. Cross-platform mobile app — final-year graduation project at Batna 2.',
    desc: 'A complete cross-platform health ecosystem built with Flutter, integrating an AI-powered medical assistant trained on health data. The app offers real-time symptom analysis, medical history tracking, appointment management, and smart medication reminders — all within a clean, accessible interface.',
    tech: ['Flutter', 'Dart', 'Firebase', 'Gemini API', 'REST APIs', 'Firestore'],
    highlights: [
      'AI-powered medical Q&A with contextual awareness',
      'Cross-platform: Android, iOS, and Web from one codebase',
      'Final-year project for Licence degree at Batna 2',
      'Offline-first architecture with Firebase sync',
    ],
    stars: 5,
    downloads: '2.4k installs',
    downloadLink: '#',
    liveLink: '#',
    images: [],
    featured: true,
    clicks: 0,
    createdAt: Date.now(),
  },
  {
    id: 'animebeast',
    name: 'Anime Beast',
    icon: '⚔',
    iconClass: 'ab-icon',
    category: 'web',
    tagline: 'Full-Stack Web Platform',
    shortDesc: 'Full-stack anime tracking & streaming platform with live comments system, multi-language support, and custom recommendation engine.',
    desc: 'A feature-rich anime tracking and streaming hub built with vanilla HTML/CSS/JS on the frontend and a custom backend. Supports live user comments, a multi-language interface (Arabic, French, English), watchlist management, episode progress tracking, and a recommendation engine based on viewing history.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'WebSockets', 'REST API'],
    highlights: [
      'Live comment system powered by WebSockets',
      'Multi-language UI: Arabic, French, English',
      'Custom anime recommendation engine',
      'Responsive design optimized for mobile & desktop',
    ],
    stars: 4,
    downloads: '1.8k users',
    downloadLink: '#',
    liveLink: '#',
    images: [],
    featured: false,
    clicks: 0,
    createdAt: Date.now(),
  },
  {
    id: 'careercraft',
    name: 'CareerCraft',
    icon: '✦',
    iconClass: 'cc-icon',
    category: 'flutter',
    tagline: 'Formerly "CV Hero" · Professional CV Builder',
    shortDesc: 'Professional CV builder (formerly CV Hero). Smart resume generation with export to PDF, beautiful templates, and AI-assisted content.',
    desc: 'A polished Flutter application for building and exporting professional resumes. Users pick from curated templates, fill in structured sections with AI-assisted suggestions, and export pixel-perfect PDFs in one tap. CareerCraft syncs via Firebase for cloud storage and history.',
    tech: ['Flutter', 'Dart', 'Firebase', 'PDF Generation', 'AI Suggestions', 'Cloud Storage'],
    highlights: [
      'AI-assisted content suggestions for each CV section',
      'Multiple professional templates with live preview',
      'One-tap PDF export with pixel-perfect rendering',
      'Cross-device sync via Firebase Cloud Firestore',
    ],
    stars: 5,
    downloads: '3.1k exports',
    downloadLink: '#',
    liveLink: '#',
    images: [],
    featured: false,
    clicks: 0,
    createdAt: Date.now(),
  },
];

/* ──────────────────────────────────────────────
   ProjectsDB — LocalStorage-backed data layer
   ────────────────────────────────────────────── */
const ProjectsDB = (() => {
  const STORAGE_KEY = 'lakhdari_projects_v2';
  const CLICKS_KEY  = 'lakhdari_clicks_v2';

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
    } catch {
      return JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
    }
  }

  function save(projects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }

  function loadClicks() {
    try {
      const raw = localStorage.getItem(CLICKS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }

  function saveClicks(clicks) {
    localStorage.setItem(CLICKS_KEY, JSON.stringify(clicks));
  }

  return {
    getAll() { return load(); },

    getById(id) { return load().find(p => p.id === id) || null; },
    // هادي هي الدالة اللي تنقصك ومهمة جداً للفايربيز:
    overrideAll(newProjectsArray) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjectsArray));
    },
    add(project) {
      const projects = load();
      project.id = project.id || ('proj_' + Date.now());
      project.clicks = 0;
      project.createdAt = Date.now();
      projects.push(project);
      save(projects);
    },

    update(id, updates) {
      const projects = load();
      const idx = projects.findIndex(p => p.id === id);
      if (idx === -1) return false;
      projects[idx] = { ...projects[idx], ...updates };
      save(projects);
      return true;
    },

    delete(id) {
      const projects = load().filter(p => p.id !== id);
      save(projects);
    },

    setFeatured(id) {
      const projects = load().map(p => ({ ...p, featured: p.id === id }));
      save(projects);
    },

    registerClick(id) {
      const clicks = loadClicks();
      clicks[id] = (clicks[id] || 0) + 1;
      saveClicks(clicks);
      // also update embedded counter
      const projects = load();
      const idx = projects.findIndex(p => p.id === id);
      if (idx !== -1) { projects[idx].clicks = (projects[idx].clicks || 0) + 1; save(projects); }
    },

    getClicks() { return loadClicks(); },

    reset() {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CLICKS_KEY);
    },
  };
})();