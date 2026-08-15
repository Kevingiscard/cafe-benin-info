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
            <h2 class="display">Le café se lit aussi<br><em>par la lumière.</em></h2>
          </div>
          <p>Ces scènes éditoriales prolongent l’encyclopédie : matière, geste, territoire et rencontre. Elles accompagnent les explications sans les remplacer.</p>
        </div>
        <div class="visual-grid">
          <figure class="visual-card">
            <img src="img/coffee_beans_macro.webp" alt="Cerises et grains de café évoquant le terroir" loading="lazy" width="1024" height="1024">
            <figcaption class="visual-card-copy"><strong>Terroir</strong><span>Le sol, le climat et le travail humain se retrouvent dans chaque lot.</span></figcaption>
          </figure>
          <figure class="visual-card">
            <img src="img/premium_coffee_pour.webp" alt="Préparation lente d’un café filtre avec un dripper" loading="lazy" width="853" height="1280">
            <figcaption class="visual-card-copy"><strong>Geste</strong><span>La précision commence par une attention portée à l’eau, au temps et à la mouture.</span></figcaption>
          </figure>
          <figure class="visual-card">
            <img src="img/coffee_shop_cotonou.webp" alt="Ambiance de communauté autour du café à Cotonou" loading="lazy" width="1536" height="1024">
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

  function addFieldNotes() {
    const beninSection = document.querySelector('#benin');
    if (!beninSection || document.querySelector('#carnet')) return;

    const section = document.createElement('section');
    section.id = 'carnet';
    section.className = 'section field-notes';
    section.setAttribute('aria-label', 'Carnet de terrain Café Bénin');
    section.innerHTML = `
      <div class="container">
        <div class="field-lead">
          <div><span class="eyebrow">Carnet de terrain · Afrique & Bénin</span><h2 class="display">Suivre les gestes,<br><em>documenter les lieux.</em></h2></div>
          <p>Ce carnet ouvre trois portes : mieux lire les sources sur le Bénin, replacer les traditions africaines dans leur contexte et passer d’une curiosité de dégustation à une recherche précise dans l’encyclopédie.</p>
        </div>
        <div class="field-grid">
          <article class="field-card"><img src="img/v14_atlas_world.jpg" alt="Carte illustrée des régions caféières du monde" loading="lazy"><div class="field-card-content"><span class="field-card-number">01 · Situer</span><h3>Le Bénin, sans raccourci.</h3><p>Une information locale est utile lorsqu’elle est datée, attribuée et définie. Le site transforme les zones d’ombre en pistes de recherche plutôt qu’en certitudes.</p><a href="#benin">Lire le dossier Bénin</a></div></article>
          <article class="field-card"><img src="img/ethiopian-coffee-ceremony-ccby.jpg" alt="Cérémonie du café en Éthiopie" loading="lazy"><div class="field-card-content"><span class="field-card-number">02 · Relier</span><h3>Rituels africains du café.</h3><p>La cérémonie photographiée est éthiopienne. Elle rappelle que le café est aussi un langage d’hospitalité, de transmission et de temps partagé, sans être confondu avec les pratiques béninoises.</p><a href="https://commons.wikimedia.org/wiki/File:Ethiopian_Coffee_Ceremony_011.jpg" target="_blank" rel="noopener">Photo : Steve Evans · CC BY 2.0</a></div></article>
          <article class="field-card"><img src="img/coffee_shop_cotonou.webp" alt="Espace café contemporain à Cotonou" loading="lazy" width="1536" height="1024"><div class="field-card-content"><span class="field-card-number">03 · Partager</span><h3>De la matière à la conversation.</h3><p>Un café se raconte aussi par les métiers, les lieux et les personnes qui apprennent à préparer, goûter et transmettre. La communauté peut enrichir cette mémoire avec des sources et des récits vérifiables.</p><a href="#contact">Contribuer au projet</a></div></article>
        </div>
        <div class="field-reader">
          <div class="field-reader-header"><span class="eyebrow">Parcours guidé</span><strong>Trois manières de commencer.</strong><p>Ouvrez une piste, puis naviguez vers les définitions, sections et sources correspondantes.</p></div>
          <div class="field-details">
            <details open><summary>Comprendre une tasse</summary><p>Commencez par la <a href="#extraction">méthode d’extraction</a>, puis utilisez le <a href="#dictionnaire">dictionnaire</a> pour explorer ratio, mouture, eau, TDS et texture. Comparez ensuite vos sensations dans la partie dégustation.</p></details>
            <details><summary>Lire une information sur le Bénin</summary><p>Recherchez l’année, l’unité, la zone exacte et la source initiale. Le dossier Bénin renvoie vers la <a href="https://dsa.agriculture.gouv.bj/" target="_blank" rel="noopener">Direction de la Statistique Agricole</a> et vers une source FAO historique, qui doivent être distinguées des données contemporaines.</p></details>
            <details><summary>Construire une culture café plus précise</summary><p>Reliez les gestes de préparation aux réalités de la plante : espèce, récolte, fermentation, séchage et torréfaction. Une tasse devient plus lisible lorsqu’on comprend la chaîne entière, de la cerise au service.</p></details>
          </div>
        </div>
      </div>`;
    beninSection.after(section);
  }

  function restoreDynamicHash() {
    const targetId = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (!['voyage-visuel', 'carnet'].includes(targetId)) return;
    requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
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
    status.textContent = 'Assistant documentaire local — réponses orientées vers les contenus et sources du site.';
    helper.after(status);
  }

  document.addEventListener('DOMContentLoaded', () => {
    removeSensitiveQueryParameters();
    addVisualJourney();
    addFieldNotes();
    restoreDynamicHash();
    replaceHeroVisual();
    enhanceReveals();
    addMagneticFeedback();
    surfaceAiStatus();
  });
})();
