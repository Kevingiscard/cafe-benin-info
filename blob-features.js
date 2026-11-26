(() => {
  'use strict';
  const API = '/api/stats';
  const page = (location.pathname.split('/').pop() || 'index.html');
  if (!/^[a-z0-9-]+\.html$/.test(page) || /^(404)\.html$/.test(page)) return;
  const fr = !(document.documentElement.lang || 'fr').startsWith('en');
  const t = (a, b) => (fr ? a : b);
  const FAV = 'cb-fav-pages-v1';
  const main = document.querySelector('main');
  if (!main) return;
  const el = (tag, attrs, text) => { const n = document.createElement(tag); Object.entries(attrs || {}).forEach(([k, v]) => n.setAttribute(k, v)); if (text) n.textContent = text; return n; };
  const post = body => fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page, ...body }), keepalive: true }).then(r => r.json()).catch(() => null);
  const style = el('style');
  style.textContent = '.cb-extra{max-width:960px;margin:2.5rem auto;padding:1.25rem;border:1px solid rgba(127,127,127,.35);border-radius:14px}.cb-extra h2{font-size:1.15rem;margin:.2rem 0 .6rem}.cb-extra button,.cb-fav{cursor:pointer;font:inherit;padding:.45rem .9rem;border-radius:999px;border:1px solid currentColor;background:transparent;color:inherit;margin:.15rem .3rem .15rem 0}.cb-extra textarea,.cb-extra input[type=text]{width:100%;box-sizing:border-box;font:inherit;padding:.5rem;border-radius:8px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;margin:.3rem 0}.cb-hp{position:absolute;left:-9999px;height:0;overflow:hidden}.cb-note{font-size:.85rem;opacity:.8}.cb-views{font-size:.85rem;opacity:.8;margin:.5rem 0}.cb-top li{margin:.3rem 0}';
  document.head.appendChild(style);

  // Favoris : seulement dans le navigateur du visiteur (rien envoyé au serveur).
  const favs = () => { try { return JSON.parse(localStorage.getItem(FAV) || '[]'); } catch { return []; } };
  const saveFavs = list => { try { localStorage.setItem(FAV, JSON.stringify(list.slice(0, 60))); } catch {} };
  const title = (document.querySelector('h1') || document.querySelector('title') || {}).textContent || page;
  const cleanTitle = title.replace(/\s+/g, ' ').trim().slice(0, 90);
  const favBtn = el('button', { type: 'button', class: 'cb-fav', 'aria-pressed': 'false' });
  const refreshFav = () => { const on = favs().some(f => f.page === page); favBtn.setAttribute('aria-pressed', String(on)); favBtn.textContent = on ? t('★ Dans mes favoris', '★ In my favorites') : t('☆ Ajouter aux favoris', '☆ Add to favorites'); };
  favBtn.addEventListener('click', () => { const l = favs(); const i = l.findIndex(f => f.page === page); if (i >= 0) l.splice(i, 1); else l.unshift({ page, title: cleanTitle }); saveFavs(l); refreshFav(); });
  refreshFav();

  const box = el('section', { class: 'cb-extra', 'aria-label': t('Votre avis sur cette page', 'Your feedback on this page') });
  box.appendChild(favBtn);
  const views = el('p', { class: 'cb-views', 'aria-live': 'polite' });
  box.appendChild(views);
  box.appendChild(el('h2', {}, t('Cette page vous a-t-elle aidé ?', 'Was this page helpful?')));
  const voteMsg = el('p', { class: 'cb-note', role: 'status' });
  const mkVote = (v, label) => { const b = el('button', { type: 'button' }, label); b.addEventListener('click', async () => { const r = await post({ action: 'vote', v }); voteMsg.textContent = r && r.ok ? t('Merci pour votre retour.', 'Thank you.') : t('Vote non pris en compte pour le moment.', 'Vote not counted right now.'); if (r && r.ok) { b.disabled = true; } }); return b; };
  box.appendChild(mkVote('up', t('👍 Oui', '👍 Yes'))); box.appendChild(mkVote('down', t('👎 Non', '👎 No'))); box.appendChild(voteMsg);

  const form = (kind, heading, button, withName) => {
    const d = el('details'); d.appendChild(el('summary', {}, heading));
    const f = el('form'); const opened = Date.now();
    if (withName) { const l = el('label', {}, t('Prénom ou pseudo (facultatif, pas de nom complet)', 'First name or nickname (optional)')); const n = el('input', { type: 'text', maxlength: '30', autocomplete: 'off' }); l.appendChild(n); f.appendChild(l); f._name = n; }
    const l2 = el('label', {}, t('Votre message (10 à 500 caractères, sans lien, e-mail ni téléphone)', 'Your message (10 to 500 characters, no links, email or phone)'));
    const ta = el('textarea', { rows: '3', maxlength: '500', required: 'required' }); l2.appendChild(ta); f.appendChild(l2);
    const hp = el('input', { type: 'text', name: 'website', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true', class: 'cb-hp' }); f.appendChild(hp);
    f.appendChild(el('p', { class: 'cb-note' }, kind === 'review' ? t('Votre avis est affiché seulement après validation par l’éditeur. Ne saisissez aucune donnée personnelle.', 'Your review appears only after the editor approves it. Do not enter personal data.') : t('Ce signalement est lu uniquement par l’éditeur et n’est pas publié.', 'This report is read only by the editor and is not published.')));
    const send = el('button', { type: 'submit' }, button); f.appendChild(send);
    const msg = el('p', { class: 'cb-note', role: 'status' }); f.appendChild(msg);
    f.addEventListener('submit', async e => { e.preventDefault(); if (Date.now() - opened < 3000) { msg.textContent = t('Un instant, puis réessayez.', 'One moment, then try again.'); return; } send.disabled = true; const r = await post({ action: kind, text: ta.value, name: f._name ? f._name.value : '', website: hp.value }); if (r && r.ok) { msg.textContent = kind === 'review' ? t('Merci. Votre avis sera affiché après validation.', 'Thank you. Your review will appear after approval.') : t('Merci, le signalement est enregistré.', 'Thank you, your report is recorded.'); ta.value = ''; } else { send.disabled = false; msg.textContent = r && r.error === 'filtered' ? t('Message refusé : retirez liens, e-mail ou numéro.', 'Rejected: remove links, email or phone numbers.') : t('Envoi impossible pour le moment.', 'Cannot send right now.'); } });
    d.appendChild(f); return d;
  };
  box.appendChild(form('report', t('Signaler une erreur ou une source à vérifier', 'Report an error or a source to check'), t('Envoyer le signalement', 'Send report'), false));
  const reviewsWrap = el('div'); box.appendChild(reviewsWrap);
  box.appendChild(form('review', t('Laisser un avis public', 'Leave a public review'), t('Envoyer l’avis', 'Send review'), true));
  main.appendChild(box);

  // Compteur (un chargement = une vue, sans cookie ni identifiant), puis lecture.
  const render = d => {
    if (!d) return;
    if (typeof d.views === 'number' && d.views > 0) views.textContent = t('Page lue ' + d.views + ' fois', 'Page viewed ' + d.views + ' times');
    if (Array.isArray(d.reviews) && d.reviews.length) { reviewsWrap.textContent = ''; reviewsWrap.appendChild(el('h2', {}, t('Avis des lecteurs', 'Reader reviews'))); d.reviews.forEach(r => { const p = el('p'); p.textContent = (r.name ? r.name + ' : ' : '') + r.text; reviewsWrap.appendChild(p); }); }
  };
  post({ action: 'view', title: cleanTitle }).then(() => fetch(API + '?action=get&page=' + encodeURIComponent(page), { cache: 'no-store' }).then(r => r.json()).then(render).catch(() => {}));

  // Accueil : « Les plus consultés » et « Mes favoris ».
  if (page === 'index.html') {
    const home = el('section', { class: 'cb-extra' });
    const topH = el('h2', {}, t('Les plus consultés', 'Most viewed')); const topL = el('ol', { class: 'cb-top' });
    const favH = el('h2', {}, t('Mes favoris', 'My favorites')); const favL = el('ul', { class: 'cb-top' });
    const link = (p, tx) => { const li = el('li'); const a = el('a', { href: p }); a.textContent = tx; li.appendChild(a); return li; };
    favs().forEach(f => { if (/^[a-z0-9-]+\.html$/.test(f.page)) favL.appendChild(link(f.page, f.title)); });
    if (!favL.children.length) favL.appendChild(el('li', {}, t('Aucun favori pour l’instant : utilisez « Ajouter aux favoris » en bas d’une page.', 'No favorites yet.')));
    fetch(API + '?action=top', { cache: 'no-store' }).then(r => r.json()).then(d => { (d.top || []).slice(0, 5).forEach(x => topL.appendChild(link(x.page, x.title + ' (' + x.views + ')'))); if (topL.children.length) { home.insertBefore(topL, favH); home.insertBefore(topH, topL); } }).catch(() => {});
    home.appendChild(favH); home.appendChild(favL); main.appendChild(home);
  }
})();
