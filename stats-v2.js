(() => {
  'use strict';
  // Mesure d'audience GoatCounter (sans cookie), chargée seulement après un « Autoriser la mesure » explicite.
  // Sans choix, après un refus ou avec Do Not Track / Global Privacy Control : aucune requête.
  const KEY = 'cb-cookie-choice-v1';
  const allowed = () => {
    try { const c = JSON.parse(localStorage.getItem(KEY) || 'null'); if (!c || c.analytics !== true) return false; } catch (e) { return false; }
    if (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true) return false;
    return !/^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  };
  let loaded = false;
  const load = () => {
    if (loaded || !allowed()) return;
    loaded = true;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.setAttribute('data-goatcounter', 'https://cafe-benin.goatcounter.com/count');
    document.head.appendChild(s);
  };
  window.cbLoadStats = load;
  load();
})();
// Compteur de vues, avis et favoris (sans cookie, sans donnée personnelle) : voir blob-features.js.
(() => { const s = document.createElement('script'); s.defer = true; s.src = 'blob-features.js?v=1'; document.head.appendChild(s); })();
