(() => {
  'use strict';
  const init = () => {
    const modal = document.querySelector('#search-modal');
    const trigger = document.querySelector('#search-open');
    const closeButton = document.querySelector('#search-close');
    const input = document.querySelector('#global-search');
    const results = document.querySelector('#search-results');
    if (!modal || !trigger || !closeButton || !input || !results || trigger.onclick) return;
    const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const pages = [
      ['explorer.html', 'Explorer les chapitres', 'Parcours guidé du café : Arabica, botanique, histoire et tasse.'],
      ['benin.html', 'Dossier Bénin', 'Repères, sources et limites des données sur le café au Bénin.'],
      ['outils.html', 'Outils pratiques', 'Calculateur, diagnostic de tasse et carnet local.'],
      ['dictionnaire.html', 'Dictionnaire du café', 'Termes, définitions, catégories et favoris.'],
      ['observatoire.html', 'Observatoire', 'Données datées, graphiques et sources.'],
      ['professionnels.html', 'Espace professionnel', 'Veille, annuaire, données agrégées et formation.'],
      ['sources.html', 'Sources et contribuer', 'Méthode, crédits et contribution documentaire.']
    ];
    const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('menu-open'); };
    const draw = () => {
      const query = normalize(input.value.trim());
      const glossary = Array.isArray(window.cafeBeninDictionary) ? window.cafeBeninDictionary : [];
      const records = [...pages.map(([href, title, description]) => ({ href, title, description, type: 'Page' })), ...glossary.map(item => ({ href: `dictionnaire.html?q=${encodeURIComponent(item.term)}`, title: item.term, description: item.definition, type: item.category || 'Dictionnaire' }))];
      const matches = records.filter(item => !query || normalize(`${item.title} ${item.description} ${item.type}`).includes(query)).slice(0, 12);
      results.replaceChildren();
      if (!matches.length) { const empty = document.createElement('p'); empty.className = 'search-empty'; empty.textContent = 'Aucun résultat. Essayez « Arabica », « mouture » ou « fermentation ». '; results.append(empty); return; }
      matches.forEach(item => { const a = document.createElement('a'); a.className = 'search-result'; a.href = item.href; const small = document.createElement('small'); small.textContent = item.type; const title = document.createElement('b'); title.textContent = item.title; const description = document.createElement('span'); description.textContent = item.description; a.append(small, title, description); a.addEventListener('click', close); results.append(a); });
    };
    const open = () => { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('menu-open'); draw(); input.focus(); input.select(); };
    trigger.onclick = open; closeButton.onclick = close; document.addEventListener('cafeb:dictionary-ready', draw); modal.addEventListener('click', event => { if (event.target === modal) close(); }); input.addEventListener('input', () => window.setTimeout(draw, 120)); document.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); open(); } if (event.key === 'Escape' && modal.classList.contains('open')) close(); });
    document.documentElement.dataset.cbSearchReady = 'true';
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
