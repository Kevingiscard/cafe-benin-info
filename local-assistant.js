(function attachLocalAssistant(root, factory) {
  const assistant = factory();
  if (root) root.cafeBeninLocal = assistant;
  if (typeof module !== 'undefined') module.exports = assistant;
})(typeof window !== 'undefined' ? window : null, function createLocalAssistant() {
  const normalize = value => String(value || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ').trim();

  const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const keyPattern = key => new RegExp(`\\b${escapeRegExp(key)}`);

  const links = {
    botanique: { href: '#botanique', label: 'Botanique du café' },
    culture: { href: '#culture', label: 'Culture et terroir' },
    processus: { href: '#processus', label: 'Transformation du café' },
    torrefaction: { href: '#torréfaction', label: 'Torréfaction' },
    extraction: { href: '#extraction', label: 'Extraction et méthodes' },
    degustation: { href: '#degustation', label: 'Dégustation' },
    dictionnaire: { href: '#dictionnaire', label: 'Dictionnaire' },
    benin: { href: '#benin', label: 'Dossier Bénin' },
    carnet: { href: '#carnet', label: 'Carnet de terrain' },
    sante: { href: '#sante', label: 'Café et santé' }
  };

  const topics = [
    { keys: ['benin', 'cotonou', 'beninois', 'beninoise', 'filiere locale'], reply: 'Pour le Bénin, le site privilégie les informations datées et sourcées. Il distingue les documents historiques des données contemporaines et évite de créer des chiffres ou terroirs non vérifiés.', links: [links.benin, links.carnet] },
    { keys: ['arabica', 'robusta', 'canephora', 'liberica', 'espece', 'cultivar', 'variete'], reply: 'Arabica, Canephora et Liberica sont des espèces ou groupes botaniques distincts. Un cultivar désigne ensuite une sélection ou une population cultivée ; le dictionnaire aide à ne pas confondre ces niveaux.', links: [links.botanique, links.dictionnaire] },
    { keys: ['naturel', 'naturelle', 'lave', 'lavage', 'honey', 'fermentation', 'sechage', 'mucilage'], reply: 'Les procédés post-récolte modifient la manière dont le fruit est traité avant le séchage. Un café naturel sèche avec le fruit ; un café lavé retire la pulpe et gère le mucilage avec fermentation, lavage ou moyens mécaniques selon le protocole.', links: [links.processus, links.dictionnaire] },
    { keys: ['espresso', 'filtre', 'v60', 'mouture', 'ratio', 'eau', 'extraction', 'cafe froid'], reply: 'Pour ajuster une tasse, changez une variable à la fois : dose, mouture, eau, temps ou agitation. Une mouture plus fine accélère généralement l’extraction ; une mouture plus grossière la ralentit.', links: [links.extraction, links.dictionnaire] },
    { keys: ['torrefaction', 'torrefie', 'crack', 'maillard', 'profil'], reply: 'La torréfaction transforme le grain vert par la chaleur : perte d’eau, expansion, réactions chimiques et développement aromatique. La couleur seule ne suffit pas à expliquer un profil ; le temps et l’énergie comptent aussi.', links: [links.torrefaction, links.dictionnaire] },
    { keys: ['gout', 'acidite', 'amer', 'arome', 'corps', 'degustation', 'cupping'], reply: 'Décrire un café consiste à distinguer arômes, acidité perçue, douceur, texture, équilibre et finale. La dégustation gagne en précision lorsqu’elle compare plusieurs tasses préparées de façon identique.', links: [links.degustation, links.dictionnaire] },
    { keys: ['sante', 'cafeine', 'grossesse', 'sommeil', 'coeur'], reply: 'La rubrique santé présente les mécanismes et les limites des études sans les transformer en diagnostic personnel. Pour une question médicale, une grossesse, un traitement ou un symptôme, demandez conseil à un professionnel de santé.', links: [links.sante] }
  ];

  function readDictionary() {
    if (typeof window !== 'undefined' && window && Array.isArray(window.cafeBeninDictionary)) return window.cafeBeninDictionary;
    if (typeof globalThis !== 'undefined' && Array.isArray(globalThis.cafeBeninDictionary)) return globalThis.cafeBeninDictionary;
    return [];
  }

  const DICT_STOPWORDS = new Set(['de', 'du', 'la', 'le', 'a', 'au', 'aux', 'et', 'd', 'l', 'en', 'sur', 'avec', 'pour', 'des', 'les', 'un', 'une', 'ou', 'the', 'of']);

  function dictionaryAnswer(query) {
    const queryTokens = new Set(query.split(' ').filter(token => token.length > 0));
    let best = null;
    const related = [];
    for (const entry of readDictionary()) {
      if (!entry || !entry.term || !entry.definition) continue;
      const term = normalize(entry.term);
      if (term.length < 3) continue;
      const tokens = term.split(' ').filter(token => token.length >= 3 && !DICT_STOPWORDS.has(token));
      if (tokens.length === 0) continue;
      let matched = 0;
      if (tokens.length === 1) {
        if (!new RegExp(`\\b${escapeRegExp(tokens[0])}\\b`).test(query)) continue;
        matched = 1;
      } else {
        const allPresent = tokens.every(token => queryTokens.has(token) || new RegExp(`\\b${escapeRegExp(token)}`).test(query));
        if (!allPresent) {
          const significantQueryTokens = [...queryTokens].filter(token => token.length >= 3 && !DICT_STOPWORDS.has(token));
          const coversQuery = significantQueryTokens.length > 0 && significantQueryTokens.every(token => tokens.includes(token));
          if (coversQuery && tokens.length >= 2) related.push({ entry, normalized: term, matched: significantQueryTokens.length, total: tokens.length });
          continue;
        }
        matched = tokens.length;
      }
      if (!best || matched > best.matched || (matched === best.matched && term.length > best.normalized.length)) {
        best = { entry, normalized: term, matched };
      }
    }
    if (!best && related.length > 0) {
      related.sort((a, b) => (b.matched / b.total) - (a.matched / a.total) || (a.total - b.total) || a.normalized.localeCompare(b.normalized, 'fr'));
      best = related.shift();
    }
    if (!best) return null;
    const also = related.filter(item => item.entry.term !== best.entry.term).slice(0, 2);
    const more = also.length > 0 ? ` Voir aussi : ${also.map(item => item.entry.term).join(' ; ')}.` : '';
    return {
      reply: `D’après le dictionnaire du site (${best.entry.category || 'entrée'}) — ${best.entry.term} : ${best.entry.definition}${more}`,
      links: [links.dictionnaire],
      source: 'local'
    };
  }

  function answer(question) {
    const query = normalize(question);
    const ranked = topics.map(topic => ({ topic, score: topic.keys.reduce((total, key) => total + (keyPattern(key).test(query) ? 1 : 0), 0) }))
      .sort((a, b) => b.score - a.score);
    const best = ranked[0];
    if (best && best.score > 0) return { reply: best.topic.reply, links: best.topic.links, source: 'local' };
    const fromDictionary = dictionaryAnswer(query);
    if (fromDictionary) return fromDictionary;
    return {
      reply: 'Ce sujet n’est pas encore couvert par le corpus local du site. Je suis l’assistant de recherche local de Café Bénin : je peux vous guider sur les espèces, la préparation, les procédés, la torréfaction, la dégustation, la santé ou le dossier Bénin, et le dictionnaire définit les termes techniques. Essayez par exemple : « différence entre café naturel et lavé » ou « comment régler une mouture filtre ? ».',
      links: [links.dictionnaire, links.extraction, links.benin],
      source: 'local'
    };
  }

  function recommend(mood, preferences = []) {
    const query = normalize(`${mood} ${preferences.join(' ')}`);
    if (query.includes('calme') || query.includes('doux') || query.includes('soir')) return 'Pour un moment calme, choisissez une préparation filtre douce, une mouture régulière et une eau juste en dessous de l’ébullition. Explorez ensuite la dégustation pour noter texture, douceur et finale.';
    if (query.includes('energie') || query.includes('matin') || query.includes('intense')) return 'Pour une tasse plus intense le matin, testez un espresso ou un café filtre avec un ratio stable et une mouture adaptée. Ajustez une seule variable par essai : d’abord la mouture, puis le temps d’écoulement.';
    return 'Commencez par choisir une méthode — filtre, immersion ou espresso — puis notez dose, eau, mouture et temps. Le meilleur conseil est reproductible : modifiez un seul paramètre à la fois et comparez les résultats.';
  }

  return {
    answer,
    recommend,
    suggestions: ['Différence entre café naturel et lavé', 'Comment régler une mouture filtre ?', 'Que signifie Arabica ?', 'Comment lire une information sur le Bénin ?']
  };
});
