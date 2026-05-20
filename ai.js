/* ============================================================
   THE LAKHDARI WORKSPACE v3.0 — ai.js
   Mini-Ilyes AI Engine · Floating Button · Speech Bubbles
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────
   CONTEXT — Ilyes Lakhdari's Digital Identity
   ────────────────────────────────────────────── */
const MINI_ILYES_CONTEXT = `You are Mini-Ilyes — a digital assistant that speaks as if you ARE Ilyes Lakhdari, a Flutter developer and computer science graduate from Batna 2 University in Algeria.

Speak in first person, naturally and conversationally. Be knowledgeable, a bit casual, and genuinely passionate about your craft.

Key facts about you (Ilyes):
- Full name: Ilyes Lakhdari. From Constantine, Algeria. Currently based there.
- Studied Computer Science at Batna 2 University. Graduation project: Healthmate.
- Main projects:
  • Healthmate — Flutter + Firebase + Gemini AI health assistant. 2,400+ installs. Cross-platform (Android/iOS/Web). Graduation project.
  • Anime Beast — Full-stack web anime tracking/streaming platform. Live WebSocket comments. Multi-language (Arabic, French, English). Custom recommendation engine. 1,800+ users.
  • CareerCraft — Flutter CV builder app (formerly CV Hero). AI-assisted content, multiple templates, PDF export, Firebase cloud sync. 3,100+ exports.
- Tech stack: Flutter/Dart (main), JavaScript (vanilla + Node.js), Python, HTML/CSS, Firebase, Firestore, REST APIs, Gemini API, WebSockets.
- Passionate about local AI: you run Llama 3 via Ollama locally on your ThinkPad L14 Gen 2 without any cloud dependency.
- Hardware rig: ThinkPad L14 Gen 2 · AMD Ryzen 5 PRO 5650U · 16 GB DDR4 · Radeon RX Vega 7 iGPU · Linux/Windows dual boot.
- Gaming achievements on integrated graphics: Ghost of Tsushima ~45 FPS Medium, GTA V ~60 FPS High (tuned), RE4 Remake ~40 FPS (patched), eFootball ~60 FPS Ultra.
- Workbench projects: repurposing CD/DVD drives for stepper motor experiments, using scrcpy for zero-latency Android mirroring via ADB, deep Linux performance tuning (CPU governors, thermal management, swap).
- Personal touch: you raise canaries at home and genuinely love watching new chicks hatch and grow. It's your quiet corner of joy away from screens.
- Philosophy: humble but confident. You love going deep into things — not surface-level. You believe local AI and hardware optimization are underrated skills.

Keep replies under 4–5 sentences unless a detailed technical answer is clearly needed. Stay in character always. If asked about something you don't know, admit it naturally — Ilyes is honest like that.`;

/* ──────────────────────────────────────────────
   AI ENGINE — Swappable Backend
   ────────────────────────────────────────────── */
const MiniIlyesAI = (() => {
  const BACKEND = 'claude'; // 'claude' | 'ollama' | 'mock'

  const OLLAMA_ENDPOINT = 'http://localhost:11434/api/chat';
  const OLLAMA_MODEL    = 'llama3';

  async function callClaude(history) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: MINI_ILYES_CONTEXT,
        messages: history,
      }),
    });
    const data = await response.json();
    return data.content?.map(b => b.text || '').join('') || "Sorry, I couldn't process that.";
  }

  async function callOllama(history) {
    const response = await fetch(OLLAMA_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [{ role: 'system', content: MINI_ILYES_CONTEXT }, ...history],
        stream: false,
      }),
    });
    const data = await response.json();
    return data.message?.content || "Ollama didn't respond.";
  }

  function mockReply(msg) {
    const m = msg.toLowerCase();
    if (m.includes('project') || m.includes('healthmate') || m.includes('anime') || m.includes('career'))
      return "I've built three main projects: Healthmate (a Flutter health app with AI), Anime Beast (a full-stack anime platform), and CareerCraft (a Flutter CV builder). Each one taught me something different about shipping real products.";
    if (m.includes('laptop') || m.includes('thinkpad') || m.includes('hardware'))
      return "I'm running a ThinkPad L14 Gen 2 — Ryzen 5 PRO 5650U, 16GB RAM, integrated Vega 7 GPU. Sounds modest, but with the right tuning you can run Ghost of Tsushima and local LLMs on it. Hardware is about understanding your tools, not just having expensive ones.";
    if (m.includes('canary') || m.includes('bird'))
      return "Ha, yeah — I raise canaries at home. Watching tiny chicks grow up is a reminder that not everything has to be optimized or shipped by a deadline. Sometimes things just need time and care.";
    if (m.includes('ai') || m.includes('ollama') || m.includes('llama'))
      return "I'm really into local AI — I run Llama 3 via Ollama directly on the ThinkPad. No cloud, no latency, no API costs. There's something deeply satisfying about owning your entire stack.";
    return "I'm Mini-Ilyes — ask me about my projects, my setup, my take on local AI, or even my canaries. I'm an open book.";
  }

  return {
    async ask(history) {
      switch (BACKEND) {
        case 'claude': return callClaude(history);
        case 'ollama': return callOllama(history);
        case 'mock':   return mockReply(history[history.length - 1]?.content || '');
        default:       return callClaude(history);
      }
    },
    getBackend() { return BACKEND; },
  };
})();

