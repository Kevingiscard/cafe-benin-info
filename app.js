(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const safeStore = {
    get(key, fallback = null) { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* Stockage local non disponible. */ } }
  };

  function setCanonical() {
    const url = 'https://kevingiscard.github.io/cafe-benin-info/';
    const canonical = $('link[rel="canonical"]');
    if (canonical) canonical.href = url;
    const og = $('meta[property="og:url"]');
    if (og) og.content = url;
  }

  function toast(message) {
    const target = $('#toast');
    if (!target) return;
    target.textContent = message;
    target.classList.add('show');
    window.clearTimeout(toast.timeout);
    toast.timeout = window.setTimeout(() => target.classList.remove('show'), 2600);
  }

  function setupTheme() {
    const root = document.documentElement;
    const toggle = $('#theme-toggle');
    if (!toggle) return;
    const apply = (value, persist = true) => {
      const theme = value === 'dark' ? 'dark' : 'light';
      root.dataset.theme = theme;
      const themeMeta = $('meta[name="theme-color"]');
      if (themeMeta) themeMeta.content = theme === 'dark' ? '#15110e' : '#f5f0e7';
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre');
      const label = $('.theme-toggle-label', toggle);
      if (label) label.textContent = theme === 'dark' ? 'Clair' : 'Sombre';
      if (persist) safeStore.set('cb-theme', theme);
    };
    apply(root.dataset.theme || safeStore.get('cb-theme') || 'light', false);
    toggle.addEventListener('click', () => apply(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  }

  function setupNavigation() {
    const header = $('#site-nav');
    const menu = $('#mobile-nav');
    const trigger = $('#nav-toggle');
    let opener = null;
    const focusables = () => $$('a[href], button:not([disabled])', menu);
    const close = ({ restoreFocus = false } = {}) => {
      if (!menu || !trigger) return;
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-label', 'Ouvrir le menu');
      document.body.classList.remove('menu-open');
      if (restoreFocus) opener?.focus();
    };
    const open = () => {
      if (!menu || !trigger) return;
      opener = document.activeElement;
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      trigger.setAttribute('aria-label', 'Fermer le menu');
      document.body.classList.add('menu-open');
      focusables()[0]?.focus();
    };

    trigger?.addEventListener('click', () => menu?.classList.contains('open') ? close({ restoreFocus: true }) : open());
    $$('.mobile-link', menu).forEach(link => link.addEventListener('click', () => close()));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu?.classList.contains('open')) close({ restoreFocus: true });
      if (event.key !== 'Tab' || !menu?.classList.contains('open')) return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 20), { passive: true });
    $$('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
      const target = $(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', link.getAttribute('href'));
    }));
  }

  function setupProgressAndReveal() {
    const progress = $('#progress');
    const update = () => {
      if (!progress) return;
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = `${max > 0 ? Math.min(100, (scrollY / max) * 100) : 0}%`;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    if (reducedMotion() || !('IntersectionObserver' in window)) {
      $$('.reveal').forEach(element => element.classList.add('in'));
      return;
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }), { threshold: .08, rootMargin: '0px 0px -4% 0px' });
    $$('.reveal').forEach(element => observer.observe(element));
  }

  function setupSearch() {
    const modal = $('#search-modal');
    const input = $('#global-search');
    const resultBox = $('#search-results');
    const openButton = $('#search-open');
    const closeButton = $('#search-close');
    if (!modal || !input || !resultBox) return;
    // Le dictionnaire peut être prêt avant DOMContentLoaded : récupérer aussi le corpus déjà exposé.
    let glossary = Array.isArray(window.cafeBeninDictionary) ? window.cafeBeninDictionary : [];
    let activeIndex = -1;
    let opener = null;
    const sectionRecords = () => $$('section[id]').map(section => ({
      id: section.id,
      type: 'Section',
      title: $('h1, h2', section)?.textContent?.replace(/\s+/g, ' ').trim() || section.id,
      description: section.textContent.replace(/\s+/g, ' ').trim().slice(0, 190)
    }));
    const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const makeResult = item => {
      const link = document.createElement('a');
      link.className = 'search-result';
      link.href = `#${item.id}`;
      link.dataset.searchResult = 'true';
      const type = document.createElement('small'); type.textContent = item.type;
      const title = document.createElement('b'); title.textContent = item.title;
      const description = document.createElement('span'); description.textContent = item.description;
      link.append(type, title, description);
      link.addEventListener('click', close);
      return link;
    };
    const draw = () => {
      const query = normalize(input.value.trim());
      const records = [...sectionRecords(), ...glossary.map(item => ({ ...item, id: 'dictionnaire', type: item.category || 'Dictionnaire', title: item.term, description: item.definition }))];
      const ranked = records.map(item => {
        const haystack = normalize(`${item.title} ${item.description} ${item.type}`);
        const exact = query && normalize(item.title) === query ? 3 : 0;
        const starts = query && normalize(item.title).startsWith(query) ? 2 : 0;
        return { item, score: exact + starts + (query && haystack.includes(query) ? 1 : 0) };
      }).filter(entry => !query || entry.score > 0).sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'fr')).slice(0, 12);
      resultBox.replaceChildren();
      activeIndex = -1;
      if (!ranked.length) {
        const empty = document.createElement('p');
        empty.className = 'search-empty';
        empty.textContent = 'Aucun résultat. Essayez un terme comme « Arabica », « mouture » ou « fermentation ». ';
        resultBox.append(empty);
        return;
      }
      ranked.forEach(({ item }) => resultBox.append(makeResult(item)));
    };
    const close = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
      opener?.focus();
    };
    const open = () => {
      opener = document.activeElement;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
      draw();
      input.focus();
      input.select();
    };
    openButton?.addEventListener('click', open);
    closeButton?.addEventListener('click', close);
    modal.addEventListener('click', event => { if (event.target === modal) close(); });
    input.addEventListener('input', draw);
    $('#hero-search-form')?.addEventListener('submit', event => {
      event.preventDefault();
      input.value = $('#hero-search').value;
      open();
    });
    input.addEventListener('keydown', event => {
      const results = $$('[data-search-result]', resultBox);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        activeIndex = event.key === 'ArrowDown' ? Math.min(activeIndex + 1, results.length - 1) : Math.max(activeIndex - 1, 0);
        results[activeIndex]?.focus();
      }
      if (event.key === 'Enter' && results.length) results[Math.max(0, activeIndex)]?.click();
    });
    document.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); open(); }
      if (event.key === 'Escape' && modal.classList.contains('open')) close();
    });
    modal.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const items = $$('input, button, a[href]', modal).filter(item => !item.hidden);
      if (!items.length) return;
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    document.addEventListener('cafeb:dictionary-ready', event => { glossary = Array.isArray(event.detail) ? event.detail : []; draw(); });
    draw();
  }

  function setupBot() {
    const form = $('#bot-form');
    const log = $('#bot-log');
    const assistant = window.cafeBeninLocal;
    if (!form || !log) return;
    const append = (role, message, links = []) => {
      const bubble = document.createElement('div');
      bubble.className = `chat ${role}`;
      const meta = document.createElement('small'); meta.textContent = role === 'user' ? 'Vous' : 'CaféBot local';
      const text = document.createElement('p'); text.textContent = message;
      bubble.append(meta, text);
      if (links.length) {
        const related = document.createElement('p'); related.className = 'chat-links';
        links.forEach(link => { const anchor = document.createElement('a'); anchor.href = link.href; anchor.textContent = link.label; related.append(anchor); });
        bubble.append(related);
      }
      log.append(bubble);
      log.scrollTop = log.scrollHeight;
    };
    if (assistant && !form.dataset.ready) {
      form.dataset.ready = 'true';
      const note = document.createElement('p'); note.className = 'local-assistant-note'; note.textContent = 'Assistant de recherche local : réponses documentaires immédiates, sans compte ni clé API.';
      const suggestions = document.createElement('div'); suggestions.className = 'bot-suggestions';
      assistant.suggestions.forEach(question => {
        const button = document.createElement('button'); button.type = 'button'; button.textContent = question;
        button.addEventListener('click', () => { $('#bot-input').value = question; form.requestSubmit(); });
        suggestions.append(button);
      });
      form.before(note, suggestions);
    }
    form.addEventListener('submit', event => {
      event.preventDefault();
      const input = $('#bot-input');
      const question = input.value.trim();
      if (!question || question.length > 4000) return;
      input.value = '';
      append('user', question);
      if (!assistant) return append('assistant', 'La recherche locale est indisponible. Actualisez la page puis réessayez.');
      const response = assistant.answer(question);
      append('assistant', response.reply, response.links || []);
    });
  }

  function setupRecommendation() {
    const form = $('#recommend-form');
    if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      const output = $('#recommendation');
      const mood = $('#mood').value.trim();
      const preferences = $('#prefs').value.split(',').map(value => value.trim()).filter(Boolean);
      if (!mood || mood.length > 200) return;
      output.textContent = window.cafeBeninLocal?.recommend(mood, preferences) || 'Le conseil local est indisponible. Actualisez la page puis réessayez.';
    });
  }

  function setupContribution() {
    const form = $('#comment-form');
    if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      const name = $('#comment-name').value.trim();
      const email = $('#comment-email').value.trim();
      const message = $('#comment-content').value.trim();
      const status = $('#comment-status');
      if (!name || !email || !message) return;
      const subject = encodeURIComponent(`Contribution Café Bénin — ${name}`);
      const body = encodeURIComponent(`Nom : ${name}\nEmail : ${email}\n\nMessage :\n${message}`);
      const link = document.createElement('a');
      link.href = `mailto:kevingiscard93@outlook.com?subject=${subject}&body=${body}`;
      link.textContent = 'Ouvrir votre application e-mail';
      link.className = 'btn primary';
      status.replaceChildren(document.createTextNode('Votre message est prêt. '), link);
    });
  }

  function setupImageFallbacks() {
    $$('img').forEach(image => image.addEventListener('error', () => {
      const container = image.closest('figure, .card-media, .big-image, .visual-card, .field-card, .hero-media') || image.parentElement;
      container?.classList.add('image-unavailable');
      image.setAttribute('aria-hidden', 'true');
      image.alt = '';
    }, { once: true }));
  }

  function setYear() { const year = $('#year'); if (year) year.textContent = new Date().getFullYear(); }

  document.addEventListener('DOMContentLoaded', () => {
    setCanonical();
    setupTheme();
    setupNavigation();
    setupProgressAndReveal();
    setupSearch();
    setupBot();
    setupRecommendation();
    setupContribution();
    setupImageFallbacks();
    setYear();
  });
})();
