(() => {
  'use strict';
  if (location.hostname === 'kevingiscard.github.io' && location.protocol !== 'https:') {
    location.replace(`https://${location.host}${location.pathname}${location.search}${location.hash}`);
  }
})();