/* ──────────────────────────────────────────────
   CHAT UI CONTROLLER
   ────────────────────────────────────────────── */
function initAIChat() {
  const chatWindow = document.getElementById('chat-window');
  const chatInput  = document.getElementById('chat-input');
  const chatSend   = document.getElementById('chat-send');
  if (!chatWindow || !chatInput || !chatSend) return;

  let conversationHistory = [];

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    chatInput.value = '';
    chatSend.disabled = true;

    const typingId = appendMessage('assistant', '', true);
    conversationHistory.push({ role: 'user', content: text });

    try {
      const reply = await MiniIlyesAI.ask(conversationHistory);
      removeMessage(typingId);
      appendMessage('assistant', reply);
      conversationHistory.push({ role: 'assistant', content: reply });
    } catch {
      removeMessage(typingId);
      appendMessage('assistant', "Hmm, connection issue — try again in a second!");
    }

    chatSend.disabled = false;
    chatInput.focus();
  }

  function appendMessage(role, text, isTyping = false) {
    const id  = `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    div.id = id;
    const avatarText = role === 'assistant' ? 'IL' : 'YOU';
    const bubbleHTML = isTyping
      ? `<div class="msg-bubble typing">thinking</div>`
      : `<div class="msg-bubble">${escHtml(text)}</div>`;
    div.innerHTML = `<div class="msg-avatar">${avatarText}</div>${bubbleHTML}`;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return id;
  }

  function removeMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function escHtml(t) {
    const d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
  }

  chatSend.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
}

/* ──────────────────────────────────────────────
   FLOATING AI BUTTON + SPEECH BUBBLES
   ────────────────────────────────────────────── */
function initFloatingAI() {
  const fabWrapper = document.getElementById('floating-ai-wrapper');
  const fabBtn     = document.getElementById('floating-ai-btn');
  const bubble     = document.getElementById('ai-speech-bubble');
  const bubbleText = document.getElementById('ai-bubble-text');
  if (!fabWrapper || !fabBtn || !bubble || !bubbleText) return;

  let bubbleTimer    = null;
  let hideTimer      = null;
  let bubbleIndex    = 0;
  let isBubbleActive = false;

  /* Get bubbles from lang system (if available) or fallback */
  function getBubbles() {
    if (typeof LangSystem !== 'undefined') return LangSystem.getBubbles();
    return [
      "Got questions? I'm right here 👋",
      "Check out how I built Healthmate with AI!",
      "Did you know I run LLMs locally on my ThinkPad?",
      "Ask me about CareerCraft — 3.1k+ exports!",
      "Want to know about my canaries? 🐤",
    ];
  }

  function showBubble() {
    if (isBubbleActive) return;
    const bubbles = getBubbles();
    bubbleText.textContent = bubbles[bubbleIndex % bubbles.length];
    bubbleIndex++;

    isBubbleActive = true;
    bubble.classList.add('visible');

    /* Auto-hide after 5s */
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideBubble, 5000);
  }

  function hideBubble() {
    isBubbleActive = false;
    bubble.classList.remove('visible');
  }

  function scheduleBubble(delay) {
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => {
      showBubble();
      /* Next bubble in 30–45s */
      scheduleBubble(30000 + Math.random() * 15000);
    }, delay);
  }

  /* First bubble appears after 8 seconds */
  scheduleBubble(8000);

  /* Click FAB → navigate to AI view */
  fabBtn.addEventListener('click', () => {
    hideBubble();
    if (typeof navigateTo === 'function') {
      navigateTo('ai');
    }
  });

  /* Close bubble on click */
  bubble.addEventListener('click', hideBubble);

  /* Update bubbles when language changes */
  document.addEventListener('langchange', () => {
    bubbleIndex = 0; // reset so next bubble is in new lang
  });
}