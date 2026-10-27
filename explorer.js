(() => {
  'use strict';
  const key = 'cb-reading-progress-v1';
  const cards = [...document.querySelectorAll('[data-chapter]')];
  let read = [];
  try { const saved = JSON.parse(localStorage.getItem(key) || '[]'); if (Array.isArray(saved)) read = saved.filter(x => typeof x === 'string'); } catch {}
  const progress = document.getElementById('chapter-progress');
  const label = document.getElementById('chapter-progress-label');
  const save = () => { try { localStorage.setItem(key, JSON.stringify(read)); } catch {} };
  const render = () => {
    cards.forEach(card => {
      const done = read.includes(card.dataset.chapter);
      card.classList.toggle('is-read', done);
      const button = card.querySelector('.chapter-read');
      const status = card.querySelector('.chapter-status');
      button.setAttribute('aria-pressed', String(done));
      button.textContent = done ? 'Marquer comme à lire' : 'Marquer comme lu';
      status.textContent = done ? 'Lu' : 'À découvrir';
    });
    progress.value = read.length;
    label.textContent = read.length + ' sur ' + cards.length + ' chapitres';
  };
  cards.forEach(card => card.querySelector('.chapter-read').addEventListener('click', () => {
    const id = card.dataset.chapter;
    read = read.includes(id) ? read.filter(value => value !== id) : [...read, id];
    save(); render();
  }));
  document.getElementById('reset-reading').addEventListener('click', () => { read = []; save(); render(); });
  render();
})();