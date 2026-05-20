/* ============================================================
   THE LAKHDARI WORKSPACE v3.0 — lang-config.js
   Bilingual System · Arabic (RTL) ↔ English (LTR)
   Instant switch · No reload · localStorage persistence
   ============================================================ */

'use strict';

const LANG_STRINGS = {
  en: {
    /* ── Sidebar ── */
    sidebar_title:      'Flutter Dev · AI Enthusiast',
    nav_home:           'Workspace',
    nav_projects:       'Projects',
    nav_ai:             'Mini-Ilyes AI',
    nav_workbench:      'Workbench',
    nav_gaming:         'Hardware & Gaming',
    nav_cv:             'Download CV',
    nav_canary:         'Canary Room',
    nav_studio:         'Lakhdari Studio',
    lang_toggle_label:  'عر',
    lang_toggle_title:  'التبديل إلى العربية',

    /* ── Home ── */
    home_badge:         'v3.0 · Batna 2 University',
    home_title_1:       'The Lakhdari',
    home_title_2:       'Workspace',
    home_subtitle:      'Full-stack developer crafting cross-platform apps, AI-powered tools, and hardware experiments from Constantine, Algeria.',
    cta_projects:       'Explore Projects',
    cta_ai:             'Talk to Mini-Ilyes',
    stat_projects:      'Live Projects',
    stat_stacks:        'Tech Stacks',
    stat_games:         'Games Optimized',
    stat_canaries:      'Canary Chicks',

    /* ── Projects ── */
    projects_title:     'App Store Canvas',
    filter_all:         'All',
    filter_flutter:     'Flutter',
    filter_web:         'Web',

    /* ── AI View ── */
    ai_view_title:      'Mini-Ilyes AI',
    ai_powered_by:      'Powered by Claude',
    ai_intro:           'Ask me anything about Ilyes — his projects, studies at Batna 2, tech stack, or thoughts on AI and hardware hacking.',
    ai_placeholder:     'Ask Mini-Ilyes anything...',
    ai_greeting:        "Hey! I'm Mini-Ilyes — a digital reflection of Ilyes Lakhdari. Ask me about my projects, my Flutter apps, my ThinkPad setup, or anything else you're curious about.",

    /* ── CV ── */
    cv_title:           'Download CV',

    /* ── Canary ── */
    canary_title:       'A Little Corner of Joy',

    /* ── Workbench ── */
    workbench_title:    'The Workbench',

    /* ── Gaming ── */
    gaming_title:       'Hardware & Gaming',

    /* ── Admin / Studio ── */
    login_modal_title:  'Studio Access',
    login_modal_sub:    'Admin credentials required',
    login_email_lbl:    'Email',
    login_pass_lbl:     'Password',
    login_email_ph:     'admin@example.com',
    login_pass_ph:      '••••••••',
    login_btn:          'Login',
    login_cancel:       'Cancel',
    logout_btn:         '⏻',
    admin_badge_text:   'Admin Mode',

    /* ── Floating AI Bubbles ── */
    bubbles: [
      "Got questions? I'm right here 👋",
      "Check out how I built Healthmate with Gemini AI!",
      "Did you know I run LLMs locally on my ThinkPad?",
      "Ask me about CareerCraft — 3.1k+ exports!",
      "Want to know about my canaries? 🐤",
      "I'm Ilyes — ask me anything about my stack!",
    ],

    /* ── Contact ── */
    nav_contact:          'Contact',
    contact_view_title:   'Get In Touch',
    contact_view_tag:     'AI-Powered · Instant Reply',
    contact_location_lbl: 'Location',
    contact_edu_lbl:      'Education',
    contact_avail_lbl:    'Availability',
    contact_ai_lbl:       'AI Reply',
    contact_ai_sub:       'Mini-Ilyes reads your message and responds',
    contact_avail_status: 'Open to opportunities',
    cf_name_label:        'Your Name',
    cf_msg_label:         'Your Message',
    cf_send_label:        'Send Message',
    cf_sending_label:     'Sending…',
    reply_from_label:     'Mini-Ilyes replied',
    visitor_label:        'You are visitor',
    visitor_label_2:      'to this workspace',

    /* ── Skills ── */
    skills_title:  'Skills & Proficiency',

    /* ── Timeline ── */
    timeline_title: 'My Journey',
    tl_2020: 'Started Computer Science at Batna 2 University',
    tl_2022: 'Built Anime Beast — first full-stack web platform',
    tl_2023: 'Launched CareerCraft — 3,100+ PDF exports',
    tl_2024: 'Graduated · Healthmate as final project · 2,400+ installs',
    tl_now:  'Building locally, thinking globally 🚀',
  },

  ar: {
    /* ── Sidebar ── */
    sidebar_title:      'مطوّر Flutter · متحمّس للذكاء الاصطناعي',
    nav_home:           'مساحة العمل',
    nav_projects:       'المشاريع',
    nav_ai:             'Mini-Ilyes AI',
    nav_workbench:      'ورشة العمل',
    nav_gaming:         'الأجهزة والألعاب',
    nav_cv:             'تحميل السيرة الذاتية',
    nav_canary:         'غرفة الكناريا',
    nav_studio:         'Lakhdari Studio',
    lang_toggle_label:  'EN',
    lang_toggle_title:  'Switch to English',

    /* ── Home ── */
    home_badge:         'v3.0 · جامعة باتنة 2',
    home_title_1:       'مساحة',
    home_title_2:       'لخضاري',
    home_subtitle:      'مطوّر متكامل يبني تطبيقات متعددة المنصات وأدوات ذكاء اصطناعي وتجارب أجهزة من قسنطينة، الجزائر.',
    cta_projects:       'استكشف المشاريع',
    cta_ai:             'تحدث مع Mini-Ilyes',
    stat_projects:      'مشروع حي',
    stat_stacks:        'تقنيات مستخدمة',
    stat_games:         'ألعاب محسّنة',
    stat_canaries:      'فراخ الكناريا',

    /* ── Projects ── */
    projects_title:     'معرض التطبيقات',
    filter_all:         'الكل',
    filter_flutter:     'Flutter',
    filter_web:         'ويب',

    /* ── AI View ── */
    ai_view_title:      'Mini-Ilyes AI',
    ai_powered_by:      'مدعوم بـ Claude',
    ai_intro:           'اسألني عن إلياس — مشاريعه أو دراسته في باتنة 2 أو تقنياته أو أفكاره حول الذكاء الاصطناعي.',
    ai_placeholder:     '...اسأل Mini-Ilyes أي شيء',
    ai_greeting:        "أهلاً! أنا Mini-Ilyes — نسخة رقمية من إلياس لخضاري. اسألني عن مشاريعي أو تطبيقات Flutter أو إعداد ThinkPad أو أي شيء يستأثر باهتمامك.",

    /* ── CV ── */
    cv_title:           'تحميل السيرة الذاتية',

    /* ── Canary ── */
    canary_title:       'ركن صغير من الفرح',

    /* ── Workbench ── */
    workbench_title:    'ورشة العمل',

    /* ── Gaming ── */
    gaming_title:       'الأجهزة والألعاب',

    /* ── Admin / Studio ── */
    login_modal_title:  'دخول الاستوديو',
    login_modal_sub:    'مطلوب بيانات المدير',
    login_email_lbl:    'البريد الإلكتروني',
    login_pass_lbl:     'كلمة المرور',
    login_email_ph:     'admin@example.com',
    login_pass_ph:      '••••••••',
    login_btn:          'دخول',
    login_cancel:       'إلغاء',
    logout_btn:         '⏻',
    admin_badge_text:   'وضع المدير',

    /* ── Floating AI Bubbles ── */
    bubbles: [
      "لديك سؤال؟ أنا هنا 👋",
      "اكتشف كيف بنيت Healthmate بذكاء اصطناعي حقيقي!",
      "هل تعلم أنني أشغّل نماذج ذكاء اصطناعي محلياً على ThinkPad؟",
      "اسألني عن CareerCraft — أكثر من 3100 تصدير!",
      "تريد تعرف على كناريا تاعي؟ 🐤",
      "أنا إلياس — اسألني عن أي شيء في تقنياتي!",
    ],
  },
};

