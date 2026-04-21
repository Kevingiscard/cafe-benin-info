/* =============================================
   CAFÉ BÉNIN PORTAIL — Script principal (Next-Gen)
   ============================================= */

// ---- Mobile nav toggle ----
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

navToggle.addEventListener("click", () => {
  mainNav.classList.toggle("open");
  navToggle.classList.toggle("open");
});

// Close nav when a link is clicked
mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navToggle.classList.remove("open");
  });
});

// ---- Smooth scroll for anchor links ----
document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const offset = document.querySelector(".header").offsetHeight; // Hauteur du header fixe
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll("section[id]");
const headerHeight = document.querySelector(".header").offsetHeight;

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - headerHeight;
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  mainNav.querySelectorAll("a").forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});

// Initial check for active link on page load
window.dispatchEvent(new Event("scroll"));

// ---- Contact Form Submission (Formspree Integration) ----
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    // Formspree gère l'envoi automatiquement, mais nous pouvons ajouter une notification visuelle
    formMessage.style.display = 'block';
    formMessage.classList.remove('success', 'error');
    formMessage.textContent = 'Envoi de votre message en cours...';
    
    // Formspree redirigera après l'envoi, donc ce code s'exécutera brièvement
    setTimeout(() => {
      formMessage.classList.add('success');
      formMessage.textContent = 'Merci ! Votre message a été envoyé avec succès. Nous vous recontacterons bientôt.';
    }, 500);
  });
}
