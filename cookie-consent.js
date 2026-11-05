(() => {
  'use strict';
  const KEY = 'cb-cookie-choice-v1';
  const get = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } };
  const save = value => { try { localStorage.setItem(KEY, JSON.stringify({ ...value, at: new Date().toISOString() })); } catch {} };
  const banner = document.querySelector('#cookie-banner');
  const status = document.querySelector('#cookie-status');
  const close = () => { if (banner) { banner.hidden = true; banner.setAttribute('aria-hidden', 'true'); } };
  const announce = message => { if (status) status.textContent = message; };
  const apply = choice => { save(choice); close(); announce(choice.analytics ? 'Mesure d’audience acceptée.' : 'Seuls les services essentiels sont conservés.'); };
  if (!banner) return;
  const existing = get();
  if (existing) close(); else { banner.hidden = false; banner.setAttribute('aria-hidden', 'false'); }
  document.querySelector('#cookies-essential')?.addEventListener('click', () => apply({ analytics: false }));
  document.querySelector('#cookies-analytics')?.addEventListener('click', () => apply({ analytics: true }));
  document.querySelector('#cookies-settings')?.addEventListener('click', () => {
    const panel = document.querySelector('#cookie-settings-panel');
    if (panel) { panel.hidden = !panel.hidden; panel.querySelector('input')?.focus(); }
  });
  document.querySelector('#cookie-reset')?.addEventListener('click', () => { try { localStorage.removeItem(KEY); } catch {} location.reload(); });
})();
