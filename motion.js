(() => {
  'use strict';

  const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  function removeSensitiveQueryParameters() {
    const url = new URL(window.location.href);
    const removable = new Set(['name', 'email', 'message', 'fbclid', 'gclid']);
    let changed = false;

    [...url.searchParams.keys()].forEach((key) => {
      if (removable.has(key) || key.startsWith('utm_')) {
        url.searchParams.delete(key);
        changed = true;
      }
    });

    if (changed) {
      const cleanUrl = `${url.pathname}${url.search}${url.hash}`;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }

  function addVisualJourney() {
    const beninSection = document.querySelector('#benin');
    if (!beninSection || document.querySelector('#voyage-visuel')) return;

    const section = document.createElement('section');
    section.id = 'voyage-visuel';
    section.className = 'section visual-journey';
    section.setAttribute('aria-label', 'Voyage visuel du café');
    section.innerHTML = `
      <div class="container">
        <div class="visual-lead">
          <div>
            <span class="eyebrow">Récit visuel</span>
            <h2 class="display" style="color:#f6f0e7 !important">Le café se lit aussi<br><em style="color:#d58a4d !important">par la lumière.</em></h2>
          </div>
          <p>Ces scènes éditoriales prolongent l’encyclopédie : matière, geste, territoire et rencontre. Elles accompagnent les explications sans les remplacer.</p>
        </div>
        <div class="visual-grid">
          <figure class="visual-card">
            <img src="img/coffee_beans_macro.png" alt="Cerises et grains de café évoquant le terroir" loading="lazy">
            <figcaption class="visual-card-copy"><strong>Terroir</strong><span>Le sol, le climat et le travail humain se retrouvent dans chaque lot.</span></figcaption>
          </figure>
          <figure class="visual-card">
            <img src="img/premium_coffee_pour.png" alt="Préparation lente d’un café filtre avec un dripper" loading="lazy">
            <figcaption class="visual-card-copy"><strong>Geste</strong><span>La précision commence par une attention portée à l’eau, au temps et à la mouture.</span></figcaption>
          </figure>
          <figure class="visual-card">
            <img src="img/coffee_shop_cotonou.png" alt="Ambiance de communauté autour du café à Cotonou" loading="lazy">
            <figcaption class="visual-card-copy"><strong>Partage</strong><span>Le café relie la connaissance, les métiers et les conversations.</span></figcaption>
          </figure>
        </div>
        <div class="image-caption"><span>Images éditoriales — Café Bénin</span><span>Une expérience documentaire, de la parcelle à la communauté</span></div>
      </div>`;
    beninSection.before(section);
  }

  function replaceHeroVisual() {
    const image = document.querySelector('.hero-media img');
    if (!image || image.dataset.editorialVisual === 'true') return;
    const fallback = image.getAttribute('src');
    image.dataset.editorialVisual = 'true';
    image.addEventListener('error', () => {
      image.src = fallback;
    }, { once: true });
    image.src = 'img/benin-coffee-dawn.jpg';
    image.alt = 'Tasse de café au lever du jour dans une ambiance béninoise contemporaine';
  }

  function enhanceReveals() {
    if (prefersReducedMotion()) return;
    const selectors = [
      '.v4-index a', '.v4-era', '.v4-panel', '.v4-numbered article',
      '.card', '.metric', '.sensory', '.v4-source', '.visual-card', '.bot-panel'
    ].join(',');
    const items = [...document.querySelectorAll(selectors)];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-motion-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    items.forEach((element, index) => {
      element.classList.add('motion-card');
      element.style.setProperty('--reveal-delay', `${Math.min((index % 6) * 55, 275)}ms`);
      observer.observe(element);
    });
  }

  function addMagneticFeedback() {
    if (prefersReducedMotion() || !window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return;
    document.querySelectorAll('.btn.primary').forEach((button) => {
      button.classList.add('motion-magnetic');
      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        button.style.transform = `translate3d(${x * 5}px, ${y * 4}px, 0)`;
      });
      button.addEventListener('pointerleave', () => {
        button.style.transform = '';
      });
    });
  }

  function surfaceAiStatus() {
    const helper = document.querySelector('#cafebot .bot-panel .notice');
    if (!helper || helper.querySelector('.ai-availability')) return;
    const status = document.createElement('span');
    status.className = 'ai-availability';
    status.textContent = 'Assistant documentaire — réponse générée côté serveur lorsque le moteur IA est configuré.';
    helper.after(status);
  }

  document.addEventListener('DOMContentLoaded', () => {
    removeSensitiveQueryParameters();
    addVisualJourney();
    replaceHeroVisual();
    enhanceReveals();
    addMagneticFeedback();
    surfaceAiStatus();
  });
})();
