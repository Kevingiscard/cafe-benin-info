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
    const stem = token => token.length > 4 ? token.replace(/(es|s|e|er|ant|ent|tion)$/, '') : token;
    const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const STOP = new Set(['le', 'la', 'les', 'de', 'des', 'du', 'un', 'une', 'et', 'ou', 'en', 'au', 'aux', 'ce', 'cette', 'pour', 'sur', 'avec', 'sans', 'est', 'sont', 'comment', 'pourquoi', 'quelle', 'quel', 'quoi', 'combien']);
    const tokensOf = query => query.split(/[^a-z0-9]+/).filter(token => token.length >= 2 && !STOP.has(token));
    const pages = [
      ['explorer.html', 'Explorer les chapitres', 'Parcours guidé du café : Arabica, botanique, histoire et tasse.'],
      ['benin.html', 'Dossier Bénin', 'Repères, sources et limites des données sur le café au Bénin.'],
      ['outils.html', 'Outils pratiques', 'Calculateur, diagnostic de tasse et carnet local.'],
      ['dictionnaire.html', 'Dictionnaire du café', 'Termes, définitions, catégories et favoris.'],
      ['observatoire.html', 'Observatoire', 'Données datées, graphiques et sources.'],
      ['professionnels.html', 'Espace professionnel', 'Veille, annuaire, données agrégées et formation.'],
      ['sources.html', 'Sources et contribuer', 'Méthode, crédits et contribution documentaire.'],
      ['chapitre-afrique.html', 'Afrique et Bénin', 'Berceau de l’Arabica, robusta, repères sourcés pour l’Afrique et le Bénin.'],
      ['chapitre-agronomie.html', 'Culture et agronomie', 'Climat, altitude, pluie, plantation et récolte.'],
      ['chapitre-botanique.html', 'Botanique et diversité', 'Rubiacées, Arabica, Canephora (robusta), diversité sauvage.'],
      ['chapitre-economie.html', 'Économie du café', 'Marché, prix, export et commerce du café.'],
      ['chapitre-extraction.html', 'Extraction et préparation', 'Golden Cup, mouture, méthodes, espresso, filtre, infusion.'],
      ['chapitre-filiere.html', 'Filière et marché', 'Producteurs, exportateurs, importateurs, torréfacteurs et cafés.'],
      ['chapitre-histoire.html', 'Histoire du café', 'Origines, Kaldi, religion, commerce, pouvoir et colonisation.'],
      ['chapitre-post-recolte.html', 'Post-récolte', 'Méthodes naturelle, lavée et honey, fermentation, séchage.'],
      ['chapitre-sante.html', 'Santé et qualité', 'Repères officiels sur café et santé, sans conseil médical.'],
      ['chapitre-sensoriel.html', 'Dégustation et sensoriel', 'Normes SCA, arômes, acidité, roue aromatique.'],
      ['chapitre-torrefaction.html', 'Torréfaction', 'Du grain vert au café aromatique, étapes thermiques, craquements.']
    ];
    const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('menu-open'); };
    const draw = () => {
      const query = normalize(input.value.trim());
      const glossary = Array.isArray(window.cafeBeninDictionary) ? window.cafeBeninDictionary : [];
      const records = [...pages.map(([href, title, description]) => ({ href, title, description, type: 'Page' })), ...glossary.map(item => ({ href: `dictionnaire.html?q=${encodeURIComponent(item.term)}`, title: item.term, description: item.definition, type: item.category || 'Dictionnaire' }))];
      const tokens = tokensOf(query);
      const scored = records.map(item => {
        if (!tokens.length) return { item, score: 1 };
        const titleNorm = normalize(item.title);
        const hay = normalize(`${item.title} ${item.description} ${item.type}`);
        let score = 0;
        for (const token of tokens) {
          const re = new RegExp(`\\b${escapeRegExp(stem(token))}`);
          if (re.test(titleNorm)) score += 3;
          else if (re.test(hay)) score += 1;
          else return null;
        }
        return { item, score };
      }).filter(Boolean).sort((a, b) => b.score - a.score);
      const matches = scored.map(entry => entry.item).slice(0, 12);
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
