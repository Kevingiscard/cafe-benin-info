(() => {
  'use strict';
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
})();