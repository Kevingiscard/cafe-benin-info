(() => {
  'use strict';
  const KEY = 'cb-cookie-choice-v1';
  const get = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } };
  const save = value => { try { localStorage.setItem(KEY, JSON.stringify({ ...value, at: new Date().toISOString() })); } catch {} };
  const banner = document.querySelector('#cookie-banner');
  const status = document.querySelector('#cookie-status');
  const close = () => { if (banner) { banner.hidden = true; banner.setAttribute('aria-hidden', 'true'); } };
  const en = (document.documentElement.lang || 'fr').startsWith('en');
  const announce = message => { if (status) status.textContent = message; };
  const msg = (fr, enText) => (en ? enText : fr);
  const apply = choice => { const wasAllowed = get()?.analytics === true; save(choice); close(); if (choice.analytics && window.cbLoadStats) window.cbLoadStats(); announce(choice.analytics ? msg('Mesure d’audience acceptée.', 'Audience measurement accepted.') : msg('Seuls les services essentiels sont conservés.', 'Only essential services are kept.')); if (wasAllowed && !choice.analytics) location.reload(); };
  if (!banner) return;
  const existing = get();
  if (existing) close(); else { banner.hidden = false; banner.setAttribute('aria-hidden', 'false'); }
  document.querySelector('#cookies-essential')?.addEventListener('click', () => apply({ analytics: false }));
  document.querySelector('#cookies-analytics')?.addEventListener('click', () => apply({ analytics: true }));
  document.querySelector('#cookies-settings')?.addEventListener('click', () => {
    const panel = document.querySelector('#cookie-settings-panel');
    if (panel) { panel.hidden = !panel.hidden; panel.querySelector('input')?.focus(); }
  });
  document.querySelector('#cookie-reset')?.addEventListener('click', () => {
    const choice = get();
    const panel = document.querySelector('#cookie-settings-panel');
    const field = document.querySelector('#analytics-choice');
    banner.hidden = false;
    banner.setAttribute('aria-hidden', 'false');
    if (panel) panel.hidden = false;
    if (field) { field.checked = choice?.analytics === true; field.focus(); }
  });
  // La case « Mesure d'audience » du panneau Choisir est un vrai réglage :
  // elle reflète le choix enregistré et l'applique dès qu'on la modifie.
  const analyticsChoice = document.querySelector('#analytics-choice');
  if (analyticsChoice) {
    document.querySelector('#cookies-settings')?.addEventListener('click', () => {
      const choice = get();
      analyticsChoice.checked = Boolean(choice && choice.analytics);
    });
    analyticsChoice.addEventListener('change', () => apply({ analytics: analyticsChoice.checked }));
  }
})();
