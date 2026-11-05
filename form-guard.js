(() => {
  'use strict';
  const forms = [...document.querySelectorAll('form[data-antispam]')];
  forms.forEach(form => {
    const started = Date.now();
    const trap = document.createElement('input');
    trap.type = 'text'; trap.name = 'website'; trap.tabIndex = -1; trap.autocomplete = 'off'; trap.className = 'form-honeypot'; trap.setAttribute('aria-hidden', 'true'); trap.placeholder = 'Ne pas remplir';
    form.append(trap);
    form.dataset.startedAt = String(started);
    form.addEventListener('submit', event => {
      const status = form.querySelector('[aria-live]');
      if (trap.value || Date.now() - started < 900) {
        event.preventDefault();
        if (status) status.textContent = 'Le formulaire a été bloqué par la protection anti-spam. Attendez un instant puis réessayez.';
        return;
      }
      form.setAttribute('aria-busy', 'true');
    }, true);
  });
})();
