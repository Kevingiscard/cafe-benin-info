(() => {
  'use strict';
  // Mesure d'audience GoatCounter (sans cookie). Respecte le refus du bandeau, Do Not Track et Global Privacy Control.
  try {
    const choice = JSON.parse(localStorage.getItem('cb-cookie-choice-v1') || 'null');
    if (choice && choice.analytics === false) return;
  } catch (e) {}
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', 'https://cafe-benin.goatcounter.com/count');
  document.head.appendChild(s);
})();
