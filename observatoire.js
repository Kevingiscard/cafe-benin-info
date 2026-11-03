(() => {
  'use strict';
  const data = window.COFFEE_OBSERVATORY;
  if (!data) return;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const sourceLink = key => {
    const source = data.sources[key];
    return `<a class="obs-source" href="${source.url}" target="_blank" rel="noopener noreferrer">${source.label}</a>`;
  };

  function renderFacts() {
    const root = $('#observatory-facts');
    if (!root) return;
    root.innerHTML = data.facts.map(fact => `<article class="obs-card" data-theme="${fact.theme}"><span class="obs-badge ${fact.confidence === 'secondaire' ? 'secondary' : ''}">${fact.confidence}</span><span class="obs-value">${fact.value}</span><h3>${fact.title}</h3><p>${fact.text}</p>${sourceLink(fact.source)}</article>`).join('');
  }

  function renderBarChart(target, items, options = {}) {
    const width = 760, height = 320, left = 54, top = 30, bottom = 52, right = 22;
    const max = Math.max(...items.map(item => item.value), 1);
    const chartWidth = width - left - right;
    const chartHeight = height - top - bottom;
    const gap = chartWidth / items.length;
    const barWidth = Math.min(72, gap * .58);
    const grid = [0, .25, .5, .75, 1].map(f => {
      const y = top + chartHeight - chartHeight * f;
      return `<line class="axis" x1="${left}" y1="${y}" x2="${width - right}" y2="${y}"/><text x="${left - 9}" y="${y + 4}" text-anchor="end">${(max * f).toFixed(options.decimals ?? 1)}</text>`;
    }).join('');
    const bars = items.map((item, index) => {
      const barHeight = chartHeight * item.value / max;
      const x = left + index * gap + (gap - barWidth) / 2;
      const y = top + chartHeight - barHeight;
      const label = item.value < 1 ? item.value.toFixed(2) : item.value.toFixed(options.decimals ?? 1);
      return `<g tabindex="0" role="img" aria-label="${item.label || item.year}: ${label} ${item.unit || ''}"><rect class="bar ${item.className || ''}" x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="8"><title>${item.label || item.year}: ${label} ${item.unit || ''}</title></rect><text class="value-label" x="${x + barWidth / 2}" y="${Math.max(18, y - 8)}" text-anchor="middle">${label}</text><text x="${x + barWidth / 2}" y="${height - 24}" text-anchor="middle">${item.year}</text></g>`;
    }).join('');
    $(target).innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${target.slice(1)}-title"><title id="${target.slice(1)}-title">${options.title || 'Graphique du café'}</title>${grid}${bars}</svg>`;
  }

  function renderCharts() {
    renderBarChart('#global-chart', data.global, { title: 'Repères de production mondiale du café', decimals: 1 });
    renderBarChart('#benin-chart', data.beninRecent.map(item => ({ ...item, className: 'benin' })), { title: 'Série secondaire de production de café vert au Bénin', decimals: 2 });
  }

  function renderTimeline(filter = 'all') {
    const root = $('#observatory-timeline');
    if (!root) return;
    root.innerHTML = data.timeline.filter(item => filter === 'all' || item.tag.toLowerCase().includes(filter)).map(item => `<article class="obs-event"><span class="obs-year">${item.year} · ${item.tag}</span><h3>${item.title}</h3><p>${item.text}</p>${sourceLink(item.source)}</article>`).join('');
  }

  function renderEvidence() {
    const root = $('#observatory-evidence');
    if (!root) return;
    root.innerHTML = data.evidence.map(item => `<article class="evidence-item ${item.key}"><h3>${item.label}</h3><p>${item.detail}</p></article>`).join('');
  }

  function setupFilters() {
    $$('.obs-filter').forEach(button => button.addEventListener('click', () => {
      $$('.obs-filter').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      const filter = button.dataset.filter || 'all';
      $$('#observatory-facts .obs-card').forEach(card => card.classList.toggle('obs-hidden', filter !== 'all' && card.dataset.theme !== filter));
      renderTimeline(filter === 'all' ? 'all' : filter);
    }));
  }

  function setupConverter() {
    const input = $('#bag-count');
    const unit = $('#bag-unit');
    const result = $('#bag-result');
    const update = () => {
      const amount = Math.max(0, Number(input.value) || 0);
      const kg = unit.value === 'tonnes' ? amount * 1000 : amount * 60;
      const bags = kg / 60;
      result.textContent = `${amount.toLocaleString('fr-FR')} ${unit.value === 'tonnes' ? 'tonne(s)' : 'sac(s) de 60 kg'} = ${kg.toLocaleString('fr-FR', {maximumFractionDigits:2})} kg, soit ${bags.toLocaleString('fr-FR', {maximumFractionDigits:2})} sac(s) équivalent(s).`;
    };
    [input, unit].forEach(element => element?.addEventListener('input', update));
    update();
  }

  function setupDataTable() {
    const root = $('#benin-data-table');
    if (!root) return;
    root.innerHTML = data.beninRecent.map(item => `<tr><td>${item.year}</td><td>${item.value.toLocaleString('fr-FR', {minimumFractionDigits:2})} t</td><td>${item.label}</td><td><span class="obs-badge secondary">${item.confidence}</span></td></tr>`).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderFacts(); renderCharts(); renderTimeline(); renderEvidence(); setupFilters(); setupConverter(); setupDataTable();
    const stamp = $('#observatory-updated'); if (stamp) stamp.textContent = data.updated;
  });
})();