/* ──────────────────────────────────────────────
   LangSystem — Singleton controller
   ────────────────────────────────────────────── */
const LangSystem = (() => {
  const STORAGE_KEY = 'lakhdari_lang_v3';
  let _current = localStorage.getItem(STORAGE_KEY) || 'en';

  /* Map of [querySelector, stringKey, attribute (null=textContent)] */
  const DOM_MAP = [
    ['.sidebar-title',                      'sidebar_title',     null],
    ['#lang-toggle-btn',                    'lang_toggle_label', null],
    ['.home-badge',                          'home_badge',        null],
    ['.home-subtitle',                       'home_subtitle',     null],
    ['.cta-primary',                         'cta_projects',      null],
    ['.cta-secondary',                       'cta_ai',            null],
    ['#chat-input',                          'ai_placeholder',    'placeholder'],
    ['#login-modal-title',                   'login_modal_title', null],
    ['#login-modal-sub',                     'login_modal_sub',   null],
    ['#login-email-label',                   'login_email_lbl',   null],
    ['#login-pass-label',                    'login_pass_lbl',    null],
    ['#login-email-input',                   'login_email_ph',    'placeholder'],
    ['#login-pass-input',                    'login_pass_ph',     'placeholder'],
    ['#login-submit-btn',                    'login_btn',         null],
    ['#login-cancel-btn',                    'login_cancel',      null],
    ['#admin-logout-btn',                    'logout_btn',        null],
    ['#admin-badge-text',                    'admin_badge_text',  null],
  ];

  /* Nav buttons — data-lang-key on the text span */
  const NAV_MAP = {
    home:       'nav_home',
    projects:   'nav_projects',
    ai:         'nav_ai',
    workbench:  'nav_workbench',
    gaming:     'nav_gaming',
    cv:         'nav_cv',
    canary:     'nav_canary',
    studio:     'nav_studio',
  };

  function t(key) {
    return LANG_STRINGS[_current]?.[key] ?? LANG_STRINGS['en'][key] ?? key;
  }

  function apply(lang) {
    if (!LANG_STRINGS[lang]) return;
    _current = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    const isAr = lang === 'ar';

    /* Direction + lang attribute */
    document.documentElement.lang = lang;
    document.documentElement.dir  = isAr ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl', isAr);

    /* Font swap */
    document.documentElement.style.setProperty(
      '--font-body',
      isAr ? "'Tajawal', sans-serif" : "'Sora', sans-serif"
    );

    /* Update lang toggle button */
    const toggleBtn = document.getElementById('lang-toggle-btn');
    if (toggleBtn) {
      toggleBtn.textContent = t('lang_toggle_label');
      toggleBtn.title       = t('lang_toggle_title');
    }

    /* Apply DOM_MAP */
    DOM_MAP.forEach(([sel, key, attr]) => {
      document.querySelectorAll(sel).forEach(el => {
        const val = t(key);
        if (attr) el[attr] = val;
        else      el.textContent = val;
      });
    });

    /* Nav button text spans */
    Object.entries(NAV_MAP).forEach(([view, key]) => {
      const btn = document.querySelector(`.nav-btn[data-view="${view}"]`);
      if (btn) {
        const span = btn.querySelectorAll('span')[1]; // second span = text
        if (span) span.textContent = t(key);
      }
    });

    /* Home title (has <em>) */
    const titleEl = document.querySelector('.home-title');
    if (titleEl) {
      titleEl.innerHTML = `${t('home_title_1')}<br/><em>${t('home_title_2')}</em>`;
    }

    /* Stat labels */
    const statKeys    = ['stat_projects', 'stat_stacks', 'stat_games', 'stat_canaries'];
    const statLabels  = document.querySelectorAll('.stat-label');
    statLabels.forEach((el, i) => { if (statKeys[i]) el.textContent = t(statKeys[i]); });

    /* Filter buttons */
    const filterKeys = ['filter_all', 'filter_flutter', 'filter_web'];
    document.querySelectorAll('.filter-btn').forEach((btn, i) => {
      if (filterKeys[i]) btn.textContent = t(filterKeys[i]);
    });

    /* View headers */
    _setText('#view-projects .view-header h2', 'projects_title');
    _setText('#view-ai .view-header h2',       'ai_view_title');
    _setText('#view-workbench .view-header h2','workbench_title');
    _setText('#view-gaming .view-header h2',   'gaming_title');
    _setText('#view-cv .view-header h2',       'cv_title');
    _setText('.canary-header h2',              'canary_title');

    /* AI section */
    const aiStatus = document.querySelector('.ai-status');
    if (aiStatus) {
      aiStatus.innerHTML = `<span class="status-dot"></span>${t('ai_powered_by')}`;
    }
    _setText('.ai-intro p', 'ai_intro');

    /* Dispatch event so other modules can react */
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang, isAr } }));
  }

  function _setText(selector, key) {
    const el = document.querySelector(selector);
    if (el) el.textContent = t(key);
  }

  return {
    apply,
    toggle() { apply(_current === 'en' ? 'ar' : 'en'); },
    t,
    get current() { return _current; },
    getBubbles() { return LANG_STRINGS[_current]?.bubbles || LANG_STRINGS['en'].bubbles; },
  };
})();