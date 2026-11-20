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
    { keys: ['gout', 'acidite', 'acide', 'amer', 'arome', 'corps', 'degustation', 'cupping'], reply: 'Décrire un café consiste à distinguer arômes, acidité perçue, douceur, texture, équilibre et finale. La dégustation gagne en précision lorsqu’elle compare plusieurs tasses préparées de façon identique.', links: [links.degustation, links.dictionnaire] },
    { keys: ['sante', 'cafeine', 'grossesse', 'sommeil', 'coeur'], reply: 'La rubrique santé présente les mécanismes et les limites des études sans les transformer en diagnostic personnel. Pour une question médicale, une grossesse, un traitement ou un symptôme, demandez conseil à un professionnel de santé.', links: [links.sante] }
  ];

  function readDictionary() {
    if (typeof window !== 'undefined' && window && Array.isArray(window.cafeBeninDictionary)) return window.cafeBeninDictionary;
    if (typeof globalThis !== 'undefined' && Array.isArray(globalThis.cafeBeninDictionary)) return globalThis.cafeBeninDictionary;
    return [];
  }

  const DICT_STOPWORDS = new Set(['de', 'du', 'la', 'le', 'a', 'au', 'aux', 'et', 'd', 'l', 'en', 'sur', 'avec', 'pour', 'des', 'les', 'un', 'une', 'ou', 'the', 'of']);

  const SITE_PAGES = [
    ['chapitre-afrique.html', 'Afrique et Bénin', 'L’Afrique est le berceau de l’Arabica et un grand producteur de robusta. Cette page réunit des repères sourcés pour l’Afrique et pour le Bénin ; les chiffr', ['afrique','producteur','bénin','berceau']],
    ['chapitre-agronomie.html', 'Culture et agronomie', 'La qualité d’un café se prépare dans le champ. Climat, altitude et pluie fixent déjà beaucoup de ce que la tasse peut offrir.', ['cultiver','culture','plantation','récolte','cerise','climat','altitude']],
    ['chapitre-botanique.html', 'Botanique et diversité', 'Le café est une graine de la famille des Rubiacées. Deux espèces font l’essentiel du commerce : Arabica et Canephora (robusta). La diversité sauvage est, e', ['arabica','robusta','espèce','liberica','cultivar']],
    ['chapitre-extraction.html', 'Extraction et préparation', 'Préparer un café, c’est dissoudre une partie des composés du grain. La norme « Golden Cup » donne des repères mesurables pour le café filtre.', ['recette','mouture','espresso','filtre','infusion','méthode','extraction','préparer']],
    ['chapitre-filiere.html', 'Filière et marché', 'De la ferme au comptoir, la filière réunit producteurs, exportateurs, importateurs, torréfacteurs et cafés. Les chiffres ci-dessous précisent l’année et le', ['filière','marché','export','économie','commerce']],
    ['chapitre-histoire.html', 'Histoire du café', 'L’histoire du café mêle botanique, religion, commerce, pouvoir et colonisation. Les récits légendaires circulent beaucoup ; seuls les faits documentés sont', ['histoire','origine','kaldi','légende','éthiopie']],
    ['chapitre-post-recolte.html', 'Post-récolte', 'Entre la cerise cueillie et le café vert, la transformation influence la qualité finale. Les sources citées ici décrivent surtout les méthodes naturelle, s'],
    ['chapitre-sante.html', 'Santé et qualité', 'Cette page présente des repères officiels, pas des conseils médicaux. En cas de doute (grossesse, traitement, maladie), demandez l’avis d’un professionnel ', ['santé','caféine','médecin','sommeil']],
    ['chapitre-sensoriel.html', 'Dégustation et sensoriel', 'Goûter, c’est apprendre à nommer. La SCA a publié des normes de dégustation qui séparent la description objective de l’appréciation personnelle.'],
    ['chapitre-torrefaction.html', 'Torréfaction', 'La torréfaction transforme un grain vert en café aromatique. Elle suit des étapes thermiques repérables, dont les craquements.', ['torréfaction','torréfier','grain','vert','rôti']],
    ['explorer.html', 'Explorer les chapitres', 'Parcours en dix chapitres, de la plante à la tasse, avec progression conservée sur l’appareil.', ['explorer','carte','parcourir']],
    ['benin.html', 'Dossier Bénin', 'Dossier documentaire sur le café au Bénin, ses sources, ses limites et les pistes de recherche.', ['bénin','ouèssè','dassa','kétou','paysan']],
    ['observatoire.html', 'Observatoire du café', 'Observatoire Café Bénin : données mondiales, série béninoise à confirmer, unités, frise historique, graphiques interactifs et méthode de vérification.', ['données','chiffres','statistiques','prix','production','observatoire']],
    ['outils.html', 'Outils pratiques', 'Cinq outils locaux pour préparer et déguster du café : ratio café/eau, infusion pas à pas, diagnostic, roue aromatique et carnet privé.', ['recette','outil','ratio','convertir','calcul']],
    ['dictionnaire.html', 'Vocabulaire complet du café', 'Rechercher, trier et parcourir le vocabulaire complet du café, organisé par science, botanique, culture, transformation, torréfaction, extraction, dégustation et filière.', ['dictionnaire','vocabulaire','glossaire','terme']],
    ['sources.html', 'Sources et contribuer', 'Consulter la méthode éditoriale, les sources de départ, les crédits visuels et contribuer une correction ou une référence à Café Bénin.', ['source','référence','contribuer']],
    ['professionnels.html', 'Espace professionnel', 'Espace professionnel Café Bénin : observatoire, annuaire vérifié, bulletin de veille, données agrégées, formation et mise en relation.'],
    ['a-propos.html', 'À propos du projet', 'À propos de Kevin Giscard et du projet Café Bénin : mission documentaire, principes éditoriaux, transparence et liens publics.'],
  ];

  // Tolérance morphologique légère : pluriels en s/x (« gland » retrouve « Café de glands »).
  const stem = token => (token.length > 4 ? token.replace(/[sx]+$/, '') : token);

  // Au-delà de ce nombre de fiches contenant le même mot, une question d'un seul mot
  // est trop générique pour renvoyer une fiche au hasard (« café » seul par exemple).
  const GENERIC_TOKEN_LIMIT = 8;

  function dictionaryAnswer(query) {
    const queryTokens = new Set(query.split(' ').filter(token => token.length > 0));
    const stemmedQuery = new Set([...queryTokens].map(stem));
    const significant = [...queryTokens].filter(token => token.length >= 3 && !DICT_STOPWORDS.has(token));
    // « café » est le sujet du site : il ne doit pas diriger le matching quand d'autres mots précisent la question.
    const focused = significant.length > 1 ? significant.filter(token => token !== 'cafe' && token !== 'coffee') : significant;
    const dictionary = readDictionary();
    let full = null;
    const related = [];
    const defMatch = [];
    const tokenFrequency = new Map();
    const defFrequency = new Map();
    const defTokens = focused.filter(qt => qt.length >= 4);
    const defRegexCache = new Map(defTokens.map(qt => [stem(qt), new RegExp(`\\b${escapeRegExp(stem(qt))}`)]));
    for (const entry of dictionary) {
      if (!entry || !entry.term || !entry.definition) continue;
      const term = normalize(entry.term);
      if (term.length < 3) continue;
      const tokens = term.split(' ').filter(token => token.length >= 3 && !DICT_STOPWORDS.has(token));
      if (tokens.length === 0) continue;
      for (const token of tokens) tokenFrequency.set(stem(token), (tokenFrequency.get(stem(token)) || 0) + 1);
      const tokenPresent = token => {
        const st = stem(token);
        if (stemmedQuery.has(st)) return true;
        if (new RegExp(`\\b${escapeRegExp(st)}`).test(query)) return true;
        // Variante longue (« decaf » retrouve « décaféiné ») : préfixe commun d'au moins 5 lettres.
        return [...queryTokens].some(qt => qt.length >= 5 && (token.startsWith(qt) || qt.startsWith(token)));
      };
      const allPresent = tokens.every(tokenPresent);
      if (allPresent) {
        const matched = tokens.length;
        if (!full || matched > full.matched || (matched === full.matched && term.length > full.normalized.length)) {
          full = { entry, normalized: term, matched };
        }
        continue;
      }
      const coversQuery = focused.length > 0 && focused.every(qt => tokens.some(token => stem(token) === stem(qt)));
      if (coversQuery && tokens.length >= 2) {
        related.push({ entry, normalized: term, matched: focused.length, total: tokens.length, demoted: false });
        continue;
      }
      // Repli : tous les mots significatifs de la question apparaissent dans la définition.
      if (defTokens.length > 0) {
        const defNorm = normalize(entry.definition);
        const hits = defTokens.filter(qt => defRegexCache.get(stem(qt)).test(defNorm));
        hits.forEach(qt => defFrequency.set(stem(qt), (defFrequency.get(stem(qt)) || 0) + 1));
        if (hits.length === defTokens.length) defMatch.push({ entry, normalized: term, matched: hits.length });
      }
    }
    related.sort((a, b) => (b.matched / b.total) - (a.matched / a.total) || (a.total - b.total) || a.normalized.localeCompare(b.normalized, 'fr'));
    // Une fiche exacte d'un seul mot ne prime que si elle couvre toute la question :
    // « céréales torréfiées » vise « Café de céréales », pas le descripteur « Céréale ».
    if (full && (significant.length <= 1 || full.matched >= significant.length)) return { kind: 'full', best: full, related };
    if (full) related.push({ entry: full.entry, normalized: full.normalized, matched: full.matched, total: 1, demoted: true });
    // Question d'un seul mot trop générique : pas de fiche précise à proposer.
    if (significant.length === 1 && (tokenFrequency.get(stem(significant[0])) || 0) > GENERIC_TOKEN_LIMIT) return null;
    if (related.length > 0) {
      related.sort((a, b) => b.matched - a.matched || (a.demoted - b.demoted) || (b.matched / b.total) - (a.matched / a.total) || (a.total - b.total) || a.normalized.localeCompare(b.normalized, 'fr'));
      // Une correspondance sur les termes, même partielle, prime sur les définitions.
      if (related.some(item => !item.demoted)) return { kind: 'related', best: related.find(item => !item.demoted), related };
    }
    if (defMatch.length > 0) {
      defMatch.sort((a, b) => b.matched - a.matched || a.normalized.localeCompare(b.normalized, 'fr'));
      // Les mots très courants du corpus ne suffisent pas à désigner une fiche précise.
      const rare = defMatch.length > 0 && defMatch.length <= 3;
      if (defMatch.length === 1) return { kind: 'definition', best: defMatch[0], related, rare, focusedCount: focused.length };
      return { kind: 'definitions', list: defMatch.slice(0, 3), rare, focusedCount: focused.length };
    }
    if (related.length > 0) return { kind: 'related', best: related[0], related };
    return null;
  }

  function pageResult(href, title, description) {
    const complete = /[.!?…»'"’]$/.test(description.trim());
    const reply = complete
      ? `Ce sujet est traité dans une page du site — ${title} : ${description}`
      : `Ce sujet est traité dans une page du site : ${title}.`;
    return { reply, links: [{ href, label: title }], source: 'local' };
  }

  function pageAnswer(focused) {
    if (focused.length === 0) return null;
    const scored = [];
    for (const [href, title, description, keywords] of SITE_PAGES) {
      const hay = normalize(`${title} ${description} ${(keywords || []).join(' ')}`);
      const titleNorm = normalize(`${title} ${(keywords || []).join(' ')}`);
      const hits = focused.filter(qt => new RegExp(`\\b${escapeRegExp(stem(qt))}`).test(hay));
      if (hits.length === focused.length) {
        const titleHits = focused.filter(qt => new RegExp(`\\b${escapeRegExp(stem(qt))}`).test(titleNorm)).length;
        scored.push({ href, title, description, titleHits });
      }
    }
    if (scored.length === 0) {
      // Dernier recours : un seul mot rare qui désigne une page et une seule.
      if (focused.length < 2) return null;
      const rare = [];
      for (const qt of focused) {
        if (qt.length < 4) continue;
        const re = new RegExp(`\\b${escapeRegExp(stem(qt))}`);
        const matches = SITE_PAGES.filter(([href, title, description, keywords]) =>
          re.test(normalize(`${title} ${description} ${(keywords || []).join(' ')}`)));
        if (matches.length === 1) rare.push({ qt, page: matches[0] });
      }
      if (rare.length !== 1) return null;
      const [href, title, description] = rare[0].page;
      return pageResult(href, title, description);
    }
    // Mot unique présent partout : trop générique pour désigner une page.
    if (focused.length === 1 && scored.length > 3) return null;
    scored.sort((a, b) => b.titleHits - a.titleHits);
    const best = scored[0];
    return pageResult(best.href, best.title, best.description);
  }

  function formatList(list) {
    const names = list.map(item => item.entry.term).join(' ; ');
    return {
      reply: `Plusieurs fiches du dictionnaire évoquent ce terme : ${names}. Le dictionnaire permet de les comparer directement.`,
      links: [links.dictionnaire],
      source: 'local'
    };
  }

  function formatEntry(best, related) {
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
    const focusedForPages = (() => {
      const questionWords = new Set(['comment', 'pourquoi', 'quelle', 'quelles', 'quels', 'quel', 'combien', 'est', 'sont', 'ou', 'avec', 'sans', 'dans', 'pour', 'sur', 'les', 'des', 'une', 'est-ce']);
      const tokens = query.split(' ').filter(token => token.length >= 3 && !DICT_STOPWORDS.has(token) && !questionWords.has(token));
      return tokens.length > 1 ? tokens.filter(token => token !== 'cafe' && token !== 'coffee') : tokens;
    })();
    const fromDictionary = dictionaryAnswer(query);
    // Une fiche exacte prime toujours sur une réponse générale.
    if (fromDictionary && fromDictionary.kind === 'full') return formatEntry(fromDictionary.best, fromDictionary.related);
    const ranked = topics.map(topic => ({ topic, score: topic.keys.reduce((total, key) => total + (keyPattern(key).test(query) ? 1 : 0), 0) }))
      .sort((a, b) => b.score - a.score);
    const best = ranked[0];
    if (best && best.score > 0) {
      // Une fiche précise qui couvre toute la question prime sur le thème général.
      if (fromDictionary && fromDictionary.kind === 'related' && fromDictionary.best.matched >= 2) {
        return formatEntry(fromDictionary.best, fromDictionary.related);
      }
      // Une correspondance rare dans les définitions prime sur un thème effleuré
      // (une seule clé), uniquement pour une question précise d'au moins deux mots.
      if (fromDictionary && fromDictionary.rare && best.score === 1 && fromDictionary.focusedCount >= 2) {
        const fromPagesHere = pageAnswer(focusedForPages);
        if (fromPagesHere) return fromPagesHere;
        if (fromDictionary.kind === 'definition') return formatEntry(fromDictionary.best, []);
        if (fromDictionary.kind === 'definitions') return formatList(fromDictionary.list);
      }
      return { reply: best.topic.reply, links: best.topic.links, source: 'local' };
    }
    const fromPages = pageAnswer(focusedForPages);
    if (fromPages) return fromPages;
    if (fromDictionary && (fromDictionary.kind === 'related' || fromDictionary.kind === 'definition')) {
      return formatEntry(fromDictionary.best, fromDictionary.related || []);
    }
    if (fromDictionary && fromDictionary.kind === 'definitions') return formatList(fromDictionary.list);
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
