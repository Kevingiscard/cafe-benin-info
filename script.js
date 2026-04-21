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

// ---- Contact Form Submission (Placeholder for Instagram Integration) ----
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // Placeholder for actual submission logic
    // In a real scenario, this would send data to a backend service
    // that then processes it and potentially sends a message to Instagram.
    // For a static GitHub Pages site, a third-party service like Formspree
    // or Netlify Forms would be used to capture the data and send an email.
    // Direct Instagram DM integration from a static frontend is not feasible.

    formMessage.style.display = 'block';
    formMessage.classList.remove('success', 'error');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      // For demonstration, we'll just show a success message.
      // In a real implementation, the response from the backend would determine success/failure.
      formMessage.classList.add('success');
      formMessage.textContent = 'Votre message a été envoyé avec succès ! Nous vous recontacterons bientôt.';
      contactForm.reset();
    } catch (error) {
      formMessage.classList.add('error');
      formMessage.textContent = 'Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer.';
      console.error('Form submission error:', error);
    }
  });
}
