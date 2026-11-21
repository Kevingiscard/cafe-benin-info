(() => {
  'use strict';
  // Cœurs de calcul purs, testables hors navigateur. Chaque résultat porte ses limites : repères sourcés, pas normes universelles.
  const pureCalc = {
    // Espresso : repères usuels barista (ratio 1:1,5 à 1:3 ; 25-30 s ; extraction 18-22 %). Pas une règle.
    espresso(dose, ratio, tds) {
      if (!(dose > 0) || !(ratio > 0)) return null;
      const boisson = dose * ratio;
      const out = { boisson };
      if (tds > 0) out.extraction = tds * boisson / dose;
      return out;
    },
    // Extraction : EY % = TDS % × masse boisson / dose. Repères usuels : 18-22 % ; filtre TDS 1,15-1,35 % ; espresso 8-12 %.
    extraction(dose, boisson, tds) {
      if (!(dose > 0) || !(boisson > 0) || !(tds > 0)) return null;
      return tds * boisson / dose;
    },
    // Plages de mouture indicatives en microns (repères publiés : keeproasting.com, Mahlkönig, honestcoffeeguide). Aucune équivalence exacte entre moulins.
    mouture: [
      { id: 'turc', nom: 'Turc / ibrik', min: 40, max: 220, texture: 'poudre très fine, comme la farine' },
      { id: 'espresso', nom: 'Espresso', min: 180, max: 380, texture: 'fin, comme le sucre semoule' },
      { id: 'moka', nom: 'Moka', min: 360, max: 660, texture: 'fin à moyen, comme le sable fin' },
      { id: 'aeropress', nom: 'AeroPress', min: 320, max: 960, texture: 'fin à moyen selon la recette' },
      { id: 'filtre', nom: 'Filtre (V60, cafetière)', min: 400, max: 900, texture: 'moyen, comme le sel fin' },
      { id: 'chemex', nom: 'Chemex', min: 600, max: 1000, texture: 'moyen à grossier' },
      { id: 'piston', nom: 'Piston (French press)', min: 690, max: 1300, texture: 'grossier, comme le gros sel' },
      { id: 'coldbrew', nom: 'Cold brew', min: 800, max: 1400, texture: 'très grossier, comme la chapelure' }
    ],
    methodesProches(um) {
      if (!(um > 0)) return [];
      return pureCalc.mouture.filter(m => um >= m.min && um <= m.max).map(m => m.nom);
    },
    // Repères SCAA (standard eau pour café de spécialité) : TDS 75-250 mg/L cible 150 ; dureté 50-100 mg/L CaCO3 ; alcalinité proche de 40 mg/L CaCO3. Trois paramètres distincts, pas de conversion entre eux.
    eau(tds, durete, alcalinite) {
      const verdicts = [];
      if (tds > 0) verdicts.push({ p: 'TDS', v: tds, rep: '75 à 250 mg/L, cible 150', ok: tds >= 75 && tds <= 250 });
      if (durete > 0) verdicts.push({ p: 'Dureté', v: durete, rep: '50 à 100 mg/L CaCO3', ok: durete >= 50 && durete <= 100 });
      if (alcalinite > 0) verdicts.push({ p: 'Alcalinité', v: alcalinite, rep: 'proche de 40 mg/L CaCO3', ok: alcalinite >= 30 && alcalinite <= 50 });
      return verdicts;
    },
    // Cold brew : repères usuels concentré 1:4 à 1:5 ; prêt à boire 1:15 ; dilution du concentré 1:1 à 1:2.
    coldbrew(eau) {
      if (!(eau > 0)) return null;
      return { concentreMin: eau / 5, concentreMax: eau / 4, pret: eau / 15 };
    },
    // Caféine : teneur sèche arabica 0,9-1,5 %, robusta 2,2-2,7 % (revues citées par coffearium.org) ; part extraite variable. Ordre de grandeur seulement.
    cafeine(dose, espece) {
      if (!(dose > 0)) return null;
      const plages = { arabica: [0.9, 1.5], robusta: [2.2, 2.7], melange: [1.2, 2.2] };
      const p = plages[espece] || plages.melange;
      return { min: dose * p[0] * 7.5, max: dose * p[1] * 10 };
    },
    cout(prix, poids, dose) {
      if (!(prix > 0) || !(poids > 0) || !(dose > 0)) return null;
      return { parTasse: prix / poids * dose, tasses: Math.floor(poids / dose) };
    },
    // Fraîcheur : repères issus des références sur le dégazage (CO2 actif les premiers jours) ; variable selon torréfaction et stockage.
    fraicheur(jours) {
      if (!(jours >= 0)) return null;
      if (jours <= 2) return 'degazage';
      if (jours <= 7) return 'filtre-ok-espresso-jeune';
      if (jours <= 30) return 'fenetre-usuelle';
      if (jours <= 45) return 'declin-progressif';
      return 'aromes-affaiblis';
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = pureCalc;
  if (typeof document === 'undefined') return;
  const $ = (id) => document.getElementById(id);
  const steps = [...document.querySelectorAll('[data-step]')];
  let currentStep = 0;
  const renderStep = () => {
    steps.forEach((step, index) => { step.hidden = index !== currentStep; step.classList.toggle('is-current', index === currentStep); });
    $('step-label').textContent = 'Étape ' + (currentStep + 1) + ' sur ' + steps.length;
    $('step-back').disabled = currentStep === 0;
    $('step-next').textContent = currentStep === steps.length - 1 ? 'Recommencer le guide' : 'Étape suivante';
  };
  $('step-back').addEventListener('click', () => { currentStep = Math.max(0, currentStep - 1); renderStep(); });
  $('step-next').addEventListener('click', () => { currentStep = currentStep === steps.length - 1 ? 0 : currentStep + 1; renderStep(); });
  renderStep();

  const advice = {
    sour: 'Piste : essayez une mouture un peu plus fine ou une température légèrement plus élevée, un seul changement à la fois. Vérifiez aussi que le café est bien mouillé et que l’écoulement n’est pas trop rapide.',
    bitter: 'Piste : essayez une mouture un peu plus grossière ou une température légèrement plus basse. Vérifiez la durée d’écoulement et le goût de l’eau.',
    weak: 'Piste : augmentez légèrement la dose de café ou réduisez l’eau. Gardez la mouture et la méthode constantes pendant la comparaison.',
    strong: 'Piste : réduisez légèrement la dose de café ou augmentez l’eau. Notez le ratio obtenu pour pouvoir revenir au résultat précédent.',
    flat: 'Piste : utilisez une eau fraîche au goût neutre, vérifiez la fraîcheur du café et nettoyez le matériel. N’attribuez pas une cause unique sans essai.'
  };
  $('diagnose').addEventListener('click', () => {
    const result = $('diagnosis-result');
    const text = advice[$('taste-issue').value];
    const p = document.createElement('p');
    p.textContent = text || 'Choisissez une sensation dans la liste.';
    result.replaceChildren(p);
  });

  const families = {
    fruit: ['Agrume', 'Baie', 'Fruit à noyau', 'Fruit sec', 'Fruit mûr'],
    floral: ['Fleur blanche', 'Jasmin', 'Rose', 'Thé'],
    sweet: ['Caramel', 'Miel', 'Sucre brun', 'Vanille'],
    roast: ['Cacao', 'Chocolat', 'Noisette', 'Pain grillé'],
    spice: ['Cannelle', 'Cardamome', 'Poivre', 'Épice douce']
  };
  let selected = [];
  let family = 'fruit';
  const renderAromas = () => {
    const box = $('aroma-options');
    box.replaceChildren();
    families[family].forEach(word => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'descriptor';
      button.textContent = word;
      button.setAttribute('aria-pressed', String(selected.includes(word)));
      button.addEventListener('click', () => {
        selected = selected.includes(word) ? selected.filter(item => item !== word) : [...selected, word];
        renderAromas();
      });
      box.append(button);
    });
    $('aroma-selection').textContent = 'Descripteurs choisis : ' + (selected.join(', ') || 'aucun');
    $('tasting-aromas').value = selected.join(', ');
  };
  document.querySelectorAll('[data-family]').forEach(button => button.addEventListener('click', () => {
    family = button.dataset.family;
    document.querySelectorAll('[data-family]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    renderAromas();
  }));
  renderAromas();

  const journalKey = 'cb-tasting-journal-v1';
  const safeRead = () => { try { const value = JSON.parse(localStorage.getItem(journalKey) || '[]'); return Array.isArray(value) ? value.filter(item => item && typeof item === 'object').slice(0, 200) : []; } catch { return []; } };
  let journal = safeRead();
  const save = () => { try { localStorage.setItem(journalKey, JSON.stringify(journal)); return true; } catch { $('journal-status').textContent = 'Le stockage local est indisponible. Vous pouvez exporter vos notes depuis cet appareil.'; return false; } };
  const renderJournal = () => {
    const box = $('journal-list'); box.replaceChildren();
    $('journal-count').textContent = journal.length + (journal.length === 1 ? ' note enregistrée' : ' notes enregistrées');
    journal.forEach((entry, index) => {
      const article = document.createElement('article'); article.className = 'info-card';
      const title = document.createElement('h3'); title.textContent = entry.date + ' · ' + entry.method;
      const meta = document.createElement('p'); meta.textContent = [entry.coffee, entry.aromas].filter(Boolean).join(' · ') || 'Aucun repère de café ou d’arôme.';
      const note = document.createElement('p'); note.textContent = entry.note || 'Aucune note complémentaire.';
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'btn'; remove.textContent = 'Supprimer cette note';
      remove.addEventListener('click', () => { journal.splice(index, 1); save(); renderJournal(); });
      article.append(title, meta, note, remove); box.append(article);
    });
  };
  const now = new Date();
  $('tasting-date').value = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
  $('tasting-form').addEventListener('submit', event => {
    event.preventDefault();
    const entry = { date: $('tasting-date').value, method: $('tasting-method').value, coffee: $('tasting-coffee').value.trim(), aromas: $('tasting-aromas').value.trim(), note: $('tasting-note').value.trim() };
    journal = [entry, ...journal].slice(0, 200);
    save(); renderJournal();
    $('journal-status').textContent = 'Note enregistrée dans le navigateur.';
    $('tasting-coffee').value = ''; $('tasting-aromas').value = ''; $('tasting-note').value = '';
  });
  const csvCell = value => {
    let text = String(value || '').replace(/"/g, '""');
    if (/^[=+\-@]/.test(text)) text = "'" + text;
    return '"' + text + '"';
  };
  $('export-journal').addEventListener('click', () => {
    const rows = [['Date','Méthode','Café','Arômes','Notes'], ...journal.map(item => [item.date,item.method,item.coffee,item.aromas,item.note])];
    const csv = '\uFEFF' + rows.map(row => row.map(csvCell).join(';')).join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = 'carnet-degustation-cafe-benin.csv'; link.click(); window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  });
  $('clear-journal').addEventListener('click', () => {
    if (!journal.length) { $('journal-status').textContent = 'Le carnet est déjà vide.'; return; }
    journal = []; save(); renderJournal(); $('journal-status').textContent = 'Carnet effacé de cet appareil.';
  });
  renderJournal();
  // ---- Nouveaux outils (lot enrichissement) : chaque outil est gardé par l'existence de ses éléments. ----
  const fmt = (n, dec = 1) => n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: dec });
  const num = id => { const e = $(id); return e ? Number(e.value) : NaN; };
  const put = (id, text) => { const e = $(id); if (e) e.textContent = text; };

  const espressoForm = $('espresso-form');
  if (espressoForm) {
    const updateEspresso = () => {
      const dose = num('espresso-dose');
      const ratio = num('espresso-ratio');
      const tds = num('espresso-tds');
      const r = pureCalc.espresso(dose, ratio, tds);
      if (!r) { put('espresso-out', 'Saisissez une dose positive.'); put('espresso-note', ''); return; }
      put('espresso-out', 'Boisson cible : ' + fmt(r.boisson) + ' g');
      let note = 'Repère courant : écoulement de 25 à 30 s environ, à ajuster selon le café et le goût.';
      if (r.extraction) {
        const ey = r.extraction;
        const lecture = ey < 18 ? 'sous le repère usuel (extraction possiblement basse)' : ey <= 22 ? 'dans le repère usuel de 18 à 22 %' : 'au-dessus du repère usuel (extraction possiblement haute)';
        note += ' Extraction estimée : ' + fmt(ey) + ' %, ' + lecture + '.';
      }
      put('espresso-note', note);
    };
    espressoForm.addEventListener('input', updateEspresso); espressoForm.addEventListener('change', updateEspresso);
    updateEspresso();
  }

  const extractionForm = $('extraction-form');
  if (extractionForm) {
    const updateExtraction = () => {
      const ey = pureCalc.extraction(num('ey-dose'), num('ey-beverage'), num('ey-tds'));
      if (!ey) { put('ey-out', 'Renseignez dose, boisson et TDS (nombres positifs).'); put('ey-note', ''); return; }
      const lecture = ey < 18 ? 'Sous le repère usuel : piste d’extraction plus poussée (mouture plus fine, temps plus long), un seul changement à la fois.' : ey <= 22 ? 'Dans le repère usuel de 18 à 22 % : laissez le goût décider.' : 'Au-dessus du repère usuel : piste d’extraction moins poussée (mouture plus grossière, temps plus court).';
      put('ey-out', 'Extraction : ' + fmt(ey) + ' %');
      put('ey-note', lecture);
    };
    extractionForm.addEventListener('input', updateExtraction);
    updateExtraction();
  }

  const grindSelect = $('grind-method');
  if (grindSelect) {
    const updateGrind = () => {
      const m = pureCalc.mouture.find(x => x.id === grindSelect.value);
      if (!m) { put('grind-out', 'Choisissez une méthode.'); return; }
      put('grind-out', m.nom + ' : environ ' + m.min + ' à ' + m.max + ' µm');
      put('grind-note', 'Texture repère : ' + m.texture + '. Plages indicatives issues de références publiées ; aucune équivalence exacte entre moulins, ajustez au goût.');
    };
    grindSelect.addEventListener('change', updateGrind);
    const um = $('grind-microns');
    const updateMicrons = () => {
      const v = num('grind-microns');
      const proches = pureCalc.methodesProches(v);
      put('grind-reverse', v > 0 ? (proches.length ? 'Méthodes compatibles avec ' + fmt(v, 0) + ' µm : ' + proches.join(', ') + '.' : 'Aucune méthode repère à ' + fmt(v, 0) + ' µm.') : '');
    };
    if (um) um.addEventListener('input', updateMicrons);
    updateGrind();
  }

  const waterForm = $('water-form');
  if (waterForm) {
    const updateWater = () => {
      const v = pureCalc.eau(num('water-tds'), num('water-hardness'), num('water-alkalinity'));
      if (!v.length) { put('water-out', 'Renseignez au moins une valeur depuis l’étiquette ou l’analyse de votre eau.'); put('water-note', ''); return; }
      put('water-out', v.map(x => x.p + ' : ' + fmt(x.v, 0) + ' mg/L, ' + (x.ok ? 'dans' : 'hors') + ' le repère (' + x.rep + ')').join(' · '));
      put('water-note', 'Repères du standard SCAA pour l’eau de brassage. TDS, dureté et alcalinité sont trois mesures distinctes : ne les convertissez pas entre elles. Sur une étiquette française, 1 °f = 10 mg/L de CaCO3.');
    };
    waterForm.addEventListener('input', updateWater);
    updateWater();
  }

  const coldForm = $('coldbrew-form');
  if (coldForm) {
    const updateCold = () => {
      const r = pureCalc.coldbrew(num('coldbrew-water'));
      if (!r) { put('coldbrew-out', 'Saisissez une quantité d’eau positive.'); put('coldbrew-note', ''); return; }
      put('coldbrew-out', 'Concentré : ' + fmt(r.concentreMin, 0) + ' à ' + fmt(r.concentreMax, 0) + ' g de café · Prêt à boire : ' + fmt(r.pret, 0) + ' g');
      put('coldbrew-note', 'Repères usuels : concentré 1:4 à 1:5 à diluer (1:1 à 1:2 dans l’eau ou le lait), prêt à boire 1:15. Infusion souvent 12 à 24 h selon goût, mouture très grossière.');
    };
    coldForm.addEventListener('input', updateCold);
    updateCold();
  }

  const cafForm = $('cafeine-form');
  if (cafForm) {
    const updateCaf = () => {
      const r = pureCalc.cafeine(num('cafeine-dose'), $('cafeine-espece') ? $('cafeine-espece').value : 'melange');
      if (!r) { put('cafeine-out', 'Saisissez une dose de café positive.'); put('cafeine-note', ''); return; }
      put('cafeine-out', 'Ordre de grandeur : ' + fmt(r.min, 0) + ' à ' + fmt(r.max, 0) + ' mg de caféine');
      put('cafeine-note', 'Estimation très approximative : la teneur réelle varie fortement (origine, lot, torréfaction, part extraite). Ceci n’est ni une mesure ni un conseil de santé ; pour un suivi médical (grossesse, cœur, sommeil), demandez à un professionnel de santé.');
    };
    cafForm.addEventListener('input', updateCaf); cafForm.addEventListener('change', updateCaf);
    updateCaf();
  }

  const costForm = $('cost-form');
  if (costForm) {
    const updateCost = () => {
      const r = pureCalc.cout(num('cost-price'), num('cost-weight'), num('cost-dose'));
      if (!r) { put('cost-out', 'Renseignez prix, poids du paquet et dose (nombres positifs).'); put('cost-note', ''); return; }
      put('cost-out', fmt(r.parTasse, 0) + ' FCFA par tasse · environ ' + r.tasses + ' tasses par paquet');
      put('cost-note', 'Calcul simple : prix ÷ poids × dose. Hors eau, énergie, lait et matériel.');
    };
    costForm.addEventListener('input', updateCost);
    updateCost();
  }

  const freshForm = $('fraicheur-form');
  if (freshForm) {
    const textes = {
      'degazage': 'Dégazage actif : le café libère encore beaucoup de CO2. En espresso, le résultat peut être irrégulier ; en filtre, c’est déjà possible en allongeant la préinfusion.',
      'filtre-ok-espresso-jeune': 'Fenêtre favorable au filtre. Pour l’espresso, beaucoup de baristas attendent environ 7 jours de repos, selon la torréfaction.',
      'fenetre-usuelle': 'Fenêtre usuelle de dégustation pour la plupart des cafés, filtre comme espresso. Conservez hermétiquement, à l’abri de la lumière et de la chaleur.',
      'declin-progressif': 'Déclin progressif des arômes : le café reste buvable, serrez le paquet et consommez en priorité.',
      'aromes-affaiblis': 'Arômes probablement affaiblis. Le café n’est pas dangereux s’il a été conservé au sec, mais la tasse sera moins expressive.'
    };
    const updateFresh = () => {
      const d = $('fraicheur-date') ? $('fraicheur-date').value : '';
      if (!d) { put('fraicheur-out', 'Choisissez la date de torréfaction indiquée sur le paquet.'); put('fraicheur-note', ''); return; }
      const aujourdhui = new Date(); aujourdhui.setHours(0, 0, 0, 0);
      const jours = Math.round((aujourdhui.getTime() - new Date(d + 'T00:00:00').getTime()) / 86400000);
      if (jours < 0) { put('fraicheur-out', 'La date choisie est dans le futur : vérifiez la saisie.'); put('fraicheur-note', ''); return; }
      put('fraicheur-out', jours + (jours <= 1 ? ' jour' : ' jours') + ' depuis la torréfaction');
      put('fraicheur-note', textes[pureCalc.fraicheur(jours)] + ' Repères généraux : la torréfaction, le stockage et le conditionnement font varier ces durées.');
    };
    freshForm.addEventListener('change', updateFresh); freshForm.addEventListener('input', updateFresh);
    updateFresh();
  }

})();
