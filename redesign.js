(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const init = () => {
    if (document.body.dataset.atlasReady === 'true') return;
    document.body.dataset.atlasReady = 'true';
    const progress = $('.atlas-progress');
    const update = () => {
      if (!progress) return;
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
    };
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update, { passive: true });
    update();

    const filters = $$('.atlas-filter');
    const chapters = $$('.atlas-chapter');
    const count = $('#atlas-result-count');
    const applyFilter = value => {
      let visible = 0;
      chapters.forEach(card => {
        const show = value === 'all' || card.dataset.theme === value;
        card.hidden = !show;
        if (show) visible += 1;
      });
      filters.forEach(button => {
        const active = button.dataset.filter === value;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      if (count) count.textContent = `${visible} parcours visibles`;
    };
    filters.forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.filter)));
    applyFilter('all');

    $$('.atlas-index-card').forEach(card => card.addEventListener('click', () => {
      $$('.atlas-index-card').forEach(item => item.classList.remove('is-active'));
      card.classList.add('is-active');
    }));

    const counters = $$('.atlas-count[data-target]');
    if ('IntersectionObserver' in window && !reduced()) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const target = Number(element.dataset.target);
        const suffix = element.dataset.suffix || '';
        const start = performance.now();
        const tick = now => {
          const ratio = Math.min(1, (now - start) / 900);
          element.textContent = `${Math.round(target * (1 - Math.pow(1 - ratio, 3)))}${suffix}`;
          if (ratio < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.unobserve(element);
      }), { threshold: .5 });
      counters.forEach(counter => observer.observe(counter));
    } else counters.forEach(counter => { counter.textContent = `${counter.dataset.target}${counter.dataset.suffix || ''}`; });

    const image = $('.atlas-feature-visual img');
    if (image) image.addEventListener('error', () => image.closest('.atlas-feature-visual')?.classList.add('image-unavailable'), { once: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
