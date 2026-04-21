/* =====================================================
   CAFÉ BÉNIN — script.js  v4.0
   ===================================================== */

(function () {
  'use strict';

  /* ---- Sélecteurs ---- */
  const header    = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const mainNav   = document.getElementById('main-nav');
  const sections  = document.querySelectorAll('section[id]');


  /* =====================================================
     1. HEADER — ombre au scroll
     ===================================================== */
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });


  /* =====================================================
     2. MENU BURGER MOBILE
     ===================================================== */
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Fermer en cliquant un lien */
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* Fermer avec Échap */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });


  /* =====================================================
     3. SMOOTH SCROLL avec offset header
     ===================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = header.offsetHeight + 8;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* =====================================================
     4. LIEN ACTIF au scroll (IntersectionObserver)
     ===================================================== */
  const navLinks = mainNav.querySelectorAll('a[href^="#"]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, {
    rootMargin: `-${header.offsetHeight + 10}px 0px -55% 0px`,
    threshold: 0
  });

  sections.forEach(s => observer.observe(s));


  /* =====================================================
     5. SCROLL REVEAL (Intersection Observer)
     ===================================================== */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));


  /* =====================================================
     6. FORMULAIRE DE CONTACT (Formspree + feedback)
     ===================================================== */
  const form        = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      /* Feedback visuel immédiat */
      formMessage.className = 'form-message loading';
      formMessage.textContent = 'Envoi en cours…';

      const data = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          formMessage.className = 'form-message success';
          formMessage.textContent = '✓ Message envoyé ! Nous vous recontacterons bientôt.';
          form.reset();
        } else {
          throw new Error('Serveur non disponible');
        }
      } catch {
        formMessage.className = 'form-message error';
        formMessage.textContent = '✗ Erreur lors de l\'envoi. Merci de réessayer ou d\'écrire à kevingiscard93@outlook.com';
      }

      /* Masquer le message après 6s */
      setTimeout(() => {
        formMessage.className = 'form-message';
        formMessage.textContent = '';
      }, 6000);
    });
  }

})();
