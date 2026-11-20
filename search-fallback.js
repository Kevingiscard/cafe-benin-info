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
      // Tolérance de frappe bornée : distance 1, mot d'au moins 5 lettres sans
      // correspondance, un seul candidat possible dans le vocabulaire de l'index.
      const vocabulary = [...new Set(records.flatMap(item => normalize(`${item.title} ${item.type}`).split(/[^a-z0-9]+/).filter(word => word.length >= 5)))];
      const distance1 = (a, b) => {
        if (a === b) return true;
        const la = a.length, lb = b.length;
        if (Math.abs(la - lb) > 1) return false;
        if (la === lb) {
          let diff = 0;
          for (let i = 0; i < la; i++) if (a[i] !== b[i]) diff++;
          if (diff === 1) return true;
          for (let i = 0; i < la - 1; i++) {
            if (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(0, i) === b.slice(0, i) && a.slice(i + 2) === b.slice(i + 2)) return true;
          }
          return false;
        }
        const [short, long] = la < lb ? [a, b] : [b, a];
        let i = 0, j = 0, skips = 0;
        while (i < short.length && j < long.length) {
          if (short[i] === long[j]) { i++; j++; }
          else { skips++; j++; if (skips > 1) return false; }
        }
        return true;
      };
      const corrections = [];
      const correctToken = token => {
        if (token.length < 5) return null;
        const candidates = vocabulary.filter(word => distance1(token, word));
        return candidates.length === 1 ? candidates[0] : null;
      };
      const scoreOne = (item, requireAll) => {
        if (!tokens.length) return { item, score: 1 };
        const titleNorm = normalize(item.title);
        const hay = normalize(`${item.title} ${item.description} ${item.type}`);
        let score = 0;
        let covered = 0;
        for (const token of tokens) {
          let re = new RegExp(`\\b${escapeRegExp(stem(token))}`);
          if (re.test(titleNorm)) { score += titleNorm === token ? 5 : 3; covered += 1; continue; }
          if (re.test(hay)) { score += 1; covered += 1; continue; }
          const fixed = correctToken(token);
          if (fixed) {
            re = new RegExp(`\\b${escapeRegExp(stem(fixed))}`);
            if (re.test(titleNorm)) {
              score += 1.5; covered += 1;
              if (!corrections.some(c => c.from === token)) corrections.push({ from: token, to: fixed });
            } else if (re.test(hay)) {
              score += 0.5; covered += 1;
              if (!corrections.some(c => c.from === token)) corrections.push({ from: token, to: fixed });
            }
          }
        }
        if (requireAll && covered < tokens.length) return null;
        return covered ? { item, score: score + covered * 2 } : null;
      };
      let ranked = records.map(item => scoreOne(item, true)).filter(Boolean).sort((a, b) => b.score - a.score);
      let fallbackUsed = false;
      if (!ranked.length && tokens.length > 1) {
        // Repli souple : au moins un mot correspond, les plus couverts d'abord.
        corrections.length = 0;
        ranked = records.map(item => scoreOne(item, false)).filter(Boolean).sort((a, b) => b.score - a.score);
        fallbackUsed = ranked.length > 0;
      }
      const matches = ranked.map(entry => entry.item).slice(0, 12);
      results.replaceChildren();
      if (fallbackUsed) {
        const note = document.createElement('p');
        note.className = 'search-empty';
        note.textContent = 'Aucun résultat ne contient tous ces mots ; voici les plus proches.';
        results.append(note);
      } else if (corrections.length) {
        const note = document.createElement('p');
        note.className = 'search-empty';
        note.textContent = 'Recherche ajustée : ' + corrections.map(c => `« ${c.from} » → « ${c.to} »`).join(', ') + '.';
        results.append(note);
      }
      if (!matches.length) { const empty = document.createElement('p'); empty.className = 'search-empty'; empty.textContent = 'Aucun résultat. Essayez « Arabica », « mouture » ou « fermentation ». '; results.append(empty); return; }
      matches.forEach(item => { const a = document.createElement('a'); a.className = 'search-result'; a.href = item.href; const small = document.createElement('small'); small.textContent = item.type; const title = document.createElement('b'); title.textContent = item.title; const description = document.createElement('span'); description.textContent = item.description; a.append(small, title, description); a.addEventListener('click', close); results.append(a); });
    };
    const open = () => { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('menu-open'); draw(); input.focus(); input.select(); };
    trigger.onclick = open; closeButton.onclick = close; document.addEventListener('cafeb:dictionary-ready', draw); modal.addEventListener('click', event => { if (event.target === modal) close(); }); input.addEventListener('input', () => window.setTimeout(draw, 120)); document.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); open(); } if (event.key === 'Escape' && modal.classList.contains('open')) close(); });
    document.documentElement.dataset.cbSearchReady = 'true';
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
